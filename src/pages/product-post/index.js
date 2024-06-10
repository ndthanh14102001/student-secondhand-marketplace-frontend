import { Box, Grid } from "@mui/material";
import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { MetaTags } from "react-meta-tags";
import { useLocation } from "react-router-dom";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import FormInfoProduct from "../../wrappers/product/product-post/FormInfoProduct";
import ImageUpload from "../../components/product-post/ImageUpload";
import useProductPostHook from "../../hooks/product-post/ProductPostHook";

const ProductPost = () => {
  const { pathname } = useLocation();
  const productPostHook = useProductPostHook();
  return (
    <Fragment>
      <MetaTags>
        <title>Đăng bán sản phẩm của bạn</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Đăng bán
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div className="row">
              <Box
                sx={{ width: "100%", p: 2 }}
                component={"form"}
                onSubmit={productPostHook.handleSubmit}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <ImageUpload
                      productInfo={productPostHook.productInfo}
                      setProductInfo={productPostHook.setProductInfo}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <FormInfoProduct
                      productInfo={productPostHook.productInfo}
                      setProductInfo={productPostHook.setProductInfo}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ProductPost;
