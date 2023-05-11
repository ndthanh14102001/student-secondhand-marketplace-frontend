import { Socket } from "socket.io-client";

export const CONNECT_CHAT_SOCKET = "CONNECT_CHAT_SOCKET";

export const connectSocket = (socketAuth) => {
    return dispatch => {
      if (socketAuth) {
        Socket.auth(socketAuth)
      }
      dispatch({ type: DECREASE_QUANTITY, payload: item });
    };
  };