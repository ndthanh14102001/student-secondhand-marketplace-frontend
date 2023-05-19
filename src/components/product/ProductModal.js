import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./sub-components/ProductRating";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ChatIcon from '@mui/icons-material/Chat';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { connect } from "react-redux";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { getUserLogin } from "../../utils/userLoginStorage";

import ProductOwnerInfo from "../../wrappers/product/ProductOwnerInfo";
import { PRODUCT_ON_SALE_STATUS, PRODUCT_SOLD_STATUS } from "../../constants";
import { ddmmyyhhmm } from "../../utils/DateFormat";
import { getProductImages } from "../../utils/handleData";
import axios from "axios";
import { useSelector } from "react-redux";
import wishlistApi from "../../api/wishlist-api";
import { RESPONSE_TYPE } from "../../utils/callApi";
function ProductModal(props) {
  const wishlistData = useSelector(state => state.wishlistData);
  const { product, onHide } = props;
  console.log("product", product);
  const userLoginData = getUserLogin()?.user;
  const attributes = product?.attributes;
  const images = getProductImages(attributes) || product?.images;
  const user = attributes?.userId?.data || product?.userId;

  const { finalproductprice } = props;

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);

  const wishlistItem = props.wishlistitem;
  const sendReport = props.sendReport;

  const addToWishlist = props.addtowishlist;

  const addToast = props.addtoast;

  // Report useState & function
  const [openConfirmReport, setOpenConfirmReport] = React.useState(false);
  const [openNeedLoginDialog, setOpenNeedLoginDialog] = React.useState(false);
  const reportCriteria = [
    "Trùng lặp",
    "Hàng đã bán",
    "Thông tin không đúng thực tế",
    "Hàng hư hỏng sau khi mua",
    "Hàng giả, hàng nhái, hàng dựng",
    "Lý do khác",
  ]

  const handleClickOpenConfirmReport = () => {
    if (userLoginData === undefined) {
      setOpenNeedLoginDialog(true);
    } else {
      setOpenConfirmReport(true);
    }
  };

  const handleCloseConfirmReport = () => {
    setOpenConfirmReport(false);
    setOpenNeedLoginDialog(false);
  };

  const [checkedReportCriteria, setCheckedReportCriteria] = React.useState([]);
  const [reportDetailInput, setReportDetailInput] = React.useState('');
  const handleToggle = (value) => () => {
    const currentIndex = checkedReportCriteria.indexOf(value);
    const newChecked = [...checkedReportCriteria];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedReportCriteria(newChecked);
  };

  const handleReport = () => {
    let descriptionInput = checkedReportCriteria.filter(fruit => fruit !== "Lý do khác").join(", ");
    if (checkedReportCriteria.indexOf("Lý do khác") > 0) {
      descriptionInput += " và lý do khác"
    }
    if (reportDetailInput !== '') {
      descriptionInput += ", mô tả chi tiết: " + reportDetailInput
    }

    axios
      .post(process.env.REACT_APP_API_ENDPOINT + '/reports',
        {
          data: {
            type: 'product',
            product: product?.id,
            reporter: userLoginData.id,
            accused: null,
            description: descriptionInput,
          }
        })
      .then((response) => {
        console.log(response)
        addToast("Đã gửi báo cáo sản phẩm này, cảm ơn bạn đã báo cáo", {
          appearance: "success",
          autoDismiss: true
        });
        handleCloseConfirmReport();
      })
      .catch((error) => {
        addToast(" Đã có lỗi !, báo cáo thất bại", {
          appearance: "error",
          autoDismiss: true
        });
        handleCloseConfirmReport();
      })
  }

  useEffect(() => {
    if (
      gallerySwiper !== null &&
      gallerySwiper.controller &&
      thumbnailSwiper !== null &&
      thumbnailSwiper.controller
    ) {
      gallerySwiper.controller.control = thumbnailSwiper;
      thumbnailSwiper.controller.control = gallerySwiper;
    }
  }, [gallerySwiper, thumbnailSwiper]);

  const gallerySwiperParams = {
    getSwiper: getGallerySwiper,
    spaceBetween: 10,
    loopedSlides: 4,
    loop: true
  };

  const thumbnailSwiperParams = {
    getSwiper: getThumbnailSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    loopedSlides: 4,
    touchRatio: 1,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    },
    renderPrevButton: () => (
      <button className="swiper-button-prev ht-swiper-button-nav">
        <i className="pe-7s-angle-left" />
      </button>
    ),
    renderNextButton: () => (
      <button className="swiper-button-next ht-swiper-button-nav">
        <i className="pe-7s-angle-right" />
      </button>
    )
  };
  const handleAddToWishlist = async (product) => {
    const wishlistNew = Array.isArray(wishlistData) ?
      wishlistData.map((item) => item?.id)
      : []
    wishlistNew.push(product?.id);
    const response = await wishlistApi.updateWishlist({ wishlist: wishlistNew })
    if (response.type === RESPONSE_TYPE) {
      addToWishlist(product, addToast)
    }
  };
  return (
    <Fragment>
      <Modal
        show={props.show}
        onHide={props.onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <Swiper {...gallerySwiperParams}>
                  {images && Array.isArray(images) &&
                    images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={process.env.REACT_APP_SERVER_ENDPOINT + (single?.attributes?.url || single?.url)}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
              <div className="product-small-image-wrapper mt-15">
                <Swiper {...thumbnailSwiperParams}>
                  {images && Array.isArray(images) &&
                    images.map((single, key) => {
                      return (
                        <div key={key}>
                          <div className="single-image">
                            <img
                              src={process.env.REACT_APP_SERVER_ENDPOINT + (single?.attributes?.url || single?.url)}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                        </div>
                      );
                    })}
                </Swiper>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{attributes?.name || product?.name || ""}</h2>
                {(product?.status === PRODUCT_SOLD_STATUS || attributes?.status === PRODUCT_SOLD_STATUS) && <div className="product-details-sold-status">
                  <span>Đã bán</span>
                </div>}
                <div className="product-details-price">
                  <span >
                    {finalproductprice}
                  </span>
                </div>

                <div className="pro-details-date">
                  <p style={{ color: "inherit" }}>{ddmmyyhhmm(new Date(attributes?.createdAt || product?.createdAt))}</p>
                </div>
                <div className="pro-details-list">
                  <p>{product.shortDescription}</p>
                </div>

                <div className="pro-details-quality">
                  <div className="pro-details-cart btn-hover">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("0123456789");
                        addToast("Đã copy số điện thoại", {
                          appearance: "success",
                          autoDismiss: true
                        });
                      }}
                    >
                      <PhoneInTalkIcon />
                      {" "}
                      {user?.phone || user?.attributes?.phone}
                    </button>
                  </div>
                  <Link
                    to={
                      (userLoginData !== undefined && user.id !== undefined) &&
                      ((userLoginData.id === user.id) ? "/chat" : "/chat/" + user.id)}
                    onClick={userLoginData === undefined ? () => { setOpenNeedLoginDialog(true) } : ''}>
                    <div className="pro-details-cart btn-hover">
                      <button
                        onClick={() => { }
                          // addToCart(
                          //   product,
                          //   addToast,
                          //   quantityCount,
                          //   selectedProductColor,
                          //   selectedProductSize
                          // )
                        }
                        disabled={props.productCartQty >= props.productStock}
                      >
                        <ChatIcon />
                        {" "}
                        {(userLoginData?.id === user?.id) ? "Đi tới chat" : "Chat với người bán"}
                      </button>
                    </div>
                  </Link>

                  <div className="pro-details-wishlist">
                    <Button
                      className={wishlistItem !== undefined ? "active" : ""}
                      startIcon={wishlistItem ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      onClick={() => addToWishlist(product, addToast)}
                      title={
                        wishlistItem !== undefined
                          ? "Added to wishlist"
                          : "Add to wishlist"
                      }
                      disabled={wishlistItem !== undefined}
                    >{wishlistItem ? 'Đã thích' : 'Yêu thích'}
                    </Button>
                    <Button
                      startIcon={sendReport ? <ReportProblemIcon /> : <ReportProblemOutlinedIcon />}
                      title={"sent report"}
                      disabled={sendReport !== undefined}
                      sx={{ color: 'red!important' }}
                      onClick={handleClickOpenConfirmReport}
                    >Báo cáo
                    </Button>

                    {/* Dialog confirm report product */}
                    <Dialog
                      open={openConfirmReport}
                      onClose={handleCloseConfirmReport}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        Xác nhận report sản phẩm
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Sản phẩm "{attributes?.name}" có vấn đề gì? vui lòng mô tả cụ thể
                        </DialogContentText>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                          {reportCriteria.map((value) => {
                            const labelId = `checkbox-list-label-${value}`;

                            return (
                              <ListItem
                                key={value}
                                disablePadding
                              >
                                <ListItemButton role={undefined} onClick={handleToggle(value)} dense>
                                  <ListItemIcon>
                                    <Checkbox
                                      edge="start"
                                      checked={checkedReportCriteria.indexOf(value) !== -1}
                                      tabIndex={-1}
                                      disableRipple
                                      inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText id={labelId} primary={value} />
                                </ListItemButton>
                              </ListItem>
                            );
                          })}
                        </List>
                        <TextField
                          fullWidth
                          label="Mô tả chi tiết"
                          id="outlined-start-adornment"
                          sx={{ padding: 0, mt: '12px' }}
                          value={reportDetailInput}
                          onChange={(event) => {
                            setReportDetailInput(event.target.value)
                          }}
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><InfoIcon /></InputAdornment>,
                          }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseConfirmReport} sx={{ textTransform: 'none' }}>Không</Button>
                        <Button onClick={handleReport} sx={{ textTransform: 'none' }}>
                          Xác nhận
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* Dialog if user haven't log in yet ! */}
                    <Dialog
                      open={openNeedLoginDialog}
                      onClose={handleCloseConfirmReport}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        Hello bạn ơi
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Bạn cần phải đăng nhập để thực hiện hành động này
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseConfirmReport} sx={{ textTransform: 'none' }}>Thoát</Button>
                        <a href={process.env.PUBLIC_URL + "/login-register"}>
                          <Button sx={{ textTransform: 'none' }}>
                            Đăng nhập
                          </Button>
                        </a>
                      </DialogActions>
                    </Dialog>
                  </div>
                </div>
                <div>
                  <ProductOwnerInfo user={user} check={1} onHideModal={onHide} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

ProductModal.propTypes = {
  addtoast: PropTypes.func,
  addtowishlist: PropTypes.func,
  cartitems: PropTypes.array,
  finalproductprice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onHide: PropTypes.func,
  product: PropTypes.object,
  show: PropTypes.bool,
  wishlistitem: PropTypes.object
};


export default ProductModal;
