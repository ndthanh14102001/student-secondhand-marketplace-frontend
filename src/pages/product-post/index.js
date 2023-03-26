import { Grid } from '@mui/material';
import React, { Fragment } from 'react'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useLocation } from 'react-router-dom';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import FormInfoProduct from './FormInfoProduct';
import ImageUpload from './ImageUpload';

const ProductPost = () => {
  const { pathname } = useLocation();
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
        <div className="product-area  pb-60">
          <div className="container">
            <div className="row">
              <Grid container spacing={2}>
                <Grid item xs={4}><ImageUpload /></Grid>
                <Grid item xs={8}><FormInfoProduct /></Grid>
              </Grid>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment >
  )
}

export default ProductPost