import React from "react";
import palette from "../../../assets/palette";
import { Box, Button, CircularProgress } from "@mui/material";

const LoadingButton = ({ isLoading, onClick, children, ...props }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        variant="contained"
        disabled={isLoading}
        onClick={onClick}
        {...props}
      >
        {children}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            color: palette.primary.main,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
};

export default LoadingButton;
