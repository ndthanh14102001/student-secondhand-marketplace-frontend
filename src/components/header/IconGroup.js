import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/actions/cartActions";
import {
  Box,
  Button,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  useThemeProps,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { getUserLogin } from "../../utils/userLoginStorage";
import { RESPONSE_TYPE } from "../../utils/callApi";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import { NOTIFICATION } from "../../constants/notification/constants";
import notificationApi from "../../api/notification";
import { IMAGE_SIZE_SMALL, getImageUrl } from "../../utils/image";
import { v4 } from "uuid";
import {
  getNotificationMessageByNotificationType,
  handleReadAll,
  handleReadNotification,
  hasBeenRead,
} from "../../utils/notification";
import { formatDateToShow } from "../../utils/DateFormat";
import {
  addNotificationToTop,
  addUnreadNotification,
  setNotifications,
  setUnreadNotifications,
} from "../../redux/actions/notificationActions";

const IconGroup = ({
  wishlistData,
  iconWhiteClass,
  handleLogout,
  handleSearch,
}) => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.userStorage.isLogin);
  const socket = useSelector((state) => state?.socket?.socket);
  const accountDropRef = useRef();
  const searchRef = useRef();
  const notificationRef = useRef();
  const history = useHistory();
  const theme = useTheme();
  const isMobilePhone = useMediaQuery(theme.breakpoints.down("md"));
  const notifications = useSelector(
    (state) => state.notificationData.notifications
  );
  const unreadNotifications = useSelector(
    (state) => state.notificationData.unreadNotifications
  );

  // const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleClick = (e) => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };
  const handleCloseAvatarDrop = () => {
    accountDropRef.current.classList.remove("active");
  };
  const handleCloseSearch = (e) => {
    searchRef.current.classList.remove("active");
  };
  const handleCloseBell = () => {
    notificationRef.current.classList.remove("active");
  };
  // const triggerMobileMenu = () => {
  //   const offcanvasMobileMenu = document.querySelector(
  //     "#offcanvas-mobile-menu"
  //   );
  //   offcanvasMobileMenu.classList.add("active");
  // };

  // const handleFetchData = async() => {
  async function getNotifications() {
    const response = await notificationApi.getAll();
    if (response.type === RESPONSE_TYPE) {
      dispatch(setNotifications(response.data?.data || []));
    }
  }
  async function getUnReadNotifications() {
    const response = await notificationApi.getUnreadNotifications();
    if (response.type === RESPONSE_TYPE) {
      dispatch(setUnreadNotifications(response.data || []));
    }
  }

  useEffect(() => {
    getNotifications();
    getUnReadNotifications();
  }, []);

  useEffect(() => {
    const convertReceivedNotificationInSocketToNotifcation = (notification) => {
      const sender = notification?.sender;
      const product = notification?.product;
      return {
        id: notification?.id,
        attributes: {
          createdAt: Date.now(),
          type: notification?.type,
          updatedAt: Date.now(),
          publishedAt: Date.now(),
          sender: {
            data: {
              id: sender?.id,
              attributes: {
                username: sender?.username,
                fullName: sender?.fullName,
                createdAt: "2024-05-07T17:52:35.700Z",
                updatedAt: "2024-05-29T04:46:52.580Z",
                avatar: {
                  data: {
                    id: v4(),
                    attributes: sender?.avatar,
                  },
                },
              },
            },
          },
          readUsers: {
            data: [],
          },
          product: {
            data: {
              id: product?.id,
              attributes: product,
            },
          },
        },
      };
    };
    if (socket) {
      socket.on(NOTIFICATION, (message) => {
        console.log("notifications", notifications);
        dispatch(
          addNotificationToTop(
            convertReceivedNotificationInSocketToNotifcation(message)
          )
        );
        dispatch(addUnreadNotification(message));
      });
      return () => {
        socket.off(NOTIFICATION);
      };
    }
  }, [socket]);
  // const handleReadNotification = async (notificationId, product) => {
  //   const response = await notificationApi.read(notificationId);
  //   if (response.type === RESPONSE_TYPE) {
  //     history.push(process.env.PUBLIC_URL + "/product/" + product?.id);
  //   }
  // };

  // const handleReadAll = async () => {
  //   const response = await notificationApi.readAll();
  //   if (response.type === RESPONSE_TYPE) {
  //     const newNotifications = [];
  //     for (let index = 0; index < notifications.length; index++) {
  //       const oldNotification = notifications[index];
  //       oldNotification?.attributes?.readUsers?.data?.push(user);
  //       newNotifications.push(oldNotification);
  //     }
  //     dispatch(setNotifications(newNotifications));
  //     dispatch(setUnreadNotifications([]));
  //   }
  // };

  const handleClickSearch = (e) => {
    e.preventDefault();
    handleSearch(searchValue);
  };

  // const hasBeenRead = (notification) => {
  //   return notification?.attributes?.readUsers?.data?.some((readUser) => {
  //     return readUser?.id === user?.id;
  //   });
  // };
  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu?.classList?.add("active");
  };
  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      <ClickAwayListener onClickAway={handleCloseSearch}>
        <div className="same-style header-search d-none d-lg-block">
          <button className="search-active" onClick={(e) => handleClick(e)}>
            <i className="pe-7s-search" />
          </button>
          <div className="search-content" ref={searchRef}>
            <form onSubmit={handleClickSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className="button-search"
                onClick={handleClickSearch}
                type="submit"
              >
                <i className="pe-7s-search" />
              </button>
            </form>
          </div>
        </div>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={handleCloseAvatarDrop}>
        <div className="same-style account-setting d-none d-lg-block">
          <button className="account-setting-active" onClick={handleClick}>
            <i className="pe-7s-user-female" />
          </button>

          <div className="account-dropdown" ref={accountDropRef}>
            <ul>
              {!isLogin && (
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Đăng nhập
                  </Link>
                </li>
              )}
              {!isLogin && (
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>
                    Đăng ký
                  </Link>
                </li>
              )}
              {isLogin && (
                <li>
                  <Link to={process.env.PUBLIC_URL + "/my-account"}>
                    Thông tin của tôi
                  </Link>
                </li>
              )}
              {isLogin && (
                <li>
                  <Link to={process.env.PUBLIC_URL + "/my-products"}>
                    Sản phẩm của tôi
                  </Link>
                </li>
              )}
              {isLogin && (
                <li>
                  <p onClick={handleLogout} className="action">
                    Đăng xuất
                  </p>
                </li>
              )}
            </ul>
          </div>
        </div>
      </ClickAwayListener>
      {isLogin && (
        <div className="same-style header-wishlist d-block d-lg-none">
          <Link to={process.env.PUBLIC_URL + "/chat"}>
            <i className="pe-7s-chat" />
            <span className="count-style">
              {wishlistData && wishlistData?.length ? wishlistData?.length : 0}
            </span>
          </Link>
        </div>
      )}
      {isLogin && (
        <ClickAwayListener onClickAway={handleCloseBell}>
          <div className="same-style account-setting ">
            <button
              className="account-setting-active"
              onClick={
                isMobilePhone
                  ? () => history.push("/notification")
                  : handleClick
              }
            >
              {/* <i className="pe-7s-bell" onClick={handleFetchData}/> */}
              <i className="pe-7s-bell" />
              {unreadNotifications?.length > 0 && (
                <span className="count-styles">
                  {unreadNotifications?.length || 0}
                </span>
              )}
            </button>
            <div
              className="account-dropdown Dropdown-underLine notification_dd"
              ref={notificationRef}
              style={{ width: "400px" }}
            >
              <div className="notify_header">
                <div className="title">Thông báo</div>
                {notifications?.length === 0 ? (
                  ""
                ) : (
                  <div
                    className="event_read"
                    onClick={() => handleReadAll({ dispatch, notifications })}
                  >
                    đánh dấu đọc tất cả
                  </div>
                )}
              </div>
              <ul>
                {notifications?.length === 0 ? (
                  <div className="notify_empty">
                    Bạn không có thông báo nào{" "}
                  </div>
                ) : (
                  notifications?.map((item, index) => {
                    const isReadNotification = hasBeenRead({
                      notification: item,
                    });
                    const sender = item?.attributes?.sender?.data?.attributes;
                    const product = item?.attributes?.product?.data;
                    return (
                      <li
                        key={item?.id}
                        className={isReadNotification ? "notify_read" : ""}
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
            </div>
          </div>
        </ClickAwayListener>
      )}

      {isLogin && (
        <div className="same-style header-wishlist">
          <Link to={process.env.PUBLIC_URL + "/wishlist"}>
            <i className="pe-7s-like" />
            <span className="count-style">
              {wishlistData && wishlistData?.length ? wishlistData?.length : 0}
            </span>
          </Link>
        </div>
      )}
      {isLogin && (
        <Box
          className="same-style"
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <Button
            onClick={() =>
              history.push(process.env.PUBLIC_URL + "/product-post")
            }
            className="header-post-product"
            sx={{
              fontSize: "1rem",
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              backgroundColor: (theme) => theme.palette.primary.main,
            }}
            variant="contained"
            startIcon={<PostAddIcon />}
          >
            Đăng bán
          </Button>
        </Box>
      )}
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
