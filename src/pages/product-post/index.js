import { Box, Grid, colors } from '@mui/material';
import React, { Fragment, useEffect } from 'react'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useLocation } from 'react-router-dom';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import FormInfoProduct from './FormInfoProduct';
import ImageUpload from './ImageUpload';
import { useState } from 'react';
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
import { getUserLogin } from '../../utils/userLoginStorage';
import { useToasts } from 'react-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { onShowPopupErrorBase } from '../../redux/actions/popupErrorBaseActions';
import { onShowPopup } from '../../redux/actions/popupActions';
import { POPUP_TYPE_ERROR } from '../../redux/reducers/popupReducer';
import { onClosePopup } from '../../redux/actions/popupActions';
import { onCloseModalLoading, onOpenModalLoading } from '../../redux/actions/modalLoadingActions';

const PRODUCT_INFO_INIT_STATE = {
  price: 0,
  description: "",
  name: "",
  categoryChoose: "",
  images: [],
  isValidPrice: true,
  isValidDescription: true,
  isValidName: true,
  isValidCategoryChoose: true,
  isValidImages: true,
}
const ProductPost = () => {

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [productInfo, setProductInfo] = useState(PRODUCT_INFO_INIT_STATE);
  const { addToast } = useToasts();
  // const [socket, setSocket] = useState(null);
  const socket = useSelector(state => state.socket.socket);
  const isValidFormInput = () => {
    let isValidPrice = true;;
    let isValidName = true;;
    let isValidDescription = true;;
    let isValidCategoryChoose = true;;
    let isValidImages = true;;
    let result = true;
    if (productInfo.price <= 0) {
      result = false;
      isValidPrice = false
    }
    if (productInfo.name.trim().length < 6) {
      result = false;
      isValidName = false
    }
    if (productInfo.description.length > 0 && productInfo.description.split(" ").length < 10) {
      result = false;
      isValidDescription = false
    }
    if (!productInfo.categoryChoose) {
      result = false;
      isValidCategoryChoose = false
    }
    if (!(productInfo.images.length >= 4 && productInfo.images.length <= 6)) {
      result = false;
      isValidImages = false
      dispatch(onShowPopup({
        type: POPUP_TYPE_ERROR,
        title: "Lỗi Hình Ảnh",
        content: "Hãy đăng từ 4 đến 6 hình ảnh",
        showButtonCancel: false,
        closeAction: () => dispatch(onClosePopup()),
        clickOkeAction: () => dispatch(onClosePopup()),

      }))
    }
    setProductInfo(prev => ({
      ...prev,
      isValidPrice,
      isValidDescription,
      isValidName,
      isValidCategoryChoose,
      isValidImages,
    }));

    return result;
  }
  const handleCreateProduct = async (user) => {
    dispatch(onOpenModalLoading())
    let response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products",
      method: "post",
      data: {
        data: {
          name: productInfo.name,
          userId: user?.id,
          category: productInfo.categoryChoose,
          price: productInfo.price,
          description: productInfo.description,
        }
      },
    })

    if (response.type === RESPONSE_TYPE) {
      const productResponse = response.data?.data;
      let formData = new FormData();
      productInfo.images.forEach((image) => {
        formData.append('files', image);
      })
      formData.append("ref", "api::product.product")
      formData.append("refId", productResponse?.id)
      formData.append("field", "images")

      response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/upload",
        method: "post",
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.type === RESPONSE_TYPE) {
        setProductInfo(PRODUCT_INFO_INIT_STATE)
        addToast("Đăng bán Sản phẩm thành công !", {
          appearance: "success",
          autoDismiss: true
        });
        // response = await callApi({
        //   url: process.env.REACT_APP_API_ENDPOINT + "/notifications",
        //   method: "post",
        //   data: {
        //     data: {
        //       from: user?.id,
        //       content: "bán" + productInfo.name,
        //     }
        //   },
        // })
        let content = productResponse?.id + ";" + productInfo.name;
        socket.emit("notification", content);
      } else {
        dispatch(onShowPopupErrorBase(response));
      }

    } else {
      dispatch(onShowPopupErrorBase(response));
    }
    dispatch(onCloseModalLoading())
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isValidFormInput()) {
      const user = getUserLogin()?.user;
      if (user) {
        await handleCreateProduct(user)
      }
    }
  }

  return (
    <Fragment>
      <MetaTags>
        <title>Flone | Product Post</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Trang chủ</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Đăng bán
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible" >
        <Breadcrumb />
        <div className="product-area pt-60 pb-60">
          <div className="container">
            <div className="row">
              <Box sx={{ width: "100%" }} component={"form"} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={4}><ImageUpload productInfo={productInfo} setProductInfo={setProductInfo} /></Grid>
                  <Grid item xs={8}>
                    <FormInfoProduct
                      productInfo={productInfo}
                      setProductInfo={setProductInfo}
                    />
                  </Grid>
                </Grid>
              </Box>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment >
  )
}

export default ProductPost