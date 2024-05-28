import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
// import { getDiscountPrice } from "../../helpers/product";
import {
  addToWishlist,
  deleteFromWishlist,
  deleteAllFromWishlist,
} from "../../redux/actions/wishlistActions";
import { addToCart } from "../../redux/actions/cartActions";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { PRODUCT_ON_SALE_STATUS } from "../../constants";
import {
  getProductImages,
  getVietNamMoneyFormat,
} from "../../utils/handleData";
import { useSelector } from "react-redux";
import wishlistApi from "../../api/wishlist-api";
import { RESPONSE_TYPE } from "../../utils/callApi";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../../redux/actions/modalLoadingActions";
import { useDispatch } from "react-redux";
import { getImageUrl } from "../../utils/image";
const Wishlist = ({
  location,
  cartItems,
  currency,
  addToCart,
  wishlistItems,
  deleteFromWishlist,
  deleteAllFromWishlist,
}) => {
  const { addToast } = useToasts();
  const { pathname } = location;
  const handleDeleteFormWishList = async (wishlistItem) => {
    const response = await wishlistApi.updateWishlist({
      wishlist: wishlistItems
        .filter((item) => item.id !== wishlistItem.id)
        ?.map((item) => item.id),
    });
    if (response.type === RESPONSE_TYPE) {
      deleteFromWishlist(wishlistItem, addToast);
    }
  };
  const handleDeleteAllWishlist = async () => {
    const response = await wishlistApi.updateWishlist({
      wishlist: [],
    });
    if (response.type === RESPONSE_TYPE) {
      deleteAllFromWishlist(addToast);
    }
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Sản phẩm yêu thích của tôi</title>
        <meta
          name="description"
          content="Wishlist page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Sản phẩm yêu thich
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {wishlistItems && wishlistItems?.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">
                  Danh sách sản phẩm yêu thích của bạn
                </h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {wishlistItems?.map((wishlistItem, key) => {
                            const wishlistItemAtrributes =
                              wishlistItem?.attributes || wishlistItem;

                            // const discountedPrice = getDiscountPrice(
                            //   wishlistItem.price,
                            //   wishlistItem.discount
                            // );
                            // const finalProductPrice = (
                            //   wishlistItem.price * currency.currencyRate
                            // ).toFixed(2);
                            const finalProductPrice = getVietNamMoneyFormat(
                              wishlistItemAtrributes?.price
                            );
                            // const cartItem = cartItems.filter(
                            //   item => item.id === wishlistItem.id
                            // )[0];
                            const wishlistItemImages =
                              getProductImages(wishlistItemAtrributes) ||
                              wishlistItemAtrributes?.images;
                            return (
                              <tr key={key}>
                                <td className="product-thumbnail">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.id
                                    }
                                  >
                                    <img
                                      className="img-fluid"
                                      src={getImageUrl(wishlistItemImages[0])}
                                      alt=""
                                    />
                                  </Link>
                                </td>

                                <td className="product-name text-center">
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/product/" +
                                      wishlistItem.id
                                    }
                                  >
                                    {wishlistItemAtrributes?.name}
                                  </Link>
                                </td>

                                <td className="product-price-cart">
                                  <span className="amount">
                                    {finalProductPrice}
                                  </span>
                                </td>
                                <td>
                                  <span
                                    className={
                                      wishlistItemAtrributes?.status !==
                                        PRODUCT_ON_SALE_STATUS &&
                                      "product-details-sold-status"
                                    }
                                  >
                                    {wishlistItemAtrributes?.status ===
                                    PRODUCT_ON_SALE_STATUS
                                      ? "Đang bán"
                                      : "Đã bán"}
                                  </span>
                                </td>
                                {/* <td className="product-wishlist-cart">
                                  {wishlistItem.affiliateLink ? (
                                    <a
                                      href={wishlistItem.affiliateLink}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      {" "}
                                      Buy now{" "}
                                    </a>
                                  ) : wishlistItem.variation &&
                                    wishlistItem.variation?.length >= 1 ? (
                                    <Link
                                      to={`${process.env.PUBLIC_URL}/product/${wishlistItem.id}`}
                                    >
                                      Select option
                                    </Link>
                                  ) : wishlistItem.stock &&
                                    wishlistItem.stock > 0 ? (
                                    <button
                                      onClick={() =>
                                        addToCart(wishlistItem, addToast)
                                      }
                                      className={
                                        cartItem !== undefined &&
                                          cartItem.quantity > 0
                                          ? "active"
                                          : ""
                                      }
                                      disabled={
                                        cartItem !== undefined &&
                                        cartItem.quantity > 0
                                      }
                                      title={
                                        wishlistItem !== undefined
                                          ? "Added to cart"
                                          : "Add to cart"
                                      }
                                    >
                                      {cartItem !== undefined &&
                                        cartItem.quantity > 0
                                        ? "Added"
                                        : "Add to cart"}
                                    </button>
                                  ) : (
                                    <button disabled className="active">
                                      Out of stock
                                    </button>
                                  )}
                                </td> */}

                                <td className="product-remove">
                                  <button
                                    onClick={async () =>
                                      await handleDeleteFormWishList(
                                        wishlistItem
                                      )
                                    }
                                  >
                                    <i className="fa fa-times"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link to={process.env.PUBLIC_URL + "/category"}>
                          Tiếp tục mua sắm
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button
                          onClick={async () => await handleDeleteAllWishlist()}
                        >
                          Làm trống sản phẩm yêu thích
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-like"></i>
                    </div>
                    <div className="item-empty-area__text">
                      Không có sản phẩm trong danh sách yêu thích <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/category"}>
                        Thêm sản phẩm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Wishlist.propTypes = {
  addToCart: PropTypes.func,
  cartItems: PropTypes.array,
  currency: PropTypes.object,
  location: PropTypes.object,
  deleteAllFromWishlist: PropTypes.func,
  deleteFromWishlist: PropTypes.func,
  wishlistItems: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, addToast, quantityCount) => {
      dispatch(addToCart(item, addToast, quantityCount));
    },
    addToWishlist: (item, addToast, quantityCount) => {
      dispatch(addToWishlist(item, addToast, quantityCount));
    },
    deleteFromWishlist: (item, addToast, quantityCount) => {
      dispatch(deleteFromWishlist(item, addToast, quantityCount));
    },
    deleteAllFromWishlist: (addToast) => {
      dispatch(deleteAllFromWishlist(addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);
