import { Avatar, Badge, Box, IconButton, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import axios from "axios";

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ForumIcon from '@mui/icons-material/Forum';

function ChatBubbleNavigator(props) {
    const chatBubbleSocket = useSelector(state => state.socket.socket);
    const [userList, setUserList] = useState([]);
    const [CustomUserList, setCustomUserList] = useState();
    const [incomingMessage, setIncomingMessage] = useState([])
    const [partnerJustSent, setPartnerJustSent] = useState(-1);

    // Get all unread message & Initiate Socket receive the message to login user
    useEffect(()=>{
        if(chatBubbleSocket !== null){
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
                // console.log("socket bên tôi nhận được: ")
                // console.log(dataPrototype)
                // // props.onUpdateUnreadChat(dataPrototype)
                // setIncomingMessage((prev) => [...prev, dataPrototype])
                setPartnerJustSent(message.from.id)
                console.log("socket bên ChatBubbleNavigator đã chạy !!! ")
                getChatsRelatedToLoggedInPerson()
            }

            chatBubbleSocket.on("private message", listener)
            getChatsRelatedToLoggedInPerson()

            return () => {
                chatBubbleSocket.off("private message", listener);
              };
        }
    },[chatBubbleSocket])

    const getChatsRelatedToLoggedInPerson = async () => {
        const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + `/chats?pagination[page]=1&pagination[pageSize]=100&filters[to][id][$eq]=${props.currentUser.id}&filters[read]=false&populate=*`,
        method: "get",
        });
        if (response.type === RESPONSE_TYPE) {
        // console.log('Danh sách chat tới người log in hiện tại')
        // console.log(response.data)
        setIncomingMessage(response.data.data)
        }
    }

    useEffect(()=>{
        if(userList.length > 0 && props.selectedChatPartner !== undefined){
            setUserList((prev) => prev.filter((object) => object.id !== props.selectedChatPartner))
        }
    },[props.selectedChatPartner])

    useEffect(() => {
        if(incomingMessage.length !== 0){
            let tempCustomUserList = [];
            console.log("incomingMessage array: ")
            console.log(incomingMessage)
            const uniqueUserIDsList = [...new Set(incomingMessage.map((object) => object.attributes.from.data.id))];

            tempCustomUserList = uniqueUserIDsList.map((id) => ({
                id: id,
                unreadCount: incomingMessage.filter((object) => object.attributes.from.data.id === id).length
            }));

            props.getChatsCount(tempCustomUserList.reduce((total, obj) => total + obj.unreadCount, 0))

            console.log("tempCustomUserList: ")
            console.log(tempCustomUserList)

            // Cheeck userlist if user (which is partner) already exist, if already there, plus, unread Count
            tempCustomUserList.map((item) => {
                if(!findIdExistById(userList, item.id)){
                    // FinalUserList.push(QueryUserByID(item.id))
                    QueryUserByID(item.id, item.unreadCount)
                }else if(item.id === partnerJustSent) {
                    setUserList((prev) => {
                        return prev.map((object) => {
                            if (object.id === partnerJustSent) {
                              // Cập nhật thuộc tính của object có id là
                              return { ...object, unreadCount: object.unreadCount + 1 };
                            }
                            return object;
                        });
                        // [...prev , prev[prev.findIndex((object) => object.id === item.id)].unreadCount++];
                    })
                }
            })
        }
    },[incomingMessage])

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

    useEffect(() => { 
        console.log(userList)
    },[userList])

    return ( 
    <Box>
        <Stack spacing={2}>
        <Link to={process.env.PUBLIC_URL + "/chat"}>
                <Tooltip title="Đi đến trang chat" placement="right">
                    <Box 
                    sx={{ 
                        width: '56px', 
                        height: '56px', 
                        boxShadow: 3,
                        backgroundColor: 'white',
                        borderRadius: '50%',
                    }}>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                            ChatBubbleIcon
                            badgeContent={
                                <ForumIcon sx={{ fontSize: '30px' }} />
                            }
                            sx={{ p: '5px', mt: '18px', ml: '20px' }}
                        >
                            <ArrowRightAltIcon sx={{ fontSize: '28px'}}/>
                        </Badge>
                    </Box>
                </Tooltip>
            </Link>
            {userList.map((item) => (
                <Tooltip title={item.username} placement="right">
                    <Badge badgeContent={item.unreadCount} max={99} color="error" overlap="circular">
                        <Link to={process.env.PUBLIC_URL + "/chat/" + item.id}>
                            <Avatar alt={item.username} src={`${process.env.REACT_APP_SERVER_ENDPOINT}${item.avatar?.url}`} 
                                sx={{ 
                                    width: '56px', 
                                    height: '56px', 
                                    boxShadow: 3 
                                }}
                            />
                        </Link>
                    </Badge>
                </Tooltip>
            ))}
        </Stack>
    </Box> 
    );
}

export default ChatBubbleNavigator;