import React from 'react'
import ProductGridSingleTwo from '../../../components/product/ProductGridSingleTwo';
import ProductGridTwo from '../../../wrappers/product/ProductGridTwo';
import { PRODUCT_ON_SELL_KEY } from './constants';

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
      <ProductGridTwo
        category={value === PRODUCT_ON_SELL_KEY ? "fashion" : "men"}
        type="bestSeller"
        limit={8}
        spaceBottomClass="mb-25" />

    </div>
  );
}

export default ProductPostList