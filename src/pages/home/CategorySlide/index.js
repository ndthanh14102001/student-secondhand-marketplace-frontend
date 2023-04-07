import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Swiper from "react-id-swiper";
import { IconButton } from "@mui/material";
import CategoryItem from "./CategoryItem";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../../redux/actions/filterActions";
import { onCloseModalLoading, onOpenModalLoading } from "../../../redux/actions/modalLoadingActions";

const CategorySlide = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  // swiper slider settings
  useEffect(() => {
    const getCategories = async () => {
      dispatch(onOpenModalLoading())
      const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/categories", {
        params: {
          filters: {
            parent: {
              id: {
                $null: true
              }
            }
          },
          populate: "*",
          sort: {
            name: "desc"
          }
        }
      });
      if (response?.data?.data) {
        setCategories(response?.data?.data)
      }
      dispatch(onCloseModalLoading())
    }
    getCategories();
  }, [])
  const thumbnailSwiperParams = {
    spaceBetween: 10,
    slidesPerView: 5,
    // loopedSlides: 5,
    touchRatio: 1,
    freeMode: true,
    // loop: true,
    navigation: {
      nextEl: ".swiper-button-mui-next",
      prevEl: ".swiper-button-mui-prev"
    },
    renderPrevButton: () => (
      <IconButton
        sx={{
          color: theme => theme.palette.primary.main,
          position: "absolute",
          top: "calc(25% + 1rem)",
          left: 0,
          zIndex: 100,
        }}
        className="swiper-button-mui-prev"
      ><ArrowBackIosIcon /></IconButton>
    ),
    renderNextButton: () => (
      <IconButton className="swiper-button-mui-next"
        sx={{
          color: theme => theme.palette.primary.main,
          position: "absolute",
          top: "calc(25% + 1rem)",
          right: 0,
          zIndex: 100,
        }}><ArrowForwardIosIcon /></IconButton>
    )
  };
  const handleClickCategoryItem = (category) => {
    dispatch(setCategoryFilter(category))
    history.push("/category");
  }
  return (
    <Fragment>
      <div className="product-area" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <div className="container">
          {categories.length > 0 && <Swiper {...thumbnailSwiperParams} >
            {
              categories.map((category, key) => {
                const attributes = category?.attributes;
                const image = attributes?.image?.data?.attributes?.url;
                return (
                  <div key={key} onClick={() => handleClickCategoryItem(category)}>
                    <CategoryItem name={attributes.name} image={image && process.env.REACT_APP_SERVER_ENDPOINT + image} />
                  </div>
                );
              })}
          </Swiper>}
        </div>
      </div>
    </Fragment>
  );
};

CategorySlide.propTypes = {
  product: PropTypes.object
};
export default CategorySlide;
