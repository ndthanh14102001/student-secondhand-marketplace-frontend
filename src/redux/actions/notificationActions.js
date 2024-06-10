import {
  SET_NOTIFICATION,
  SET_UNREAD_NOTIFICATION,
  ADD_NOTIFICATION_TO_TOP,
  ADD_UNREAD_NOTIFICATION,
} from "../reducers/notification";

const setNotifications = (notifications) => {
  return {
    type: SET_NOTIFICATION,
    payload: notifications,
  };
};

const addNotificationToTop = (notification) => {
  return {
    type: ADD_NOTIFICATION_TO_TOP,
    payload: notification,
  };
};
const setUnreadNotifications = (unreadNotifications) => {
  return {
    type: SET_UNREAD_NOTIFICATION,
    payload: unreadNotifications,
  };
};
const addUnreadNotification = (unreadNotification) => {
  return {
    type: ADD_UNREAD_NOTIFICATION,
    payload: unreadNotification,
  };
};
export {
  setNotifications,
  setUnreadNotifications,
  addNotificationToTop,
  addUnreadNotification,
};
