import React from 'react'
import ProductGridSingleTwo from '../../components/product/ProductGridSingleTwo';
import MyProductGrid from './MyProductGrid';
import { PRODUCT_ON_SALE_KEY } from '../../constants/my-products/constants';

const ProductPostList = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      className='row'
      role="tabpanel"
      hidden={value !== index}
      id={`products-tabpanel-${index}`}
      aria-labelledby={`products-tab-${index}`}
      {...other}
    >
      <MyProductGrid
        productStatus={value}
        category={value === PRODUCT_ON_SALE_KEY ? "fashion" : "men"}
        type="bestSeller"
        limit={8}
        spaceBottomClass="mb-25" />

    </div>
  );
}

export default ProductPostList