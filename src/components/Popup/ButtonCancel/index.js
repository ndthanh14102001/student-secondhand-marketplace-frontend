import { Button } from "@mui/material";
import React from "react";

const ButtonCancel = ({ ...props }) => {
  return (
    <Button {...props}>{"Hủy bỏ"}</Button>
  );
};

export default ButtonCancel;