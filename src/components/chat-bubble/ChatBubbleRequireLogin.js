import { Box } from "@mui/material";
import { Link } from "react-router-dom/cjs/react-router-dom";
import "./chat-bubble.css";
import palette from "../../assets/palette";

function ChatBubbleRequireLogin() {
  return (
    <Box
      sx={{
        width: "200px",
        position: "absolute",
        borderRadius: "8px",
        marginBottom: "62px",
        transitionDuration: "300ms",
        justifyContent: "center",
        display: "flex",
        overflow: "hidden",
        padding: "1rem",
        top: "-20%",
        left: "68%",
        background: palette.primary.main,
      }}
    >
      <Box
        sx={{
          color: "white",
          fontSize: "14px",
        }}
      >
        Bạn cần phải đăng nhập để có thể trò chuyện.
        <Link to={process.env.PUBLIC_URL + "/login-register"}>
          <span
            className="linkToLoginBubbleChat"
            style={{
              fontWeight: "bold",
              color: "white",
            }}
          >
            {" "}
            Ấn vào đây để đăng nhập
          </span>
        </Link>
      </Box>
    </Box>
  );
}

export default ChatBubbleRequireLogin;
