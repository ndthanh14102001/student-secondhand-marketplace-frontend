import { Box } from "@mui/material";
import React from "react";
import { formatDate } from "../../utils/chat";

const MyMessage = ({ currentUser, message, createdAt }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        flexGrow: "1",
        alignItems: "end",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#e5efff",
          color: "black",
          fontSize: "14px",
          padding: "10px",
          margin: "8px",
          maxWidth: "75%",
          borderRadius: "9px",
          border: "1px solid lightgrey",
          boxShadow: "1px 1px 1px lightgrey",
        }}
      >
        <Box sx={{ overflowWrap: "anywhere" }}>{message}</Box>
        {/* <Box sx={{ overflowWrap: "anywhere" }}>{item.attributes.content}</Box> */}
        <Box
          className="timeDisplay"
          sx={{ fontSize: "10px", color: "grey", marginTop: "10px" }}
        >
          {/* {formatDate(item.attributes.createdAt)} */}
          {formatDate(createdAt)}
        </Box>
      </Box>
    </Box>
  );
};

export default MyMessage;
