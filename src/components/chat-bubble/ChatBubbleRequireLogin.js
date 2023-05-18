import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import './chat-bubble.css';

function ChatBubbleRequireLogin() {
    return ( 
        <Box sx={{ marginLeft: '200px', marginBottom: '-16px',  }}>
            <ChatBubbleIcon sx={{ fontSize: '170px', color: '#a749ff', transform: 'scaleX(1.2)',}}/>
            <Box sx={{ width: '150px', right: '8px',bottom: '51px', position: 'absolute', color: 'white', fontSize: '14px' }}>
                Bạn cần phải đăng nhập để có thể trò chuyện. 
                <Link to={process.env.PUBLIC_URL + '/login-register'}>
                    <span
                        className='linkToLoginBubbleChat'
                        style={{ 
                            fontWeight: 'bold',
                            color: 'white',
                        }}>
                            {" "}Ấn vào đây để đăng nhập
                    </span>                
                </Link>
            </Box>
        </Box>
     );
}

export default ChatBubbleRequireLogin;