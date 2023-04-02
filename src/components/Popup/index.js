import * as React from "react";
import PropType from "prop-types";

import {
  Typography,
  Slide,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
  Button
} from "@mui/material";

import * as styles from "./styles";
import SuccessIcon from "../../assets/images/success-icon-shape.png";
import WarningIcon from "../../assets/images/warning-icon-shape.png";
import ErrorIcon from "../../assets/images/error-icon-shape.png";
import InfoIcon from "../../assets/images/info-icon-shape.png";
import ButtonCancel from "./ButtonCancel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Popup({
  isOpen,
  onClose,
  type,
  title,
  content,
  buttonText,
  onButtonClick,
  customButton,
  customButtonRight,
  styleButton,
  styleIcon,
  isShowButtonCancel,
  onButtonCancelClick,
  ...props }) {
  const IconStatus = ({ type, styleIcon }) => {
    switch (type) {
      case "success":
        return <img src={SuccessIcon} alt="success" />;
      case "warning":
        return <img src={WarningIcon} alt="warning" />;
      case "error":
        return <img src={ErrorIcon} alt="error" />;
      case "info":
        return <img style={{ ...styleIcon }} src={InfoIcon} alt="info" />;
      default:
        return <img src={SuccessIcon} alt="success" />;
    }
  };
  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      sx={styles.popUpContainer}
      TransitionComponent={Transition}
      {...props}
    >
      <Typography
        id="popup-status-icon"
        sx={styles.popupIcon}
        component="div"
      >
        <Typography >
          <IconStatus styleIcon={styleIcon} type={type} />
        </Typography>
      </Typography>
      <DialogTitle
        sx={{ ...styles.popupTitle(type) }}>
        {title}
      </DialogTitle>
      <DialogContent sx={styles.popupContent}>
        {content}
      </DialogContent>
      <DialogActions sx={styles.popupActions}>
        {customButton}
        {isShowButtonCancel &&
          <ButtonCancel
            color={type}
            variant="outlined"
            sx={{ ...styleButton }}
            onClick={onButtonCancelClick}
          />}
        <Button
          color={type}
          variant="contained"
          sx={{ ...styleButton }}
          onClick={onButtonClick}
        >{buttonText ? buttonText : "Đồng ý"}</Button>
        {customButtonRight}
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(Popup);
Popup.PropType = {
  sOpen: PropType.bool,
  onClose: PropType.func,
  type: PropType.oneOf(["success", "warning", "error", "info"]),
  title: PropType.string,
  content: PropType.string | PropType.element,
  buttonText: PropType.string,
};
// Example
// const [open, setOpen] = React.useState(true);
/* <Popup
  buttonText={"success"}
  isOpen={open}
   //Handle when click modal
  onClose={() => {
    setOpen(false);
  }}
  //Handle Button Click
  onButtonClick={() => {
    setOpen(false);
  }}
  type={"success"}
  title="Error"

  //content cant using JSX element
  content="content"
/> */
