import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/actions/cartActions";
import { Box, Button, Card, ClickAwayListener, Typography } from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useToasts } from "react-toast-notifications";
import { clearUserLogin } from "../../utils/userLoginStorage";
import { logout } from "../../redux/actions/userStorageActions";
import { getUserLogin } from "../../utils/userLoginStorage";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import Avatar from '@mui/material/Avatar';
import { useEffect } from "react";
import Brightness1Icon from '@mui/icons-material/Brightness1';
import { io } from "socket.io-client";
import { setSocket as setSocketRedux } from "../../redux/actions/socketActions";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

const IconGroup = ({
  currency,
  cartData,
  wishlistData,
  // compareData,
  // deleteFromCart,
  iconWhiteClass,
}) => {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.userStorage.isLogin);
  const accountDropRef = useRef();
  const searchRef = useRef();
  const notificationRef = useRef();
  const history = useHistory();
  const user = getUserLogin()?.user;

  const [noti, setNoti] = useState([]);
  const [read, setRead] = useState([]);
  const [socket, setSocket] = useState(null);
  const [transition, setTransition] = React.useState(undefined);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const [messageSender, setMessageSender] = React.useState("");
  const [state, setState] = React.useState({
    open: false,
  });
  const { open } = state;
  // const [listIdRead, setListIdRead] = useState([]);

  const { addToast } = useToasts();
  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };
  const handleCloseAvatarDrop = () => {
    accountDropRef.current.classList.remove("active");
  };
  const handleCloseSearch = e => {
    searchRef.current.classList.remove("active");
  };
  const handleCloseBell = () => {
    notificationRef.current.classList.remove("active");
  }
  // const triggerMobileMenu = () => {
  //   const offcanvasMobileMenu = document.querySelector(
  //     "#offcanvas-mobile-menu"
  //   );
  //   offcanvasMobileMenu.classList.add("active");
  // };
  const handleLogout = () => {
    history.push(process.env.PUBLIC_URL)
    clearUserLogin();
    addToast("Đăng xuất thành công", {
      appearance: "success",
      autoDismiss: true
    });
    dispatch(logout());
    handleCloseAvatarDrop();
  }

  // const handleFetchData = async() => {
  async function handleFetchData() {
    let list = [];
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user?.id,
      method: "get",
      params: {
        populate: {
          followers: true,
          notification_reads: true
        }
      }
    })
    if (response.type === RESPONSE_TYPE) {
      let fl = response.data?.followers;
      fl.map((follower) => {
        list = list.concat(follower.id)
      })
      let reads = response.data?.notification_reads;
      reads.map((read) => {
        setRead(prev => prev.concat(read.id))
      })
      const response1 = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/notifications",
        method: "get",
        params: {
          populate: {
            from: {
              populate: {
                avatar: true
              }
            },
            reads: true
          },
          sort: {
            createdAt: "desc",
          },
          pagination: {
            limit: "10"
          }
        },
      })
      if (response1.type === RESPONSE_TYPE) {
        let listNoti = response1.data.data;
        setNoti(listNoti.filter((noti) => list.includes(noti.attributes?.from?.data?.id)))
      }
    }
  }

  function connectSocket() {
    const SERVER_URL = process.env.REACT_APP_SERVER_ENDPOINT;
    const setupSocket = io(SERVER_URL, {
      autoConnect: false
    });

    let tokenArr = getUserLogin().token.split(" ")
    setupSocket.auth = { token: tokenArr[1] }

    setupSocket.connect();

    setupSocket.on("disconnect", () => {
      console.log(socket.connected); // false
    });
    dispatch(setSocketRedux(setupSocket))
    setupSocket.on("connect", () => {
      setSocket(setupSocket)
    });

  }

  useEffect(() => {
    handleFetchData();
    if (user) {
      connectSocket();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("notification",(message) => {
        setMessageSender(message);  
      });
    }
  }, [socket]);

  useEffect(() => {
    const updateMessage = async () => {
        const response2 = await callApi({
          url: `${process.env.REACT_APP_API_ENDPOINT}/users/${messageSender?.from?.id}`,
          method: "get",
          params: {
            populate: {
              avatar: true,
            }
          }
        });
  
        if (response2.type === RESPONSE_TYPE) {
          const sender = {
            data: {
              id: response2?.data?.id,
              attributes: {
                fullName: response2?.data?.fullName,
                avatar: {
                  data: {
                    attributes: {
                      url: response2?.data?.avatar?.url ? response2?.data?.avatar?.url : "",
                    }
                  }
                }
              }
            }
          };
  
          const data = {
            id: messageSender?.id,
            attributes: {
              content: messageSender?.content,
              createdAt: messageSender?.createdAt,
              from: sender,
            }
          };
  
          setNoti(prevNoti => [data, ...prevNoti]);
          setState({ open: true });
          setTransition(() => TransitionUp);
  
          const messagesender = `${response2.data.fullName} vừa mới đăng bán ${getProduct(messageSender.content, 2)}`;
          setMessageInfo(messagesender);
        }
    };

    updateMessage();
  }, [messageSender]);
  

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleDate = (date) => {
    const inputDate = new Date(date);
    const now = new Date();
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const oneHourInMs = 1000 * 60 * 60;
    const oneMinuteInMs = 1000 * 60
    const diffInDays = Math.floor((now.getTime() - inputDate.getTime()) / oneDayInMs);
    const diffInHours = Math.floor((now.getTime() - inputDate.getTime()) / oneHourInMs);
    const diffInMinutes = Math.floor((now.getTime() - inputDate.getTime()) / oneMinuteInMs);
    if (diffInDays > 0)
      return `${diffInDays} ngày trước`;
    if (diffInHours > 0)
      return `${diffInHours} giờ trước`;
    if (diffInMinutes > 0)
      return `${diffInMinutes} phút trước`;
    return 'ngay bây giờ';
  }

  const handleReadNotification = async (id, link) => {

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/notifications/" + id,
      method: "get",
      params: {
        populate: {
          reads: true,
        }
      }
    })
    if (response.type === RESPONSE_TYPE) {
      let list = []
      let listIdRead = []
      list = response?.data?.data?.attributes?.reads?.data;
      list.map((item) => {
        listIdRead.push(item.id)
      })
      listIdRead.push(user?.id)
      const response1 = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/notifications/" + id,
        method: "put",
        data: {
          data: {
            reads: listIdRead,
          }
        },
      })
      if (response1.type === RESPONSE_TYPE) {
        history.push(process.env.PUBLIC_URL + "/product/" + link)
      }
    }
  }

  const isIdRead = (id) => read.includes(id);
  const unRead = noti.filter((item) => !read.includes(item.id));

  const handleReadAll = async () => {
    let list = []
    noti.map((item) => {
      list.push(item?.id)
      setRead(prev => prev.concat(item?.id))
    })

    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user?.id,
      method: "get",
      params: {
        populate: {
          notification_reads: true,
        }
      }
    })
    if (response.type === RESPONSE_TYPE) {
      let read = [];
      let read1 = response.data?.notification_reads
      read1.map((item) => {
        read.push(item.id)
      })
      let final = list.concat(read)
      const response1 = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + user?.id,
        method: "put",
        data: {
          notification_reads: final,
        }
      })
      if (response1.type === RESPONSE_TYPE) {
        addToast("đã đọc tất cả thông báo", {
          appearance: "success",
          autoDismiss: true
        });
      }
    }
  }
  const getProduct = (item, status) => {
    const parts = item.split(';');
    if (status === 1)
      return parts[0];
    return parts[1];
  }

  const handleClickDirect = () => {
    history.push(process.env.PUBLIC_URL + "/product/" + getProduct(messageSender.content, 1));
  }

  return (
    <div
      className={`header-right-wrap ${iconWhiteClass ? iconWhiteClass : ""}`}
    >
      <ClickAwayListener onClickAway={handleCloseSearch}>
        <div className="same-style header-search d-none d-lg-block">
          <button className="search-active" onClick={e => handleClick(e)}>
            <i className="pe-7s-search" />
          </button>
          <div className="search-content" ref={searchRef}>
            <form action="#">
              <input type="text" placeholder="Search" />
              <button className="button-search">
                <i className="pe-7s-search" />
              </button>
            </form>
          </div>
        </div>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={handleCloseAvatarDrop}>
        <div className="same-style account-setting d-none d-lg-block">
          <button
            className="account-setting-active"
            onClick={handleClick}
          >
            <i className="pe-7s-user-female" />
          </button>

          <div className="account-dropdown" ref={accountDropRef}>
            <ul>
              {!isLogin && <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>Đăng nhập</Link>
              </li>}
              {!isLogin && <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  Đăng ký
                </Link>
              </li>}
              {isLogin && <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  Thông tin của tôi
                </Link>
              </li>}
              {isLogin && <li>
                <Link to={process.env.PUBLIC_URL + "/my-products"}>
                  Sản phẩm của tôi
                </Link>
              </li>}
              {isLogin && <li>
                <p onClick={handleLogout} className="action">Đăng xuất</p>
              </li>}
            </ul>
          </div>

        </div>
      </ClickAwayListener>
      {/* <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareData && compareData.length ? compareData.length : 0}
          </span>
        </Link>
      </div> */}
      {isLogin &&
        <ClickAwayListener onClickAway={handleCloseBell}>
          <div className="same-style account-setting d-none d-lg-block" >
            <button
              className="account-setting-active"
              onClick={handleClick}
            >
              {/* <i className="pe-7s-bell" onClick={handleFetchData}/> */}
              <i className="pe-7s-bell" />
              <span className="count-styles">
                {unRead && unRead.length ? unRead.length : 0}
              </span>
            </button>
            <div className="account-dropdown Dropdown-underLine notification_dd" ref={notificationRef} style={{ width: '400px' }} >
              <div className="notify_header">
                <div className="title">Thông báo</div>
                {noti.length === 0 ? "" : <div className="event_read" onClick={() => handleReadAll()}>đánh dấu đọc tất cả</div>}
              </div>
              <ul>
                {
                  noti.length === 0 ? (<div className='notify_empty'>Bạn không có thông báo nào </div>):
                  noti.map((item, index) => (
                    <li key={index} className={isIdRead(item?.id) ? "notify_read" : ""} onClick={() => handleReadNotification(item?.id, getProduct(item?.attributes?.content,1))}>
                      
                      <div className="notify_avatar">
                        <Avatar 
                          alt="avatar" 
                          src={item?.attributes?.from?.data?.attributes?.avatar?.data?.attributes?.url ? 
                            (process.env.REACT_APP_SERVER_ENDPOINT + item?.attributes?.from?.data?.attributes?.avatar?.data?.attributes?.url) 
                            : "abc"
                          } 
                        />  
                      </div>
                      <div className="notify_data">
                        <div className="data">
                          <b>{item?.attributes?.from?.data?.attributes?.fullName} </b> đăng bán <b>{getProduct(item?.attributes?.content,2)}</b> 
                        </div>
                        <div className="date">
                          {handleDate(item?.attributes?.updatedAt)}
                        </div>
                      </div>
                      { 
                        isIdRead(item?.id) ? 
                        "" : 
                        <div className="notify_icon-read">
                          <Brightness1Icon sx={{ fontSize: '15px', color: 'hsl(214, 89%, 52%)' }} />
                        </div>
                      }
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </ClickAwayListener>
      }
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistData && wishlistData.length ? wishlistData.length : 0}
          </span>
        </Link>
      </div>
      {isLogin && <div className="same-style">
        <Button
          onClick={() => history.push(process.env.PUBLIC_URL + "/product-post")}
          className="header-post-product"
          sx={{
            fontSize: "1rem",
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
          variant="contained"
          startIcon={<PostAddIcon />}
        >Đăng bán</Button>
      </div>}
      {/* <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartData && cartData.length ? cartData.length : 0}
          </span>
        </Link>
      </div> */}
      {/* <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div> */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        onClose={handleClose}
        autoHideDuration={6000}
        message=" "
        TransitionComponent={transition}
        key={'bottom right'}
        ContentProps={{
          sx: {
            backgroundColor: "white",
            color: "black",
            width: "200px",
            flexWrap: "nowrap",
            flexDirection: "row"
          }
        }}
      >
        <Card sx={{ minWidth: '275px', display: 'flex', p: 2 }}>
          <Box 
          onClick={handleClickDirect} 
          sx={{ 
            width: '275px', 
            cursor: 'pointer',
            '&:hover': {
              '& .MuiTypography-root': {
                color: '#A749FF', 
              },
            }, 
          }} 
          >
            <Typography>
              {messageInfo ? messageInfo : undefined}
            </Typography>
          </Box>
          <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
          </IconButton>
        </Card>
      </Snackbar>
    </div >
  );
};

IconGroup.propTypes = {
  cartData: PropTypes.array,
  compareData: PropTypes.array,
  currency: PropTypes.object,
  iconWhiteClass: PropTypes.string,
  deleteFromCart: PropTypes.func,
  wishlistData: PropTypes.array
};

const mapStateToProps = state => {
  return {
    currency: state.currencyData,
    cartData: state.cartData,
    wishlistData: state.wishlistData,
    compareData: state.compareData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    deleteFromCart: (item, addToast) => {
      dispatch(deleteFromCart(item, addToast));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(IconGroup);
