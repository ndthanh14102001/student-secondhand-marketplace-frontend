import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from 'react';
import MetaTags from 'react-meta-tags';
import Paginator from 'react-hooks-paginator';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect, useDispatch, useSelector } from 'react-redux';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import callApi from "../../utils/callApi";
import { ALL_UNIVERSITY } from "../../components/product/ShopUniversityFilter";
import { setSortPriceFilter } from "../../redux/actions/filterActions";
import { PRICE_HIGH_TO_LOW_SORT, PRICE_LOW_TO_HIGH_SORT } from "../../components/product/ShopTopAction";
import { useMemo } from "react";
import { onCloseModalLoading, onOpenModalLoading } from "../../redux/actions/modalLoadingActions";

const ShopGridStandard = ({ location, products }) => {
    const dispatch = useDispatch();
    const [isLoadingCategoryQuery, setIsLoadingCategoryQuery] = useState(true);
    const categoriesFilter = useSelector(state => state.filter.category);
    const universityFilter = useSelector(state => state.filter.university);
    const nameFilter = useSelector(state => state.filter.name);
    const priceFilter = useSelector(state => state.filter.sort.price);

    const [productList, setProductList] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);

    const [layout, setLayout] = useState('grid three-column');
    const [sortType, setSortType] = useState('');
    const [sortValue, setSortValue] = useState('');
    const [filterSortType, setFilterSortType] = useState('');
    // const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    // const [currentData, setCurrentData] = useState([]);
    // const [sortedProducts, setSortedProducts] = useState([]);
    const pageLimit = 15;
    const { pathname } = location;

    const getLayout = (layout) => {
        setLayout(layout)
    }

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    }

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        // setFilterSortValue(sortValue);
        dispatch(setSortPriceFilter(sortValue))
    }
    // useEffect(() => {
    //     let sortedProducts = getSortedProducts(products, sortType, sortValue);
    //     const filterSortedProducts = getSortedProducts(sortedProducts, filterSortType, filterSortValue);
    //     sortedProducts = filterSortedProducts;
    //     setSortedProducts(sortedProducts);
    //     setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    // }, [offset, products, sortType, sortValue, filterSortType, filterSortValue]);
    const priceSortType = useMemo(() => {
        if (priceFilter === PRICE_HIGH_TO_LOW_SORT) {
            return "desc"
        }
        if (priceFilter === PRICE_LOW_TO_HIGH_SORT) {
            return "asc"
        }
        return undefined
    }, [priceFilter])
    useEffect(() => {
        const filterProduct = async () => {
            setIsLoadingCategoryQuery(true);
            dispatch(onOpenModalLoading())
            const categoriesQuery = [{
                category: {
                    id: {
                        $eq: categoriesFilter?.id
                    }
                }
            },];
            const categoriesChild = categoriesFilter?.attributes?.children?.data;
            if (categoriesChild && Array.isArray(categoriesChild)) {
                categoriesChild.forEach(category => {
                    categoriesQuery.push({
                        category: {
                            id: {
                                $eq: category?.id
                            }
                        },
                    })
                })
            }
            const response = await callApi({
                url: process.env.REACT_APP_API_ENDPOINT + "/products",
                method: "get",
                params: {
                    filters: {
                        $or: categoriesQuery,
                        status: {
                            $eq: "onSale"
                        },
                        userId: {
                            universityId: {
                                $eq: universityFilter === ALL_UNIVERSITY ? undefined : universityFilter
                            },
                        },
                        name: {
                            $contains: nameFilter || undefined
                        }
                    },
                    pagination: {
                        page: currentPage || 1,
                        pageSize: pageLimit,
                    },
                    populate: {
                        userId: {
                            populate: "*"
                        },
                        category: true,
                        images: true
                    },
                    sort: {
                        price: priceSortType
                    }
                }
            })
            setProductList(response.data?.data)
            setTotalProduct(response?.data?.meta?.pagination?.total);
            dispatch(onCloseModalLoading())
            setIsLoadingCategoryQuery(false);
        }
        if (categoriesFilter) {
            filterProduct();
        }
    }, [offset, currentPage, products, sortType, sortValue, filterSortType, universityFilter, categoriesFilter, nameFilter, priceSortType, dispatch]);
    return (
        <Fragment>
            <MetaTags>
                <title>Mua bán, trao đổi đồ dùng cho sinh viên</title>
                <meta name="description" content="Shop page of flone react minimalist eCommerce template." />
            </MetaTags>

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>Trang chủ</BreadcrumbsItem>
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>Danh mục</BreadcrumbsItem>

            <LayoutOne headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb />

                <div className="shop-area pt-95 pb-100">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 order-2 order-lg-1">
                                {/* shop sidebar */}
                                <ShopSidebar products={products} getSortParams={getSortParams} sideSpaceClass="mr-30" />
                            </div>
                            <div className="col-lg-9 order-1 order-lg-2">
                                {/* shop topbar default */}
                                <ShopTopbar
                                    valueFilter={priceFilter}
                                    getLayout={getLayout}
                                    getFilterSortParams={getFilterSortParams}
                                    productCount={totalProduct}
                                    sortedProductCount={productList?.length || 0} />

                                {/* shop page content default */}
                                {/* <ShopProducts layout={layout} products={currentData} /> */}
                                <ShopProducts layout={layout} products={productList} />
                                {productList?.length === 0 && !isLoadingCategoryQuery && <div>
                                    Không có kết quả
                                </div>}
                                {isLoadingCategoryQuery && <div>
                                    Đang tải...
                                </div>}
                                {/* shop product pagination */}
                                <div className="pro-pagination-style text-center mt-30">
                                    {/* <Paginator
                                        totalRecords={sortedProducts?.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    /> */}
                                    <Paginator
                                        totalRecords={totalProduct}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
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
    )
}

ShopGridStandard.propTypes = {
    location: PropTypes.object,
    products: PropTypes.array
}

const mapStateToProps = state => {
    return {
        products: state.productData.products
    }
}

export default connect(mapStateToProps)(ShopGridStandard);