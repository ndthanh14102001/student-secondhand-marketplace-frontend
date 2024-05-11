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
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ContentPasteSearchTwoToneIcon from '@mui/icons-material/ContentPasteSearchTwoTone';

import TextsmsTwoToneIcon from '@mui/icons-material/TextsmsTwoTone';
import axios from 'axios';

function CustomizedInputBase(props) {
  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      {
        props.isSearching ? 
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={props.cancelSearchingMode}>
          <KeyboardReturnIcon />
        </IconButton> 
        : 
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={props.handleSearchingMode}>
          <SearchIcon />
        </IconButton>
      }
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Tìm kiếm người dùng"
        inputProps={{ 
          'aria-label': 'tìm kiếm người dùng',
        }}
        onChange={(event) => {
          props.handleSetSearchKey(event.target.value)
          console.log(event.target.value)
        }}
        onClick={props.handleSearchingMode}
      />
    </Paper>
  )
}

function ChatsNavigator(props) {

  // const [userFromURL, setUserFromURL] = useState();
  // const [userFromSearch, setUserFromSearch] = useState([]);
  const [userList, setUserList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchUserList, setSearchUserList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [partnerJustSent, setPartnerJustSent] = useState(-1);
  const [isSearching, setIsSearching] = useState(false)

  // Record unique user to check if they are already exist
  const [UniqueUser, setUniqueUser] = useState([])

  // Customize & update user object array as incoming message received
  useEffect(() => {
    if(props.inComingMessage != undefined && (props.inComingMessage?.length !== 0 || props.sellerData !== undefined)){
      let inComingMessage = props.inComingMessage
      let tempCustomUserList = [];
      console.log("Chat page: inComingMessage array: ")
      console.log(inComingMessage)
      console.log("Chat page: props.sellerData")
      console.log(props.sellerData)
      const uniqueUserIDsList = [...new Set(inComingMessage?.map((object) => object.attributes.from.data.id))];
      

      if(props.sellerData !== undefined){
        tempCustomUserList = uniqueUserIDsList?.map((id) => {
          if(id === props.sellerData.id) {
            return {
            id: id,
            unreadCount: 0
          }}
          return {
            id: id,
            unreadCount: inComingMessage.filter((object) => object.attributes.from.data.id === id && object.attributes.read === false)?.length
          }
        }); 
      } else {
        tempCustomUserList = uniqueUserIDsList?.map((id) => ({
          id: id,
          unreadCount: inComingMessage.filter((object) => object.attributes.from.data.id === id && object.attributes.read === false)?.length
        })); 
      }

      console.log("Chat page: tempCustomUserList: ")
      console.log(tempCustomUserList)
      console.log("Chat page: props.incomingFromSocket.attributes.from.data.id: ")
      console.log(props.incomingFromSocket)
      // Cheeck userlist if user (which is partner) already exist, if already there, plus, unread Count

      if(props.sellerData !== undefined && (tempCustomUserList.findIndex(obj => obj.id === props.sellerData.id) === -1)){
        tempCustomUserList.push({id: props.sellerData.id, unreadCount: 0})
      }

      console.log("Chat page: tempCustomUserList after insert seller data: ")
      console.log(tempCustomUserList)
      
      tempCustomUserList?.map((item) => {
          if(!findIdExistById(UniqueUser, item.id)){
              console.log('Chat page: find above mentioned user')
              // FinalUserList.push(QueryUserByID(item.id))
              QueryUserByID(item.id, item.unreadCount)
              setUniqueUser((prev) => [...prev, item])
          }else if(props.incomingFromSocket !== undefined && item.id === props.incomingFromSocket.attributes.from.data.id) {
              console.log("người dùng username +1 unread: " + props.incomingFromSocket.attributes.from.data.id)
              setUserList((prev) => {
                  return prev?.map((object) => {
                      if (object.id === props.incomingFromSocket.attributes.from.data.id) {
                        // Cập nhật thuộc tính của object có id là
                        return { ...object, unreadCount: item.unreadCount };
                      }
                      return object;
                  });
                  // [...prev , prev[prev.findIndex((object) => object.id === item.id)].unreadCount++];
              })
          }
      })
    }
  }, [props.inComingMessage, props.sellerData])

  // If a user id is called in chat, we set index selected Item to it
  useEffect(() => { 
      if(props.sellerData !== undefined) {
        userList?.map((item, index)=>{
          if(item.id === props.sellerData.id){
            setSelectedIndex(index)
          }
        })
      }
  },[props.sellerData, userList])

  //search User get 10 first record
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
        setSearchUserList(response.data)
      }
    }
    if(searchKey?.length > 0){
      getSellerInfo();
    } else {
      setSearchUserList([]);
    }

  },[searchKey])

  // Just in case data from server delay which result to display users even when search key leave blank
  // IMPORTANT BE CAREFUL OF USEFFECT LOOP
  useEffect(()=>{
    if(searchKey?.length === 0 && searchUserList?.length > 0){
      setSearchUserList([]);
    }
  },[searchUserList])

  const findIdExistById = (array, id) => {
    const index = array.findIndex((object) => object.id === id);
    return index !== -1 ? true : false;
  };

  const QueryUserByID = async (userId, unreadCount) => {
    const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + "/users?filters[id][$eq]=" + userId + "&populate=*")
    response.data[0].unreadCount = unreadCount
    let data = response.data[0];
    setUserList((prev) => [ ...prev, data])
  }

  const handleSetSeller = (index) => {
    props.handleChangeSeller(userList[index])
  }

  const handleSetSearchKey = (value) => {
    setSearchKey(value)
  }

  const ListUserChat = () => {
    return (
      <Box>
        <Box sx={{ fontSize: '14px', color: 'grey', textAlign: 'center', mb: '8px' }}>
          Người đã nhắn tin
        </Box>
        <Stack
          direction="column"
          spacing={1}
          sx={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Box>
            {userList?.length > 0 ? userList?.map((item, index) => (
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
                {item.unreadCount > 0 && <Chip color="error" size="small" label={item.unreadCount} />}
              </Box>
            )) : 
              <Box sx={{ width: '100%', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                <TextsmsTwoToneIcon sx={{ fontSize: '150px', color: 'lightgrey' }} />
                <Box sx={{ fontSize: '18px', color: 'grey' }}>bạn chưa có cuộc trò chuyện nào</Box>
              </Box>}
          </Box>
          {/* <Divider variant="middle" /> */}
        </Stack>
      </Box>
    )
  }

  const ListUserSearching = () => {
    return (
      <Box>
        <Box sx={{ fontSize: '14px', color: 'grey', textAlign: 'center', mb: '8px' }}>
          {searchKey?.length > 0 ? (<span>Kết quả tìm kiếm &#40;Có {searchUserList?.length} kết quả&#41;</span>) : "bắt đầu nhập để tìm kiếm"}
        </Box>
        <Stack
          direction="column"
          spacing={1}
          sx={{ overflowY: 'auto', overflowX: 'hidden' }}
        >
          <Box>
            {searchUserList?.length > 0 ? searchUserList?.map((item, index) => (
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
                  '&:hover' : {
                    backgroundColor: 'whitesmoke',
                    cursor: 'pointer',
                  }
                }}
                onClick={() => {
                  setIsSearching(false)
                  props.handleChangeSeller(item)
                  setUserList((prev) => {
                    if(prev.findIndex(obj => obj.id === item.id) === -1){
                      setSelectedIndex(prev?.length)
                      setUniqueUser((subPrev) => [...subPrev, {id: item.id, unreadCount: 0}])
                      return [...prev, {...item, unreadCount: 0}]
                    } else {
                      setSelectedIndex(prev.findIndex(obj => obj.id === item.id))
                      return prev
                    }
                  })
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
                {item.unreadCount > 0 && <Chip color="error" size="small" label={item.unreadCount} />}
              </Box>
            )) : 
              <Box sx={{ width: '100%', height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                <ContentPasteSearchTwoToneIcon sx={{ fontSize: '150px', color: 'lightgrey' }} />
              </Box>}
          </Box>
          {/* <Divider variant="middle" /> */}
        </Stack>
      </Box>
    )
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
      <CustomizedInputBase 
        handleSetSearchKey={handleSetSearchKey}
        handleSearchingMode={() => {
          setIsSearching(true)
        }}
        cancelSearchingMode={() => {
          setIsSearching(false)
        }}
        isSearching={isSearching}
      />
      <Divider variant="middle" sx={{ m: '14px 0' }} />
      {isSearching ? <ListUserSearching /> : <ListUserChat />}
    </Box>
  )
}

export default ChatsNavigator
