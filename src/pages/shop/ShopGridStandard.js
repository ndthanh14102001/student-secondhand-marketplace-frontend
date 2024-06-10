import PropTypes from "prop-types";
import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import Paginator from "react-hooks-paginator";
import { useLocation } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import useShopHook from "../../hooks/shop/ShopHook";

const ShopGridStandard = ({ products }) => {
  const { pathname } = useLocation();
  const shopHook = useShopHook({ products });
  return (
    <Fragment>
      <MetaTags>
        <title>Mua bán, trao đổi đồ dùng cho sinh viên</title>
        <meta
          name="description"
          content="Shop page of flone react minimalist eCommerce template."
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Danh mục
      </BreadcrumbsItem>

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                {/* shop sidebar */}
                <ShopSidebar
                  products={products}
                  getSortParams={shopHook.getSortParams}
                  sideSpaceClass="mr-30"
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                {/* shop topbar default */}
                <ShopTopbar
                  valueFilter={shopHook.priceFilter}
                  getLayout={shopHook.getLayout}
                  getFilterSortParams={shopHook.getFilterSortParams}
                  productCount={shopHook.totalProduct}
                  sortedProductCount={shopHook.productList?.length || 0}
                />

                {/* shop page content default */}
                <ShopProducts layout={shopHook.layout} products={shopHook.productList} />
                {shopHook.productList?.length === 0 && !shopHook.isLoadingCategoryQuery && (
                  <div>Không có kết quả</div>
                )}
                {shopHook.isLoadingCategoryQuery && <div>Đang tải...</div>}
                {/* shop product pagination */}
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={shopHook.totalProduct}
                    pageLimit={shopHook.pageLimit}
                    pageNeighbours={2}
                    setOffset={shopHook.setOffset}
                    currentPage={shopHook.currentPage}
                    setCurrentPage={shopHook.setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

ShopGridStandard.propTypes = {
  location: PropTypes.object,
  products: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    products: state.productData.products,
  };
};

export default connect(mapStateToProps)(ShopGridStandard);
