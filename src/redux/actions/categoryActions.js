import { SET_CATEGORY_FILTER } from "../reducers/categoryReducer"

export const setCategoryFilter = (category) =>{
  return {
    type: SET_CATEGORY_FILTER,
    payload: category
  }
}