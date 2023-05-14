export const getVietNamMoneyFormat = (money) => {
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money || 0);
}
export const getProductImages = (productAttributes) => {
  return productAttributes?.images?.data &&
    Array.isArray(productAttributes?.images?.data) &&
    productAttributes?.images?.data?.length > 0 &&
    productAttributes?.images?.data
}