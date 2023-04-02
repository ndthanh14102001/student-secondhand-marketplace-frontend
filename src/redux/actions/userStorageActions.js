import { LOGIN, LOGOUT } from "../reducers/userStorage"

export const login = () => {
  return {
    type: LOGIN
  }
}
export const logout = () => {
  return {
    type: LOGOUT
  }
}