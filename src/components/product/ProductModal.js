import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import Swiper from "react-id-swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { Modal } from "react-bootstrap";
import Rating from "./sub-components/ProductRating";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ChatIcon from '@mui/icons-material/Chat';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { connect } from "react-redux";
import { Button } from "@mui/material";

import ProductOwnerInfo from "../../wrappers/product/ProductOwnerInfo";
import { PRODUCT_ON_SALE_STATUS } from "../../constants";
import { ddmmyyhhmm } from "../../utils/DateFormat";
function ProductModal(props) {
  const { product } = props;
  const attributes = product?.attributes;
  const images = attributes?.images?.data &&
    Array.isArray(attributes?.images?.data) &&
    attributes?.images?.data?.length > 0 &&
    attributes?.images?.data;
  const user = attributes?.userId?.data?.attributes;
  const { finalproductprice } = props;

  const [gallerySwiper, getGallerySwiper] = useState(null);
  const [thumbnailSwiper, getThumbnailSwiper] = useState(null);

  const wishlistItem = props.wishlistitem;

  const addToWishlist = props.addtowishlist;

  const addToast = props.addtoast;

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
                              src={process.env.REACT_APP_SERVER_ENDPOINT + single?.attributes?.url}
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
                              src={process.env.REACT_APP_SERVER_ENDPOINT + single?.attributes?.url}
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
                <h2>{attributes?.name || ""}</h2>
                <div className="product-details-price">
                  <span >
                    {finalproductprice}
                  </span>
                </div>

                <div className="pro-details-date">
                  {console.log("product", product)}
                  <p style={{ color: "inherit" }}>{ddmmyyhhmm(new Date(attributes?.createdAt))}</p>
                </div>
                <div className="pro-details-list">
                  <p>{product.shortDescription}</p>
                </div>

                <div className="pro-details-quality">
                  <div className="pro-details-cart btn-hover">
                    {attributes?.status && attributes?.status === PRODUCT_ON_SALE_STATUS ? (
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
                        {user?.phone}
                      </button>
                    ) : (
                      <button disabled>Out of Stock</button>
                    )}
                  </div>
                  <div className="pro-details-cart btn-hover">
                    <button
                    >
                      <ChatIcon />
                      {" "}
                      Chat với người bán
                    </button>
                  </div>

                  <div className="pro-details-wishlist">
                    <Button
                      className={wishlistItem !== undefined ? "active" : ""}
                      startIcon={wishlistItem ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                      onClick={() => addToWishlist(product, addToast)}
                      title={
                        wishlistItem !== undefined
                          ? "Added to wishlist"
                          : "Add to wishlist"
                      }
                      disabled={wishlistItem !== undefined}
                    >Yêu thích
                    </Button>
                  </div>
                </div>
                <div>
                  <ProductOwnerInfo user={user} />
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
