import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import Rating from "./sub-components/ProductRating";
import ProductOwnerInfo from "../../wrappers/product/ProductOwnerInfo";

import { Button } from "@mui/material";
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

// import ChatsFrame from "../../components/chat"
import { PRODUCT_ON_SALE_STATUS } from "../../constants";

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
  addToCompare
}) => {
  const attributes = product?.attributes;
  const user = attributes?.userId?.data;

  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variation ? product.variation[0].color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variation ? product.variation[0].size[0].name : ""
  );
  const [productStock, setProductStock] = useState(
    attributes?.status
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  return (
    <div className="product-details-content ml-70">

      <h2>{attributes?.name}</h2>
      {productStock !== PRODUCT_ON_SALE_STATUS && <div className="product-details-sold-status">
        <span>Đã bán</span>
      </div>}

      <div className="product-details-price">
        <span>{finalProductPrice} </span>
      </div>
      {/* {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ""
      )} */}

      {/* {product.variation ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variation.map((single, key) => {
                return (
                  <label
                    className={`pro-details-color-content--single ${single.color}`}
                    key={key}
                  >
                    <input
                      type="radio"
                      value={single.color}
                      name="product-color"
                      checked={
                        single.color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(single.color);
                        setSelectedProductSize(single.size[0].name);
                        setProductStock(single.size[0].stock);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variation &&
                product.variation.map(single => {
                  return single.color === selectedProductColor
                    ? single.size.map((singleSize, key) => {
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <input
                              type="radio"
                              value={singleSize.name}
                              checked={
                                singleSize.name === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              onChange={() => {
                                setSelectedProductSize(singleSize.name);
                                setProductStock(singleSize.stock);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">{singleSize.name}</span>
                          </label>
                        );
                      })
                    : "";
                })}
            </div>
          </div>
        </div>
      ) : (
        ""
      )} */}
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
            disabled={productCartQty >= productStock}
          >
            <PhoneInTalkIcon />
            {" "}
            {user?.attributes?.phone}
          </button>
        </div>
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
            disabled={productCartQty >= productStock}
          >
            <ChatIcon />
            {" "}
            Chat với người bán
          </button>
        </div>
      </div>
      <Button
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
      <Button
        startIcon={sendReport ? <ReportProblemIcon /> : <ReportProblemOutlinedIcon />}
        // onClick={() => addToWishlist(product, addToast)}
        title={
          sendReport !== undefined
            ? "sent report"
            : "sent report"
        }
        disabled={sendReport !== undefined}
        sx={{ color: 'red' }}
      >Báo cáo
      </Button>
      {
        product.category ? (
          <div className="pro-details-meta">
            <span>Danh mục :</span>
            <ul>
              {product.category.map((single, key) => {
                return (
                  <li key={key}>
                    <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                      {single}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )
      }
      {/* {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )} */}

      {/* <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div> */}
      <div>
        <ProductOwnerInfo user={user} />
      </div>
    </div >
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
  wishlistItem: PropTypes.object
};

const mapDispatchToProps = dispatch => {
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
    }
  };
};

export default connect(null, mapDispatchToProps)(ProductDescriptionInfo);
