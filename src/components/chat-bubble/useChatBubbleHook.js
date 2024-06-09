import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { useSelector } from "react-redux";
import { PRIVATE_MESSAGE } from "../../constants/chat/constants";

const useChatBubbleHook = () => {
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);
  const [isOpenRequireLoginPopup, setIsOpenRequireLoginPopup] = useState(false);
  const isLogin = useSelector((state) => state.userStorage?.isLogin);

  const socket = useSelector((state) => state.socket.socket);

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

  useEffect(() => {
    const addNumberOfUnreadMessagesWhenReceiveMessage = () => {
      setNumberOfUnreadMessages((prev) => prev + 1);
    };
    if (socket) {
      socket?.on(PRIVATE_MESSAGE, addNumberOfUnreadMessagesWhenReceiveMessage);
    }

    return () => {
      socket?.off(PRIVATE_MESSAGE, addNumberOfUnreadMessagesWhenReceiveMessage);
    };
  }, [socket]);

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
