import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import callApi, { RESPONSE_TYPE } from "../../../utils/callApi";

import SearchIcon from "@mui/icons-material/Search";

/* ICON IMPORT SECTION */
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import useChatFrame from "./useChatFrame";
import { useParams } from "react-router-dom";

// IMPORTANT: this component still accept props "props.sellerData" as null
// All variable involved to the aforemention props: partner (all involve with validation will not be counted)
function ChatFrame(props) {
  const chatFrame = useChatFrame();
  const params = useParams();
  const { socket } = props;
  const { addToast } = useToasts();
  const chatTextBoxHeight = 60;
  const [partner, setPartner] = useState(props.sellerData);
  const [currentUser, setcurrentUser] = useState(props.userLoginData);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Get both user data with given id pass from parent component
  useEffect(() => {
    const getSellerInfo = async () => {
      const response = await callApi({
        url:
          process.env.REACT_APP_API_ENDPOINT +
          `/users/?filters[id]=${props.sellerData?.id}&filters[id]=${props.userLoginData?.id}`,
        method: "get",
        params: {
          populate: {
            product: {
              populate: {
                images: {
                  populate: "*",
                },
                userId: {
                  populate: {
                    avatar: {
                      populate: "*",
                    },
                    product: {
                      populate: "*",
                    },
                  },
                },
              },
            },
            avatar: {
              populate: "*",
            },
            user_followed: {
              populate: "*",
            },
          },
        },
      });

      if (response.type === RESPONSE_TYPE) {
        if (response.data[0]?.id === props?.sellerData?.id) {
          setPartner(response.data[0]);
          setcurrentUser(response.data[1]);
        } else {
          setPartner(response.data[1]);
          setcurrentUser(response.data[0]);
        }
      }
    };

    if (
      props?.sellerData?.id !== undefined &&
      props?.userLoginData?.id !== undefined
    ) {
      getSellerInfo();
    }
  }, [props?.sellerData?.id]);

  // Get chat from database
  useEffect(() => {
    setIsLoading(true);
    let ChatArray = [];
    const getChats = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_ENDPOINT +
            `/chatFrame?.chats?pagination[page]=1&pagination[pageSize]=100&filters[$and][0][sender][id][$eq]=${currentUser?.id}&filters[$and][1][receiver][id][$eq]=${partner?.id}&populate=*`
        )
        .then((response) => {
          // setChats(prev => [...prev, ...response.data])
          ChatArray = ChatArray.concat(response.data?.data);
          axios
            .get(
              process.env.REACT_APP_API_ENDPOINT +
                `/chatFrame?.chats?pagination[page]=1&pagination[pageSize]=100&filters[$and][0][from][id][$eq]=${partner?.id}&filters[$and][1][to][id][$eq]=${currentUser?.id}&populate=*`
            )
            .then((response) => {
              // setChats(prev => [...prev, ...response.data])
              ChatArray = ChatArray.concat(response.data?.data);
              let sortedChat = ChatArray.sort(function (a, b) {
                return a.attributes.createdAt.localeCompare(
                  b?.attributes?.createdAt
                );
              }).reverse();
              setChats(sortedChat);
              setIsLoading(false);
            })
            .catch((error) => {
              addToast("Lỗi nhận tin nhắn chiều thứ hai", {
                appearance: "error",
                autoDismiss: true,
              });
            });
        })
        .catch((error) => {
          addToast("Lỗi nhận tin nhắn chiều thứ nhất", {
            appearance: "error",
            autoDismiss: true,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    if (
      props?.sellerData?.id !== undefined &&
      props?.userLoginData?.id !== undefined &&
      partner !== null &&
      currentUser !== null
    ) {
      getChats();
    }
  }, [partner, currentUser]);

  // Set chatFrame?.chats to read (Proceed only once)
  useEffect(() => {
    if (partner !== undefined && chatFrame?.chats !== undefined) {
      const updateRecords = async () => {
        const promises = chatFrame?.chats?.map((item) => {
          if (
            item.attributes.sender.data?.id === partner?.id &&
            item.attributes.read === false
          ) {
            return axios.put(
              `${process.env.REACT_APP_API_ENDPOINT}/chatFrame?.chats/${item?.id}`,
              { data: { read: true } }
            );
          }
        });
        await Promise.all(promises);
        props.handleNavigateChats(partner?.id);
      };

      updateRecords();
    }
  }, [partner, chatFrame?.chats]);

  // Send message (socket emit)
  const sendMessage = (e) => {
    const targetMessBox = document.getElementById("MessageEditorBox");
    if (targetMessBox.value?.length < 1) {
      return;
    } else {
    }
    let mess = targetMessBox.value;
    socket.emit("private message", {
      content: mess,
      to: partner?.id,
    });

    const dataPrototype = {
      id: 69,
      attributes: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: mess,
        read: false,
        from: {
          data: {
            id: currentUser?.id,
            attributes: {
              username: currentUser.username,
            },
          },
        },
        to: {
          data: {
            id: partner?.id,
            attributes: {
              username: partner.username,
            },
          },
        },
      },
    };
    setChats((prev) => [dataPrototype, ...prev]);
    document.getElementById("MessageEditorBox").value = "";
  };

  // Send chat when press enter
  const sendMessageWhenPressEnter = (e) => {
    if (e.target.value?.length === 1 && e.key === "Enter") {
      document.getElementById("MessageEditorBox").value = "";
      return;
    } else if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Initiate Socket receive the message
  useEffect(() => {
    // if(partner !== undefined) {
    const listener = (message) => {
      const dataPrototype = {
        id: message?.id,
        attributes: {
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          content: message.content,
          read: false,
          from: {
            data: {
              id: message.sender?.id,
              attributes: {
                // username: partner.username,
              },
            },
          },
          to: {
            data: {
              id: currentUser?.id,
              attributes: {
                // username: currentUser.username,
              },
            },
          },
        },
      };
      props.onUpdateUnreadChat(dataPrototype);
      if (partner?.id === message.sender?.id) {
        setChats((prev) => [dataPrototype, ...prev]);
      }
    };

    socket.on("private message", listener);

    return () => {
      socket.off("private message", listener);
    };
    // }
  }, [partner]);

  // Message Content
  const MessageContent = () => {
    console.log("chatFrame?.chats", chatFrame?.chats);
    return chatFrame?.chats?.map((item, index) => {
      const sender = item.attributes.sender.data;
      const receiver = item.attributes.receiver.data;
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
      // if (item.attributes.sender.data?.id === item.attributes.receiver.data?.id) {
      //   return (
      //     // Box message này hiển thị nếu message là của đối phương
      //     <Box
      //       key={index}
      //       sx={{
      //         display: "flex",
      //         flexDirection: "row",
      //         flexGrow: "1",
      //         alignItems: "end",
      //       }}
      //     >
      //       <Avatar
      //         alt={partner.username}
      //         src={`${process.env.REACT_APP_SERVER_ENDPOINT}${partner.avatar?.url}`}
      //         sx={{ width: 28, height: 28, marginBottom: "8px" }}
      //       />
      //       <Box
      //         sx={{
      //           backgroundColor: "white",
      //           fontSize: "14px",
      //           padding: "10px",
      //           margin: "8px",
      //           maxWidth: "75%",
      //           borderRadius: "9px",
      //           border: "1px solid lightgrey",
      //           boxShadow: "1px 1px 1px lightgrey",
      //         }}
      //       >
      //         <Box sx={{ overflowWrap: "anywhere" }}>
      //           {item.attributes.content}
      //         </Box>
      //         <Box
      //           className="timeDisplay"
      //           sx={{
      //             fontSize: "10px",
      //             color: "grey",
      //             marginTop: "10px",
      //             textAlign: "right",
      //           }}
      //         >
      //           {formatDate(item.attributes.createdAt)}
      //         </Box>
      //       </Box>
      //     </Box>
      //   );
      // } else {
      //   return (
      //     // Khung chat này hiển thị nếu message là của bản thân
      //     <Box
      //       key={index}
      //       sx={{
      //         display: "flex",
      //         flexDirection: "row-reverse",
      //         flexGrow: "1",
      //         alignItems: "end",
      //       }}
      //     >
      //       <Avatar
      //         alt={currentUser.username}
      //         src={`${process.env.REACT_APP_SERVER_ENDPOINT}${currentUser.avatar?.url}`}
      //         sx={{
      //           width: 32,
      //           height: 32,
      //           marginBottom: "8px",
      //           backgroundColor: "rgb(0, 132, 255)",
      //         }}
      //       />
      //       <Box
      //         sx={{
      //           backgroundColor: "#e5efff",
      //           color: "black",
      //           fontSize: "14px",
      //           padding: "10px",
      //           margin: "8px",
      //           maxWidth: "75%",
      //           borderRadius: "9px",
      //           border: "1px solid lightgrey",
      //           boxShadow: "1px 1px 1px lightgrey",
      //         }}
      //       >
      //         <Box sx={{ overflowWrap: "anywhere" }}>
      //           {item.attributes.content}
      //         </Box>
      //         <Box
      //           className="timeDisplay"
      //           sx={{ fontSize: "10px", color: "grey", marginTop: "10px" }}
      //         >
      //           {formatDate(item.attributes.createdAt)}
      //         </Box>
      //       </Box>
      //     </Box>
      //   );
      // }
    });
  };

  //Welcome panel (getting started)
  const WelcomeToChatPanel = () => {
    return (
      <Box
        sx={{
          display: "flex",
          height: "400px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "18px",
            width: "420px",
            border: "1px solid lightgrey",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(140deg, #ad00d9 0%, #BC70A4 60%, #BFD641 100%)",
              height: "90px",
              position: "absolute",
              width: "500px",
              left: "-20px",
              top: "-30px",
              zIndex: "1",
            }}
          />
          <div style={{ height: "60px", zIndex: "2" }}>
            <h3
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "Verdana,sans-serif",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Chào mừng đến với chat
            </h3>
          </div>
          <div
            style={{
              fontSize: "14px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#a749ff",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            >
              <PersonIcon
                sx={{ fontSize: "20px", color: "white", margin: "5px" }}
              />
            </div>
            Chọn người dùng bên thanh bên trái để bắt đầu trò chuyện.
          </div>
          <div
            style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                backgroundColor: "#a749ff",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            >
              <SearchIcon
                sx={{ fontSize: "20px", color: "white", margin: "5px" }}
              />
            </div>
            Bạn cũng có thể tìm người dùng bằng thanh tìm kiếm, chọn trong danh
            sách để bắt đầu cuộc trò chuyện mới.{" "}
          </div>
        </Box>
      </Box>
    );
  };

  const NoChatYetPanel = () => {
    return (
      <Box
        sx={{
          display: "flex",
          height: "200px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "18px",
            width: "420px",
            border: "1px solid lightgrey",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
          >
            <div
              style={{
                backgroundColor: "#a749ff",
                marginRight: "10px",
                borderRadius: "50%",
              }}
            >
              <ChatIcon
                sx={{ fontSize: "18px", color: "white", margin: "5px" }}
              />
            </div>
            Hiện tại chưa có tin nhắn, bạn có thể bắt đầu cuộc trò chuyện đầu
            tiên
          </div>
        </Box>
      </Box>
    );
  };

  //UseEffect update chat
  useEffect(() => {
    MessageContent();
  }, [chatFrame?.chats]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "calc(90vw - 300px)",
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
        {props.sellerData !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Avatar
              alt={props.sellerData?.username}
              src={`${process.env.REACT_APP_SERVER_ENDPOINT}${partner?.avatar?.url}`}
              sx={{ width: 32, height: 32 }}
            />
            <Typography sx={{ ml: "12px" }}>
              {props.sellerData?.username}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Display chatFrame?.chats */}
      <Box
        sx={{
          borderBottom: "1px solid #f0f0f0",
          height: `calc(100% - ${chatTextBoxHeight}px)`,
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
          {params?.id && chatFrame?.chats?.length === 0 ? (
            <NoChatYetPanel />
          ) : (
            <MessageContent />
          )}
          {!params?.id && <WelcomeToChatPanel />}
          {/* {props.isPartnerDeclared ? (
            isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  height: "300px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : chatFrame?.chats?.length === 0 ? (
              <NoChatYetPanel />
            ) : (
              <MessageContent />
            )
          ) : (
            <WelcomeToChatPanel />
          )} */}
        </Box>
      </Box>

      {/* Chat text box */}
      <Box
        sx={{
          backgroundColor: "white",
          minHeight: `${chatTextBoxHeight}px`,
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
          disabled={props.sellerData === undefined ? true : false}
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
          onKeyUp={sendMessageWhenPressEnter}
        />
        <IconButton sx={{ margin: "8px 4px" }} onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </div>
  );
}

export default ChatFrame;

// const UpdateMessageToDatabase = async () => {
//   axios
//   .post(process.env.REACT_APP_API_ENDPOINT + '/chatFrame?.chats?populate=*',
//     {
//       data: {
//         content: mess,
//         from: props.userLoginData?.id,
//         to: props.sellerData?.id,
//         read: false,
//       }
//     })
//   .then((response) => {
//     setChats((prev) => [response.data.data, ...prev])
//     addToast("Gửi tin nhắn thành công", {
//       appearance: "success",
//       autoDismiss: true
//     });

//   })
//   .catch((error) => {
//     addToast(" gửi tin nhắn thất bại, vui lòng kiểm tra lại đường truyền", {
//       appearance: "error",
//       autoDismiss: true
//     });
//   })
// }
// UpdateMessageToDatabase();
