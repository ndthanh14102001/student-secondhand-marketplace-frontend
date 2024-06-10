import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { useDispatch, useSelector } from "react-redux";
import { setNumberOfUnreadMessages } from "../../redux/actions/socketActions";

const useChatBubbleHook = () => {
  const dispatch = useDispatch();
  const [isOpenRequireLoginPopup, setIsOpenRequireLoginPopup] = useState(false);
  const isLogin = useSelector((state) => state.userStorage?.isLogin);
  const numberOfUnreadMessages = useSelector(
    (state) => state.socket?.numberOfUnreadMessages
  );

  const flagUpdateNumberOfUnreadMessages = useSelector(
    (state) => state.chatBubble?.flagUpdateNumberOfUnreadMessages
  );

  useEffect(() => {
    const getNumberOfUnreadMessages = async () => {
      if (isLogin) {
        const response = await chatApi.getNumberOfUnreadMessages();
        if (response.type === RESPONSE_TYPE) {
          dispatch(
            setNumberOfUnreadMessages(response?.numberOfUnreadMessages || 0)
          );
        }
      } else {
        dispatch(setNumberOfUnreadMessages(0));
      }
    };
    getNumberOfUnreadMessages();
  }, [isLogin, flagUpdateNumberOfUnreadMessages]);

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
