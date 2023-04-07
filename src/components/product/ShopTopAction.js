import PropTypes from "prop-types";
import React from "react";
import { setActiveLayout } from "../../helpers/product";
export const PRICE_HIGH_TO_LOW_SORT = "priceHighToLow";
export const PRICE_LOW_TO_HIGH_SORT = "priceLowToHigh";
export const PRICE_DEFAULT_SORT = "default";
const ShopTopAction = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount,
  valueFilter
}) => {
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
        <div className="shop-select">
          <select
            value={valueFilter}
            onChange={e => getFilterSortParams("filterSort", e.target.value)}
          >
            <option value={PRICE_DEFAULT_SORT}>Mặt định</option>
            <option value={PRICE_HIGH_TO_LOW_SORT}>Giá - Cao đến Thấp</option>
            <option value={PRICE_LOW_TO_HIGH_SORT}>Giá - Thấp đến Cao</option>
          </select>
        </div>
        <p>
          Hiển thị {sortedProductCount} của {productCount} kết quả
        </p>
      </div>

      <div className="shop-tab">
        <button
          onClick={e => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={e => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={e => {
            getLayout("list");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
    </div>
  );
};

ShopTopAction.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number
};

export default ShopTopAction;
