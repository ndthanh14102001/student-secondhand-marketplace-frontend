import { Box, Grid } from '@mui/material';
import React, { Fragment, useEffect } from 'react'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { MetaTags } from 'react-meta-tags'
import { useHistory, useLocation } from 'react-router-dom';
import LayoutOne from '../../layouts/LayoutOne';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import FormInfoProduct from './FormInfoProduct';
import ImageUpload from './ImageUpload';
import { useState } from 'react';
import callApi, { RESPONSE_TYPE } from '../../utils/callApi';
import { getUserLogin } from '../../utils/userLoginStorage';
import { useToasts } from 'react-toast-notifications';
import { useDispatch } from 'react-redux';
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
  imagesBeforeUpdate: [],
  status: "",
  isValidPrice: true,
  isValidDescription: true,
  isValidName: true,
  isValidCategoryChoose: true,
  isValidImages: true,
}
const ProductUpdate = ({ match }) => {
  const productId = match.params.id

  const history = useHistory();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [productInfo, setProductInfo] = useState(PRODUCT_INFO_INIT_STATE);
  const { addToast } = useToasts();
  useEffect(() => {
    dispatch(onOpenModalLoading())
    const getProductById = async () => {
      const response = await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/products/" + productId,
        method: "get",
        params: {
          populate: {
            userId: {
              populate: "*"
            },
            category: true,
            images: true
          }
        }
      });
      if (response.type === RESPONSE_TYPE) {
        const productData = response.data?.data;
        const productDataAttributes = productData?.attributes;
        setProductInfo(prev => ({
          ...prev,
          categoryChoose: productDataAttributes?.category?.data?.id,
          name: productDataAttributes?.name,
          price: productDataAttributes?.price,
          description: productDataAttributes?.description,
          images: productDataAttributes?.images?.data || [],
          imagesBeforeUpdate: productDataAttributes?.images?.data || [],
          status: productDataAttributes?.status
        }));
      }
      dispatch(onCloseModalLoading())
    }
    getProductById();
  }, [productId, dispatch])
  const handleUpdateSuccess = () => {
    addToast("Cập nhật thông tin thành công !", {
      appearance: "success",
      autoDismiss: true
    });
    history.push(process.env.PUBLIC_URL + "/my-products")
  }
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
    if (productInfo.name.trim() < 6) {
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
  const handleDeleteFileInApi = async (productImagesDelete) => {
    for (let indexProductImagesDelete = 0; indexProductImagesDelete < productImagesDelete.length; indexProductImagesDelete++) {
      const imageProductDelete = productImagesDelete[indexProductImagesDelete];
      console.log("delete");
      await callApi({
        url: process.env.REACT_APP_API_ENDPOINT + "/upload/files/" + imageProductDelete?.id,
        method: "delete",
      })
    }
  }
  const handleUpdateProduct = async (user) => {
    dispatch(onOpenModalLoading())
    const imagesOld = [];
    const imagesNew = [];
    let productImagesDelete = productInfo.imagesBeforeUpdate;
    for (let indexImages = 0; indexImages < productInfo.images.length; indexImages++) {
      const image = productInfo.images[indexImages];
      if (image?.id) {
        imagesOld.push(image)
        productImagesDelete = productImagesDelete.filter(imageBefore => imageBefore?.id !== image?.id)
      } else {
        imagesNew.push(image)
      }
    }

    if (productImagesDelete.length > 0) {
      await handleDeleteFileInApi(productImagesDelete);
    }
    let response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/products/" + productId,
      method: "put",
      data: {
        data: {
          name: productInfo.name,
          userId: user?.id,
          category: productInfo.categoryChoose,
          price: productInfo.price,
          description: productInfo.description,
          images: imagesOld.map(image => image?.id)
        }
      },
    })

    if (response.type === RESPONSE_TYPE) {
      if (imagesNew.length > 0) {
        let formData = new FormData();
        imagesNew.forEach((image) => {
          formData.append('files', image);
        })
        formData.append("ref", "api::product.product")
        formData.append("refId", productId)
        formData.append("field", "images")

        response = await callApi({
          url: process.env.REACT_APP_API_ENDPOINT + "/upload",
          method: "post",
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        if (response.type === RESPONSE_TYPE) {
          handleUpdateSuccess();
        } else {
          dispatch(onShowPopupErrorBase(response));
        }
      } else {
        handleUpdateSuccess();
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
        await handleUpdateProduct(user)
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
      <LayoutOne headerTop="visible">
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

export default ProductUpdate