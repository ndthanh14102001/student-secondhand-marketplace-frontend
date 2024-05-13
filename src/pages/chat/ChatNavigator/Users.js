import React from "react";
import TextsmsTwoToneIcon from "@mui/icons-material/TextsmsTwoTone";
import { Avatar, Box, Chip, Stack } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
const Users = ({ users }) => {
  const history = useHistory();
  const params = useParams();
  const isSelected = (userId) => {
    return `${userId}` === params?.id;
  };
  return (
    <Box>
      <Box
        sx={{
          fontSize: "14px",
          color: "grey",
          textAlign: "center",
          mb: "8px",
        }}
      >
        Người đã nhắn tin
      </Box>
      <Stack
        direction="column"
        spacing={1}
        sx={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <Box>
          {users?.length > 0 ? (
            users?.map((user, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mb: "4px",
                  p: "8px 8px",
                  borderRadius: "16px",
                  transitionDuration: "400ms",
                  backgroundColor: isSelected(user?.id) ? "#ebf5ff" : "",
                  "&:hover": {
                    backgroundColor: isSelected(user?.id) && "whitesmoke",
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  history.push("/chat/" + user?.id);
                }}
              >
                <Avatar
                  alt={user.username}
                  src={`${process.env.REACT_APP_SERVER_ENDPOINT}${user.avatar?.url}`}
                  sx={{ width: 52, height: 52 }}
                />
                <Box
                  sx={{
                    ml: "12px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ fontSize: "16px" }}>{user.username}</Box>
                  {/* <Box sx={{ fontSize: '13px', color: user.newestMessage.read ? 'grey' : 'blue', mt: '2px', fontWeight: user.newestMessage.read ? '' : 'bold'}}>{user.newestMessage}</Box> */}
                </Box>
                {user?.chats?.length > 0 && (
                  <Chip
                    color="error"
                    size="small"
                    label={user?.chats?.length || 0}
                  />
                )}
              </Box>
            ))
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "280px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <TextsmsTwoToneIcon
                sx={{ fontSize: "150px", color: "lightgrey" }}
              />
              <Box sx={{ fontSize: "18px", color: "grey" }}>
                bạn chưa có cuộc trò chuyện nào
              </Box>
            </Box>
          )}
        </Box>
        {/* <Divider variant="middle" /> */}
      </Stack>
    </Box>
  );
};

export default Users;
