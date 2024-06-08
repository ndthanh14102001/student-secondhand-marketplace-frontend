/* eslint-disable default-case */
import {
  NOTIFICATION_NEW_PRODUCT_TYPE,
  NOTIFICATION_NEW_COMMENT_TYPE,
} from "../constants";

const getNotificationMessageByNotificationType = (notification) => {
  switch (notification?.type) {
    case NOTIFICATION_NEW_PRODUCT_TYPE:
      return "đăng bán";
    case NOTIFICATION_NEW_COMMENT_TYPE:
      return "đã bình luận vào";
  }
  return "";
};
export { getNotificationMessageByNotificationType };
