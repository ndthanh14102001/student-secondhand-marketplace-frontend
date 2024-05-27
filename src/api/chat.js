import callApi, { RESPONSE_TYPE } from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const chatApi = {
  getChats: async ({ partnerId }) => {
    const loggedInUser = getUserLogin();

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/chats",
      method: "get",
      headers: {
        authorization: loggedInUser?.token,
      },
      params: {
        populate: "*",
        sort: {
          createdAt: "desc",
        },
        pagination: {
          page: 1,
          pageSize: 100,
        },
        filters: {
          $and: [
            {
              sender: {
                id: {
                  $in: [loggedInUser?.user?.id, partnerId],
                },
              },
            },
            {
              receiver: {
                id: {
                  $in: [loggedInUser?.user?.id, partnerId],
                },
              },
            },
          ],
        },
      },
    });
    return response;
  },
  getNumberOfUnreadMessages: async () => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/chats/unread/count",
      method: "get",
      headers: {
        authorization: getUserLogin()?.token,
      },
    });
    if (response.type === RESPONSE_TYPE) {
      const numberOfUnreadMessages = response?.data?.data?.total;
      return {
        ...response,
        numberOfUnreadMessages,
      };
    }
    return response;
  },
  getPartners: async () => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/chats/partners",
      method: "get",
      headers: {
        authorization: getUserLogin().token,
      },
    });
    if (response.type === RESPONSE_TYPE) {
      const partners = response?.data?.data;
      return {
        ...response,
        partners: partners || [],
      };
    }
    return response;
  },
  readChatsBySenderId: async ({ senderId }) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/chats/read/" + senderId,
      method: "patch",
      headers: {
        authorization: getUserLogin().token,
      },
    });
    return response;
  },
};
export default chatApi;
