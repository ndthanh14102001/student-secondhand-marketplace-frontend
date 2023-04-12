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

function ChatFrame() {
  const chatTextBoxHeight = 60
  const [partner, setPartner] = useState(4)
  const [currentAdmin, setCurrentAdmin] = useState(2)
  const [chats, setChats] = useState([])
  const [avatar, setAvatar] = useState({ admin: '', partner: '' })

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/chats?filters[$and][0][sender][id][$eq]=${currentAdmin}&filters[$and][1][receiver][id][$eq]=${partner}&populate=*`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setChats((prev) => [...prev, posts.data])
      })
  }, [currentAdmin, partner])

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/chats?filters[$and][0][sender][id][$eq]=${partner}&filters[$and][1][receiver][id][$eq]=${currentAdmin}&populate=*`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setChats((prev) => [...prev, posts.data])
      })
  }, [currentAdmin, partner])

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/users?filters[$or][0][id][$eq]=${currentAdmin}&filters[$or][1][id][$eq]=${partner}&populate=avatar`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setAvatar({
          admin:
            posts[0].id === currentAdmin
              ? posts[0].avatar?.data?.attributes?.url
              : posts[1].avatar?.data?.attributes?.url,
          partner:
            posts[1].id === currentAdmin
              ? posts[0].avatar?.data?.attributes?.url
              : posts[1].avatar?.data?.attributes?.url,
        })
      })
  }, [currentAdmin, partner])

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
        <Typography sx={{ ml: '12px' }}>Hoang123</Typography>
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
        {/* {chats.sort(function (a, b) {
          return (
            new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time)
          )
        })} */}
        {/* {chats.map((item) =>
          item.data.attributes.sender.data.attributes.username === partner ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexGrow: '1',
                alignItems: 'end',
              }}
            >
              <Avatar
                alt={item.data.attributes.sender.data.attributes.username}
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus id dignissim justo. Nulla ut facilisis ligula.
                Interdum et malesuada fames ac ante ipsum primis in faucibus.
                Sed malesuada lobortis pretium.
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row-reverse',
                flexGrow: '1',
                alignItems: 'end',
              }}
            > */}
        {/* <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
            sx={{
              width: 28,
              height: 28,
              marginBottom: '8px',
              backgroundColor: 'rgb(0, 132, 255)',
            }}
          /> */}
        {/* <Box
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus id dignissim justo. Nulla ut facilisis ligula.
                Interdum et malesuada fames ac ante ipsum primis in faucibus.
                Sed malesuada lobortis pretium.
              </Box>
            </Box>
          ),
        )} */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          {/* <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
            sx={{
              width: 28,
              height: 28,
              marginBottom: '8px',
              backgroundColor: 'rgb(0, 132, 255)',
            }}
          /> */}
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
        <Box>
          <Divider>18:62</Divider>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          {/* <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
            sx={{
              width: 28,
              height: 28,
              marginBottom: '8px',
              backgroundColor: 'rgb(0, 132, 255)',
            }}
          /> */}
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
        <Box>
          <Divider>18:62</Divider>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row-reverse',
            flexGrow: '1',
            alignItems: 'end',
          }}
        >
          {/* <Avatar
            alt="Remy Sharp"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Fcute-little-bird-avatar&psig=AOvVaw2WwyCbE5GdR5umWLJkdfNM&ust=1680945752181000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCJDNzIW5l_4CFQAAAAAdAAAAABAE"
            sx={{
              width: 28,
              height: 28,
              marginBottom: '8px',
              backgroundColor: 'rgb(0, 132, 255)',
            }}
          /> */}
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            id dignissim justo. Nulla ut facilisis ligula. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Sed malesuada lobortis
            pretium.
          </Box>
        </Box>
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
