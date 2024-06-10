import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const commentApi = {
  create: async ({ data }) => {
    const loggedInUser = getUserLogin();

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/comments",
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
export default commentApi;
