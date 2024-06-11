import { ALL_UNIVERSITY } from "../components/product/ShopUniversityFilter";
import { PRODUCT_ON_SALE_STATUS } from "../constants";
import { PAGE_LIMIT } from "../constants/shop/constants";
import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const shopApi = {
  getProducts: async ({
    categoriesQuery,
    universityFilter,
    nameFilter,
    currentPage,
    priceSortType,
  }) => {
    const loggedUser = getUserLogin()?.user;
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products",
      method: "get",
      params: {
        filters: {
          $or: categoriesQuery,
          status: {
            $eq: PRODUCT_ON_SALE_STATUS,
          },
          userId: {
            universityId: {
              $eq:
                universityFilter === ALL_UNIVERSITY
                  ? undefined
                  : universityFilter,
            },
            id: {
              $ne: loggedUser?.id,
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
