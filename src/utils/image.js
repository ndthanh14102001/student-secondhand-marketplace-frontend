export const IMAGE_SIZE_SMALL = "small";
export const IMAGE_SIZE_MEDIUM = "medium";
export const IMAGE_SIZE_THUMBNAIL = "thumbnail";
const getImageUrl = (imageData, size = IMAGE_SIZE_SMALL) => {
  return imageData?.attributes?.formats[size]?.url;
};

export { getImageUrl };
