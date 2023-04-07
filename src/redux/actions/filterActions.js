import * as constants from "../reducers/filterReducer"

export const setCategoryFilter = (category) => {
  return {
    type: constants.SET_CATEGORY_FILTER,
    payload: category
  }
}
export const setUnversityFilter = university => {
  return {
    type: constants.SET_UNVERSITY_FILTER,
    payload: university
  }
}
export const setNameFilter = name => {
  return {
    type: constants.SET_NAME_FILTER,
    payload: name
  }
}
export const setSortPriceFilter = type => {
  return {
    type: constants.SET_SORT_PRICE_FILTER,
    payload: type
  }
}