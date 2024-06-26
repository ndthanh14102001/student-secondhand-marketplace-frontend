import PropTypes from "prop-types";
import React, {
  Fragment,
} from "react";
import { Box, IconButton } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import useCategorySlideHook from "../../hooks/category-slide/CategorySlideHook";
const CategorySlideOne = () => {
  const theme = useTheme();
  const categorySlideHook = useCategorySlideHook();
  return (
    <Fragment>
      <div
        style={{ marginTop: "3rem", marginBottom: "3rem" }}
      >
        <Box
          className="container"
          onMouseEnter={categorySlideHook.addClassHoverBtn}
          onMouseOver={categorySlideHook.removeClassHoverBtn}
          sx={{
            padding: "0 2rem",
            position: "relative",
          }}
        >
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={categorySlideHook.activeCategorySlider}
            onChangeIndex={categorySlideHook.handleStepChange}
            enableMouseEvents
          >
            {categorySlideHook.categoriesCarouselShow}
          </SwipeableViews>
          <IconButton
            ref={categorySlideHook.btnPrevSlideRef}
            id="btn-prev-cat-carousel"
            size="large"
            onClick={categorySlideHook.handleBack}
            sx={{
              color: (theme) => theme.palette.primary.main,
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              display: categorySlideHook.activeCategorySlider !== 0 ? "inline-flex" : "none",
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            ref={categorySlideHook.btnNextSlideRef}
            id="btn-next-cat-carousel"
            size="large"
            onClick={categorySlideHook.handleNext}
            sx={{
              color: (theme) => theme.palette.primary.main,
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              display:
              categorySlideHook.activeCategorySlider < categorySlideHook.numScreenCarousel - 1
                  ? "inline-flex"
                  : "none",
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Box>
      </div>
    </Fragment>
  );
};

CategorySlideOne.propTypes = {
  product: PropTypes.object,
};
export default CategorySlideOne;
