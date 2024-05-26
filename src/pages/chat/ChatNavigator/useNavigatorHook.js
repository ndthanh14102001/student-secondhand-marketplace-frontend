import React, { useEffect, useState } from "react";
import chatApi from "../../../api/chat";
import { RESPONSE_TYPE } from "../../../utils/callApi";
import { PRIVATE_MESSAGE } from "../constants";
import { useSelector } from "react-redux";

const useNavigatorHook = () => {
  const [partners, setPartners] = useState([]);

  const socket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    console.log("render");
    (async function getPartnerts() {
      const response = await chatApi.getPartners();
      if (response.type === RESPONSE_TYPE) {
        setPartners(response?.partners || []);
      }
    })();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(PRIVATE_MESSAGE, handleReceiveNewChat);
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (socket) {
        socket?.off(PRIVATE_MESSAGE);
      }
    };
  }, []);
  const handleReceiveNewChat = (chat) => {
    setPartners((oldPartners) => {
      for (let index = 0; index < oldPartners?.length; index++) {
        const oldPartner = oldPartners[index];
        if (oldPartner?.id === chat?.from?.id) {
          oldPartner?.chats?.push(chat);
          movePartnerToTop(oldPartners, index);
          break;
        }
      }
      return oldPartners;
    });
  };

  const movePartnerToTop = (partners, index) => {
    partners.unshift(partners.splice(index, 1)[0]);
  };
  return { partners, handleReceiveNewChat };
};

export default useNavigatorHook;
