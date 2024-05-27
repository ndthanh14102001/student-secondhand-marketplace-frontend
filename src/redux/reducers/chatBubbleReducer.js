/* eslint-disable default-case */
import {
  SHOW_CHAT_BUBBLE,
  HIDE_CHAT_BUBBLE,
} from "../actions/chatBubbleActions";

const initState = {
  isShow: true,
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
  }
  return state;
};

export default chatBubbleReducer;
