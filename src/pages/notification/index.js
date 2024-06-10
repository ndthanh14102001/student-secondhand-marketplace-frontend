import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { IMAGE_SIZE_SMALL, getImageUrl } from "../../utils/image";
import {
  getNotificationMessageByNotificationType,
  handleReadAll,
  handleReadNotification,
  hasBeenRead,
} from "../../utils/notification";
import { formatDateToShow } from "../../utils/DateFormat";
import { useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags";
import LayoutOne from "../../layouts/LayoutOne";
import { Box } from "@mui/material";
const Notification = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const notifications = useSelector(
    (state) => state.notificationData.notifications
  );

  return (
    <Fragment>
      <MetaTags>
        <title>
          Chợ Sinh Viên - Website mua bán, trao đổi đồ dùng cho sinh viên
        </title>
        <meta
          name="description"
          content="Fashion home of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-1"
      >
        <Box sx={{ p: 2 }}>
          <div className="notify_header d-flex justify-content-between mb-2">
            <div className="title h2">Thông báo</div>
            {notifications?.length === 0 ? (
              ""
            ) : (
              <div
                className="event_read btn btn-primary"
                onClick={() => handleReadAll({ dispatch, notifications })}
                style={{ height: "fit-content" }}
              >
                Đánh dấu đọc tất cả
              </div>
            )}
          </div>
          <ul>
            {notifications?.length === 0 ? (
              <div className="notify_empty">Bạn không có thông báo nào </div>
            ) : (
              notifications?.map((item, index) => {
                const isReadNotification = hasBeenRead({ notification: item });
                const sender = item?.attributes?.sender?.data?.attributes;
                const product = item?.attributes?.product?.data;
                return (
                  <li
                    key={item?.id}
                    className={`${
                      isReadNotification ? "notify_read" : ""
                    } d-flex align-items-center mb-2`}
                    onClick={() =>
                      handleReadNotification({
                        history,
                        notificationId: item?.id,
                        product,
                      })
                    }
                  >
                    <div className="notify_avatar">
                      <Avatar
                        alt="avatar"
                        src={getImageUrl(
                          sender?.avatar?.data?.attributes,
                          IMAGE_SIZE_SMALL
                        )}
                      />
                    </div>
                    <div className="notify_data">
                      <div className="data">
                        <b>{sender?.fullName} </b>
                        {getNotificationMessageByNotificationType(
                          item?.attributes
                        )}{" "}
                        <b>{product?.attributes?.name}</b>
                      </div>
                      <div className="date">
                        {formatDateToShow(item?.attributes?.updatedAt)}
                      </div>
                    </div>
                    {isReadNotification ? (
                      ""
                    ) : (
                      <div className="notify_icon-read">
                        <Brightness1Icon
                          sx={{
                            fontSize: "15px",
                            color: "hsl(214, 89%, 52%)",
                          }}
                        />
                      </div>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </Box>
      </LayoutOne>
    </Fragment>
  );
};

export default Notification;
