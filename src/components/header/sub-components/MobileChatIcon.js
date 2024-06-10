import React from "react";
import { Link } from "react-router-dom";
import useChatBubbleHook from "../../chat-bubble/useChatBubbleHook";
const MobileChatIcon = () => {
  const chatBubbleHook = useChatBubbleHook();

  return (
    <div className="same-style header-wishlist d-block d-lg-none">
      <Link to={process.env.PUBLIC_URL + "/chat"}>
        <i className="pe-7s-chat" />
        {chatBubbleHook.numberOfUnreadMessages > 0 && (
          <span className="count-style">
            {chatBubbleHook.numberOfUnreadMessages}
          </span>
        )}
      </Link>
    </div>
  );
};

export default MobileChatIcon;
