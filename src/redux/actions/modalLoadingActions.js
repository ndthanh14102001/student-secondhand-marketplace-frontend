import { CLOSE_MODAL_LOADING, OPEN_MODAL_LOADING } from "../reducers/modalLoadingReducer";

export const onOpenModalLoading = () => {
  return {
    type: OPEN_MODAL_LOADING
  };
};
export const onCloseModalLoading = () => {
  return {
    type: CLOSE_MODAL_LOADING
  };
};