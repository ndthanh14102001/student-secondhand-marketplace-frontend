import uuid from "uuid/v4";
import {
    CONNECT_CHAT_SOCKET
} from "../actions/cartActions";

const initState = [];

const chatSocketReducer = (state = initState, action) => {
  const jwtAuth = state,
    user = action.payload;

  if (action.type === CONNECT_CHAT_SOCKET) {
    
  }
};

export default chatSocketReducer;
