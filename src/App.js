import PropTypes from "prop-types";
import React, { useEffect, Suspense, lazy, useState } from "react";
import ScrollToTop from "./utils/scroll-top.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { multilanguage, loadLanguages } from "redux-multilanguage";
import { connect, useDispatch, useSelector } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";
import ThemeProvider from "./theme";
import ChatBubble from "./components/chat-bubble";
// import ModalLoading from "./components/modal-loading";
import Popup from "./components/popup";
import PopupErrorBase from "./components/popup-error-base";
import { onClosePopupErrorBase } from "./redux/actions/popupErrorBaseActions";
import { getUserLogin } from "./utils/userLoginStorage";
import { login, logout } from "./redux/actions/userStorageActions";
import wishlistApi from "./api/wishlist-api";
import { RESPONSE_TYPE } from "./utils/callApi";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "./redux/actions/modalLoadingActions";
import { setWishlist } from "./redux/actions/wishlistActions";
import ConnectSocket from "./components/socket-connection/ConnectSocket.js";

const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));

const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));
const Product = lazy(() => import("./pages/shop-product/Product"));

const Chat = lazy(() => import("./pages/chat/index.js"));

const MyAccount = lazy(() => import("./pages/MyAccount"));

const MyProducts = lazy(() => import("./pages/my-products"));
const ProductPost = lazy(() => import("./pages/product-post"));
const ProductUpdate = lazy(() => import("./pages/product-update"));

const UserInfo = lazy(() => import("./pages/user-info"));
const LoginAndRegister = lazy(() => import("./pages/LoginAndRegister"));
const ForgotPassword = lazy(() => import("./pages/forgot-password"));

const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

const NotFound = lazy(() => import("./pages/NotFound"));

const App = (props) => {
  const dispatch = useDispatch();

  const isLogin = useSelector((state) => state.userStorage.isLogin);

  const popup = useSelector((state) => state.popup);
  const modalLoading = useSelector((state) => state.modalLoading);
  const popupErrorBase = useSelector((state) => state.popupErrorBase);
  const chatBubble = useSelector((state) => state.chatBubble);

  const loggedInUser = getUserLogin()?.user;

  //UseState NavigateUserInChat
  const [selectedChatPartner, setSelectedChatPartner] = useState();
  const handleNavigateChats = (partnerID) => {
    setSelectedChatPartner(partnerID);
  };

  useEffect(() => {
    const getWishlist = async () => {
      dispatch(onOpenModalLoading());
      const response = await wishlistApi.getWishlistPopulateAll();
      if (response.type === RESPONSE_TYPE) {
        dispatch(setWishlist(response.data?.product_likes || []));
      }
      dispatch(onCloseModalLoading());
    };
    if (loggedInUser) {
      getWishlist();
    }
  }, [isLogin]);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(login());
    } else {
      dispatch(logout());
    }
    props.dispatch(
      loadLanguages({
        languages: {
          en: require("./translations/english.json"),
          fn: require("./translations/french.json"),
          de: require("./translations/germany.json"),
        },
      })
    );
  });
  return (
    <ThemeProvider>
      <ConnectSocket />
      <Popup
        isOpen={popup.open}
        onClose={popup.actions.closeAction}
        onButtonClick={popup.actions.clickOkeAction}
        type={popup.type}
        title={popup.title}
        isShowButtonCancel={popup.showButtonCancel}
        onButtonCancelClick={popup.actions.clickCancelButton}
        content={popup.content}
      />

      {modalLoading.open && (
        <div className="flone-preloader-wrapper">
          <div className="flone-preloader">
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <ToastProvider placement="bottom-left">
        <BreadcrumbsProvider>
          <Router>
            <PopupErrorBase
              open={popupErrorBase.open}
              onClose={() => {
                props.dispatch(onClosePopupErrorBase());
              }}
              type={popupErrorBase.type}
              title={popupErrorBase.title}
              content={popupErrorBase.content}
            />
            <ScrollToTop>
              <Suspense
                fallback={
                  <div className="flone-preloader-wrapper">
                    <div className="flone-preloader">
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                }
              >
                {chatBubble?.isShow && (
                  <ChatBubble selectedChatPartner={selectedChatPartner} />
                )}
                <Switch>
                  <Route
                    exact
                    path={process.env.PUBLIC_URL + "/"}
                    component={HomeFashion}
                  />

                  {/* Homepages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/home-fashion"}
                    component={HomeFashion}
                  />

                  {/* Shop pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/category"}
                    component={ShopGridStandard}
                  />

                  {/* Chat pages */}
                  {loggedInUser !== undefined ? (
                    <Route
                      path={process.env.PUBLIC_URL + "/chat/:id"}
                      render={(routeProps) => <Chat />}
                    />
                  ) : (
                    <Route
                      path={process.env.PUBLIC_URL + "/chat"}
                      component={LoginAndRegister}
                    />
                  )}

                  {loggedInUser !== undefined && (
                    <Route
                      path={process.env.PUBLIC_URL + "/chat"}
                      render={(routeProps) => (
                        <Chat
                          {...routeProps}
                          key={routeProps.match.params.id}
                          parentHandleNavigateChats={handleNavigateChats}
                        />
                      )}
                    />
                  )}

                  {/* Shop product pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/product/:id"}
                    render={(routeProps) => (
                      <Product
                        {...routeProps}
                        key={routeProps.match.params.id}
                      />
                    )}
                  />

                  {/* Other pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/my-account"}
                    component={MyAccount}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/my-products"}
                    component={MyProducts}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/product-post"}
                    component={ProductPost}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/product-update/:id"}
                    render={(routeProps) => (
                      <ProductUpdate
                        {...routeProps}
                        key={routeProps.match.params.id}
                        updatePage={true}
                      />
                    )}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/user/info/:id"}
                    render={(routeProps) => (
                      <UserInfo
                        {...routeProps}
                        key={routeProps.match.params.id}
                      />
                    )}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/login-register"}
                    component={LoginAndRegister}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/forgot-password"}
                    component={ForgotPassword}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/cart"}
                    component={Cart}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/wishlist"}
                    component={Wishlist}
                  />

                  <Route
                    path={process.env.PUBLIC_URL + "/not-found"}
                    component={NotFound}
                  />
                  {/* <Route
                    path={process.env.PUBLIC_URL + "/test"}
                    component={DistanceCalculator}
                  /> */}
                  <Route exact component={NotFound} />
                </Switch>
              </Suspense>
            </ScrollToTop>
          </Router>
        </BreadcrumbsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

App.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(multilanguage(App));
