import { useEffect, useState } from "react";
import chatApi from "../../api/chat";
import { RESPONSE_TYPE } from "../../utils/callApi";

const useChatBubbleHook = () => {
  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0);
  useEffect(() => {
    const getNumberOfUnreadMessages = async () => {
      const response = await chatApi.getNumberOfUnreadMessages();
      if (response.type === RESPONSE_TYPE) {
        setNumberOfUnreadMessages(response?.numberOfUnreadMessages || 0);
      }
    };
    getNumberOfUnreadMessages();
  }, []);
  return { numberOfUnreadMessages };
};

export default useChatBubbleHook;
