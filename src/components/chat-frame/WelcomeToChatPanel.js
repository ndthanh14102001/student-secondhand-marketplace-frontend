import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
const WelcomeToChatPanel = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "400px",
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
          maxWidth: "420px",
          border: "1px solid lightgrey",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            background:
              "linear-gradient(140deg, #ad00d9 0%, #BC70A4 60%, #BFD641 100%)",
            height: "90px",
            position: "absolute",
            width: "500px",
            left: "-20px",
            top: "-30px",
            zIndex: "1",
          }}
        />
        <div style={{ height: "60px", zIndex: "2" }}>
          <Typography
            sx={{
              textAlign: "center",
              color: "white",
              fontFamily: "Verdana,sans-serif",
              fontSize: {
                md: "20px",
                xs: "1rem",
              },
              fontWeight: "bold",
            }}
          >
            Chào mừng đến với chat
          </Typography>
        </div>
        <div
          style={{
            fontSize: "14px",
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#a749ff",
              marginRight: "10px",
              borderRadius: "50%",
            }}
          >
            <PersonIcon
              sx={{ fontSize: "20px", color: "white", margin: "5px" }}
            />
          </div>
          Chọn người dùng bên thanh bên trái để bắt đầu trò chuyện.
        </div>
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
            <SearchIcon
              sx={{ fontSize: "20px", color: "white", margin: "5px" }}
            />
          </div>
          Bạn cũng có thể tìm người dùng bằng thanh tìm kiếm, chọn trong danh
          sách để bắt đầu cuộc trò chuyện mới.{" "}
        </div>
      </Box>
    </Box>
  );
};
export default WelcomeToChatPanel;
