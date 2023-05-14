import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { getProducts } from "../../helpers/product";
import ProductGridSingle from "../../components/product/ProductGridSingle";
import { addToWishlist } from "../../redux/actions/wishlistActions";
import { useEffect } from "react";
import { useState } from "react";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import {
  getArrayUniversity, getAllUniversity, getFullAddressUniversity,
  getAllDistanceUniversity, getAllDistanceUniversityObject
} from "../../utils/data/university";
import { getUserLogin } from "../../utils/userLoginStorage";
import { calculateDistance } from "../../utils/googleApi";
import { getAllWards } from "../../utils/data/wards";
import { getAllDistrict } from "../../utils/data/district";
import { getAllCity } from "../../utils/data/city";
import { Box, Button, CircularProgress } from "@mui/material";
import userApi from "../../api/user-api";
import { onShowPopupErrorBase } from "../../redux/actions/popupErrorBaseActions";
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
  const dispatch = useDispatch();
  const userLogin = getUserLogin();
  const [productList, setProductList] = useState([]);
  const [indexUniversityFilter, setIndexUniviersityFilter] = useState(0);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [distancesUniversityHasProduct, setDistancesUniversityHasProduct] = useState([]);

  useEffect(() => {
    const getDistancesUniversityHasUser = async () => {

      if (userLogin) {
        const users = await userApi.getAllUserHasProduct((response) => dispatch(onShowPopupErrorBase(response)));
        const distances = [];
        const universityCaculated = {}
        const distancesUniversity = getAllDistanceUniversityObject()[userLogin?.user?.universityId];
        users.forEach((user) => {
          if (!universityCaculated[user.universityId]) {
            distances.push({
              id: user.universityId,
              distance: distancesUniversity[user.universityId]
            })
            universityCaculated[user.universityId] = distancesUniversity[user.universityId];
          }
        })
        distances.sort((a, b) => Number(a.distance) - Number(b.distance))
        setDistancesUniversityHasProduct(distances);
      } else {
        setDistancesUniversityHasProduct([]);
      }
    }
    getDistancesUniversityHasUser();
  }, []);

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
    const getProductListHomeNoRecommender = async () => {

      if (hasMore && isLoadingData) {
        console.log("page", page);
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/products",
          method: "get",
          params: {
            pagination: {
              page: page,
              pageSize: 2
            },
            populate: {
              userId: {
                populate: "*"
              },
              category: true,
              images: true
            },
            filters: {
              status: {
                $eq: "onSale"
              }
            },
            sort: {
              createdAt: "desc"
            }
          }
        });
        if (response.type === RESPONSE_TYPE) {
          const metaPagination = response.data?.meta?.pagination;

          setPage(prev => prev + 1);
          setHasMore(metaPagination?.pageCount >= page + 1);
          setIsLoadingData(false);
          setProductList(prev => [...prev, ...response.data?.data])
        }
      }

    }
    const getProductListHomeHasRecomender = async () => {
      console.log("page", page);
      if (distancesUniversityHasProduct.length > 0) {
        let pageTmp = page;
        let hasMoreTmp = hasMore;
        let indexUniversityFilterTmp = indexUniversityFilter;

        const universityIdFilter = []
        if (distancesUniversityHasProduct[indexUniversityFilter]) {
          universityIdFilter.push({
            userId: {
              universityId: {
                $eq: distancesUniversityHasProduct[indexUniversityFilter].id
              }
            }
          })
        } else {
          hasMoreTmp = false
          setHasMore(hasMoreTmp);
          setIsLoadingData(false);
        }

        while (true && hasMoreTmp) {
          const response = await callApi({
            url: process.env.REACT_APP_API_ENDPOINT + "/products",
            method: "get",
            params: {
              filters: {
                $or: universityIdFilter,
                status: {
                  $eq: "onSale"
                },

              },
              pagination: {
                page: page,
                pageSize: 8
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
            const metaPagination = response.data?.meta?.pagination;
            if (page + 1 > metaPagination?.pageCount) {
              pageTmp = 1
              if (indexUniversityFilterTmp + 1 > distancesUniversityHasProduct?.length) {
                hasMoreTmp = false;
                indexUniversityFilterTmp = 0;
                setHasMore(hasMoreTmp);
                setPage(pageTmp);
                setIsLoadingData(false);
                break;
              } else {
                hasMoreTmp = true;
                indexUniversityFilterTmp = indexUniversityFilterTmp + 1;
              }

            } else {
              pageTmp = page + 1
              hasMoreTmp = true;
            }
            if (Array.isArray(response.data?.data) && response.data?.data.length > 0) {
              setProductList(prev => [...prev, ...response.data?.data])
              setIndexUniviersityFilter(indexUniversityFilterTmp);
              setHasMore(hasMoreTmp);
              setPage(pageTmp);
              setIsLoadingData(false);
              break;
            }
          }
        }
      }

    }
    if (category === HOME_CATEGORY) {
      if (isLoadingData) {
        if (userLogin) {
          getProductListHomeHasRecomender();
        } else {
          getProductListHomeNoRecommender();
        }
      }
    } else {
      getProductListByCategory();
    }

  }, [category, isLoadingData, distancesUniversityHasProduct.length]);
  const handleShowNextPage = () => {
    if (hasMore) {
      setIsLoadingData(true);
    }
  }
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
      {hasMore && <Box className="col-md-12" sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            variant="contained"
            // sx={buttonSx}
            disabled={isLoadingData}
            onClick={handleShowNextPage}
          >
            Hiển thị thêm
          </Button>
          {isLoadingData && (
            <CircularProgress
              size={24}
              sx={{
                color: "purple",
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>}
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
