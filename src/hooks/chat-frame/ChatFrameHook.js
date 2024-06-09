import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { useParams } from "react-router-dom";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useSelector } from "react-redux";

import { v4 } from "uuid";
import { PRIVATE_MESSAGE } from "../../constants/chat/constants";
import { formatMessage } from "../../utils/chat";

const ChatFrameHook = () => {
  const params = useParams();
  const loggedInUser = getUserLogin()?.user;
  const socket = useSelector((state) => state.socket.socket);

  const [chats, setChats] = useState([]);
  const [partner, setPartner] = useState();
  useEffect(() => {
    const getChats = async () => {
      const response = await chatApi.getChats({ partnerId: params?.id });
      if (response.type === RESPONSE_TYPE) {
        setChats(response?.data?.data || []);
      }
    };
    if (params?.id) {
      getChats();
    }
  }, [params?.id]);

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      await chatApi.readChatsBySenderId({
        senderId: params?.id,
      });
    };
    if (params?.id) {
      markMessagesAsSeen();
    }
  }, [params?.id]);

  const addChat = (chat) => {
    setChats((prev) => [chat, ...prev]);
  };

  useEffect(() => {
    const getPartnerInfo = async () => {
      const response = await chatApi.getPartnerByUserId({ userId: params?.id });

      if (response.type === RESPONSE_TYPE) {
        setPartner(response.partner);
      }
    };

    if (loggedInUser && params?.id) {
      getPartnerInfo();
    }
  }, [params?.id]);

  useEffect(() => {
    const listener = (message) => {
      const formattedMessage = formatMessage({
        id: message?.id,

        content: message?.content,
        createdAt: new Date(),
        updatedAt: new Date(),

        receiverId: loggedInUser?.id,
        receiverAttribute: {
          username: loggedInUser?.username,
        },
        senderId: message?.from?.id,
        senderAttribute: {
          username: partner?.username,
        },
      });
      if (partner?.id === message?.from?.id) {
        addChat(formattedMessage);
      }
    };

    socket?.on(PRIVATE_MESSAGE, listener);

    return () => {
      socket?.off(PRIVATE_MESSAGE, listener);
    };
  }, [partner]);

  const sendMessageInSocket = (e) => {
    if (isEmtyMessageToSend()) {
      return;
    }
    const targetMessBox = document.getElementById("MessageEditorBox");
    let message = targetMessBox?.value;

    socket.emit(PRIVATE_MESSAGE, {
      content: message,
      to: partner?.id,
    });
    const formattedMessage = formatMessage({
      content: message,
      id: v4(),

      createdAt: Date.now(),
      updatedAt: Date.now(),
      receiverId: partner?.id,
      receiverAttribute: {
        username: partner.username,
      },
      senderId: loggedInUser?.id,
      senderAttribute: {
        username: loggedInUser.username,
      },
    });
    document.getElementById("MessageEditorBox").value = "";
    addChat(formattedMessage);
  };
  const isEmtyMessageToSend = () => {
    const targetMessBox = document.getElementById("MessageEditorBox");
    return targetMessBox.value?.length < 1;
  };
  const sendMessageWhenPressEnter = (e) => {
    if (e.target.value?.length === 1 && e.key === "Enter") {
      document.getElementById("MessageEditorBox").value = "";
      return;
    } else if (e.key === "Enter") {
      sendMessageInSocket();
    }
  };

  return {
    chats,
    addChat,
    partner,
    setPartner,
    sendMessageWhenPressEnter,
    sendMessageInSocket,
  };
};

export default ChatFrameHook;
