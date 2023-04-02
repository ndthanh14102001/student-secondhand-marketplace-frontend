import * as constants from "../reducers/popupReducer";

export const onShowPopup = (
  {
    type = constants.POPUP_TYPE_INFO,
    title = "",
    content = "",
    showButtonCancel = true,
    clickOkeAction = () => null,
    closeAction = () => null,
    clickCancelButton = () => null,
  }
) => {
  return {
    type: constants.SHOW_POPUP,
    payload: {
      open: true,
      type: type,
      title: title,
      content: content,
      showButtonCancel,
      actions: {
        clickOkeAction,
        closeAction,
        clickCancelButton
      }
    }
  };
};

export const onClosePopup = () => {
  return {
    type: constants.CLOSE_POPUP,
  };
};
