import React from "react";
import { getUserLogin } from "../../../../utils/userLoginStorage";
import MyMessage from "./MyMessage";
import PartnerMessage from "./PartnerMessage";

const Messages = ({ messages, partner }) => {
  const currentUser = getUserLogin()?.user;
  return messages?.map((item, index) => {
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
  });
};

export default Messages;
