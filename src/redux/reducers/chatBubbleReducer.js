/* eslint-disable default-case */
import {
  SHOW_CHAT_BUBBLE,
  HIDE_CHAT_BUBBLE,
  UPDATE_NUMBER_OF_UNREAD_MESSAGES,
} from "../actions/chatBubbleActions";

const initState = {
  isShow: true,
  flagUpdateNumberOfUnreadMessages: true,
};

const chatBubbleReducer = (state = initState, action) => {
  switch (action.type) {
    case SHOW_CHAT_BUBBLE: {
      state.isShow = true;
      break;
    }
    case HIDE_CHAT_BUBBLE: {
      state.isShow = false;
      break;
    }
    case UPDATE_NUMBER_OF_UNREAD_MESSAGES: {
      state.flagUpdateNumberOfUnreadMessages =
        !state.flagUpdateNumberOfUnreadMessages;
      break;
    }
  }
  return state;
};

export default chatBubbleReducer;
