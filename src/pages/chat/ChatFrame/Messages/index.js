import { Avatar, Box } from "@mui/material";
import React from "react";

const Messages = ({ messages }) => {
  // Format time data
  const formatDate = (date) => {
    const inputDate = new Date(date);
    const minutes =
      inputDate.getMinutes() < 10
        ? `0${inputDate.getMinutes()}`
        : inputDate.getMinutes();

    return (
      `${inputDate.getDate().toString().padStart(2, "0")}-${(
        inputDate.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          "0"
        )}-${inputDate.getFullYear()} ${inputDate.getHours()}:` + minutes
    );
  };
  return messages?.map((item, index) => {
    // const sender = item.attributes.sender.data;
    const receiver = item?.attributes?.receiver?.data;
    return (
      // Box message này hiển thị nếu message là của đối phương
      <Box
        key={index}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexGrow: "1",
          alignItems: "end",
        }}
      >
        <Avatar
          alt={receiver?.attributes?.username}
          src={`${process.env.REACT_APP_SERVER_ENDPOINT}${receiver?.avatar?.url}`}
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
          <Box sx={{ overflowWrap: "anywhere" }}>
            {item?.attributes?.message}
          </Box>
          <Box
            className="timeDisplay"
            sx={{
              fontSize: "10px",
              color: "grey",
              marginTop: "10px",
              textAlign: "right",
            }}
          >
            {formatDate(item?.attributes?.createdAt)}
          </Box>
        </Box>
      </Box>
    );
  });
};

export default Messages;
