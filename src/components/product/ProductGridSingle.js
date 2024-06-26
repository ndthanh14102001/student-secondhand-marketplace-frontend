import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
// import { getDiscountPrice } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { ddmmyyhhmm } from "../../utils/DateFormat";
import styled from "@emotion/styled";
import { getUniversityById } from "../../utils/data/university";
import { useSelector } from "react-redux";
import { handleAddToWishlist } from "../../redux/actions/wishlistActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { IMAGE_SIZE_MEDIUM, getImageUrl } from "../../utils/image";
import { LazyLoadImage } from "react-lazy-load-image-component";
const BoxInfo = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  marginTop: "0.6rem",
  overflow: "hidden",
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
  spaceBottomClass,
}) => {
  const history = useHistory();
  const wishlistData = useSelector((state) => state.wishlistData);
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();
  const attributes = product?.attributes;
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  const finalProductPrice = formatter.format(attributes?.price || 0);
  const images =
    attributes?.images?.data &&
    Array.isArray(attributes?.images?.data) &&
    attributes?.images?.data?.length > 0 &&
    attributes?.images?.data;
  const user = attributes?.userId?.data?.attributes;
  const avatar = user?.avatar?.data?.attributes;
  return (
    <Fragment>
      <div
        style={{
          boxSizing: "border-box",
        }}
        className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${
          sliderClassName ? sliderClassName : ""
        }`}
      >
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}
        >
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.id}>
              <LazyLoadImage
                fetchpriority="high"
                className="default-img"
                src={getImageUrl(images?.[0], IMAGE_SIZE_MEDIUM)}
                alt=""
              />
              {images && images?.length > 1 ? (
                <LazyLoadImage
                  fetchpriority="high"
                  className="hover-img"
                  src={getImageUrl(images?.[1], IMAGE_SIZE_MEDIUM)}
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
            <div className="product-price">
              <span style={{ margin: 0 }}>{finalProductPrice} </span>
            </div>
            <Typography color="#9b9b9b" component={"span"} fontSize={"0.8rem"}>
              {ddmmyyhhmm(new Date(attributes?.createdAt))}{" "}
            </Typography>
            <BoxInfo>
              <Avatar src={avatar && getImageUrl(avatar)} />
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
  wishlistItem: PropTypes.object,
};

export default ProductGridSingle;
