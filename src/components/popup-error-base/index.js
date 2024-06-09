import React from "react";
import { useMemo } from "react";
import  * as errorType from "../../utils/callApi";
import * as message from "./constants";
import Popup from "../popup";
import { clearUserLogin } from "../../utils/userLoginStorage";
import { useHistory } from "react-router-dom";

const PopupErrorBase = ({ open, onClose, type = errorType.NETWORK_ERROR, content, title }) => {
  const history = useHistory();
  const errorText = useMemo(() => {
    if (title) {
      return title;
    }
    switch (type) {
      case errorType.NETWORK_ERROR: {
        return (message.MESSAGE_NETWORK_ERROR);
      }
      case errorType.SERVER_CONNECT_ERROR: {
        return (message.MESSAGE_SERVER_ERROR);
      }
      case errorType.STATUS_FORBIDDEN_ERROR: {
        return (message.MESSAGE_FORBIDDEN_RESOURCE);
      }
      case errorType.ERROR_AUTHORIZE:{
        return (message.MESSAGE_AUTHORIZE_ERROR);
      }
      default: {
        return (message.MESSAGE_WEBSITE_ERROR);
      }
    }
  }, [type, title]);
  const contentText = useMemo(() => {
    if (content) {
      return content;
    }
    switch (type) {
      case errorType.NETWORK_ERROR: {
        return (message.MESSAGE_HANDLE_NETWORK_ERROR);
      }
      case errorType.SERVER_CONNECT_ERROR: {
        return (message.MESSAGE_HANDLE_SERVER_ERROR);
      }
      case errorType.STATUS_FORBIDDEN_ERROR: {
        return (message.MESSAGE_HANDLE_FORBIDDEN_RESOURCE);
      }
      case errorType.ERROR_AUTHORIZE:{
        return (message.MESSAGE_HANDLE_AUTHORIZE_ERROR);
      }
      default: {
        return (message.MESSAGE_HANDLE_WEBSITE_ERROR);
      }
    }
  }, [type, content]);
  const handleClose = () =>{
    if(type === errorType.ERROR_AUTHORIZE){
      clearUserLogin();
      history.push(process.env.PUBLIC_URL + "/login-register");
    }else{
      onClose();
    }
  };
  return <Popup
    buttonText={"Đông ý"}
    isOpen={open}
    onClose={handleClose}
    onButtonClick={handleClose}
    type={"error"}
    title={errorText}
    content={contentText}
  />;
};
export default PopupErrorBase;
//import { NETWORK_ERROR, 
// RESPONSE_TYPE,
//   SERVER_CONNECT_ERROR, 
//   STATUS_FORBIDDEN_ERROR } from "../../../Service/Utils/CallApi";

///import { PopupErrorBase, usePopupErrorBase } from "../../../Components";

//const popupErrorBase = usePopupErrorBase();

// useEffect(() => {
//   const getMemberData = async () => {
//     const response = await memberApi.getAll();
//     if (response.type === RESPONSE_TYPE) {
//       setMembers(response.data);
//     } else {
//       popupErrorBase.onShowPopupErrorBase(response.status)
//     }
//   };
//   getMemberData();
// }, []);

//<PopupErrorBase
//open={popupErrorBase.isError}
//onClose={() => popupErrorBase.setIsError(false)}
//type={popupErrorBase.errorType}
// title = {popupErrorBase.title }
// content = {popupErrorBase.content}
///>