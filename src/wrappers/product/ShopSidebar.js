import PropTypes from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
import ShopTag from "../../components/product/ShopTag";
import { useEffect } from "react";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { useState } from "react";
import ShopUniversityFilter, { ALL_UNIVERSITY } from "../../components/product/ShopUniversityFilter";
import { UNIVERSITY_LIST } from "../../constants";
import { onOpenModalLoading, onCloseModalLoading } from "../../redux/actions/modalLoadingActions"
const ShopSidebar = ({ products, getSortParams, sideSpaceClass }) => {
  const uniqueCategories = getIndividualCategories(products);
  const uniqueColors = getIndividualColors(products);
  const uniqueSizes = getProductsIndividualSizes(products);
  const uniqueTags = getIndividualTags(products);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllCategory = async () => {
      dispatch(onOpenModalLoading())
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/categories",
        method: "get",
        params: {
          filters: {
            parent: {
              id: {
                $null: true
              }
            }
          },
          populate: {
            children: {
              populate: "children"
            },
          },
          sort: {
            name: "desc"
          }
        }
      });
      if (response.type === RESPONSE_TYPE) {
        setCategories(response.data?.data);
      }
      dispatch(onCloseModalLoading())
    }
    getAllCategory();
  }, [dispatch]);
  return (
    <div className={`sidebar-style ${sideSpaceClass ? sideSpaceClass : ""}`}>
      {/* shop search */}
      <ShopSearch />
      <ShopUniversityFilter />
      {/* filter by categories */}
      {/* <ShopCategories
        categories={uniqueCategories}
        getSortParams={getSortParams}
      /> */}
      <ShopCategories
        categories={categories}
        getSortParams={getSortParams}
      />
      {/* filter by color */}
      {/* <ShopColor colors={uniqueColors} getSortParams={getSortParams} /> */}

      {/* filter by size */}
      {/* <ShopSize sizes={uniqueSizes} getSortParams={getSortParams} /> */}

      {/* filter by tag */}
      {/* <ShopTag tags={uniqueTags} getSortParams={getSortParams} /> */}
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
