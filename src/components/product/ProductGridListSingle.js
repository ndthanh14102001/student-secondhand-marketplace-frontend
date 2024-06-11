import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { getDiscountPrice } from "../../utils/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import {
  Avatar,
  Box,
  Button,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { ddmmyyhhmm } from "../../utils/DateFormat";
import { PRODUCT_ON_SALE_STATUS } from "../../constants";
import { getProductImages } from "../../utils/handleData";
import { getUniversityById } from "../../utils/data/university";
import wishlistApi from "../../api/wishlist-api";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { useSelector } from "react-redux";
import { handleAddToWishlist } from "../../redux/actions/wishlistActions";
import { getImageUrl } from "../../utils/image";

const BoxInfo = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginTop: "0.6rem",
}));
const ProductGridListSingle = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass,
}) => {
  const wishlistData = useSelector((state) => state.wishlistData);
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  const attributes = product?.attributes;
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  const finalProductPrice = formatter.format(
    attributes?.price || product?.price || 0
  );
  const images = getProductImages(attributes) || product?.images;
  const user = attributes?.userId?.data?.attributes || product?.userId;
  const avatar = getImageUrl(user?.avatar?.data?.attributes || user?.avatar);

  return (
    <Fragment>
      <div
        className={`col-xl-4 col-sm-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              <img
                className="default-img"
                src={getImageUrl(images?.[0])}
                alt=""
              />
              {images && images?.length && images?.length > 1 ? (
                <img
                  className="hover-img"
                  src={getImageUrl(images?.[1])}
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
                  onClick={async () =>
                    await handleAddToWishlist(
                      product,
                      wishlistData,
                      addToast,
                      addToWishlist,
                      history
                    )
                  }
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
          <div className="product-content">
            <div>
              <Tooltip title={attributes?.name || product?.name}>
                <h3 className="product-name">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {attributes?.name || product?.name}
                  </Link>
                </h3>
              </Tooltip>
            </div>
            <div className="product-price">
              <span style={{ margin: 0 }}>{finalProductPrice} </span>
            </div>
            <Typography color="#9b9b9b" component={"span"} fontSize={"0.8rem"}>
              {ddmmyyhhmm(
                new Date(attributes?.createdAt || product?.createdAt)
              )}{" "}
            </Typography>
            <BoxInfo>
              <Avatar src={avatar} />
              <Box
                className="capitalizeText"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  marginLeft: "1rem",
                  width: "100%",
                }}
              >
                <Typography component={"span"} fontSize={"0.8rem"}>
                  {user?.fullName || ""}{" "}
                </Typography>
                <Tooltip
                  PopperProps={{
                    className: "capitalizeText",
                  }}
                  title={
                    getUniversityById(
                      user?.universityId
                    )?.teN_DON_VI.toLocaleLowerCase() || ""
                  }
                >
                  <Typography
                    component={"span"}
                    className="ellipsisText "
                    sx={{
                      fontSize: "0.8rem",
                      width: "80%",
                    }}
                  >
                    {getUniversityById(
                      user?.universityId
                    )?.teN_DON_VI?.toLocaleLowerCase() || ""}
                  </Typography>
                </Tooltip>
              </Box>
            </BoxInfo>
          </div>
        </div>
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="product-list-image-wrap">
                <div className="product-img">
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    <img
                      className="default-img img-fluid"
                      src={getImageUrl(images?.[0]?.attributes)}
                      alt=""
                    />
                    {images && images?.length && images?.length > 1 ? (
                      <img
                        className="hover-img img-fluid"
                        src={getImageUrl(images?.[1]?.attributes)}
                        alt=""
                      />
                    ) : (
                      ""
                    )}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content">
                <h3>
                  <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
                    {attributes?.name || product?.name}
                  </Link>
                </h3>
                <div className="product-list-price">
                  <span>{finalProductPrice} </span>
                </div>
                {/* {product.rating && product.rating > 0 ? (
                  <div className="rating-review">
                    <div className="product-list-rating">
                      <Rating ratingValue={product.rating} />
                    </div>
                  </div>
                ) : (
                  ""
                )} */}
                {attributes?.shortDescription ? (
                  <p>{attributes.shortDescription}</p>
                ) : (
                  ""
                )}

                <div className=" d-flex align-items-center">
                  {(attributes?.status &&
                    attributes?.status === PRODUCT_ON_SALE_STATUS) ||
                  product?.status === PRODUCT_ON_SALE_STATUS ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        history.push(
                          `${process.env.PUBLIC_URL}/product/${product.id}`
                        );
                      }}
                    >
                      {/* <Link
                        to={`${process.env.PUBLIC_URL}/product/${product.id}`}
                      >
                        Thông tin chi tiết
                      </Link> */}
                      Thông tin chi tiết
                    </Button>
                  ) : (
                    <div className="shop-list-btn">
                      <button disabled className="active">
                        Ngừng bán
                      </button>
                    </div>
                  )}

                  <div className="shop-list-wishlist ml-10">
                    <button
                      className={wishlistItem !== undefined ? "active" : ""}
                      disabled={wishlistItem !== undefined}
                      title={
                        wishlistItem !== undefined
                          ? "Added to wishlist"
                          : "Add to wishlist"
                      }
                      onClick={async () =>
                        await handleAddToWishlist(
                          product,
                          wishlistData,
                          addToast,
                          addToWishlist,
                          history
                        )
                      }
                    >
                      <i className="pe-7s-like" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

ProductGridListSingle.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.object,
};

export default ProductGridListSingle;
