import { SET_CATEGORY_FILTER, SET_UNVERSITY_FILTER } from "../reducers/filterReducer"

export const setCategoryFilter = (category) => {
  return {
    type: SET_CATEGORY_FILTER,
    payload: category
  }
}
export const setUnversityFilter = university => {
  return {
    type: SET_UNVERSITY_FILTER,
    payload: university
  }
}