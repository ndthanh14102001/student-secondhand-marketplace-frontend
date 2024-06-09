import React, { Fragment, useEffect } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import {
  hideChatBubble,
  showChatBubble,
} from "../../redux/actions/chatBubbleActions";
import ChatFrame from "../../wrappers/chat-frame";
import ChatsNavigator from "../../wrappers/chat-navigator";

function ChatsFrame(props) {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    dispatch(hideChatBubble());
    return () => {
      dispatch(showChatBubble());
    };
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>Student Market | Trò chuyện</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutOne headerTop="visible">
        <div className="product-area pt-60 pb-60" style={{ padding: 0 }}>
          <div className="container" style={{ margin: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <div style={{ margin: "8px" }}>
                <ChatsNavigator />
              </div>
              <div style={{ marginLeft: "8px", marginTop: "8px" }}>
                {socket !== null && <ChatFrame />}
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
}

export default ChatsFrame;
