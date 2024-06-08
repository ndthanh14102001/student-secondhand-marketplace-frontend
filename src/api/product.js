import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const productApi = {
  create: async ({ data }) => {
    const loggedInUser = getUserLogin();

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products",
      method: "post",
      data: {
        data: data,
      },
      headers: {
        authorization: loggedInUser?.token,
      },
    });
    return response;
  },
};
export default productApi;
