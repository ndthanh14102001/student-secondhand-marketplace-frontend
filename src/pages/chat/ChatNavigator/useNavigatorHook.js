import React, { useEffect, useState } from "react";
import chatApi from "../../../api/chat";
import { RESPONSE_TYPE } from "../../../utils/callApi";
import { PRIVATE_MESSAGE } from "../constants";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
const useNavigatorHook = () => {
  const history = useHistory();
  const params = useParams();
  const [partners, setPartners] = useState([]);

  const socket = useSelector((state) => state.socket.socket);
  useEffect(() => {
    (async function getPartnerts() {
      const response = await chatApi.getPartners();
      if (response.type === RESPONSE_TYPE) {
        setPartners(response?.partners || []);
      }
    })();
  }, []);

  useEffect(() => {
    const handleReceiveNewChat = async (chat) => {
      if (chat?.from?.id.toString() !== params?.id.toString()) {
        setPartners((oldPartners) => {
          for (let index = 0; index < oldPartners?.length; index++) {
            const oldPartner = oldPartners[index];
            if (oldPartner?.user_id === chat?.from?.id) {
              oldPartner.seencount = Number(oldPartner.seencount) + 1;
              movePartnerToTop(oldPartners, index);
              break;
            }
          }
          return oldPartners;
        });
      } else {
        await markMessagesAsSeen();
      }
    };
    const markMessagesAsSeen = async () => {
      await chatApi.readChatsBySenderId({
        senderId: params?.id,
      });
    };

    if (socket) {
      socket.on(PRIVATE_MESSAGE, handleReceiveNewChat);
    }
    return () => {
      if (socket) {
        socket?.off(PRIVATE_MESSAGE);
      }
    };
  }, [socket, params]);

  const movePartnerToTop = (partners, index) => {
    partners.unshift(partners.splice(index, 1)[0]);
  };

  const onClickUser = (userId) => {
    setPartners((oldPartners) => {
      for (let index = 0; index < oldPartners?.length; index++) {
        const oldPartner = oldPartners[index];
        if (oldPartner?.user_id === userId) {
          oldPartner.seencount = 0;
          break;
        }
      }
      return oldPartners;
    });
    history.push("/chat/" + userId);
  };
  return { partners, onClickUser };
};

export default useNavigatorHook;
