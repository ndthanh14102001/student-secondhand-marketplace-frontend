import callApi, { RESPONSE_TYPE } from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";

const categoryApi = {
  getAllCategorySlide: async () => {
    const response = await callApi({
      method: "get",
      url: process.env.REACT_APP_API_ENDPOINT + "/categories",
      params: {
        filters: {
          parent: {
            id: {
              $null: true,
            },
          },
        },
        populate: "*",
        sort: {
          name: "desc",
        },
      },
    });
    if (response.type === RESPONSE_TYPE) {
      return {
        ...response,
        categories: response.data?.data || [],
      };
    }
    return {
      ...response,
      categories: [],
    };
  },
};
export default categoryApi;
