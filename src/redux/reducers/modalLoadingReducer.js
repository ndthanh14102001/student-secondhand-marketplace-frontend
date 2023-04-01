
export const OPEN_MODAL_LOADING = "open";
export const CLOSE_MODAL_LOADING = "close";
export const modalLoadingInitState = {
  open: false
};

const modalLoadingReducer = (state = modalLoadingInitState, action) => {
  switch (action.type) {
    case OPEN_MODAL_LOADING: {
      return {
        open: true
      };
    }
    case CLOSE_MODAL_LOADING: {
      return {
        open: false
      };
    }
    default: {
      return state;
    }
  }
};
export default modalLoadingReducer;
