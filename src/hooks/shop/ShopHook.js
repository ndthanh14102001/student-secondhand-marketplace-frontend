import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSortPriceFilter } from "../../redux/actions/filterActions";
import {
  PRICE_HIGH_TO_LOW_SORT,
  PRICE_LOW_TO_HIGH_SORT,
} from "../../components/product/ShopTopAction";
import { useMemo } from "react";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../../redux/actions/modalLoadingActions";
import shopApi from "../../api/shop";
const useShopHook = ({ products }) => {
  const dispatch = useDispatch();
  const [isLoadingCategoryQuery, setIsLoadingCategoryQuery] = useState(true);
  const categoriesFilter = useSelector((state) => state.filter.category);
  const universityFilter = useSelector((state) => state.filter.university);
  const nameFilter = useSelector((state) => state.filter.name);
  const priceFilter = useSelector((state) => state.filter.sort.price);

  const [productList, setProductList] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);

  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");

  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const getLayout = (layout) => {
    setLayout(layout);
  };

  const getSortParams = (sortType, sortValue) => {
    setSortType(sortType);
    setSortValue(sortValue);
  };

  const getFilterSortParams = (sortType, sortValue) => {
    setFilterSortType(sortType);
    dispatch(setSortPriceFilter(sortValue));
  };

  const priceSortType = useMemo(() => {
    if (priceFilter === PRICE_HIGH_TO_LOW_SORT) {
      return "desc";
    }
    if (priceFilter === PRICE_LOW_TO_HIGH_SORT) {
      return "asc";
    }
    return undefined;
  }, [priceFilter]);

  useEffect(() => {
    const filterProduct = async () => {
      setIsLoadingCategoryQuery(true);
      dispatch(onOpenModalLoading());
      const categoriesQuery = [
        {
          category: {
            id: {
              $eq: categoriesFilter?.id,
            },
          },
        },
      ];
      const categoriesChild = categoriesFilter?.attributes?.children?.data;
      if (categoriesChild && Array.isArray(categoriesChild)) {
        categoriesChild.forEach((category) => {
          categoriesQuery.push({
            category: {
              id: {
                $eq: category?.id,
              },
            },
          });
        });
      }
      const response = await shopApi.getProducts({
        categoriesQuery,
        currentPage,
        nameFilter,
        priceSortType,
        universityFilter,
      });
      setProductList(response.data?.data);
      setTotalProduct(response?.data?.meta?.pagination?.total);
      dispatch(onCloseModalLoading());
      setIsLoadingCategoryQuery(false);
    };
    if (categoriesFilter) {
      filterProduct();
    }
  }, [
    offset,
    currentPage,
    products,
    sortType,
    sortValue,
    filterSortType,
    universityFilter,
    categoriesFilter,
    nameFilter,
    priceSortType,
    dispatch,
  ]);
  return {
    isLoadingCategoryQuery,
    setIsLoadingCategoryQuery,
    categoriesFilter,
    universityFilter,
    nameFilter,
    priceFilter,
    productList,
    setProductList,
    totalProduct,
    setTotalProduct,
    layout,
    setLayout,
    sortType,
    setSortType,
    sortValue,
    setSortValue,
    filterSortType,
    setFilterSortType,
    offset,
    setOffset,
    currentPage,
    setCurrentPage,
    getLayout,
    getSortParams,
    getFilterSortParams,
    priceSortType,
  };
};

export default useShopHook;
