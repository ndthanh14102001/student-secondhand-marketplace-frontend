import React, { useState } from "react";
import { Fragment } from "react";
import { MetaTags } from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../../layouts/LayoutOne";
import Breadcrumb from "../../../wrappers/breadcrumb/Breadcrumb";
import qs from "qs";
import PageCreateNewPassword from "./PageCreateNewPassword";
import PageForgotPassword from "./PageForgotPassword";
const INFO_FORGOT_PASSWORD = {
  password: "",
  confirmPassword: "",
  isValidConfirmPassword: true,
  isShowPassword: "",
  email: "",
};
const ForgotPassword = ({ location }) => {
  const [infoForgotPassword, setInfoForgotPassword] =
    useState(INFO_FORGOT_PASSWORD);
  const code = qs.parse(location?.search, { ignoreQueryPrefix: true })?.code;

  return (
    <Fragment>
      <MetaTags>
        <title>Chợ Sinh Viên - Website mua bán, trao đổi đồ dùng cho sinh viên</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        Trang chủ
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + location?.pathname}>
        Quên mật khẩu
      </BreadcrumbsItem>
      <LayoutOne>
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              {code && (
                <PageCreateNewPassword
                  code={code}
                  infoCreateNewPassword={infoForgotPassword}
                  setInfoCreateNewPassword={setInfoForgotPassword}
                />
              )}
              {!code && (
                <PageForgotPassword
                  email={infoForgotPassword.email}
                  setEmail={(value) =>
                    setInfoForgotPassword((prev) => ({ ...prev, email: value }))
                  }
                />
              )}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ForgotPassword;
