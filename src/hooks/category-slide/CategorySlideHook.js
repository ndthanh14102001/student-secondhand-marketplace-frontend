import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import CategorySlideOneSingle from "../../components/category-slide/CategorySlideOneSingle";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategoryFilter } from "../../redux/actions/filterActions";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../../redux/actions/modalLoadingActions";
import { v4 } from "uuid";
import { IMAGE_SIZE_THUMBNAIL, getImageUrl } from "../../utils/image";
import categoryApi from "../../api/category";
const CAT_ITEM_EACH_PAGE = 5;
const MOBILE_CAT_ITEM_EACH_PAGE = 2;

const useCategorySlideHook = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const isMobilePhone = useMediaQuery(theme.breakpoints.down("md"));

  const [activeCategorySlider, setActiveCategorySlider] = React.useState(0);
  const [categories, setCategories] = useState([]);
  const [numScreenCarousel, setNumScreenCarousel] = useState(0);
  const btnNextSlideRef = useRef();
  const btnPrevSlideRef = useRef();
  // swiper slider settings
  useEffect(() => {
    const getCategories = async () => {
      dispatch(onOpenModalLoading());
      const response = await categoryApi.getAllCategorySlide();
      setCategories(response.categories);
      dispatch(onCloseModalLoading());
    };
    getCategories();
  }, [dispatch]);

  const handleClickCategoryItem = (category) => {
    dispatch(setCategoryFilter(category));
    history.push("/category");
  };

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
    const numberOfCategoryEachPage = getNumberOfCategoryEachPage();
    while (
      indexItem < numberOfCategoryEachPage &&
      indexCat < categories?.length
    ) {
      const category = categories[indexCat];
      const attributes = category?.attributes;
      const image = getImageUrl(
        attributes?.image?.data?.attributes,
        IMAGE_SIZE_THUMBNAIL
      );
      carouselItem.push([
        <Grid
          item
          xs={12 / numberOfCategoryEachPage}
          onClick={() => handleClickCategoryItem(category)}
          key={v4()}
        >
          <CategorySlideOneSingle name={attributes.name} image={image} />
        </Grid>,
      ]);
      indexItem++;
      indexCat++;
    }
    return {
      component: carouselItem,
      indexCat,
    };
  };

  const getNumberOfCategoryEachPage = () => {
    return isMobilePhone ? MOBILE_CAT_ITEM_EACH_PAGE : CAT_ITEM_EACH_PAGE;
  };

  const categoriesCarouselShow = useMemo(() => {
    let indexCategories = 0;
    let numScreen = 0;
    const categoriesShow = [];
    while (indexCategories < categories?.length) {
      numScreen++;
      const { component: items, indexCat } =
        getCategoriesItemScreen(indexCategories);
      categoriesShow.push(
        <Grid container spacing={2} key={indexCategories}>
          {items}
        </Grid>
      );
      indexCategories = indexCat;
    }
    setNumScreenCarousel(numScreen);
    return categoriesShow;
  }, [categories?.length, isMobilePhone]);

  const addClassHoverBtn = useCallback(() => {
    if (btnNextSlideRef.current) {
      btnNextSlideRef.current.classList.add("icon-button-hover");
    }
    if (btnPrevSlideRef.current) {
      btnPrevSlideRef.current.classList.add("icon-button-hover");
    }
  }, [activeCategorySlider]);

  const removeClassHoverBtn = useCallback(() => {
    if (btnNextSlideRef.current) {
      btnNextSlideRef.current.classList.remove("icon-button-hover");
    }
    if (btnPrevSlideRef.current) {
      btnPrevSlideRef.current.classList.remove("icon-button-hover");
    }
  }, [activeCategorySlider]);
  return {
    activeCategorySlider,
    setActiveCategorySlider,
    categories,
    setCategories,
    numScreenCarousel,
    setNumScreenCarousel,
    btnNextSlideRef,
    btnPrevSlideRef,
    removeClassHoverBtn,
    addClassHoverBtn,
    categoriesCarouselShow,
    getCategoriesItemScreen,
    handleClickCategoryItem,
    handleStepChange,
    handleNext,
    handleBack,
  };
};

export default useCategorySlideHook;
