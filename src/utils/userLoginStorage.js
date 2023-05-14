import Cookies from "universal-cookie";
export const KEY = "userlogin";

export const getAccountExpiresBase = () => {
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + 30);
  return expiresDate;
};
export const noRememberLogin = (token, info) => {
  const cookies = new Cookies();
  cookies.set(KEY, { token: "Bearer " + token, user: info }, { path: "/" });
};
export const rememberLogin = (token, info) => {
  const cookies = new Cookies();
  cookies.set(KEY, { token: "Bearer " + token, user: info }, { expires: getAccountExpiresBase(), path: "/" });
};

export const updateUser = (newInfo) => {
  const cookies = new Cookies();
  const existingData = cookies.get(KEY);
  if (existingData) {
    const updatedData = { ...existingData, user: newInfo };
    cookies.set(KEY, updatedData, { expires: getAccountExpiresBase(), path: "/" });
  }
};

export const getUserLogin = () => {
  const cookies = new Cookies();

  const userCookies = cookies.get(KEY);
  if (userCookies) {
    return userCookies;
  }
  return null;
};

export const clearUserLogin = () => {
  const cookies = new Cookies();
  cookies.remove(KEY, { path: "/" });
};
