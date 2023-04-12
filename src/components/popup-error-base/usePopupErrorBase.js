import { useState } from "react";
import { ERROR_AUTHORIZE, NETWORK_ERROR, SERVER_CONNECT_ERROR, STATUS_ERROR_SERVER, STATUS_FORBIDDEN_ERROR } from "../../Service/Utils/CallApi";
import { FRONTEND_ERROR } from "./constants";

const usePopupErrorBase = () => {
  const [isError, setIsError] = useState(false);
  //errorType : NETWORK_ERROR || SERVER_CONNECT_ERROR || STATUS_FORBIDDEN_ERROR 
  const [errorType, setErrorType] = useState(FRONTEND_ERROR);
  //responseStatus : NETWORK_ERROR || SERVER_CONNECT_ERROR || STATUS_FORBIDDEN_ERROR 
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState(null);
  const onShowPopupError = (title = null, content = null) => {
    setTitle(title);
    setContent(content);
    setIsError(true);
  };
  const onShowPopupErrorBaseWithMessageServer = (response) => {
    setTitle(null);
    setContent(null);
    const responseStatus = response?.status;
    switch (responseStatus) {
      case NETWORK_ERROR: {
        setErrorType(NETWORK_ERROR);
        break;
      }
      case SERVER_CONNECT_ERROR: {
        setErrorType(SERVER_CONNECT_ERROR);
        break;
      }
      case STATUS_ERROR_SERVER: {
        setErrorType(SERVER_CONNECT_ERROR);
        break;
      }
      case STATUS_FORBIDDEN_ERROR: {
        setErrorType(STATUS_FORBIDDEN_ERROR);
        break;
      }
      case ERROR_AUTHORIZE: {
        setErrorType(ERROR_AUTHORIZE);
        break;
      }
      default: {
        const errorMessage = response?.data?.error?.message || response?.data?.error;
        const title = response?.data?.error?.errors || response?.data?.error?.error || "Error";
        if (errorMessage) {
          if (Array.isArray(errorMessage)) {
            onShowPopupError(title, errorMessage.join(","));
          } else if (typeof errorMessage === "object") {
            onShowPopupError(title, Object.values(errorMessage).join(","));
          } else {
            onShowPopupError(title, errorMessage.toString());
          }
        } else {
          setErrorType(FRONTEND_ERROR);
        }
        break;
      }
    }
    setIsError(true);
  };
  const onShowPopupErrorBase = (responseStatus) => {
    setTitle(null);
    setContent(null);
    switch (responseStatus) {
      case NETWORK_ERROR: {
        setErrorType(NETWORK_ERROR);
        break;
      }
      case SERVER_CONNECT_ERROR: {
        setErrorType(SERVER_CONNECT_ERROR);
        break;
      }
      case STATUS_ERROR_SERVER: {
        setErrorType(SERVER_CONNECT_ERROR);
        break;
      }
      case STATUS_FORBIDDEN_ERROR: {
        setErrorType(STATUS_FORBIDDEN_ERROR);
        break;
      }
      case ERROR_AUTHORIZE: {
        setErrorType(ERROR_AUTHORIZE);
        break;
      }
      default: {
        setErrorType(FRONTEND_ERROR);
        break;
      }
    }
    setIsError(true);
  };
  return {
    isError,
    setIsError,
    errorType,
    setErrorType,
    onShowPopupErrorBase,
    content,
    setContent,
    title,
    setTitle,
    onShowPopupError,
    onShowPopupErrorBaseWithMessageServer
  };
};
export default usePopupErrorBase;
