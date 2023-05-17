import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Box } from '@mui/material';

function ChatBubbleRequireLogin() {
    return ( 
        <Box sx={{ marginLeft: '200px', marginBottom: '-16px',  }}>
            <ChatBubbleIcon sx={{ fontSize: '170px', color: '#a749ff', transform: 'scaleX(1.2)',}}/>
            <Box sx={{ width: '150px', right: '5px',bottom: '44px', position: 'absolute', color: 'white', fontSize: '14px' }}>
                Bạn cần phải đăng nhập để có thể trò chuyện. <span style={{ fontWeight: 'bold' }}>Ấn vào đây để đăng nhập</span>
            </Box>
        </Box>
     );
}

export default ChatBubbleRequireLogin;