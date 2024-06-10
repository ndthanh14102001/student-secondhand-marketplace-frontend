import PropTypes from "prop-types";
import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductCartQuantity } from "../../utils/product";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  handleAddToWishlist,
} from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import ProductOwnerInfo from "../../wrappers/product/ProductOwnerInfo";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  List,
  TextField,
  InputAdornment,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoIcon from "@mui/icons-material/Info";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import InsertLinkSharpIcon from "@mui/icons-material/InsertLinkSharp";
import { Helmet } from "react-helmet";

// import ChatsFrame from "../../components/chat"
import { PRODUCT_ON_SALE_STATUS } from "../../constants";
import axios from "axios";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useSelector } from "react-redux";
import { RESPONSE_TYPE } from "../../utils/callApi";
import wishlistApi from "../../api/wishlist-api";
import Like from "../social-plugin/Like";
import ShareMessage from "../social-plugin/ShareMessage";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
  addToast,
  addToCart,
  addToWishlist,
  sendReport,
  addToCompare,
}) => {
  const history = useHistory();
  const wishlistData = useSelector((state) => state.wishlistData);
  const attributes = product?.attributes;
  const user = attributes?.userId?.data;
  const userLoginData = getUserLogin()?.user;

  const isProductOwner = useMemo(() => {
    console.log(userLoginData, attributes?.userId);
    return userLoginData?.id === user?.id;
  }, []);

  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(attributes?.status);
  const [quantityCount, setQuantityCount] = useState(1);
  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  //Function Report
  const [openConfirmReport, setOpenConfirmReport] = React.useState(false);
  const [openNeedLoginDialog, setOpenNeedLoginDialog] = React.useState(false);

  const reportCriteria = [
    "Trùng lặp",
    "Hàng đã bán",
    "Thông tin không đúng thực tế",
    "Hàng hư hỏng sau khi mua",
    "Hàng giả, hàng nhái, hàng dựng",
    "Lý do khác",
  ];

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
  const [reportDetailInput, setReportDetailInput] = React.useState("");
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
    let descriptionInput = checkedReportCriteria
      .filter((fruit) => fruit !== "Lý do khác")
      .join(", ");
    if (checkedReportCriteria.indexOf("Lý do khác") > 0) {
      descriptionInput += " và lý do khác";
    }
    if (reportDetailInput !== "") {
      descriptionInput += ", mô tả chi tiết: " + reportDetailInput;
    }

    axios
      .post(process.env.REACT_APP_API_ENDPOINT + "/reports", {
        data: {
          type: "product",
          product: product?.id,
          reporter: userLoginData.id,
          accused: null,
          description: descriptionInput,
        },
      })
      .then((response) => {
        addToast("Đã gửi báo cáo sản phẩm này, cảm ơn bạn đã báo cáo", {
          appearance: "success",
          autoDismiss: true,
        });
        handleCloseConfirmReport();
      })
      .catch((error) => {
        addToast(" Đã có lỗi !, báo cáo thất bại", {
          appearance: "error",
          autoDismiss: true,
        });
        handleCloseConfirmReport();
      });
  };

  let shareURL =
    process.env.REACT_APP_IS_LOCALHOST == 1
      ? "https://chosinhvien.vercel.app/product/80"
      : window.location.href;

  const handleCopyURL = () => {
    const currentURL = window.location.href;

    const tempInput = document.createElement("input");
    tempInput.value = currentURL;
    document.body.appendChild(tempInput);

    tempInput.select();
    tempInput.setSelectionRange(0, 99999);

    document.execCommand("copy");

    document.body.removeChild(tempInput);

    addToast(" Đã copy link trang web", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:title"
          content={`${product?.attributes?.name} - ${product?.id}`}
        />
        <meta
          property="og:description"
          content={product?.attributes?.description}
        />
        <meta property="og:price:amount" content={product?.attributes?.price} />
        <meta property="og:price:currency" content="VND" />
        <meta property="og:availability" content="instock" />
        {/* <meta property="og:image" content={process.env.REACT_APP_SERVER_ENDPOINT + product?.attributes?.images?.data[0]?.attributes?.url} /> */}
        <meta
          property="og:image:secure_url"
          content={
            process.env.REACT_APP_SERVER_ENDPOINT +
            product?.attributes?.images?.data[0]?.attributes?.url
          }
        />
        {/* <meta property="og:image:secure" content={process.env.REACT_APP_SERVER_ENDPOINT + product?.attributes?.images?.data[0]?.attributes?.url} /> */}
        <link
          rel="preload"
          as="image"
          href={
            process.env.REACT_APP_SERVER_ENDPOINT +
            product?.attributes?.images?.data[0]?.attributes?.url
          }
        />
        <meta
          property="fb:app_id"
          content={process.env.REACT_APP_FACEBOOK_APP_ID}
        />
      </Helmet>
      <div className="product-details-content ml-70">
        <h2>{attributes?.name}</h2>
        {productStock !== PRODUCT_ON_SALE_STATUS && (
          <div className="product-details-sold-status">
            <span>Đã bán</span>
          </div>
        )}

        <div className="product-details-price">
          <span>{finalProductPrice} </span>
        </div>
        {!isProductOwner && (
          <div className="pro-details-quality">
            <div className="pro-details-cart btn-hover">
              <button
                onClick={() => {
                  navigator.clipboard.writeText("0123456789");
                  addToast("Đã copy số điện thoại", {
                    appearance: "success",
                    autoDismiss: true,
                  });
                }}
                disabled={productCartQty >= productStock}
              >
                <PhoneInTalkIcon /> {user?.attributes?.phone}
              </button>
            </div>
            <Link
              to={
                userLoginData !== undefined &&
                user.id !== undefined &&
                (userLoginData.id === user.id ? "/chat" : "/chat/" + user.id)
              }
              onClick={
                userLoginData === undefined
                  ? () => {
                      setOpenNeedLoginDialog(true);
                    }
                  : ""
              }
            >
              <div className="pro-details-cart btn-hover">
                <button>
                  <ChatIcon />{" "}
                  {userLoginData?.id === user?.id
                    ? "Đi tới chat"
                    : "Chat với người bán"}
                </button>
              </div>
            </Link>
          </div>
        )}
        {isProductOwner && (
          <div className="pro-details-quality">
            <Link
              to={"/product-update/"+product?.id}
              onClick={
                userLoginData === undefined
                  ? () => {
                      setOpenNeedLoginDialog(true);
                    }
                  : ""
              }
            >
              <div className="pro-details-cart btn-hover">
                <button>
                  <EditIcon /> Cập nhật thông tin sản phẩm
                </button>
              </div>
            </Link>
          </div>
        )}
        <Button
          startIcon={wishlistItem ? <FavoriteBorderIcon /> : <FavoriteIcon />}
          onClick={async () =>
            await handleAddToWishlist(
              product,
              wishlistData,
              addToast,
              addToWishlist,
              history
            )
          }
          title={
            wishlistItem !== undefined ? "Added to wishlist" : "Add to wishlist"
          }
          disabled={wishlistItem !== undefined}
        >
          Yêu thích
        </Button>
        <Button
          startIcon={
            sendReport ? <ReportProblemIcon /> : <ReportProblemOutlinedIcon />
          }
          // onClick={() => addToWishlist(product, addToast)}
          title={sendReport !== undefined ? "sent report" : "sent report"}
          disabled={sendReport !== undefined}
          sx={{ color: "red" }}
          onClick={handleClickOpenConfirmReport}
        >
          Báo cáo
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
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              {reportCriteria?.map((value) => {
                const labelId = `checkbox-list-label-${value}`;

                return (
                  <ListItem key={value} disablePadding>
                    <ListItemButton
                      role={undefined}
                      onClick={handleToggle(value)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checkedReportCriteria.indexOf(value) !== -1}
                          tabIndex={-1}
                          disableRipple
                          inputProps={{ "aria-labelledby": labelId }}
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
              sx={{ padding: 0, mt: "12px" }}
              value={reportDetailInput}
              onChange={(event) => {
                setReportDetailInput(event.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InfoIcon />
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmReport}
              sx={{ textTransform: "none" }}
            >
              Không
            </Button>
            <Button onClick={handleReport} sx={{ textTransform: "none" }}>
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
          <DialogTitle id="alert-dialog-title">Hello bạn ơi</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn cần phải đăng nhập để thực hiện hành động này
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseConfirmReport}
              sx={{ textTransform: "none" }}
            >
              Thoát
            </Button>
            <a href={process.env.PUBLIC_URL + "/login-register"}>
              <Button sx={{ textTransform: "none" }}>Đăng nhập</Button>
            </a>
          </DialogActions>
        </Dialog>
        <div>
          <ProductOwnerInfo user={user} check={1} />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Typography>Chia sẻ tin đăng này cho bạn bè:</Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              borderTop: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
              padding: "5px",
            }}
          >
            <Like dataHref={shareURL} />
            <ShareMessage dataHref={shareURL} />
            <Box
              sx={{
                backgroundColor: "#e0e0e0",
                width: "40px",
                height: "40px",
                borderRadius: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleCopyURL}
            >
              <InsertLinkSharpIcon sx={{ transform: "rotate(125deg)" }} />
            </Box>
          </Stack>
        </div>
      </div>
    </>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItems: PropTypes.array,
  compareItem: PropTypes.array,
  currency: PropTypes.object,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.object,
  wishlistItem: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (
      item,
      addToast,
      quantityCount,
      selectedProductColor,
      selectedProductSize
    ) => {
      dispatch(
        addToCart(
          item,
          addToast,
          quantityCount,
          selectedProductColor,
          selectedProductSize
        )
      );
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
  };
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
