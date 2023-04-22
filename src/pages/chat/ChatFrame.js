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

function ChatFrame(props) {

  const { addToast } = useToasts();
  const chatTextBoxHeight = 60
  const [partner, setPartner] = useState(3)
  const [currentUser, setcurrentUser] = useState(1)
  const [chats, setChats] = useState([])
  const [avatar, setAvatar] = useState({ admin: '', partner: '' })

  // useEffect(() => {
  //   const requestUrl =
  //     process.env.REACT_APP_API_ENDPOINT +
  //     `/chats?filters[$and][0][from][id][$eq]=${currentUser}&filters[$and][1][to][id][$eq]=${partner}&populate=*`
  //   fetch(requestUrl)
  //     .then((res) => res.json())
  //     .then((posts) => {
  //       setChats((prev) => [...prev, posts.data])
  //     })
  // }, [currentUser, partner])

  // useEffect(() => {
  //   const requestUrl =
  //     process.env.REACT_APP_API_ENDPOINT +
  //     `/chats?filters[$and][0][from][id][$eq]=${partner}&filters[$and][1][to][id][$eq]=${currentUser}&populate=*`
  //   fetch(requestUrl)
  //     .then((res) => res.json())
  //     .then((posts) => {
  //       setChats((prev) => [...prev, posts.data])
  //     })
  // }, [currentUser, partner])

  // useEffect(() => {
  //   const requestUrl =
  //     process.env.REACT_APP_API_ENDPOINT +
  //     `/users?filters[$or][0][id][$eq]=${currentUser}&filters[$or][1][id][$eq]=${partner}&populate=avatar`
  //   fetch(requestUrl)
  //     .then((res) => res.json())
  //     .then((posts) => {
  //       setAvatar({
  //         admin:
  //           posts[0].id === currentUser
  //             ? posts[0].avatar?.data?.attributes?.url
  //             : posts[1].avatar?.data?.attributes?.url,
  //         partner:
  //           posts[1].id === currentUser
  //             ? posts[0].avatar?.data?.attributes?.url
  //             : posts[1].avatar?.data?.attributes?.url,
  //       })
  //     })
  // }, [currentUser, partner])

  // Get chat from database
  useEffect(() => {
    let ChatArray = [];
    const getChats = async () => {
      await axios
        .get(process.env.REACT_APP_API_ENDPOINT + `/chats?filters[$and][0][from][id][$eq]=${currentUser}&filters[$and][1][to][id][$eq]=${partner}&populate=*`)
        .then((response) => {
          // setChats(prev => [...prev, ...response.data])
          ChatArray = ChatArray.concat(response.data.data)
          axios
            .get(process.env.REACT_APP_API_ENDPOINT + `/chats?filters[$and][0][from][id][$eq]=${partner}&filters[$and][1][to][id][$eq]=${currentUser}&populate=*`)
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
    getChats();
  },[])

  // Update chat to database
  const sendMessage = (mess) => {
    axios
    .post(process.env.REACT_APP_API_ENDPOINT + '/chats', 
      {
        data: {
          content: mess,
          from: props.sellerData.id,
          to: props.userLoginData.id,
          read: false,
        }
      })
    .then((response) => {
      console.log(response)
      addToast("Gửi tin nhắn thành công thành công", {
        appearance: "success",
        autoDismiss: true
      });
      
    })
    .catch((error) => {
      addToast(" gửi tin nhắn thất bại, vui lòng kiểm tra lại đường truyền", {
        appearance: "error",
        autoDismiss: true
      });
    })
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
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
          alt="Avatar người được chọn"
          src={process.env.REACT_APP_SERVER_ENDPOINT + avatar.partner}
          sx={{ width: 28, height: 28 }}
        />
        <Typography sx={{ ml: '12px' }}>{props.sellerData.username}</Typography>
      </Box>

      {/* Display chats */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid #f0f0f0',
          height: `calc(100% - ${chatTextBoxHeight}px)`,
          overflowY: 'auto',
          padding: '0 12px',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        {
          chats.map((item, index) => {
          console.log('Item thứ ' + index + ' :' + item.attributes.from.data.id)
          if (item.attributes.from.data.id === partner) {
            return (
            // Tag này hiển thị nếu message là của đối phương
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
                alt={item.attributes.from.data.attributes.username}
                src=""
                sx={{ width: 28, height: 28, marginBottom: '8px' }}
              />
              <Box
                sx={{
                  backgroundColor: '#E4E6EB',
                  fontSize: '14px',
                  padding: '8px',
                  margin: '8px',
                  maxWidth: '75%',
                  borderRadius: '12px',
                }}
              >
                {item.attributes.content}
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
                  alt="Remy Sharp"
                  src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
                  sx={{
                    width: 28,
                    height: 28,
                    marginBottom: '8px',
                    backgroundColor: 'rgb(0, 132, 255)',
                  }}
                />
              <Box
                sx={{
                  backgroundColor: 'rgb(0, 132, 255)',
                  color: 'white',
                  fontSize: '14px',
                  padding: '8px',
                  margin: '8px',
                  maxWidth: '75%',
                  borderRadius: '12px',
                }}
              >
                {item.attributes.content}
              </Box>
            </Box>
          )}}
        )}
        <Box>
          <Divider>18:62</Divider>
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
          id="message"
          placeholder="Aa...."
          multiline
          maxRows={6}
          variant="filled"
          sx={{
            padding: '4px 16px',
            borderRadius: '24px',
            width: '100%',
            height: '40px',
            justifyContent: 'center',
            backgroundColor: '#E4E6EB',
          }}
        />
        <IconButton sx={{ margin: '8px 4px' }}>
          <SendIcon />
        </IconButton>
      </Box>
    </div>
  )
}

export default ChatFrame
