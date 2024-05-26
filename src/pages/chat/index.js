import ChatsNavigator from "./ChatNavigator";
import ChatFrame from "./ChatFrame";
import React, { Fragment, useEffect, useState } from "react";
import LayoutOne from "../../layouts/LayoutOne";
import { MetaTags } from "react-meta-tags";
import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { useDispatch, useSelector } from "react-redux";
import { onCloseModalLoading } from "../../redux/actions/modalLoadingActions";

function ChatsFrame(props) {
  const { parentHandleNavigateChats, match } = props;
  const dispatch = useDispatch();
  const setupSocket = useSelector((state) => state.socket.socket);
  // const { pathname } = useLocation();
  // const attributes = product?.attributes;
  const userLoginData = getUserLogin()?.user;

  // Thông tin người bán hiện tại
  const [user, setUser] = useState();

  // Mảng tin nhắn từ mọi người tới người đăng nhập hiện tại
  const [incomingFromSocket, setincomingFromSocket] = useState();
  const [isNotCalledYet, setIsNotCalledYet] = useState(true);
  const [inComingMessage, setIncomingMessage] = useState();

  const handleChangeSeller = (info) => {
    setUser(info);
  };

  //After change partner, the unread messages become read
  const handleNavigateChats = (partnerID) => {
    if (inComingMessage !== undefined) {
      setIncomingMessage((prev) => {
        return prev?.map((item) => {
          if (
            item.attributes.from.data.id === partnerID &&
            !item.attributes.read
          ) {
            return {
              ...item,
              attributes: {
                ...item.attributes,
                read: true,
              },
            };
          }
          return item;
        });
      });
      parentHandleNavigateChats(partnerID);
    }
  };

  //Update new message to IncomingMessage
  const onUpdateUnreadChat = (input) => {
    setincomingFromSocket(input);
    setIncomingMessage((prev) => [...prev, input]);
  };

  //Tắt cái modal loading
  useEffect(() => {
    dispatch(onCloseModalLoading());
  }, []);

  // Lấy thông tin người bán hiện tại theo id
  useEffect(() => {
    const getUserInfo = async () => {
      const userId = match?.params?.id;

      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
        method: "get",
      });
      if (response.type === RESPONSE_TYPE) {
        setUser(response.data);
      }
    };

    if (match !== undefined) {
      getUserInfo();
    }
  }, []);

  // các hàm phải chạy 1 lần khi khởi tạo component
  useEffect(() => {
    if (userLoginData !== undefined && isNotCalledYet) {
      getChatsRelatedToLoggedInPerson();
      setIsNotCalledYet(false);
    }
  }, [userLoginData]);

  //Lấy tin nhắn của tất cả mọi người gửi cho đến NGƯỜI ĐĂNG NHẬP
  const getChatsRelatedToLoggedInPerson = async () => {
    const response = await callApi({
      url:
        process.env.REACT_APP_API_ENDPOINT +
        `/chats?pagination[page]=1&pagination[pageSize]=100&filters[to][id][$eq]=${userLoginData.id}&populate=*`,
      method: "get",
    });
    if (response.type === RESPONSE_TYPE) {
      if (match.params.id !== undefined) {
        setIncomingMessage(
          response.data.data?.map((item) => {
            if (item.attributes.from.data.id === match.params.id) {
              return {
                ...item,
                attributes: {
                  ...item.attributes,
                  read: true,
                },
              };
            }
            return item;
          })
        );
      } else {
        setIncomingMessage(response.data.data);
      }
    }
  };

  return (
    <Fragment>
      <MetaTags>
        <title>Student Market | Trò chuyện</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      {/* <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Chat với người bán
      </BreadcrumbsItem> */}
      <LayoutOne headerTop="visible">
        {/* <Breadcrumb /> */}
        <div className="product-area pt-60 pb-60" style={{ padding: 0 }}>
          <div className="container" style={{ margin: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <div style={{ margin: "8px" }}>
                <ChatsNavigator
                  handleChangeSeller={handleChangeSeller}
                  userLoginData={userLoginData}
                  inComingMessage={inComingMessage}
                  incomingFromSocket={incomingFromSocket}
                  sellerData={user}
                />
              </div>
              <div style={{ marginLeft: "8px", marginTop: "8px" }}>
                {setupSocket !== null && (
                  <ChatFrame
                    sellerData={user}
                    userLoginData={userLoginData}
                    socket={setupSocket}
                    isPartnerDeclared={
                      match?.params?.id !== undefined || user !== undefined
                    }
                    handleNavigateChats={handleNavigateChats}
                    onUpdateUnreadChat={onUpdateUnreadChat}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
}

export default ChatsFrame;
