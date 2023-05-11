import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  TextField,
  Typography,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { useToasts } from "react-toast-notifications";
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
// import { io } from "socket.io-client";

function ChatFrame(props) {

  const { socket } = props;
  const { addToast } = useToasts();
  const chatTextBoxHeight = 60
  const [partner, setPartner] = useState(null)
  const [currentUser, setcurrentUser] = useState(null)
  const [chats, setChats] = useState([])
  const [avatar, setAvatar] = useState({ admin: '', partner: '' })

  // Format time data
  const formatDate = (date) => {
    const inputDate = new Date(date)
    const minutes =
      inputDate.getMinutes() < 10
        ? `0${inputDate.getMinutes()}`
        : inputDate.getMinutes()

    return (
      `${inputDate.getDate().toString().padStart(2, '0')}-${(
        inputDate.getMonth() + 1
      )
        .toString()
        .padStart(
          2,
          '0',
        )}-${inputDate.getFullYear()} ${inputDate.getHours()}:` + minutes
    )
  }

  // Get both user data with given id pass from parent component
  useEffect(()=> {
    const getSellerInfo = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + `/users/?filters[id]=${props.sellerData.id}&filters[id]=${props.userLoginData.id}`,
        method: "get",
        params: {
          populate: {
            product: {
              populate: {
                images: {
                  populate: "*"
                },
                userId: {
                  populate: {
                    avatar: {
                      populate: "*"
                    },
                    product: {
                      populate: "*"
                    }
                  }
                }
              },
            },
            avatar: {
              populate: "*"
            },
            user_followed:{
              populate: "*"
            }
          }
        }
      })

      if (response.type === RESPONSE_TYPE) {
        if(response.data[0].id === props.sellerData.id){
          setPartner(response.data[0]);
          setcurrentUser(response.data[1]);
        }
        else {
          setPartner(response.data[1]);
          setcurrentUser(response.data[0]);
        }
        
      }
    }

    if(props.sellerData.id !== undefined && props.userLoginData.id !== undefined){
      getSellerInfo();
    }
  },[props.sellerData.id, props.userLoginData.id])

  // Get chat from database
  useEffect(() => {
    let ChatArray = [];
    const getChats = async () => {
      await axios
        .get(process.env.REACT_APP_API_ENDPOINT + `/chats?filters[$and][0][from][id][$eq]=${currentUser.id}&filters[$and][1][to][id][$eq]=${partner.id}&populate=*`)
        .then((response) => {
          // setChats(prev => [...prev, ...response.data])
          ChatArray = ChatArray.concat(response.data.data)
          axios
            .get(process.env.REACT_APP_API_ENDPOINT + `/chats?filters[$and][0][from][id][$eq]=${partner.id}&filters[$and][1][to][id][$eq]=${currentUser.id}&populate=*`)
            .then((response) => {
              // setChats(prev => [...prev, ...response.data])
              ChatArray = ChatArray.concat(response.data.data)
              let sortedChat = ChatArray.sort(function (a, b) {
                return a.attributes.createdAt.localeCompare(b.attributes.createdAt);
              }).reverse()
              setChats(sortedChat)
              console.log(ChatArray)
            })
            .catch((error) => {
              addToast("Lỗi nhận tin nhắn chiều thứ hai", {
                appearance: "error",
                autoDismiss: true
            });
          })
        })
        .catch((error) => {
          addToast("Lỗi nhận tin nhắn chiều thứ nhất", {
            appearance: "error",
            autoDismiss: true
        });
      })
    }
    if(props.sellerData.id !== undefined && props.userLoginData.id !== undefined && partner !== null && currentUser !== null){
      getChats();
    }
  },[partner, currentUser])

  // Send message
  const sendMessage = () => {
    let mess = document.getElementById('MessageEditorBox').value
    socket.emit("private message", {
      content: mess,
      to: partner.id,
    });

    const dataPrototype = {
      id : 69,
      attributes: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        content: mess,
        read: false,
        from: {
          data: {
              id: props.userLoginData.id,
              attributes: {
                  username: props.userLoginData.username,
              }
          }
        },
        to: {
          data: {
              id: props.sellerData.id,
              attributes: {
                  username: props.sellerData.username,
              }
          }
        }
      }
    }
    setChats((prev) => [dataPrototype, ...prev])
    // const UpdateMessageToDatabase = async () => { 
    //   axios
    //   .post(process.env.REACT_APP_API_ENDPOINT + '/chats?populate=*', 
    //     {
    //       data: {
    //         content: mess,
    //         from: props.userLoginData.id,
    //         to: props.sellerData.id,
    //         read: false,
    //       }
    //     })
    //   .then((response) => {
    //     console.log(response)
    //     setChats((prev) => [response.data.data, ...prev])
    //     console.log(chats.concat(response.data.data))
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
  }

  useEffect(()=>{
    socket.on("private message", (message) => {
      const dataPrototype = {
        id : message.id,
        attributes: {
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          content: message.content,
          read: false,
          from: {
            data: {
                id: props.sellerData.id,
                attributes: {
                    username: props.sellerData.username,
                }
            }
          },
          to: {
            data: {
                id: props.userLoginData.id,
                attributes: {
                    username: props.userLoginData.username,
                }
            }
          }
        }
      }
      console.log(dataPrototype)
      setChats((prev) => [dataPrototype, ...prev])
   })
  },[socket])

  // Message Content
  const MessageContent = () => {
      return chats.map((item, index) => {
      console.log('Item thứ ' + index + ' :' + item.attributes.from.data.id)
      if (item.attributes.from.data.id === partner.id) {
        return (

        // Box message này hiển thị nếu message là của đối phương
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          <Avatar
            alt={partner.username}
            src={`${process.env.REACT_APP_SERVER_ENDPOINT}${partner.avatar?.url}`}
            sx={{ width: 28, height: 28, marginBottom: '8px' }}
          />
          <Box
            sx={{
              backgroundColor: 'white',
              fontSize: '14px',
              padding: '10px',
              margin: '8px',
              maxWidth: '75%',
              borderRadius: '9px',
              border: '1px solid lightgrey',
              boxShadow: '1px 1px 1px lightgrey',
            }}
          >
            <Box>{item.attributes.content}</Box>
            <Box
              className="timeDisplay"
              sx={{ fontSize: '10px', color: 'grey', marginTop: '10px', textAlign: 'right' }}
            >
              {formatDate(item.attributes.createdAt)}
            </Box>
          </Box>
        </Box>
      )
    } else {
        return (
        // Khung chat này hiển thị nếu message là của bản thân
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          <Avatar
              alt={currentUser.username}
              src={`${process.env.REACT_APP_SERVER_ENDPOINT}${currentUser.avatar?.url}`}
              sx={{
                width: 32,
                height: 32,
                marginBottom: '8px',
                backgroundColor: 'rgb(0, 132, 255)',
              }}
            />
          <Box
            sx={{
              backgroundColor: '#e5efff',
              color: 'black',
              fontSize: '14px',
              padding: '10px',
              margin: '8px',
              maxWidth: '75%',
              borderRadius: '9px',
              border: '1px solid lightgrey',
              boxShadow: '1px 1px 1px lightgrey',
            }}
          >
            <Box>{item.attributes.content}</Box>
            <Box
              className="timeDisplay"
              sx={{ fontSize: '10px', color: 'grey', marginTop: '10px' }}
            >
              {formatDate(item.attributes.createdAt)}
            </Box>
          </Box>
        </Box>
      )}}
    )
  }

  //UseEffect update chat
  useEffect(() => {
    MessageContent();
  }, [chats])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '600px',
        width: '55vw',
        height: '600px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #f0f0f0',
      }}
    >
      {/* chat Person info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '12px',
          backgroundColor: 'white',
          overflow: 'hidden',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Avatar
          alt={props.sellerData.username}
          src={`${process.env.REACT_APP_SERVER_ENDPOINT}${partner?.avatar?.url}`}
          sx={{ width: 32, height: 32 }}
        />
        <Typography sx={{ ml: '12px' }}>{props.sellerData.username}</Typography>
      </Box>

      {/* Display chats */}
      <Box
        sx={{
          borderBottom: '1px solid #f0f0f0',
          height: `calc(100% - ${chatTextBoxHeight}px)`,
          overflowY: 'auto',
          padding: '0 12px',
          display: 'flex',
          flexDirection: 'column-reverse',
          background: '#e5e7e8',
        }}
      >
          <Box
          sx={{ 
            display: 'flex',
            flexDirection: 'column-reverse',
           }}
          id="DisplayMessages">          
            <MessageContent />
          {/* <Box>
            <Divider>18:62</Divider>
          </Box> */}
        </Box>
      </Box>

      {/* Chat text box */}
      <Box
        sx={{
          backgroundColor: 'white',
          minHeight: `${chatTextBoxHeight}px`,
          padding: '8px',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <InputBase
          id="MessageEditorBox"
          placeholder="Aa...."
          multiline
          maxRows={6}
          variant="filled"
          sx={{
            padding: '4px 16px',
            borderRadius: '24px',
            width: '100%',
            height: 'auto',
            justifyContent: 'center',
            backgroundColor: '#E4E6EB',
            overflow: 'hidden',
          }}
          inputProps={{
            style: { border: 'none'},
          }}
        />
        <IconButton 
          sx={{ margin: '8px 4px' }} 
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </div>
  )
}

export default ChatFrame
