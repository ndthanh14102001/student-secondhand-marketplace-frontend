export const getVietNamMoneyFormat = (money) => {
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(money || 0);
}