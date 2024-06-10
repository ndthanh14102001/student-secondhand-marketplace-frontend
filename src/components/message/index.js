import React from "react";
import { getUserLogin } from "../../utils/userLoginStorage";
import MyMessage from "./MyMessage";
import PartnerMessage from "./PartnerMessage";
import { useSelector } from "react-redux";

const Messages = ({  partner }) => {
  const chats = useSelector((state) => state.socket.chats);

  const currentUser = getUserLogin()?.user;
  return (
    chats?.map((item, index) => {
      const receiver = item?.attributes?.receiver?.data;
      receiver.avatar = partner?.avatar;
      const sender = item?.attributes?.sender?.data;
      return currentUser?.id === sender?.id ? (
        <MyMessage
          currentUser={sender}
          createdAt={item?.attributes?.createdAt}
          message={item?.attributes?.message}
        />
      ) : (
        <PartnerMessage
          createdAt={item?.attributes?.createdAt}
          message={item?.attributes?.message}
          receiver={receiver}
        />
      );
    }) || []
  );
};

export default Messages;
