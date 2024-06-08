import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";

const notificationApi = {
  getAll: async () => {
    const loggedInUser = getUserLogin();
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/notifications",
      method: "get",
      headers: {
        authorization: loggedInUser?.token,
      },
      params: {
        populate: {
          sender: {
            populate: ["avatar"],
          },
          readUsers: true,
          product: true,
        },
        sort: {
          createdAt: "desc",
        },
        pagination: {
          page: 1,
          pageSize: 100,
        },
        filters: {
          receivers: {
            $in: [loggedInUser?.user?.id],
          },
        },
      },
    });
    return response;
  },
  getUnreadNotifications: async () => {
    const loggedInUser = getUserLogin();
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/notifications/unread",
      method: "get",
      headers: {
        authorization: loggedInUser?.token,
      },
    });
    return response;
  },
  read: async (notificationId) => {
    const loggedInUser = getUserLogin();
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/read/notification/" + notificationId,
      method: "patch",
      headers: {
        authorization: loggedInUser?.token,
      },
    });
    return response;
  },
};

export default notificationApi;
