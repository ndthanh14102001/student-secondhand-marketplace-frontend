import { Avatar, Badge, Box, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import axios from "axios";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ForumIcon from "@mui/icons-material/Forum";

function ChatBubbleNavigator(props) {
  const socket = useSelector((state) => state.socket.socket);
  const [userList, setUserList] = useState([]);
  const [CustomUserList, setCustomUserList] = useState();
  const [incomingMessage, setIncomingMessage] = useState([]);
  const [partnerJustSent, setPartnerJustSent] = useState(-1);

  // Get all unread message & Initiate Socket receive the message to login user
  useEffect(() => {
    
    if (socket !== null) {
      
      const listener = (message) => {
        // const dataPrototype = {
        // id : message.id,
        // attributes: {
        //     createdAt: message.createdAt,
        //     updatedAt: message.updatedAt,
        //     content: message.content,
        //     read: false,
        //     from: {
        //         data: {
        //             id: message.from.id,
        //         }
        //     },
        // }
        // }
        
        
        // // props.onUpdateUnreadChat(dataPrototype)
        // setIncomingMessage((prev) => [...prev, dataPrototype])

        // Tạm
        // setPartnerJustSent(message.from.id);
        
        // getChatsRelatedToLoggedInPerson();
        
      };

      socket.on("private message", listener);
      getChatsRelatedToLoggedInPerson();

      //   return () => {
      //     socket.off("private message", listener);
      //   };
    }
  }, [socket]);

  const getChatsRelatedToLoggedInPerson = async () => {
    const response = await callApi({
      url:
        process.env.REACT_APP_API_ENDPOINT +
        `/chats?pagination[page]=1&pagination[pageSize]=100&filters[to][id][$eq]=${props.currentUser.id}&filters[read]=false&populate=*`,
      method: "get",
    });
    if (response.type === RESPONSE_TYPE) {
      
      
      setIncomingMessage(response.data.data);
    }
  };

  // Eliminate user that has been navigated
  useEffect(() => {
    
    
    
    if (userList?.length > 0 && props.selectedChatPartner !== undefined) {
      setUserList((prev) => {
        props.getChatsCount(
          prev
            .filter((object) => object.id !== props.selectedChatPartner)
            .reduce((total, obj) => total + obj.unreadCount, 0)
        );
        return prev.filter((object) => object.id !== props.selectedChatPartner);
      });
    }
  }, [props.selectedChatPartner]);

  useEffect(() => {
    if (incomingMessage?.length !== 0) {
      let tempCustomUserList = [];
      
      
      const uniqueUserIDsList = [
        ...new Set(
          incomingMessage?.map((object) => object.attributes.from.data.id)
        ),
      ];

      tempCustomUserList = uniqueUserIDsList?.map((id) => ({
        id: id,
        unreadCount: incomingMessage.filter(
          (object) => object.attributes.from.data.id === id
        )?.length,
      }));

      if (
        props.selectedChatPartner !== undefined &&
        window.location.pathname.indexOf("/chat") !== -1
      ) {
        props.getChatsCount(
          tempCustomUserList
            .filter((object) => object.id !== props.selectedChatPartner)
            .reduce((total, obj) => total + obj.unreadCount, 0)
        );
      } else {
        props.getChatsCount(
          tempCustomUserList.reduce((total, obj) => total + obj.unreadCount, 0)
        );
      }

      
      

      // Cheeck userlist if user (which is partner) already exist, if already there, plus, unread Count
      tempCustomUserList?.map((item) => {
        if (
          !findIdExistById(userList, item.id) &&
          (item.id !== props.selectedChatPartner ||
            window.location.pathname.indexOf("/chat") === -1)
        ) {
          // FinalUserList.push(QueryUserByID(item.id))
          QueryUserByID(item.id, item.unreadCount);
        } else if (item.id === partnerJustSent) {
          setUserList((prev) => {
            return prev
              ?.map((object) => {
                if (
                  object.id === partnerJustSent &&
                  object.id === props.selectedChatPartner &&
                  window.location.pathname.indexOf("/chat") !== -1
                ) {
                  return null;
                } else if (object.id === partnerJustSent) {
                  // Cập nhật thuộc tính của object có id là
                  return { ...object, unreadCount: object.unreadCount + 1 };
                }
                return object;
              })
              .filter(Boolean);
            // [...prev , prev[prev.findIndex((object) => object.id === item.id)].unreadCount++];
          });
        }
      });
    }
  }, [incomingMessage]);

  const findIdExistById = (array, id) => {
    const index = array.findIndex((object) => object.id === id);
    return index !== -1 ? true : false;
  };

  const QueryUserByID = async (userId, unreadCount) => {
    const response = await axios.get(
      process.env.REACT_APP_API_ENDPOINT +
        "/users?filters[id][$eq]=" +
        userId +
        "&populate=*"
    );
    response.data[0].unreadCount = unreadCount;
    let data = response.data[0];
    setUserList((prev) => [...prev, data]);
  };

  // useEffect(() => {
  //     
  // },[userList])

  return (
    <Box>
      <Stack spacing={2}>
        <Link to={process.env.PUBLIC_URL + "/chat"}>
          <Tooltip title="Đi đến trang chat" placement="right">
            <Box
              sx={{
                width: "56px",
                height: "56px",
                boxShadow: 3,
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                badgeContent={<ForumIcon sx={{ fontSize: "30px" }} />}
                sx={{ p: "5px", mt: "18px", ml: "20px" }}
              >
                <ArrowRightAltIcon sx={{ fontSize: "28px" }} />
              </Badge>
            </Box>
          </Tooltip>
        </Link>
        {userList?.map((item, index) => (
          <Tooltip key={index} title={item.username} placement="right">
            <Badge
              badgeContent={item.unreadCount}
              max={99}
              color="error"
              overlap="circular"
            >
              <Box onClick={() => setUserList((prev) => prev.splice(index, 1))}>
                <Link to={process.env.PUBLIC_URL + "/chat/" + item.id}>
                  <Avatar
                    alt={item.username}
                    src={`${process.env.REACT_APP_SERVER_ENDPOINT}${item.avatar?.url}`}
                    sx={{
                      width: "56px",
                      height: "56px",
                      boxShadow: 3,
                    }}
                  />
                </Link>
              </Box>
            </Badge>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}

export default ChatBubbleNavigator;
