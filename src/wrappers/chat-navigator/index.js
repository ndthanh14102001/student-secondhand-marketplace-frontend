import React, { useState } from "react";
import { Box, Divider, IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ChatNavigatorSingle from "../../components/chat-navigator/ChatNavigatorSingle";
import useChatNavigatorHook from "../../hooks/chat-navigator/ChatNavigatorHook";

function CustomizedInputBase(props) {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
    >
      {props.isSearching ? (
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={props.cancelSearchingMode}
        >
          <KeyboardReturnIcon />
        </IconButton>
      ) : (
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={props.handleSearchingMode}
        >
          <SearchIcon />
        </IconButton>
      )}
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm người dùng"
        inputProps={{
          "aria-label": "tìm kiếm người dùng",
        }}
        onChange={(event) => {
          props.handleSetSearchKey(event.target.value);
        }}
        onClick={props.handleSearchingMode}
      />
    </Paper>
  );
}

function ChatsNavigator({ onCloseDrawer }) {
  const chatNavigatorHook = useChatNavigatorHook();
  const [isSearching, setIsSearching] = useState(false);

  return (
    <Box
      sx={{
        width: "350px",
        padding: "12px",
        backgroundColor: "white",
        border: "1px solid #f0f0f0",
        borderRadius: "12px",
        height: "550px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <IconButton
          sx={{
            display: {
              xs: "block",
              md: "none",
            },
          }}
          onClick={onCloseDrawer}
        >
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
        <CustomizedInputBase
          handleSetSearchKey={() => {}}
          handleSearchingMode={() => {
            setIsSearching(true);
          }}
          cancelSearchingMode={() => {
            setIsSearching(false);
          }}
          isSearching={isSearching}
        />
      </Box>
      <Divider variant="middle" sx={{ m: "14px 0" }} />
      <ChatNavigatorSingle
        users={chatNavigatorHook.partners}
        onClickUser={(userId) => {
          chatNavigatorHook.onClickUser(userId);
          if (typeof onCloseDrawer === "function") {
            onCloseDrawer();
          }
        }}
      />
    </Box>
  );
}

export default ChatsNavigator;
