import { PRICE_DEFAULT_SORT } from "../../components/product/ShopTopAction";

export const SET_CATEGORY_FILTER = "SET_CATEGORY_FILTER";
export const SET_UNVERSITY_FILTER = "SET_UNVERSITY_FILTER";
export const SET_NAME_FILTER = "SET_NAME_FILTER";
export const SET_SORT_PRICE_FILTER = "SET_SORT_PRICE_FILTER";
export const filterInitState = {
  category: {

  },
  university: "",
  name: "",
  sort: {
    price: PRICE_DEFAULT_SORT
  }
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
    case SET_NAME_FILTER: {
      return {
        ...state,
        name: action.payload
      };
    }
    case SET_SORT_PRICE_FILTER: {
      return {
        ...state,
        sort: {
          ...state.sort,
          price: action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};
export default filterReducer;
