
export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";
export const SET_UNVERSITY_FILTER = "SET_UNVERSITY_FILTER";
export const filterInitState = {
  category: {

  },
  university: "",
  name: ""
};

const filterReducer = (state = filterInitState, action) => {
  switch (action.type) {
    case SET_CATEGORY_FILTER: {
      return {
        ...state,
        category: action.payload
      };
    }
    case SET_UNVERSITY_FILTER: {
      return {
        ...state,
        university: action.payload
      };
    }
    default: {
      return state;
    }
  }
};
export default filterReducer;
