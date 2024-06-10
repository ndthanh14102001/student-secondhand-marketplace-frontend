import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MobileNavMenu = ({ handleLogout }) => {
  const isLogin = useSelector((state) => state.userStorage.isLogin);
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>{"Trang chủ"}</Link>
        </li>
        <li>
          <Link to={process.env.PUBLIC_URL + "/category"}>{"Danh mục"}</Link>
        </li>
        {isLogin && (
          <li className="menu-item-has-children">
            <Link to={process.env.PUBLIC_URL + "/my-account"}>
              {"Tài khoản của tôi"}
            </Link>
            <ul className="sub-menu">
              <li className="menu-item-has-children">
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  {"Thông tin của tôi"}
                </Link>
              </li>
              <li className="menu-item-has-children">
                <Link to={process.env.PUBLIC_URL + "/my-products"}>
                  {"Sản phẩm của tôi"}
                </Link>
              </li>
              <li className="menu-item-has-children" onClick={handleLogout}>
                <Link to={process.env.PUBLIC_URL + "/"}>
                  {"Đăng xuất"}
                </Link>
              </li>
            </ul>
          </li>
        )}
        {!isLogin && (
          <li>
            <Link to={process.env.PUBLIC_URL + "/login-register"}>
              {"Đăng nhập và đăng ký"}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object,
};

export default MobileNavMenu;
