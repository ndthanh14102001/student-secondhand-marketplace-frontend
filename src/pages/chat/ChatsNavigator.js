import {
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material'

import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
import { PropaneSharp } from '@mui/icons-material';

function CustomizedInputBase(props) {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm người dùng"
        inputProps={{ 'aria-label': 'tìm kiếm người dùng' }}
        onChange={(event) => {
          props.handleSetSearchKey(event.target.value)
          console.log(event.target.value)
        }}
      />
    </Paper>
  )
}

function ChatsNavigator(props) {

  // const [userFromURL, setUserFromURL] = useState();
  // const [userFromSearch, setUserFromSearch] = useState([]);
  const [userList, setUserList] = useState();
  const [CustomUserList, setCustomUserList] = useState();
  const [searchKey, setSearchKey] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // get first 10 user from database
  useEffect(()=> {
    const getSellerInfo = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + `/users?pagination[start]=0&pagination[limit]=10&filters[id][$ne]=${props.userLoginData.id}&filters[username][$contains]=${searchKey}`,
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
        setUserList(response.data)
      }
    }
    getSellerInfo();
  },[searchKey])

  useEffect(() => {
    if(userList !== undefined && props.inComingMessage !== undefined){
      console.log(props.inComingMessage)
      const getUnreadMessageCount = (idPartner) => {
        return props.inComingMessage.reduce((countRead, message) => {
          if (message.attributes.from.data.id === idPartner && !message.attributes.read) {
            return countRead + 1;
          }
          return countRead;
        }, 0);
      };

      const getNewestMessage = (idPartner) => {
        let newArr = props.inComingMessage.sort(function (a, b) {
          return a.attributes.createdAt.localeCompare(b?.attributes?.createdAt);
        }).reverse()
        let breakLoop = false;
        // console.log("after shuffle")
        // console.log(newArr)
        return newArr.map((item, index) => {
          if(item.attributes.from.data.id === idPartner && !breakLoop){
            breakLoop = true;
            return newArr[index].attributes.content
          }
        })
      }

      // const getReadStatus = (idPartner) => {
      //   let newArr = props.inComingMessage.sort(function (a, b) {
      //     return a.attributes.createdAt.localeCompare(b?.attributes?.createdAt);
      //   }).reverse()
      //   let breakLoop = false;
      //   return newArr.map((item, index) => {
      //     if(item.attributes.from.data.id === idPartner && !breakLoop){
      //       breakLoop = true;
      //       return newArr[index].attributes.read
      //     }
      //   })
      // }

      let newUserList = userList.map((item) => {
        return {
          ...item, 
          unreadMessage: getUnreadMessageCount(item.id), 
          newestMessage: getNewestMessage(item.id),
          // read: getReadStatus(item.id)
        }
      });
      console.log(newUserList)
      setCustomUserList(newUserList)
    }
  }, [userList, props.inComingMessage])

  const handleSetSeller = (index) => {
    props.handleChangeSeller(userList[index])
  }

  const handleSetSearchKey = (value) => {
    setSearchKey(value)
  }

  return (
    <Box
      sx={{
        width: '350px',
        padding: '12px',
        // margin: '8px',
        backgroundColor: 'white',
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        // minHeight: '500px',
        height: '550px',
        // height: 'fit-content',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'center',
      }}
    >
      <CustomizedInputBase handleSetSearchKey={handleSetSearchKey}/>
      <Divider variant="middle" sx={{ m: '14px 0' }} />
      <Box sx={{ fontSize: '12px', color: 'grey', textAlign: 'center' }}>
        Mọi người
      </Box>
      <Stack
        direction="column"
        spacing={1}
        sx={{ overflowY: 'auto', overflowX: 'hidden' }}
      >
        <Box>
          {CustomUserList?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: '4px',
                p: '8px 8px',
                borderRadius: '16px',
                transitionDuration: '400ms',
                backgroundColor: selectedIndex === index ? 'lightblue' : '',
                '&:hover' : {
                  backgroundColor: selectedIndex !== index && 'whitesmoke',
                  cursor: 'pointer',
                }
              }}
              onClick={() => {
                handleSetSeller(index)
                setSelectedIndex(index)
              }}
            >
              <Avatar
                alt={item.username}
                src={`${process.env.REACT_APP_SERVER_ENDPOINT}${item.avatar?.url}`}
                sx={{ width: 52, height: 52 }}
              />
              <Box sx={{ ml: '12px', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ fontSize: '16px' }}>{item.username}</Box>
                {/* <Box sx={{ fontSize: '13px', color: item.newestMessage.read ? 'grey' : 'blue', mt: '2px', fontWeight: item.newestMessage.read ? '' : 'bold'}}>{item.newestMessage}</Box> */}
              </Box>
              {item.unreadMessage > 0 && <Chip color="error" size="small" label={item.unreadMessage} />}
            </Box>
          ))}
        </Box>
        {/* <Divider variant="middle" /> */}
      </Stack>
    </Box>
  )
}

export default ChatsNavigator
