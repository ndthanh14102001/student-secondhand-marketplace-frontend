import { NETWORK_ERROR } from "../../utils/callApi";

export const SHOW_POPUP_ERROR_BASE = "show popup error base";
export const CLOSE_POPUP_ERROR_BASE = "close popup error base";

export const MESSAGE_NETWORK_ERROR = "Network Error!";
export const MESSAGE_SERVER_ERROR = "Internal Server Error!";
export const MESSAGE_AUTHORIZE_ERROR = "Authentication Error";
export const MESSAGE_FORBIDDEN_RESOURCE = "Forbidden Resource!";
export const MESSAGE_WEBSITE_ERROR = "Website has error";

export const MESSAGE_HANDLE_NETWORK_ERROR = "Please check your Network!";
export const MESSAGE_HANDLE_SERVER_ERROR = "Server is busy, please try again later!";
export const MESSAGE_HANDLE_FORBIDDEN_RESOURCE = "You don’t have permission to access!";
export const MESSAGE_HANDLE_AUTHORIZE_ERROR = "Login session has expired !";
export const MESSAGE_HANDLE_WEBSITE_ERROR = "Website has error, Please click help to report a bug!";

export const FRONTEND_ERROR = "frontend error";

export const popupErrorBaseInitState = {
  open: false,
  type: NETWORK_ERROR,
  content: "",
  title: ""
};

export const popupErrorBaseReducer = (state = popupErrorBaseInitState, action) => {
  switch (action.type) {
    case SHOW_POPUP_ERROR_BASE: {
      return {
        ...action.payload
      };
    }
    case CLOSE_POPUP_ERROR_BASE: {
      return popupErrorBaseInitState;
    }
    default: {
      return state;
    }
  }
};