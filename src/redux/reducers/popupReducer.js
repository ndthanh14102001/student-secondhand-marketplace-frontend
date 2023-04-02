const POPUP_TYPE_ERROR = "error";
const POPUP_TYPE_INFO = "info";
const POPUP_TYPE_SUCCESS = "success";
const POPUP_TYPE_WARNING = "warning";
const SHOW_POPUP = "show popup";
const CLOSE_POPUP = "close popup";
export {
  POPUP_TYPE_ERROR,
  POPUP_TYPE_INFO,
  POPUP_TYPE_SUCCESS,
  POPUP_TYPE_WARNING,
  SHOW_POPUP,
  CLOSE_POPUP
};
export const popupInitState = {
  open: false,
  type: POPUP_TYPE_INFO,
  title: "",
  content: "",
  showButtonCancel: false,
  actions: {
    clickOkeAction: () => null,
    closeAction: () => null,
    clickCancelButton: () => null
  },
};
const popupReducer = (state = popupInitState, action) => {
  switch (action.type) {
    case SHOW_POPUP: {
      return {
        ...action.payload
      };
    }
    case CLOSE_POPUP: {
      return popupInitState;
    }
    default: {
      return state;
    }
  }
};
export default popupReducer;