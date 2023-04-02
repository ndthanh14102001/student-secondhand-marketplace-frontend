import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
// import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { ddmmyyhhmm } from "../../utils/DateFormat";
import styled from "@emotion/styled";
const BoxInfo = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginTop: "0.6rem"
}));
const ProductGridSingle = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();
  const attributes = product?.attributes;
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  const finalProductPrice = formatter.format(attributes?.price || 0);
  const images = attributes?.images?.data &&
    Array.isArray(attributes?.images?.data) &&
    attributes?.images?.data?.length > 0 &&
    attributes?.images?.data;
  const user = attributes?.userId?.data?.attributes;
  const avatar = user?.avatar?.data?.attributes?.url;
  return (
    <Fragment>
      <div
        style={{
          boxSizing: "border-box"
        }}
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${sliderClassName ? sliderClassName : ""
          }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              <img
                className="default-img"
                src={`${process.env.REACT_APP_SERVER_ENDPOINT}${images && images.length > 0 && images[0]?.attributes?.url}`}
                alt=""
              />
              {images && images.length > 1 ? (
                <img
                  className="hover-img"
                  src={`${process.env.REACT_APP_SERVER_ENDPOINT}${images && images.length > 0 && images[1]?.attributes?.url}`}
                  alt=""
                />
              ) : (
                ""
              )}
            </Link>

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={wishlistItem !== undefined ? "active" : ""}
                  disabled={wishlistItem !== undefined}
                  title={
                    wishlistItem !== undefined
                      ? "Added to wishlist"
                      : "Add to wishlist"
                  }
                  onClick={() => addToWishlist(product, addToast)}
                >
                  <i className="pe-7s-like" />
                </button>
              </div>
              <div className="pro-same-action pro-cart">
                <Link to={`${process.env.PUBLIC_URL}/product/${product.id}`}>
                  Thông tin chi tiết
                </Link>
              </div>
              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>
          <div className="product-content ">
            <div>
              <Tooltip title={attributes?.name}>
                <h3 className="product-name">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {attributes?.name}
                  </Link>
                </h3>
              </Tooltip>
            </div>
            <div className="product-price" >
              <span style={{ margin: 0 }}>{finalProductPrice} </span>
            </div>
            <Typography color="#9b9b9b" component={"span"} fontSize={"0.8rem"}>{ddmmyyhhmm(new Date(attributes?.updatedAt))} </Typography>
            <BoxInfo>
              <Avatar src={avatar && process.env.REACT_APP_SERVER_ENDPOINT + avatar} />
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: "1rem"
              }}>
                <Typography component={"span"} fontSize={"0.8rem"}>{user?.fullName || ""} </Typography>
                <Typography component={"span"}
                  sx={{
                    fontSize: "0.8rem",
                  }}
                >{user?.university || ""}</Typography>
              </Box>
            </BoxInfo>
          </div>
        </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        // discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        // finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addtocart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
      />
    </Fragment>
  );
};

ProductGridSingle.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object
};

export default ProductGridSingle;
