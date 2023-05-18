import { Avatar, Badge, Box, IconButton, Stack } from "@mui/material";
import './chat-bubble.css';
import ChatBubbleNavigator from "./ChatBubbleNavigator";
import ChatBubbleRequireLogin from "./ChatBubbleRequireLogin";

// icon import
import SmsIcon from '@mui/icons-material/Sms';
import { getUserLogin } from "../../utils/userLoginStorage";
import { useEffect, useState } from "react";

function ChatBubble(props) {


    const userLoginData = getUserLogin()?.user;
    const [openBubbleDrawer, setOpenBubbleDrawer] = useState(false) //Open drawer and display sum of incoming chats
    const [totalChatCount, setTotalChatCount] = useState(0)

    const getChatsCount = (count) => {
        setTotalChatCount(count)
    }

    return ( 
        <Box sx={{ position: 'fixed', left: 0, bottom: 0, width: '150px', height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
            {/* Button size: 60x60 px */}
            <Badge badgeContent={openBubbleDrawer ? 0 : totalChatCount} max={99} color="error" overlap="circular">
                <IconButton 
                    className="ChatBubbleCSS"
                    sx={{ 
                        p: '12px',  
                        background: '#a749ff', 
                        color: 'white' , 
                        borderRadius: '50%',
                        zIndex: '1',
                        boxShadow: 3,
                        }}>
                    <SmsIcon sx={{ fontSize: '36px', }} />
                </IconButton>            
            </Badge>

            {/* This Box will receive all click event to execute bubble chat drawer */}
            <Box 
              onClick={() => setOpenBubbleDrawer((prev) => !prev)}
              sx={{ 
                width: '70px',
                height: '70px',
                position: 'absolute',
                borderRadius: '50%',
                zIndex: '2',
                transitionDuration: '500ms',
                '&:hover' : {
                    background: 'rgba(167, 73, 255, 0.35)',
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    cursor: 'pointer'
                },
                '&:active' : {
                    background: 'rgba(167, 73, 255, 0.3)',
                    width: '85px',
                    height: '85px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transform: 'scale(0.9)',
                    transitionDuration: '100ms',
                },
             }}>
            </Box>

            {/* This tag contain bubble drawer's content */}
            <Box sx={{ 
                maxHeight: openBubbleDrawer ? '400px' : '0px',
                maxWidth: openBubbleDrawer ? '600px' : '0px',
                position: 'absolute',
                borderRadius: '30px',
                bottom: '44px',
                marginBottom: '62px',
                transitionDuration: '300ms',
                justifyContent: 'center',
                display: 'flex',
                overflow: 'hidden',
                padding: openBubbleDrawer ? '10px' : ''
             }}>
                {(userLoginData !== undefined) ?
                    <ChatBubbleNavigator 
                        currentUser={userLoginData} 
                        selectedChatPartner={props.selectedChatPartner} 
                        getChatsCount={getChatsCount}
                    />
                    :
                    <ChatBubbleRequireLogin />
                }
            </Box>
        </Box>
     );
}

export default ChatBubble;