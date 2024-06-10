import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import TabProduct from "../../wrappers/product/TabProduct";
import CategorySlideOne from "../../wrappers/category-slide/CategorySlideOne";
import { HOME_CATEGORY } from "../../wrappers/product/ProductGrid";

const HomeFashion = () => {
  return (
    <Fragment>
      <MetaTags>
        <title>
          Chợ Sinh Viên - Website mua bán, trao đổi đồ dùng cho sinh viên
        </title>
        <meta
          name="description"
          content="Fashion home of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        <CategorySlideOne />
        <TabProduct spaceBottomClass="pb-60" category={HOME_CATEGORY} />
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFashion;
