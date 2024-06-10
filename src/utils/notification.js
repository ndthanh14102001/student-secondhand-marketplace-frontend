/* eslint-disable default-case */
import notificationApi from "../api/notification";
import {
  NOTIFICATION_NEW_PRODUCT_TYPE,
  NOTIFICATION_NEW_COMMENT_TYPE,
} from "../constants";
import {
  setNotifications,
  setUnreadNotifications,
} from "../redux/actions/notificationActions";
import { RESPONSE_TYPE } from "./callApi";
import { getUserLogin } from "./userLoginStorage";

const getNotificationMessageByNotificationType = (notification) => {
  switch (notification?.type) {
    case NOTIFICATION_NEW_PRODUCT_TYPE:
      return "đăng bán";
    case NOTIFICATION_NEW_COMMENT_TYPE:
      return "đã bình luận vào";
  }
  return "";
};

const handleReadAll = async ({ notifications, dispatch }) => {
  const loggedInUser = getUserLogin()?.user;
  const response = await notificationApi.readAll();
  if (response.type === RESPONSE_TYPE) {
    const newNotifications = [];
    for (let index = 0; index < notifications.length; index++) {
      const oldNotification = notifications[index];
      oldNotification?.attributes?.readUsers?.data?.push(loggedInUser);
      newNotifications.push(oldNotification);
    }
    dispatch(setNotifications(newNotifications));
    dispatch(setUnreadNotifications([]));
  }
};

const hasBeenRead = ({ notification }) => {
  const loggedInUser = getUserLogin()?.user;
  return notification?.attributes?.readUsers?.data?.some((readUser) => {
    return readUser?.id === loggedInUser?.id;
  });
};

const handleReadNotification = async ({ notificationId, product, history }) => {
  const response = await notificationApi.read(notificationId);
  if (response.type === RESPONSE_TYPE) {
    history.push(process.env.PUBLIC_URL + "/product/" + product?.id);
  }
};
export {
  getNotificationMessageByNotificationType,
  handleReadNotification,
  hasBeenRead,
  handleReadAll,
};
