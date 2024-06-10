import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const fileApi = {
  post: async ({ formData }) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/upload",
      method: "post",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },
  postWithAuthorization: async ({ formData }) => {
    const loggedInUser = getUserLogin();

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/upload",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: loggedInUser?.token,
      },
    });
    return response;
  },
};
export default fileApi;
