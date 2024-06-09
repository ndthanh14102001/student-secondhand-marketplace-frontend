import { Avatar, Box } from "@mui/material";
import React from "react";
import { formatDate } from "../../utils/chat"; 
import { getImageUrl } from "../../utils/image";

const PartnerMessage = ({ receiver, message, createdAt }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexGrow: "1",
        alignItems: "end",
      }}
    >
      <Avatar
        alt={"avatar"}
        src={getImageUrl(receiver?.avatar)}
        sx={{ width: 28, height: 28, marginBottom: "8px" }}
      />
      <Box
        sx={{
          backgroundColor: "white",
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
        {/* <Box sx={{ overflowWrap: "anywhere" }}>{item?.attributes?.message}</Box> */}
        <Box
          className="timeDisplay"
          sx={{
            fontSize: "10px",
            color: "grey",
            marginTop: "10px",
            textAlign: "right",
          }}
        >
          {/* {formatDate(item?.attributes?.createdAt)} */}
          {formatDate(createdAt)}
        </Box>
      </Box>
    </Box>
  );
};

export default PartnerMessage;
