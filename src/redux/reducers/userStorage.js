
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const userStorage = {
  isLogin: false
};

const userStorageReducer = (state = userStorage, action) => {
  switch (action.type) {
    case LOGIN: {
      console.log("login")
      return {
        isLogin: true
      };
    }
    case LOGOUT: {
      return {
        isLogin: false
      };
    }
    default: {
      return state;
    }
  }
};
export default userStorageReducer;
