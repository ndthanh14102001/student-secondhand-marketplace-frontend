import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/actions/cartActions";
import { Button, ClickAwayListener } from "@mui/material";
import PostAddIcon from '@mui/icons-material/PostAdd';
import { useToasts } from "react-toast-notifications";
import { clearUserLogin } from "../../utils/userLoginStorage";
import { logout } from "../../redux/actions/userStorageActions";
const IconGroup = ({
  currency,
  cartData,
  wishlistData,
  // compareData,
  // deleteFromCart,
  iconWhiteClass
}) => {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.userStorage.isLogin);
  const accountDropRef = useRef();
  const searchRef = useRef();
  const history = useHistory();

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
