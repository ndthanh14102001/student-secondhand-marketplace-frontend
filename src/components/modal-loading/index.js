import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
const ModalLoading = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "var(--modal-loading-progress-color)", zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default ModalLoading;