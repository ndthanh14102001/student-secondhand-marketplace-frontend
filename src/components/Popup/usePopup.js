import { useState } from "react";
import { POPUP_TYPE_INFO } from "./constants";

const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("info");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [buttonText, setButtonText] = useState("");
  const onClose = () => {
    setIsOpen(false);
  };
  const [actions, setActions] = useState({
    onClickOk: onClose
  });
  const onShowPopup = (
    type = POPUP_TYPE_INFO,
    title = "info",
    content = "info",
    clickOkAction = null
  ) => {
    setType(type);
    setTitle(title);
    setContent(content);
    setIsOpen(true);
    if (clickOkAction) {
      setActions({
        ...actions,
        onClickOk: clickOkAction
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    type,
    setType,
    title,
    setTitle,
    content,
    setContent,
    buttonText,
    setButtonText,
    onShowPopup,
    onClose,
    actions, setActions
  };
};

export default usePopup;

//const popup = usePopup();
/* <Popup
  isOpen={popup.isOpen}
  //Handle when click modal
  onClose={popup.onClose}
  //Handle Button Click
  onButtonClick={() => {
    handelNextStep();
    navigate("/" + routes.admin.inventory);
  }}
  type={popup.type}
  title={popup.title}

  //content cant using JSX element
  content={popup.content}
/> */