import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Logo from "../../components/header/Logo";
import NavMenu from "../../components/header/NavMenu";
import IconGroup from "../../components/header/IconGroup";
import MobileMenu from "../../components/header/MobileMenu";
import { logout } from "../../redux/actions/userStorageActions";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";
import { clearUserLogin } from "../../utils/userLoginStorage";
import { setNameFilter } from "../../redux/actions/filterActions";

const HeaderOne = ({
  layout,
  top,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
}) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const history = useHistory();
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  const search = (value) => {
    history.push(process.env.PUBLIC_URL + "/category");
    dispatch(setNameFilter(value.trim()));
  };

  const handleLogout = () => {
    history.push(process.env.PUBLIC_URL);
    clearUserLogin();
    addToast("Đăng xuất thành công", {
      appearance: "success",
      autoDismiss: true,
    });
    dispatch(logout());
  };
  return (
    <header
      className={`header-area clearfix ${headerBgClass ? headerBgClass : ""} ${
        headerPositionClass ? headerPositionClass : ""
      }`}
    >
      <div
        className={` ${
          headerPaddingClass ? headerPaddingClass : ""
        } sticky-bar header-res-padding clearfix ${
          scroll > headerTop ? "stick" : ""
        }`}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row" style={{ alignItems: "center" }}>
            <div className="col-xl-2 col-lg-2 col-md-6 col-4">
              {/* header logo */}
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-block">
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8">
              {/* Icon group */}
              <IconGroup handleLogout={handleLogout} handleSearch={search} />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu handleLogout={handleLogout} handleSearch={search} />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
};

export default HeaderOne;
