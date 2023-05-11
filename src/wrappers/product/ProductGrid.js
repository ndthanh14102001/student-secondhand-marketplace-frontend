import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { useEffect } from "react";
import { useState } from "react";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { getArrayUniversity, getAllUniversity, getFullAddressUniversity } from "../../utils/data/university";
import { getUserLogin } from "../../utils/userLoginStorage";
import { calculateDistance } from "../../utils/googleApi";
import { getAllWards } from "../../utils/data/wards";
import { getAllDistrict } from "../../utils/data/district";
import { getAllCity } from "../../utils/data/city";
export const HOME_CATEGORY = "HOME_CATEGORY";

const ProductGrid = ({
  category,
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  wishlistItems,
  compareItems,
  sliderClassName,
  spaceBottomClass
}) => {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    const getProductListByCategory = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/products",
        method: "get",
        params: {
          populate: "*",
          filters: {
            category: {
              id: {
                $eq: category
              }
            },
            status: {
              $eq: "onSale"
            }
          }
        }
      });
      if (response.type === RESPONSE_TYPE) {
        setProductList(response.data?.data)
      }
    }
    const getProductListHome = async () => {
      const universityArray = getArrayUniversity();
      const universityObject = getAllUniversity();
      const userLogin = getUserLogin();
      const userLoginUniversity = universityObject[userLogin.user.universityId];


      const distances = []
      for (let indexUniversity = 0; indexUniversity < universityArray.length; indexUniversity++) {
        const university = universityArray[indexUniversity];
        const originAddress = getFullAddressUniversity(university);
        const destinationAddress = getFullAddressUniversity(userLoginUniversity);
        const result = await calculateDistance(
          originAddress,
          destinationAddress,
        );
        console.log("result", result, `${originAddress},${destinationAddress}`);
        distances.push({
          id: university.id,
          distance: result
        })
      }

      console.log("distances", distances)


      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/products",
        method: "get",
        params: {
          filters: {
            $or: [{
              userId: {
                universityId: {
                  $eq: userLogin.user.universityId
                }
              }
            },],
            status: {
              $eq: "onSale"
            },

          },
          pagination: {
            page: 1,
            pageSize: 16
          },
          populate: {
            userId: {
              populate: "*"
            },
            category: true,
            images: true
          },

          sort: {
            createdAt: "desc"
          }
        }
      });
      if (response.type === RESPONSE_TYPE) {
        setProductList(response.data?.data)
      }
    }
    if (category === HOME_CATEGORY) {
      getProductListHome();
    } else {
      getProductListByCategory();
    }
  }, [category]);
  return (
    <Fragment>
      {/* {products.map(product => {
        return (
          <ProductGridSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter(cartItem => cartItem.id === product.id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                wishlistItem => wishlistItem.id === product.id
              )[0]
            }
            compareItem={
              compareItems.filter(
                compareItem => compareItem.id === product.id
              )[0]
            }
            key={product.id}
          />
        );
      })} */}
      {productList.map(product => {
        return (
          <ProductGridSingle
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter(cartItem => cartItem.id === product.id)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                wishlistItem => wishlistItem.id === product.id
              )[0]
            }
            compareItem={
              compareItems.filter(
                compareItem => compareItem.id === product.id
              )[0]
            }
            key={product.id}
          />
        );
      })}
    </Fragment>
  );
};

ProductGrid.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  wishlistItems: PropTypes.array
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

const mapDispatchToProps = dispatch => {
  return {
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);
