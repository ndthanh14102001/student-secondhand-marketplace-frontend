import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  addSeenCountByPartnerId,
  newMessage,
  setSocket,
} from "../../redux/actions/socketActions";
import { PRIVATE_MESSAGE } from "../../constants/chat/constants";
import { getPartnerIdByLocation } from "../../utils/chat";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { updateNumberOfUnreadMessages } from "../../redux/actions/chatBubbleActions";

const ConnectSocket = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const isLogin = useSelector((state) => state?.userStorage?.isLogin);

  useEffect(() => {
    if (isLogin) {
      connectSocket();
    }
  }, [isLogin]);

  useEffect(() => {
    const handleReceiveNewChat = async (chat) => {
      const partnerId = getPartnerIdByLocation();
      if (chat?.from?.id?.toString() !== partnerId?.toString()) {
        dispatch(addSeenCountByPartnerId({ partnerId: chat?.from?.id }));
      } else {
        await markMessagesAsSeen();
      }
    };
    const markMessagesAsSeen = async () => {
      const partnerId = Number(getPartnerIdByLocation());
      const response = await chatApi.readChatsBySenderId({
        senderId: partnerId,
      });
      if (response.type === RESPONSE_TYPE) {
        dispatch(updateNumberOfUnreadMessages());
      }
    };

    const chatListener = (message) => {
      dispatch(newMessage(message));
      handleReceiveNewChat(message);
    };
    if (socket) {
      socket?.on(PRIVATE_MESSAGE, chatListener);
    }

    return () => {
      socket?.off(PRIVATE_MESSAGE, chatListener);
    };
  }, [socket]);

  function connectSocket() {
    let tokenArr = getUserLogin()?.token?.split(" ");
    if (tokenArr?.length >= 2) {
      const SERVER_URL = process.env.REACT_APP_SERVER_ENDPOINT;
      const setupSocket = io(SERVER_URL, {
        autoConnect: false,
      });

      setupSocket.auth = { token: tokenArr[1] };

      setupSocket.connect();

      setupSocket.on("connect", () => {
        dispatch(setSocket(setupSocket));
      });
    }
  }

  return <></>;
};

export default ConnectSocket;
