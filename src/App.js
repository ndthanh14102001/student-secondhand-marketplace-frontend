import PropTypes from "prop-types";
import React, { useEffect, Suspense, lazy, useState } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
import { multilanguage, loadLanguages } from "redux-multilanguage";
import { connect, useDispatch, useSelector } from "react-redux";
import { BreadcrumbsProvider } from "react-breadcrumbs-dynamic";
import ThemeProvider from "./theme";
import ChatBubble from "./components/chat-bubble";
// import ModalLoading from "./components/modal-loading";
import Popup from "./components/Popup";
import PopupErrorBase from "./components/popup-error-base";
import { onClosePopupErrorBase } from "./redux/actions/popupErrorBaseActions";
import { getUserLogin } from "./utils/userLoginStorage";
import { login, logout } from "./redux/actions/userStorageActions"
const DistanceCalculator = lazy(() => import("./test-google"));
const SwipeableTextMobileStepper = lazy(() => import("./test-image-carousel"));
// Get user data
// const user = getUserLogin();

// home pages
const HomeFashion = lazy(() => import("./pages/home/HomeFashion"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));

// chat pages
const Chat = lazy(() => import("./pages/chat/index.js"));

// blog pages
const BlogStandard = lazy(() => import("./pages/blog/BlogStandard"));
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogRightSidebar = lazy(() => import("./pages/blog/BlogRightSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const MyProducts = lazy(() => import("./pages/other/my-products"));
const ProductPost = lazy(() => import("./pages/product-post"));
const ProductUpdate = lazy(() => import("./pages/product-update"));
const UserInfo = lazy(() => import("./pages/user-info"));

const LoginAndRegister = lazy(() => import("./pages/other/LoginAndRegister"));
const ForgotPassword = lazy(() => import("./pages/other/forgot-password"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = (props) => {
  const dispatch = useDispatch();

  const popup = useSelector(state => state.popup);
  const modalLoading = useSelector(state => state.modalLoading);
  const popupErrorBase = useSelector(state => state.popupErrorBase);

  // [DON'T DELETE THIS] This line exist to check if user is logged in yet
  const user = getUserLogin()?.user;

  //UseState NavigateUserInChat
  const [selectedChatPartner, setSelectedChatPartner] = useState();
  const handleNavigateChats = (partnerID) => {
    setSelectedChatPartner(partnerID)
  }


  useEffect(() => {
    if (user) {
      dispatch(login())
    } else {
      dispatch(logout())
    }
    props.dispatch(
      loadLanguages({
        languages: {
          en: require("./translations/english.json"),
          fn: require("./translations/french.json"),
          de: require("./translations/germany.json")
        }
      })
    );
  });
  return (
    <ThemeProvider>
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

      {/* <ModalLoading open={modalLoading.open} /> */}
      {modalLoading.open && < div className="flone-preloader-wrapper">
        <div className="flone-preloader">
          <span></span>
          <span></span>
        </div>
      </div>}
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
                <ChatBubble selectedChatPartner={selectedChatPartner}/>
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
                  {user !== undefined ?
                    <Route
                      path={process.env.PUBLIC_URL + "/chat/:id"}
                      render={(routeProps) => (
                        <Chat {...routeProps} key={routeProps.match.params.id} parentHandleNavigateChats={handleNavigateChats} />
                      )}
                    />
                    :
                    <Route
                      path={process.env.PUBLIC_URL + "/chat"}
                      component={LoginAndRegister}
                    />}

                  {user !== undefined &&
                    <Route
                      path={process.env.PUBLIC_URL + "/chat"}
                      render={(routeProps) => (
                        <Chat {...routeProps} key={routeProps.match.params.id} parentHandleNavigateChats={handleNavigateChats} />
                      )}
                    />}


                  {/* Shop product pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/product/:id"}
                    render={(routeProps) => (
                      <Product {...routeProps} key={routeProps.match.params.id} />
                    )}
                  />

                  {/* Blog pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/blog-standard"}
                    component={BlogStandard}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
                    component={BlogNoSidebar}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
                    component={BlogRightSidebar}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/blog-details-standard"}
                    component={BlogDetailsStandard}
                  />

                  {/* Other pages */}
                  <Route
                    path={process.env.PUBLIC_URL + "/about"}
                    component={About}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/contact"}
                    component={Contact}
                  />
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
                      <ProductUpdate {...routeProps} key={routeProps.match.params.id} updatePage={true} />
                    )}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/user/info/:id"}
                    render={(routeProps) => (
                      <UserInfo {...routeProps} key={routeProps.match.params.id} />
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
                    path={process.env.PUBLIC_URL + "/compare"}
                    component={Compare}
                  />
                  <Route
                    path={process.env.PUBLIC_URL + "/checkout"}
                    component={Checkout}
                  />

                  <Route
                    path={process.env.PUBLIC_URL + "/not-found"}
                    component={NotFound}
                  />
                  {/* <Route
                    path={process.env.PUBLIC_URL + "/test"}
                    component={DistanceCalculator}
                  /> */}
                  <Route
                    path={process.env.PUBLIC_URL + "/test"}
                    component={SwipeableTextMobileStepper}
                  />
                  <Route exact component={NotFound} />
                </Switch>
              </Suspense>
            </ScrollToTop>
          </Router>
        </BreadcrumbsProvider>
      </ToastProvider>
    </ThemeProvider >
  );
};

App.propTypes = {
  dispatch: PropTypes.func
};

export default connect()(multilanguage(App));