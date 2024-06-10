import { Box } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
const NoChatYetPanel = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "200px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "18px",
          border: "1px solid lightgrey",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{ fontSize: "14px", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              backgroundColor: "#a749ff",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          >
            <ChatIcon
              sx={{ fontSize: "18px", color: "white", margin: "5px" }}
            />
          </div>
          Hiện tại chưa có tin nhắn, bạn có thể bắt đầu cuộc trò chuyện đầu
          tiên
        </div>
      </Box>
    </Box>
  );
};
export default NoChatYetPanel;