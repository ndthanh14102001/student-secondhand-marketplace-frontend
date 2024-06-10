import React from "react";
import { Badge, IconButton } from "@mui/material";
import SmsIcon from "@mui/icons-material/Sms";
const NumberOfUnreadMessage = ({ numberOfUnreadMessages }) => {
  return (
    <Badge
      badgeContent={numberOfUnreadMessages}
      max={99}
      color="error"
      overlap="circular"
    >
      <IconButton
        className="ChatBubbleCSS"
        sx={{
          p: "12px",
          background: "#a749ff",
          color: "white",
          borderRadius: "50%",
          zIndex: "1",
          boxShadow: 3,
        }}
      >
        <SmsIcon sx={{ fontSize: "36px" }} />
      </IconButton>
    </Badge>
  );
};

export default NumberOfUnreadMessage;
