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
  getAllDistanceUniversityObject
} from "../../utils/data/university";
import { getUserLogin } from "../../utils/userLoginStorage";
import { Box, Button, CircularProgress } from "@mui/material";
import userApi from "../../api/user-api";
import { onShowPopupErrorBase } from "../../redux/actions/popupErrorBaseActions";
export const HOME_CATEGORY = "HOME_CATEGORY";

const NUMBER_PRODUCT_RECOMMENDER = 8;
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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [recomenderInfo, setRecomenderInfo] = useState({
    distancesUniversityHasProduct: [],
    indexUniversityFilter: 0,
    hasMore: true,
    page: 1,
    productRecomended: 0,
    productRecommenderNext: NUMBER_PRODUCT_RECOMMENDER,
    remainingProductInUni: 0
  })

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
        setRecomenderInfo(prev => ({
          ...prev,
          distancesUniversityHasProduct: distances,
        }));
      } else {
        setRecomenderInfo(prev => ({
          ...prev,
          distancesUniversityHasProduct: [],
        }));
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
      if (recomenderInfo.hasMore && isLoadingData) {
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/products",
          method: "get",
          params: {
            pagination: {
              page: recomenderInfo.page,
              pageSize: 8
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
          setRecomenderInfo(prev => ({
            ...prev,
            hasMore: metaPagination?.pageCount >= prev.page + 1,
            page: prev.page + 1
          }))
          setIsLoadingData(false);
          setProductList(prev => [...prev, ...response.data?.data])
        }
      }

    }
    const getFilterUniversityByIndex = (indexUniversity) => {
      const universityIdFilter = [];
      let hasMoreTmp = recomenderInfo.hasMore;
      if (recomenderInfo.distancesUniversityHasProduct[indexUniversity]) {
        universityIdFilter.push({
          userId: {
            universityId: {
              $eq: recomenderInfo.distancesUniversityHasProduct[indexUniversity].id
            }
          }
        })
      } else {
        hasMoreTmp = false
        setRecomenderInfo(prev => ({
          ...prev,
          hasMore: false
        }));
        setIsLoadingData(false);
      }
      return {
        universityIdFilter,
        hasMoreTmp,
      }
    }
    const getProductListHomeHasRecomender = async () => {
      const recomenderInfoCopy = { ...recomenderInfo };

      if (recomenderInfo.distancesUniversityHasProduct?.length > 0) {

        
        while (true && recomenderInfoCopy.hasMore) {
          let universityIdFilter = []
          const filterUniversity = getFilterUniversityByIndex(recomenderInfoCopy.indexUniversityFilter);
          universityIdFilter = filterUniversity.universityIdFilter;
          recomenderInfoCopy.hasMore = filterUniversity.hasMoreTmp;
          if (recomenderInfoCopy.hasMore) {
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
                  page: recomenderInfoCopy.page,
                  pageSize: recomenderInfoCopy.productRecommenderNext
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
              if (recomenderInfoCopy.page + 1 > metaPagination?.pageCount) {
                
                recomenderInfoCopy.page = 1
                if (recomenderInfoCopy.indexUniversityFilter + 1 > recomenderInfoCopy.distancesUniversityHasProduct?.length) {
                  recomenderInfoCopy.hasMore = false;
                  recomenderInfoCopy.indexUniversityFilter = 0;
                  setRecomenderInfo({
                    ...recomenderInfoCopy
                  })
                  setIsLoadingData(false);
                  break;
                } else {
                  
                  recomenderInfoCopy.hasMore = true;
                  recomenderInfoCopy.indexUniversityFilter = recomenderInfoCopy.indexUniversityFilter + 1;
                }

              } else {
                
                recomenderInfoCopy.page = recomenderInfoCopy.page + 1
                recomenderInfoCopy.hasMore = true;
              }
              if (Array.isArray(response.data?.data) && response.data?.data?.length > 0) {
                const metaPagination = response.data?.meta?.pagination;
                recomenderInfoCopy.productRecomended = recomenderInfoCopy.productRecomended + response.data?.data?.length;
                recomenderInfoCopy.productRecommenderNext = recomenderInfoCopy.productRecommenderNext - response.data?.data?.length;

                setProductList(prev => [...prev, ...response.data?.data])

                if (recomenderInfoCopy.productRecommenderNext === 0) {
                  
                  recomenderInfoCopy.productRecommenderNext = NUMBER_PRODUCT_RECOMMENDER;
                  setRecomenderInfo({
                    ...recomenderInfoCopy
                  })
                  setIsLoadingData(false);
                  break;
                }
              }
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

  }, [category, isLoadingData, recomenderInfo.distancesUniversityHasProduct?.length]);
  const handleShowNextPage = () => {
    if (recomenderInfo.hasMore) {
      setIsLoadingData(true);
    }
  }
  return (
    <Fragment>
      {/* {products?.map(product => {
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
      {productList?.map(product => {
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
      {recomenderInfo.hasMore && <Box className="col-md-12" sx={{ display: "flex", justifyContent: "center" }}>
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
