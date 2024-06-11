import React, { Fragment, useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import LayoutOne from "../../layouts/LayoutOne";
import {
  hideChatBubble,
  showChatBubble,
} from "../../redux/actions/chatBubbleActions";
import ChatFrame from "../../wrappers/chat-frame";
import ChatsNavigator from "../../wrappers/chat-navigator";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

function ChatsFrame(props) {
  const params = useParams();
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const hasPartner = params?.id;
  const [isOpenNavigatorDrawer, setIsOpenNavigatorDrawer] = useState(
    hasPartner ? false : true
  );

  useEffect(() => {
    dispatch(hideChatBubble());
    return () => {
      dispatch(showChatBubble());
    };
  }, []);

  const onCloseNavigatorDrawer = () => {
    setIsOpenNavigatorDrawer(false);
  };

  const onOpenNavigatorDrawer = () => {
    setIsOpenNavigatorDrawer(true);
  };
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
              <Box
                sx={{
                  margin: "8px",
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
              >
                <ChatsNavigator />
              </Box>
              <div style={{ marginLeft: "8px", marginTop: "8px", flex: 1 }}>
                {socket !== null && (
                  <ChatFrame
                    onOpenNavigatorDrawer={onOpenNavigatorDrawer}
                    isOpenNavigatorDrawer={isOpenNavigatorDrawer}
                    onCloseNavigatorDrawer={onCloseNavigatorDrawer}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
}

export default ChatsFrame;
