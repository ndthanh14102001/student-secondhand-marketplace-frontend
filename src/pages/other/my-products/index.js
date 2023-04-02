import React, { Fragment } from 'react'
import { MetaTags } from 'react-meta-tags'
import LayoutOne from '../../../layouts/LayoutOne'
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import { useLocation } from 'react-router';
import { Box, Tab, Tabs } from '@mui/material';
import ProductPostList from './ProductPostList';
import { PRODUCT_SOLD_KEY, PRODUCT_ON_SELL_KEY } from './constants';

function a11yProps(index) {
  return {
    id: `products-tab-${index}`,
    'aria-controls': `products-tabpanel-${index}`,
  };
}
const MyProducts = () => {
  const { pathname } = useLocation();
  const [value, setValue] = React.useState(PRODUCT_ON_SELL_KEY);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <MetaTags>
        <title>Flone | My Products</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Sản phẩm của tôi
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        <Breadcrumb />
        <div className="product-area  pb-60">
          <div className="container">
            <div className="row">
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', margin: "2rem 0" }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Sản phẩm đang bán" {...a11yProps(PRODUCT_ON_SELL_KEY)} />
                    <Tab label="Sản phẩm đã bán" {...a11yProps(PRODUCT_SOLD_KEY)} />
                  </Tabs>
                </Box>
                <ProductPostList value={value} index={PRODUCT_ON_SELL_KEY}>
                  Sản phẩm đang bán
                </ProductPostList>
                <ProductPostList value={value} index={PRODUCT_SOLD_KEY}>
                  Sản phẩm đã bán
                </ProductPostList>
              </Box>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment >
  )
}

export default MyProducts