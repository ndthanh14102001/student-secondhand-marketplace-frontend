import { useEffect, useState } from "react";
import chatApi from "../../../api/chat";
import { useParams } from "react-router-dom";
import { RESPONSE_TYPE } from "../../../utils/callApi";
const useChatFrame = () => {
  const params = useParams();
  const [chats, setChats] = useState([]);
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
  return { chats, addChat };
};

export default useChatFrame;
