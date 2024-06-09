import { useDispatch } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { useLocation } from "react-router-dom";

import callApi, { RESPONSE_TYPE } from "../../utils/callApi";
import { onShowPopupErrorBase } from "../../redux/actions/popupErrorBaseActions";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../../redux/actions/modalLoadingActions";
import { PRODUCT_ON_SALE_KEY } from "../../constants/my-products/constants";
import { PRODUCT_ON_SALE_STATUS, PRODUCT_SOLD_STATUS } from "../../constants";

import { onShowPopup } from "../../redux/actions/popupActions";
import { POPUP_TYPE_ERROR } from "../../redux/reducers/popupReducer";
import { onClosePopup } from "../../redux/actions/popupActions";

import { getUserLogin } from "../../utils/userLoginStorage";
import { useParams } from "react-router-dom";

const useUserInfoHook = () => {
  const [openNeedLoginDialog, setOpenNeedLoginDialog] = React.useState(false);

  const [openConfirmReport, setOpenConfirmReport] = React.useState(false);

  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params?.id;
  const { pathname } = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [openUnFollow, setOpenUnFollow] = useState(false);
  const [listIdFollow, setListIdFollow] = useState([]);
  const [productStatusShow, setProductSatusShow] =
    React.useState(PRODUCT_ON_SALE_KEY);
  const avatar = useMemo(() => {
    return userInfo?.avatar;
  }, [userInfo]);

  const user = getUserLogin()?.user;

  const handleClickOpenConfirmReport = () => {
    if (user === undefined) {
      setOpenNeedLoginDialog(true);
    } else {
      setOpenConfirmReport(true);
    }
  };

  const handleCloseConfirmReport = () => {
    setOpenConfirmReport(false);
    setOpenNeedLoginDialog(false);
  };

  const handleChangeProductStatusShow = (event, newValue) => {
    setProductSatusShow(newValue);
  };
  const productShow = useMemo(() => {
    if (userInfo?.product && Array.isArray(userInfo.product)) {
      return userInfo.product.filter((product) => {
        const statusShow =
          productStatusShow === PRODUCT_ON_SALE_KEY
            ? PRODUCT_ON_SALE_STATUS
            : PRODUCT_SOLD_STATUS;
        return product?.status === statusShow;
      });
    }
    return [];
  }, [userInfo, productStatusShow]);
  useEffect(() => {
    const getUserInfo = async () => {
      dispatch(onOpenModalLoading());
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
        method: "get",
        params: {
          populate: {
            product: {
              populate: {
                images: {
                  populate: "*",
                },
                userId: {
                  populate: {
                    avatar: {
                      populate: "*",
                    },
                    product: {
                      populate: "*",
                    },
                    followers: {
                      populate: "*",
                    },
                  },
                },
              },
            },
            avatar: {
              populate: "*",
            },
            followers: {
              populate: "*",
            },
          },
        },
      });
      if (response.type === RESPONSE_TYPE) {
        const responseData = response.data;
        setUserInfo(responseData);
        if (user) {
          responseData.followers?.map((follower) => {
            setListIdFollow((prevList) => prevList.concat(follower.id));
            if (follower.id === user?.id) {
              setIsFollow(true);
            }
          });
        }
      } else {
        dispatch(onShowPopupErrorBase(response));
      }
      dispatch(onCloseModalLoading());
    };
    getUserInfo();
  }, [userId]);

  const handleCloseUnFollow = () => {
    setOpenUnFollow(false);
  };

  const handleUnFollow = async () => {
    let list = listIdFollow.filter((item) => item !== user.id);
    setListIdFollow(listIdFollow.filter((item) => item !== user.id));
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
      method: "put",
      data: {
        followers: list,
      },
    });
    if (response.type === RESPONSE_TYPE) {
      addToast("Hủy theo dõi thành công", {
        appearance: "success",
        autoDismiss: true,
      });
      setIsFollow(false);
      setOpenUnFollow(false);
    }
  };

  const handleFollow = async () => {
    if (isFollow) {
      setOpenUnFollow(true);
    } else {
      if (user) {
        let list = listIdFollow.concat(user.id);
        setListIdFollow(listIdFollow.concat(user.id));
        const response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userId,
          method: "put",
          data: {
            followers: list,
          },
        });
        if (response.type === RESPONSE_TYPE) {
          addToast("Theo dõi thành công", {
            appearance: "success",
            autoDismiss: true,
          });
          setIsFollow(true);
        }
      } else {
        dispatch(
          onShowPopup({
            type: POPUP_TYPE_ERROR,
            title: "Đăng nhập",
            content: "Hãy quay lại đăng nhập để bình luận",
            showButtonCancel: false,
            closeAction: () => dispatch(onClosePopup()),
            clickOkeAction: () => dispatch(onClosePopup()),
          })
        );
      }
    }
  };
  return {
    productStatusShow,
    setProductSatusShow,
    openNeedLoginDialog,
    setOpenNeedLoginDialog,
    openConfirmReport,
    setOpenConfirmReport,
    userId,
    pathname,
    userInfo,
    setUserInfo,
    isFollow,
    setIsFollow,
    openUnFollow,
    setOpenUnFollow,
    listIdFollow,
    setListIdFollow,
    avatar,
    handleClickOpenConfirmReport,
    handleCloseConfirmReport,
    handleChangeProductStatusShow,
    productShow,
    handleCloseUnFollow,
    handleUnFollow,
    handleFollow,
  };
};

export default useUserInfoHook;
