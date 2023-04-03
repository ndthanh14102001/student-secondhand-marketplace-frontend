
export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";
export const categoryInitState = {
  filter: {

  }
};

const categoryReducer = (state = categoryInitState, action) => {
  switch (action.type) {
    case SET_CATEGORY_FILTER: {
      return {
        ...state,
        filter: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
export default categoryReducer;
