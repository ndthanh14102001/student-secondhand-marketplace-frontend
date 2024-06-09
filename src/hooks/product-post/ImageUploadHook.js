import { useState, useRef } from "react";
import { IMAGE_FILE_TYPE } from "../../constants/product-post/constants";
import { onShowPopupErrorBaseCustom } from "../../redux/actions/popupErrorBaseActions";
import { useDispatch } from "react-redux";
const useImageUploadHook = ({ setProductInfo }) => {
  const dispatch = useDispatch();
  const [flagToClearInput, setFlagToClearInput] = useState(false);

  const inputFileRef = useRef();
  const inputFileAddRef = useRef();

  const handleClearInput = () => {
    setFlagToClearInput((prev) => !prev);
  };
  const checkValidFileType = (files) => {
    if (Array.isArray(Object.values(files))) {
      for (let indexFiles = 0; indexFiles < files?.length; indexFiles++) {
        const file = files[indexFiles];
        const extension = file.name.split(".").pop().toLowerCase();
        if (!IMAGE_FILE_TYPE.includes(extension)) {
          return false;
        }
      }
    }
    return true;
  };
  const uploadImages = (e) => {
    if (checkValidFileType(e.target.files)) {
      setProductInfo((prev) => ({
        ...prev,
        images: Object.values(e.target.files),
        isValidImages: true,
      }));
    } else {
      dispatch(
        onShowPopupErrorBaseCustom({
          title: "Loại file không hợp lệ",
          content: "Chỉ hỗ trợ file " + IMAGE_FILE_TYPE.join(", "),
        })
      );
    }
    handleClearInput();
  };
  const addImage = (e) => {
    if (checkValidFileType(e.target.files)) {
      setProductInfo((prev) => ({
        ...prev,
        images: [...prev.images, ...Object.values(e.target.files)],
        isValidImages: true,
      }));
    } else {
      dispatch(
        onShowPopupErrorBaseCustom({
          title: "Loại file không hợp lệ",
          content: "Chỉ hỗ trợ file " + IMAGE_FILE_TYPE.join(", "),
        })
      );
    }
    handleClearInput();
  };
  const removeImage = (index) => {
    setProductInfo((prev) => ({
      ...prev,
      images: prev.images.filter((file, indexFile) => {
        return index !== indexFile;
      }),
      isValidImages: true,
    }));
  };
  const showImage = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch (e) {
      const imageAttributes = file?.attributes;
      return process.env.REACT_APP_SERVER_ENDPOINT + imageAttributes?.url;
    }
  };
  return {
    flagToClearInput,
    setFlagToClearInput,
    inputFileRef,
    inputFileAddRef,
    handleClearInput,
    checkValidFileType,
    uploadImages,
    addImage,
    removeImage,
    showImage,
  };
};

export default useImageUploadHook;
