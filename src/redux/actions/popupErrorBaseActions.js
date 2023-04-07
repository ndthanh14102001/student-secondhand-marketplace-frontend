import { CLOSE_POPUP_ERROR_BASE, FRONTEND_ERROR, SHOW_POPUP_ERROR_BASE } from "../reducers/popupErrorBase";
import {
  ERROR_AUTHORIZE,
  NETWORK_ERROR,
  SERVER_CONNECT_ERROR,
  STATUS_ERROR_SERVER,
  STATUS_FORBIDDEN_ERROR
} from "../../utils/callApi";

export const onShowPopupErrorBase = (response) => {
  let errorType = "";
  let titleError = "";
  let message = "";
  const responseStatus = response?.status;
  switch (responseStatus) {
    case NETWORK_ERROR: {
      errorType = NETWORK_ERROR;
      break;
    }
    case SERVER_CONNECT_ERROR: {
      errorType = SERVER_CONNECT_ERROR;
      break;
    }
    case STATUS_ERROR_SERVER: {
      errorType = SERVER_CONNECT_ERROR;
      break;
    }
    case STATUS_FORBIDDEN_ERROR: {
      errorType = STATUS_FORBIDDEN_ERROR;
      break;
    }
    case ERROR_AUTHORIZE: {
      errorType = ERROR_AUTHORIZE;
      break;
    }
    default: {
      const errorMessage = response?.data?.error?.message || response?.data?.error;
      titleError = response?.data?.error?.errors || response?.data?.error?.error || "Error";
      if (errorMessage) {
        if (Array.isArray(errorMessage)) {
          message = errorMessage.join(",");
        } else if (typeof errorMessage === "object") {
          message = Object.values(errorMessage).join(",");
        } else {
          message = errorMessage.toString();
        }
      } else {
        errorType = FRONTEND_ERROR;
      }
      break;
    }
  }
  return {
    type: SHOW_POPUP_ERROR_BASE,
    payload: {
      open: true,
      type: errorType,
      content: message,
      title: titleError
    }
  };
};
export const onShowPopupErrorBaseCustom = ({
  content,
  title,
}) => {
  return {
    type: SHOW_POPUP_ERROR_BASE,
    payload: {
      open: true,
      content: content,
      title: title
    }
  };
};
export const onClosePopupErrorBase = () => {
  return {
    type: CLOSE_POPUP_ERROR_BASE,
  };
};