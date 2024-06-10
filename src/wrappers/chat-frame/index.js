import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Messages from "../../components/message";
import useChatFrameHook from "../../hooks/chat-frame/ChatFrameHook";
import { CHAT_TEXT_BOX_HEIGHT } from "../../constants/chat/constants";
import WelcomeToChatPanel from "../../components/chat-frame/WelcomeToChatPanel";
import NoChatYetPanel from "../../components/chat-frame/NoChatYetPanel";
import { getImageUrl } from "../../utils/image";
import ChatsNavigator from "../chat-navigator";

function ChatFrame({
  onOpenNavigatorDrawer,
  onCloseNavigatorDrawer,
  isOpenNavigatorDrawer,
}) {
  const chatFrameHook = useChatFrameHook();
  const params = useParams();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "600px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #f0f0f0",
      }}
    >
      {/* chat Person info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "12px",
          backgroundColor: "white",
          overflow: "hidden",
          minHeight: "54px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Stack flex={1} direction={"row"} alignItems={"center"} spacing={2}>
            {chatFrameHook.partner && (
              <>
                <Avatar
                  alt={chatFrameHook.partner?.fullName}
                  src={getImageUrl(chatFrameHook.partner?.avatar)}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography>{chatFrameHook.partner?.fullName}</Typography>
              </>
            )}
          </Stack>

          <div className="same-style mobile-off-canvas d-block d-lg-none">
            <IconButton onClick={onOpenNavigatorDrawer}>
              <i className="pe-7s-menu" />
            </IconButton>
          </div>
          <Drawer
            anchor={"right"}
            open={isOpenNavigatorDrawer}
            // onClose={toggleDrawer(anchor, false)}
          >
            {<ChatsNavigator onCloseDrawer={onCloseNavigatorDrawer}/>}
          </Drawer>
        </Box>
      </Box>

      {/* Display chatFrameHook?.chats */}
      <Box
        sx={{
          borderBottom: "1px solid #f0f0f0",
          height: `calc(100% - ${CHAT_TEXT_BOX_HEIGHT}px)`,
          overflowY: "auto",
          padding: "0 12px",
          display: "flex",
          flexDirection: "column-reverse",
          background: "#e5e7e8",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
          id="DisplayMessages"
        >
          {params?.id && chatFrameHook?.chats?.length === 0 ? (
            <NoChatYetPanel />
          ) : (
            <Messages
              messages={chatFrameHook.chats}
              partner={chatFrameHook?.partner}
            />
          )}
          {!chatFrameHook.partner && <WelcomeToChatPanel />}
        </Box>
      </Box>

      {/* Chat text box */}
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: `${CHAT_TEXT_BOX_HEIGHT}px`,
          padding: "8px",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <InputBase
          id="MessageEditorBox"
          placeholder="Aa...."
          multiline
          maxRows={6}
          variant="filled"
          disabled={chatFrameHook.partner ? false : true}
          sx={{
            padding: "4px 16px",
            borderRadius: "24px",
            width: "100%",
            height: "auto",
            justifyContent: "center",
            backgroundColor: "#E4E6EB",
            overflow: "hidden",
          }}
          inputProps={{
            style: { border: "none" },
          }}
          onKeyUp={chatFrameHook?.sendMessageWhenPressEnter}
        />
        <IconButton
          sx={{ margin: "8px 4px" }}
          onClick={chatFrameHook?.sendMessageInSocket}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </div>
  );
}

export default ChatFrame;
