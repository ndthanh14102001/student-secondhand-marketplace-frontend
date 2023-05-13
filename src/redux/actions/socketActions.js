import * as constants from "../reducers/socketReducer"

export const setSocket = (socket) => {
  return {
    type: constants.SET_SOCKET,
    payload: socket
  }
}