import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { useSelector } from "react-redux";

const useChatBubbleHook = () => {
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);
  const [isOpenRequireLoginPopup, setIsOpenRequireLoginPopup] = useState(false); //Open drawer and display sum of incoming chats
  const isLogin = useSelector((state) => state.userStorage?.isLogin);
  useEffect(() => {
    const getNumberOfUnreadMessages = async () => {
      if (isLogin) {
        const response = await chatApi.getNumberOfUnreadMessages();
        if (response.type === RESPONSE_TYPE) {
          setNumberOfUnreadMessages(response?.numberOfUnreadMessages || 0);
        }
      } else {
        setNumberOfUnreadMessages(0);
      }
    };
    getNumberOfUnreadMessages();
  }, [isLogin]);

  const closeRequireLoginPopup = () => {
    if (isOpenRequireLoginPopup) {
      setIsOpenRequireLoginPopup(false);
    }
  };

  const toggleRequireLoginPopup = () => {
    setIsOpenRequireLoginPopup((isOpen) => !isOpen);
  };
  return {
    numberOfUnreadMessages,
    isOpenRequireLoginPopup,
    setIsOpenRequireLoginPopup,
    closeRequireLoginPopup,
    toggleRequireLoginPopup,
  };
};

export default useChatBubbleHook;
