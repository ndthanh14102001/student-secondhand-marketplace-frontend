import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { RESPONSE_TYPE } from "../../utils/callApi";
import { getUserLogin } from "../../utils/userLoginStorage";
import { onShowPopupErrorBase } from "../../redux/actions/popupErrorBaseActions";
import { onShowPopup } from "../../redux/actions/popupActions";
import { POPUP_TYPE_ERROR } from "../../redux/reducers/popupReducer";
import { onClosePopup } from "../../redux/actions/popupActions";
import {
  onCloseModalLoading,
  onOpenModalLoading,
} from "../../redux/actions/modalLoadingActions";
import productApi from "../../api/product";
import { PRODUCT_INFO_INIT_STATE } from "../../constants/product-post/constants";
import fileApi from "../../api/file";

const useProductPostHook = () => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [productInfo, setProductInfo] = useState(PRODUCT_INFO_INIT_STATE);

  const isValidFormInput = () => {
    let isValidPrice = true;
    let isValidName = true;
    let isValidDescription = true;
    let isValidCategoryChoose = true;
    let isValidImages = true;
    let result = true;
    if (productInfo.price <= 0) {
      result = false;
      isValidPrice = false;
    }
    if (productInfo.name.trim()?.length < 6) {
      result = false;
      isValidName = false;
    }
    if (
      productInfo.description?.length > 0 &&
      productInfo.description.split(" ")?.length < 10
    ) {
      result = false;
      isValidDescription = false;
    }
    if (!productInfo.categoryChoose) {
      result = false;
      isValidCategoryChoose = false;
    }
    if (!(productInfo.images?.length >= 4 && productInfo.images?.length <= 6)) {
      result = false;
      isValidImages = false;
      dispatch(
        onShowPopup({
          type: POPUP_TYPE_ERROR,
          title: "Lỗi Hình Ảnh",
          content: "Hãy đăng từ 4 đến 6 hình ảnh",
          showButtonCancel: false,
          closeAction: () => dispatch(onClosePopup()),
          clickOkeAction: () => dispatch(onClosePopup()),
        })
      );
    }
    setProductInfo((prev) => ({
      ...prev,
      isValidPrice,
      isValidDescription,
      isValidName,
      isValidCategoryChoose,
      isValidImages,
    }));

    return result;
  };
  const handleCreateProduct = async (user) => {
    dispatch(onOpenModalLoading());

    let response = await productApi.create({
      data: {
        name: productInfo.name,
        userId: user?.id,
        category: productInfo.categoryChoose,
        price: productInfo.price,
        description: productInfo.description,
      },
    });

    if (response.type === RESPONSE_TYPE) {
      const productResponse = response.data;
      let formData = new FormData();
      productInfo.images.forEach((image) => {
        formData.append("files", image);
      });
      formData.append("ref", "api::product.product");
      formData.append("refId", productResponse?.id);
      formData.append("field", "images");

      response = await fileApi.post({ formData });
      if (response.type === RESPONSE_TYPE) {
        setProductInfo(PRODUCT_INFO_INIT_STATE);
        addToast("Đăng bán Sản phẩm thành công !", {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        dispatch(onShowPopupErrorBase(response));
      }
    } else {
      dispatch(onShowPopupErrorBase(response));
    }
    dispatch(onCloseModalLoading());
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidFormInput()) {
      const user = getUserLogin()?.user;
      if (user) {
        await handleCreateProduct(user);
      }
    }
  };
  return {
    productInfo,
    setProductInfo,
    isValidFormInput,
    handleCreateProduct,
    handleSubmit,
  };
};

export default useProductPostHook;
