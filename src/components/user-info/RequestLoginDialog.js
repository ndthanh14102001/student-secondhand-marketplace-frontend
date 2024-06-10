import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const RequestLoginDialog = ({
  openNeedLoginDialog,
  handleCloseConfirmReport,
}) => {
  return (
    <Dialog
      open={openNeedLoginDialog}
      onClose={handleCloseConfirmReport}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Hello bạn ơi</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Bạn cần phải đăng nhập để có thể tố cáo
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseConfirmReport}
          sx={{ textTransform: "none" }}
        >
          Thoát
        </Button>
        <a href={process.env.PUBLIC_URL + "/login-register"}>
          <Button sx={{ textTransform: "none" }}>Đăng nhập</Button>
        </a>
      </DialogActions>
    </Dialog>
  );
};

export default RequestLoginDialog;
