import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { useParams } from "react-router-dom";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useDispatch, useSelector } from "react-redux";

import { v4 } from "uuid";
import { PRIVATE_MESSAGE } from "../../constants/chat/constants";
import { formatMessage } from "../../utils/chat";
import { addChat, setChats } from "../../redux/actions/socketActions";
import { updateNumberOfUnreadMessages } from "../../redux/actions/chatBubbleActions";

const ChatFrameHook = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const loggedInUser = getUserLogin()?.user;
  const socket = useSelector((state) => state.socket.socket);
  const chats = useSelector((state) => state.socket.chats);
  const [partner, setPartner] = useState();

  useEffect(() => {
    const getChats = async () => {
      const response = await chatApi.getChats({ partnerId: params?.id });
      if (response.type === RESPONSE_TYPE) {
        dispatch(setChats(response?.data?.data || []));
      }
    };
    if (params?.id) {
      getChats();
    } else {
      dispatch(setChats([]));
    }
  }, [params?.id]);

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      await chatApi.readChatsBySenderId({
        senderId: params?.id,
      });
      dispatch(updateNumberOfUnreadMessages());
    };
    if (params?.id) {
      markMessagesAsSeen();
    }
  }, [params?.id]);

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
    dispatch(addChat(formattedMessage));
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
    partner,
    chats,
    sendMessageWhenPressEnter,
    sendMessageInSocket,
  };
};

export default ChatFrameHook;
