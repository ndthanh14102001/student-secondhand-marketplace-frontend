import { useHistory } from "react-router-dom";
import { Box, ClickAwayListener } from "@mui/material";

import ChatBubbleRequireLogin from "./ChatBubbleRequireLogin";
import { getUserLogin } from "../../utils/userLoginStorage";
import useChatBubbleHook from "./useChatBubbleHook";
import NumberOfUnreadMessage from "./NumberOfUnreadMessage";

import "./chat-bubble.css";
function ChatBubble(props) {
  const chatBubbleHook = useChatBubbleHook();

  const navigate = useHistory();

  const navigateChatPage = () => {
    const userLoginData = getUserLogin()?.user;
    if (userLoginData) {
      navigate.push(process.env.PUBLIC_URL + "/chat");
    } else {
      chatBubbleHook.toggleRequireLoginPopup();
    }
  };
  return (
    <ClickAwayListener
      onClickAway={() => {
        chatBubbleHook.closeRequireLoginPopup();
      }}
    >
      <Box
        sx={{
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "150px",
          height: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <NumberOfUnreadMessage
          numberOfUnreadMessages={chatBubbleHook.numberOfUnreadMessages}
        />

        {/* This Box will receive all click event to execute bubble chat drawer */}
        <Box
          onClick={navigateChatPage}
          sx={{
            width: "70px",
            height: "70px",
            position: "absolute",
            borderRadius: "50%",
            zIndex: "2",
            transitionDuration: "500ms",
            "&:hover": {
              background: "rgba(167, 73, 255, 0.35)",
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              cursor: "pointer",
            },
            "&:active": {
              background: "rgba(167, 73, 255, 0.3)",
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              cursor: "pointer",
              transform: "scale(0.9)",
              transitionDuration: "100ms",
            },
          }}
        ></Box>

        {/* This tag contain bubble drawer's content */}
        {chatBubbleHook.isOpenRequireLoginPopup && <ChatBubbleRequireLogin />}
      </Box>
    </ClickAwayListener>
  );
}

export default ChatBubble;
