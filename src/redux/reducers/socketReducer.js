export const SET_SOCKET = "SET_SOCKET";

export const filterInitState = {
  socket: null,
};

const socketReducer = (state = filterInitState, action) => {
  switch (action.type) {
    case SET_SOCKET: {
      return {
        socket: action.payload
      };
    }
    
    default: {
      return state;
    }
  }
};
export default socketReducer;
