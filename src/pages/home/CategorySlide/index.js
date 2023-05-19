import PropTypes from "prop-types";
import React, { Fragment, useCallback, useEffect, useMemo, useRef } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Button, Grid, IconButton } from "@mui/material";
import CategoryItem from "./CategoryItem";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from '@mui/material/styles';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { setCategoryFilter } from "../../../redux/actions/filterActions";
import { onCloseModalLoading, onOpenModalLoading } from "../../../redux/actions/modalLoadingActions";
import { v4 } from "uuid";
const CAT_ITEM_EACH_PAGE = 5;
const CategorySlide = () => {
  const theme = useTheme();
  const [activeCategorySlider, setActiveCategorySlider] = React.useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [numScreenCarousel, setNumScreenCarousel] = useState(0);
  const btnNextSlideRef = useRef()
  const btnPrevSlideRef = useRef()
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
  }, [dispatch])
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
  const handleStepChange = (step) => {
    setActiveCategorySlider(step);
  };
  const handleNext = () => {
    setActiveCategorySlider((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveCategorySlider((prevActiveStep) => prevActiveStep - 1);
  };
  const getCategoriesItemScreen = (indexCat) => {
    let indexItem = 0;
    const carouselItem = [];
    while (indexItem < CAT_ITEM_EACH_PAGE && indexCat < categories.length) {
      const category = categories[indexCat];
      const attributes = category?.attributes;
      const image = attributes?.image?.data?.attributes?.url;
      carouselItem.push([
        <Grid item xs={12 / CAT_ITEM_EACH_PAGE} onClick={() => handleClickCategoryItem(category)} key={v4()}>
          <CategoryItem name={attributes.name} image={image && process.env.REACT_APP_SERVER_ENDPOINT + image} />
        </Grid>
      ])
      indexItem++;
      indexCat++;
    }
    return {
      component: carouselItem,
      indexCat,
    };
  }
  const categoriesCarouselShow = useMemo(() => {
    let indexCategories = 0;
    let numScreen = 0;
    const categoriesShow = [];
    while (indexCategories < categories.length) {
      numScreen++;
      const { component: items, indexCat } = getCategoriesItemScreen(indexCategories)
      categoriesShow.push(<Grid container spacing={2} key={v4()}>
        {items}
      </Grid>)
      indexCategories = indexCat;
    }
    setNumScreenCarousel(numScreen);
    return categoriesShow;
  }, [categories.length]);
  console.log("activeCategorySlider", activeCategorySlider)
  const addClassHoverBtn = useCallback(() => {
    if (btnNextSlideRef.current) {
      btnNextSlideRef.current.classList.add("icon-button-hover")
    }
    if (btnPrevSlideRef.current) {
      btnPrevSlideRef.current.classList.add("icon-button-hover")
    }

  }, [activeCategorySlider]);
  const removeClassHoverBtn = useCallback(() => {
    if (btnNextSlideRef.current) {
      btnNextSlideRef.current.classList.remove("icon-button-hover")
    }
    if (btnPrevSlideRef.current) {
      btnPrevSlideRef.current.classList.remove("icon-button-hover")
    }

  }, [activeCategorySlider]);
  return (
    <Fragment>
      <div className="product-area" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <Box className="container"
          onMouseEnter={addClassHoverBtn}
          onMouseOver={removeClassHoverBtn}
          sx={{
            padding: "0 2rem",
            position: "relative"
          }}
        >
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeCategorySlider}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {categoriesCarouselShow}
          </SwipeableViews>
          <IconButton
            ref={btnPrevSlideRef}
            id="btn-prev-cat-carousel"
            size="large"
            onClick={handleBack}
            sx={{
              color: theme => theme.palette.primary.main,
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              display: activeCategorySlider !== 0 ? "inline-flex" : "none"
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            ref={btnNextSlideRef}
            id="btn-next-cat-carousel"
            size="large"
            onClick={handleNext}
            sx={{
              color: theme => theme.palette.primary.main,
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              display: activeCategorySlider < numScreenCarousel - 1 ? "inline-flex" : "none",
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </div>
    </Fragment >
  );
};

CategorySlide.propTypes = {
  product: PropTypes.object
};
export default CategorySlide;
