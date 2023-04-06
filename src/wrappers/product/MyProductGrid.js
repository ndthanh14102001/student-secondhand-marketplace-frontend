// Product Grid Two
import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";
import { addToCart } from "../../redux/actions/cartActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { addToCompare } from "../../redux/actions/compareActions";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { onShowPopupErrorBase } from "../../redux/actions/popupErrorBaseActions";
import { useMemo } from "react";
import { PRODUCT_ON_SALE_STATUS, PRODUCT_SOLD_STATUS } from "../../constants";
import { PRODUCT_ON_SALE_KEY } from "../../pages/other/my-products/constants";

const MyProductGrid = ({
  // products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  wishlistItems,
  compareItems,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  productStatus
}) => {
  const [products, setProducts] = useState([]);
  const productsShow = useMemo(() => {
    if (productStatus === PRODUCT_ON_SALE_KEY) {
      return products.filter(product => {
        console.log("product", product)
        return product?.attributes?.status === PRODUCT_ON_SALE_STATUS
      })
    } else {
      return products.filter(product => product?.attributes?.status === PRODUCT_SOLD_STATUS)
    }
  }, [productStatus, products])
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllMyProduct = async () => {
      const user = getUserLogin()?.user;
      if (user) {
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/products",
          method: "get",
          params: {
            populate: "*",
            filters: {
              userId: {
                id: {
                  $eq: user?.id
                }
              }
            },
            sort: {
              updatedAt: "desc"
            }
          }
        })
        if (response.type === RESPONSE_TYPE) {
          setProducts(response.data?.data);
        } else {
          dispatch(onShowPopupErrorBase(response));
        }
      }
    }
    getAllMyProduct();
  }, [dispatch])
  return (
    <Fragment>
      {productsShow.map((product) => {
        return (
          <ProductGridSingleTwo
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            colorClass={colorClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter((cartItem) => cartItem.id === product.id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                (wishlistItem) => wishlistItem.id === product.id
              )[0]
            }
            compareItem={
              compareItems.filter(
                (compareItem) => compareItem.id === product.id
              )[0]
            }
            key={product.id}
            titlePriceClass={titlePriceClass}
          />
        );
      })}
    </Fragment>
  );
};

MyProductGrid.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItems: PropTypes.array,
  productStatus: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  return {
    products: getProducts(
      state.productData.products,
      ownProps.category,
      ownProps.type,
      ownProps.limit
    ),
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData
  };
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProductGrid);
