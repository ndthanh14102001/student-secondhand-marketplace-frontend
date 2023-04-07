import callApi from "../utils/callApi";

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
  }
}
export default userApi;