import { Box, Button } from "@mui/material";
import React from "react";

const FlowButton = ({ isFollow, handleFollow, sx, buttonStyle }) => {
  return (
    <Box ml={"1rem"} display={"flex"} alignItems="center" {...sx}>
      {isFollow ? (
        <Button
          sx={{ textTransform: "capitalize", ...buttonStyle }}
          variant="outlined"
          onClick={handleFollow}
        >
          Đang theo dõi
        </Button>
      ) : (
        <Button
          sx={{ textTransform: "capitalize", ...buttonStyle }}
          variant="contained"
          onClick={handleFollow}
        >
          Theo dõi
        </Button>
      )}
    </Box>
  );
};

export default FlowButton;
