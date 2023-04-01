import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link, useHistory } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import callApi, { RESPONSE_TYPE, STATUS_BAD_REQUEST } from "../../utils/callApi";
import { onCloseModalLoading, onOpenModalLoading } from "../../redux/actions/modalLoadingActions";
import { Typography } from "@mui/material";
import { noRememberLogin, rememberLogin } from "../../utils/userLoginStorage";
import { login } from "../../redux/actions/userStorageActions";

const LoginRegister = ({ location }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = location;

  const { addToast } = useToasts();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckedRememberLogin, setIsCheckedRememberLogin] = useState(false);

  const [messageError, setMessageError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(onOpenModalLoading());
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/auth/local",
      method: "post",
      data: {
        identifier: email,
        password: password
      },
    })

    if (response.type === RESPONSE_TYPE) {
      addToast("Đăng nhập thành công", {
        appearance: "success",
        autoDismiss: true
      });
      dispatch(login());
      if (isCheckedRememberLogin) {
        rememberLogin(response.data?.jwt, response.data?.user);
      } else {
        noRememberLogin(response.data?.jwt, response.data?.user);
      }
      history.push("/");

    } else {
      if (response.status === STATUS_BAD_REQUEST) {
        setMessageError("Email hoặc mật khẩu không chính xác!")
      }
    }
    dispatch(onCloseModalLoading());
    console.log("response", response);
  }
  const handleChangeEmail = e => {
    setEmail(e.target.value)
    setMessageError("")
  }
  const handleChangePassword = e => {
    setPassword(e.target.value)
    setMessageError("")
  }
  return (
    <Fragment>
      <MetaTags>
        <title>Flone | Login</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Đăng nhập
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Đăng nhập</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Đăng ký</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form onSubmit={handleLogin}>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Tên đăng nhập"
                                value={email}
                                onChange={handleChangeEmail}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="mật khẩu"
                                value={password}
                                onChange={handleChangePassword}
                              />
                              <Typography color="error">{messageError}</Typography>
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" value={isCheckedRememberLogin} onChange={e => setIsCheckedRememberLogin(e.target.checked)} />
                                  <label className="ml-10">Ghi nhớ đăng nhập</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Quên mật khẩu ?
                                  </Link>
                                </div>
                                <button type="submit">
                                  <span>Đăng nhập</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form>
                              <input
                                type="text"
                                name="user-name"
                                placeholder="Tên đăng nhập"
                              />
                              <input
                                name="user-email"
                                placeholder="Email"
                                type="email"
                              />
                              <input
                                type="text"
                                name="full-name"
                                placeholder="Họ tên"
                              />
                              <input
                                name="phone-number"
                                placeholder="Số điện thoại"
                                type="text"
                              />
                              <input
                                name="university"
                                placeholder="Trường đại học"
                                type="text"
                              />
                              <input
                                name="address"
                                placeholder="Địa chỉ"
                                type="text"
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Mật khẩu"
                              />
                              <input
                                type="confirm-password"
                                name="user-confirm-password"
                                placeholder="Xác nhận mật khẩu"
                              />

                              <div className="button-box">
                                <button type="submit">
                                  <span>Đăng ký</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object
};

export default LoginRegister;
