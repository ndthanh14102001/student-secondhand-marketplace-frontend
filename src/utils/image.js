import imageCompression from "browser-image-compression";
export const IMAGE_SIZE_SMALL = "small";
export const IMAGE_SIZE_MEDIUM = "medium";
export const IMAGE_SIZE_THUMBNAIL = "thumbnail";
const getImageUrl = (imageData, size = IMAGE_SIZE_SMALL) => {
  try {
    return (
      getImageBySize(imageData?.attributes?.formats, size)?.url ||
      getImageBySize(imageData?.formats, size)?.url ||
      ""
    );
  } catch {
    return "";
  }
};

const getImageBySize = (formats, size) => {
  if (formats) {
    if (size in formats) {
      return formats[size];
    }
    return Object.values(formats)?.[0];
  }
};

const convertImageFileToWebp = async (file) => {
  if (file) {
    if (file?.type === "image/webp") {
      return file;
    }
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Error converting image:", error);
    }
    return null;
  }
};
export { getImageUrl, convertImageFileToWebp };
