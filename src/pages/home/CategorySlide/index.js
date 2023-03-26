import PropTypes from "prop-types";
import React, { Fragment } from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Swiper from "react-id-swiper";
import { IconButton } from "@mui/material";
import CategoryItem from "./CategoryItem";

const CategorySlide = ({ product }) => {
  // swiper slider settings

  const thumbnailSwiperParams = {
    spaceBetween: 10,
    slidesPerView: 5,
    loopedSlides: 5,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-mui-next",
      prevEl: ".swiper-button-mui-prev"
    },
    renderPrevButton: () => (
      <IconButton
        sx={{
          color: theme => theme.palette.primary.main,
          position: "absolute",
          top:"calc(25% + 1rem)",
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
          top:"calc(25% + 1rem)",
          right: 0,
          zIndex: 100,
        }}><ArrowForwardIosIcon /></IconButton>
    )
  };

  return (
    <Fragment>
      <div className="product-area" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
        <div className="container">
          <Swiper {...thumbnailSwiperParams}>
            {
              categories.map((category, key) => {
                return (
                  <div key={key}>
                    <CategoryItem name={category.name} image={category.img} />
                  </div>
                );
              })}
          </Swiper>
        </div>
      </div>
    </Fragment>
  );
};

CategorySlide.propTypes = {
  product: PropTypes.object
};
const categories = [
  {
    name: "Tài liệu học tập",
    img: "https://cdn-icons-png.flaticon.com/512/35/35920.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  },
  {
    name: "Dụng cụ học tập",
    img: "https://vppcantho.com/wp-content/uploads/2021/03/icon-stationery.png"
  }
]
export default CategorySlide;
