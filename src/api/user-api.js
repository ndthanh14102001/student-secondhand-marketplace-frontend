import callApi, { RESPONSE_TYPE } from "../utils/callApi";
const userApi = {
  getProductByUserId: async (userId) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products",
      method: "get",
      params: {
        populate: "*",
        filters: {
          userId: {
            id: {
              $eq: userId
            }
          }
        },
        sort: {
          updatedAt: "desc"
        }
      }
    })
    return response;
  },
  getAllUserHasProduct: async (handleError) => {
    let data = [];
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users",
      method: "get",
      params: {
        fields: ['products', 'universityId'],
        populate: "product",
      }
    })
    if (response.type === RESPONSE_TYPE) {
      const responseData = response.data;
      console.log("responseData", responseData);
      if (Array.isArray(responseData)) {
        data = responseData.filter((user) => user?.product?.length > 0)
      }
    } else {
      handleError(response);
    }
    return data;
  },
}
export default userApi;