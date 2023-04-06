import { Box, Grid } from '@mui/material';
import React, { Fragment } from 'react'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useLocation } from 'react-router-dom';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import FormInfoProduct from './FormInfoProduct';
import ImageUpload from './ImageUpload';
import { useState } from 'react';

const ProductPost = () => {
  const { pathname } = useLocation();
  const [price, setPrice] = useState(0);
  const [categoryChoose, setCategoryChoose] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("submit")
  }
  return (
    <Fragment>
      <MetaTags>
        <title>Flone | Product Post</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Đăng bán
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div className="row">
              <Box sx={{ width: "100%" }} component={"form"} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={4}><ImageUpload /></Grid>
                  <Grid item xs={8}>
                    <FormInfoProduct price={price} setPrice={setPrice}
                      categoryChoose={categoryChoose}
                      setCategoryChoose={setCategoryChoose}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment >
  )
}

export default ProductPost