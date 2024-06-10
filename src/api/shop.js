import { ALL_UNIVERSITY } from "../components/product/ShopUniversityFilter";
import { PAGE_LIMIT } from "../constants/shop/constants";
import callApi from "../utils/callApi";
const shopApi = {
  getProducts: async ({
    categoriesQuery,
    universityFilter,
    nameFilter,
    currentPage,
    priceSortType,
  }) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products",
      method: "get",
      params: {
        filters: {
          $or: categoriesQuery,
          status: {
            $eq: "onSale",
          },
          userId: {
            universityId: {
              $eq:
                universityFilter === ALL_UNIVERSITY
                  ? undefined
                  : universityFilter,
            },
          },
          name: {
            $contains: nameFilter || undefined,
          },
        },
        pagination: {
          page: currentPage || 1,
          pageSize: PAGE_LIMIT,
        },
        populate: {
          userId: {
            populate: "*",
          },
          category: true,
          images: true,
        },
        sort: {
          price: priceSortType,
        },
      },
    });
    return response;
  },
};
export default shopApi;
