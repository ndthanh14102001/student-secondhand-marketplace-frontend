import * as constants from "../reducers/socketReducer";

export const setSocket = (socket) => {
  return {
    type: constants.SET_SOCKET,
    payload: socket,
  };
};

export const setChats = (chats) => {
  return {
    type: constants.SET_CHATS,
    payload: chats,
  };
};

export const addChat = (chat) => {
  return {
    type: constants.ADD_CHAT,
    payload: chat,
  };
};

export const setPartners = (partnerts) => {
  return {
    type: constants.SET_PARTNERS,
    payload: partnerts,
  };
};

export const setNumberOfUnreadMessages = (unreadMessages) => {
  return {
    type: constants.SET_NUMBER_OF_UNREAD_MESSAGES,
    payload: unreadMessages,
  };
};
export const newMessage = (message) => {
  return {
    type: constants.NEW_MESSAGE,
    payload: message,
  };
};

export const addSeenCountByPartnerId = ({ partnerId }) => {
  return {
    type: constants.ADD_SEEN_COUNT,
    payload: {
      partnerId,
    },
  };
};
export const clearSeenCountByPartnerId = ({ partnerId }) => {
  return {
    type: constants.CLEAR_SEEN_COUNT,
    payload: {
      partnerId,
    },
  };
};
