import validator from "validator";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import MetaTags from "react-meta-tags";
import { Link, useHistory } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import LayoutOne from "../layouts/LayoutOne";
import Breadcrumb from "../wrappers/breadcrumb/Breadcrumb";
import callApi, { RESPONSE_TYPE, STATUS_BAD_REQUEST } from "../utils/callApi";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../redux/actions/modalLoadingActions";
import {
  Box,
  Button,
  TextField,
  Typography,
  styled,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { noRememberLogin, rememberLogin } from "../utils/userLoginStorage";
import { login } from "../redux/actions/userStorageActions";
import { onShowPopup, onClosePopup } from "../redux/actions/popupActions";
import { POPUP_TYPE_ERROR } from "../redux/reducers/popupReducer";
import { useRef } from "react";

import PasswordStrengthBar from "../components/password-strength-bar";
import { useMemo } from "react";
import {
  ERROR_COLOR,
  getColorToPasswordStrength,
} from "../components/password-strength-bar/constants";
import { getAllUniversity } from "../utils/data/university";
const LOGIN_KEY = "login";
const REGISTER_KEY = "register";

const REGISTER_INFO_INIT_STATE = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  isValidConfirmPassword: true,
  isShowPassword: "",
  phone: "",
  isValidPhone: true,
  fullName: "",
  university: "",
  isValidUniversity: true,
  address: "",
};
const BoxInput = styled(Box)(() => ({
  marginBottom: "1rem",
}));
const LoginRegister = ({ location }) => {
  const universityData = useMemo(() => {
    return Object.values(getAllUniversity());
  }, []);
  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = location;

  const [pageSelected, setPageSeleted] = useState(LOGIN_KEY);
  const { addToast } = useToasts();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isCheckedRememberLogin, setIsCheckedRememberLogin] = useState(false);

  const [messageError, setMessageError] = useState("");

  const [registerInfo, setRegisterInfo] = useState(REGISTER_INFO_INIT_STATE);
  const refPhoneInput = useRef();
  const refPasswordInput = useRef();
  const handleLogin = async () => {
    dispatch(onOpenModalLoading());
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/auth/local",
      method: "post",
      data: {
        identifier: email,
        password: password,
      },
    });

    if (response.type === RESPONSE_TYPE) {
      addToast("Đăng nhập thành công", {
        appearance: "success",
        autoDismiss: true,
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
        if (response.data.error.name === "ApplicationError") {
          dispatch(
            onShowPopup({
              type: POPUP_TYPE_ERROR,
              title: "Đăng nhập thất bại",
              content: "Tài khoản này hiện đang bị khóa",
              showButtonCancel: false,
              closeAction: () => dispatch(onClosePopup()),
              clickOkeAction: () => dispatch(onClosePopup()),
            })
          );
        } else {
          setMessageError("Email hoặc mật khẩu không chính xác!");
        }
      }
    }
    dispatch(onCloseModalLoading());
  };
  const checkValidInputRegister = () => {
    let result = true;
    if (!validator.isMobilePhone(registerInfo.phone, "vi-VN")) {
      result = false;
      setRegisterInfo((prev) => ({
        ...prev,
        isValidPhone: false,
      }));
      refPhoneInput.current.querySelector("input").focus();
    }
    if (!registerInfo.university) {
      result = false;
      setRegisterInfo((prev) => ({
        ...prev,
        isValidUniversity: false,
      }));
    }
    if (registerInfo.password !== registerInfo.confirmPassword) {
      result = false;
      setRegisterInfo((prev) => ({
        ...prev,
        isValidConfirmPassword: false,
      }));
    }
    if (getColorToPasswordStrength(registerInfo.password) === ERROR_COLOR) {
      result = false;
      refPasswordInput.current.querySelector("input").focus();
    }
    return result;
  };
  const handleRegister = async () => {
    if (checkValidInputRegister()) {
      dispatch(onOpenModalLoading());
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/auth/local/register",
        method: "post",
        data: {
          username: registerInfo.username,
          email: registerInfo.email,
          password: registerInfo.password,
          fullName: registerInfo.fullName,
          phone: registerInfo.phone,
          address: registerInfo.address,
          universityId: registerInfo.university?.id,
        },
      });

      if (response.type === RESPONSE_TYPE) {
        addToast("Đăng ký thành công", {
          appearance: "success",
          autoDismiss: true,
        });
        setRegisterInfo(REGISTER_INFO_INIT_STATE);
        setPageSeleted(LOGIN_KEY);
      } else {
        if (response.status === STATUS_BAD_REQUEST) {
          dispatch(
            onShowPopup({
              type: POPUP_TYPE_ERROR,
              clickOkeAction: () => dispatch(onClosePopup()),
              closeAction: () => dispatch(onClosePopup()),
              showButtonCancel: false,
              content: "Username hoặc Email đã tồn tại",
              title: "Error",
            })
          );
        }
      }
      dispatch(onCloseModalLoading());
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pageSelected === LOGIN_KEY) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };
  const handleClickShowPassword = () => {
    setRegisterInfo({
      ...registerInfo,
      isShowPassword: !registerInfo.isShowPassword,
    });
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setMessageError("");
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setMessageError("");
  };
  const handleChangeUsername = (e) => {
    setRegisterInfo({
      ...registerInfo,
      username: e.target.value,
    });
  };
  const handleChangeEmailRegister = (e) => {
    setRegisterInfo({
      ...registerInfo,
      email: e.target.value,
    });
  };
  const handleChangeFullName = (e) => {
    setRegisterInfo({
      ...registerInfo,
      fullName: e.target.value,
    });
  };
  const handleChangePhone = (e) => {
    setRegisterInfo({
      ...registerInfo,
      phone: e.target.value,
      isValidPhone: true,
    });
  };
  const handleChangeUniversity = (e, newValue) => {
    setRegisterInfo({
      ...registerInfo,
      university: newValue,
      isValidUniversity: true,
    });
  };
  const handleChangeAddress = (e) => {
    setRegisterInfo({
      ...registerInfo,
      address: e.target.value,
    });
  };
  const handleChangePasswordRegister = (e) => {
    let isValidConfirmPassword = false;
    if (e.target.value === registerInfo.confirmPassword) {
      isValidConfirmPassword = true;
    }
    setRegisterInfo({
      ...registerInfo,
      password: e.target.value,
      isValidConfirmPassword,
    });
  };
  const handleChangeConfirmPassword = (e) => {
    let isValidConfirmPassword = false;
    if (e.target.value === registerInfo.password) {
      isValidConfirmPassword = true;
    }
    setRegisterInfo({
      ...registerInfo,
      confirmPassword: e.target.value,
      isValidConfirmPassword,
    });
  };
  const colorValidStrengthPassword = useMemo(() => {
    if (registerInfo.password?.length > 0) {
      return getColorToPasswordStrength(registerInfo.password);
    }
    return "primary";
  }, [registerInfo.password]);
  return (
    <Fragment>
      <MetaTags>
        <title>
          Chợ Sinh Viên - Website mua bán, trao đổi đồ dùng cho sinh viên
        </title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
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
                  <Tab.Container
                    defaultActiveKey={LOGIN_KEY}
                    activeKey={pageSelected}
                  >
                    <Nav
                      variant="pills"
                      className="login-register-tab-list flex-nowrap"
                      onSelect={(key) => setPageSeleted(key)}
                    >
                      <Nav.Item>
                        <Nav.Link eventKey={LOGIN_KEY} className="text-nowrap">
                          <h4>Đăng nhập</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey={REGISTER_KEY}
                          className="text-nowrap"
                        >
                          <h4>Đăng ký</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey={LOGIN_KEY}>
                        <div className="login-form-container">
                          <div>
                            <form onSubmit={handleSubmit}>
                              <BoxInput>
                                <TextField
                                  fullWidth
                                  type="text"
                                  name="user-name"
                                  placeholder="Email hoặc Tên đăng nhập"
                                  label="Email hoặc Tên đăng nhập"
                                  value={email}
                                  onChange={handleChangeEmail}
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  fullWidth
                                  type="password"
                                  name="user-password"
                                  placeholder="Mật khẩu"
                                  label="Mật khẩu"
                                  value={password}
                                  onChange={handleChangePassword}
                                />
                              </BoxInput>
                              <Typography color="error">
                                {messageError}
                              </Typography>
                              {/* Mobile login button */}
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                  width: "100%",
                                  display: {
                                    xs: "block",
                                    md: "none",
                                  },
                                }}
                              >
                                <span>Đăng nhập</span>
                              </Button>
                              <Box sx={{}}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexDirection: {
                                      xs: "column",
                                      md: "row",
                                    },
                                  }}
                                >
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={isCheckedRememberLogin}
                                        onChange={(e) =>
                                          setIsCheckedRememberLogin(
                                            e.target.checked
                                          )
                                        }
                                      />
                                    }
                                    label="Ghi nhớ đăng nhập"
                                  />
                                  <Link
                                    to={
                                      process.env.PUBLIC_URL +
                                      "/forgot-password"
                                    }
                                  >
                                    Quên mật khẩu ?
                                  </Link>
                                </Box>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  sx={{
                                    display: {
                                      xs: "none",
                                      md: "block",
                                    },
                                  }}
                                >
                                  <span>Đăng nhập</span>
                                </Button>
                              </Box>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey={REGISTER_KEY}>
                        <div className="login-form-container">
                          <div>
                            <form onSubmit={handleSubmit}>
                              <BoxInput>
                                <TextField
                                  required
                                  fullWidth
                                  type="text"
                                  name="user-name"
                                  placeholder="Tên đăng nhập"
                                  label={"Tên đăng nhập"}
                                  value={registerInfo.username}
                                  onChange={handleChangeUsername}
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  required
                                  fullWidth
                                  name="user-email"
                                  placeholder="Email"
                                  label="Email"
                                  type="email"
                                  value={registerInfo.email}
                                  onChange={handleChangeEmailRegister}
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  required
                                  fullWidth
                                  type="text"
                                  name="full-name"
                                  placeholder="Họ tên"
                                  label="Họ tên"
                                  value={registerInfo.fullName}
                                  onChange={handleChangeFullName}
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  error={!registerInfo.isValidPhone}
                                  helperText={
                                    !registerInfo.isValidPhone &&
                                    "Số điện thoại không hợp lệ"
                                  }
                                  ref={refPhoneInput}
                                  required
                                  fullWidth
                                  name="phone-number"
                                  placeholder="Số điện thoại"
                                  label="Số điện thoại"
                                  type="text"
                                  value={registerInfo.phone}
                                  onChange={handleChangePhone}
                                />
                              </BoxInput>
                              <BoxInput>
                                <Autocomplete
                                  fullWidth
                                  onChange={handleChangeUniversity}
                                  disablePortal
                                  id="combo-box-demo"
                                  options={universityData}
                                  renderInput={(params) => (
                                    <TextField
                                      fullWidth
                                      {...params}
                                      label="Trường Đại Học"
                                    />
                                  )}
                                  getOptionLabel={(university) =>
                                    university?.teN_DON_VI
                                  }
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  required
                                  fullWidth
                                  name="address"
                                  placeholder="Địa chỉ"
                                  label="Địa chỉ"
                                  type="text"
                                  value={registerInfo.address}
                                  onChange={handleChangeAddress}
                                />
                              </BoxInput>
                              <BoxInput>
                                <TextField
                                  ref={refPasswordInput}
                                  color={colorValidStrengthPassword}
                                  helperText={
                                    "Sử dụng 6+ ký tự, kết hợp với chữ thường, chữ hoa, số, ký tự đặt biệt"
                                  }
                                  required
                                  fullWidth
                                  type={
                                    registerInfo.isShowPassword
                                      ? "text"
                                      : "password"
                                  }
                                  name="user-password"
                                  placeholder="Mật khẩu"
                                  label="Mật khẩu"
                                  value={registerInfo.password}
                                  onChange={handleChangePasswordRegister}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          edge="end"
                                        >
                                          {registerInfo.isShowPassword ? (
                                            <VisibilityOff />
                                          ) : (
                                            <Visibility />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </BoxInput>
                              <PasswordStrengthBar
                                value={registerInfo.password}
                              />
                              <BoxInput mt={"1rem"}>
                                <TextField
                                  error={!registerInfo.isValidConfirmPassword}
                                  helperText={
                                    !registerInfo.isValidConfirmPassword &&
                                    "Mật khẩu và Xác nhận mật khẩu không giống nhau"
                                  }
                                  fullWidth
                                  required
                                  type={
                                    registerInfo.isShowPassword
                                      ? "text"
                                      : "password"
                                  }
                                  name="user-confirm-password"
                                  placeholder="Xác nhận mật khẩu"
                                  label="Xác nhận mật khẩu"
                                  value={registerInfo.confirmPassword}
                                  onChange={handleChangeConfirmPassword}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          edge="end"
                                        >
                                          {registerInfo.isShowPassword ? (
                                            <VisibilityOff />
                                          ) : (
                                            <Visibility />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </BoxInput>
                              <div>
                                <Button
                                  type="submit"
                                  variant="contained"
                                  sx={{
                                    width: {
                                      xs: "100%",
                                      md: "auto",
                                    },
                                  }}
                                >
                                  <span>Đăng ký</span>
                                </Button>
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
  location: PropTypes.object,
};
export default LoginRegister;
