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
export { getImageUrl };
