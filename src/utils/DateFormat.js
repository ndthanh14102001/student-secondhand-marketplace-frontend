const ddmmyy = (date, symbol = "/") => {
  const dateShow = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
  const month =
    date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
  const year =
    date.getFullYear() >= 10 ? date.getFullYear() : `0${date.getFullYear()}`;
  return `${dateShow}${symbol}${month}${symbol}${year}`;
};
const hhmmss = (
  time,
  symbol = ":",
  hourText = "h",
  minText = "m",
  secondText = "s"
) => {
  try {
    const hour =
      time.getHours() >= 10 ? time.getHours() : `0${time.getHours()}`;
    const min =
      time.getMinutes() >= 10 ? time.getMinutes() : `0${time.getMinutes()}`;
    const second =
      time.getSeconds() >= 10 ? time.getSeconds() : `0${time.getSeconds()}`;
    return `${hour}${hourText} ${symbol} ${min}${minText} ${symbol} ${second}${secondText}`;
  } catch (err) {
    return "";
  }
};
const hhmm = (time, symbol = ":", hourText = "h", minText = "") => {
  try {
    const hour =
      time.getHours() >= 10 ? time.getHours() : `0${time.getHours()}`;
    const min =
      time.getMinutes() >= 10 ? time.getMinutes() : `0${time.getMinutes()}`;
    return `${hour}${hourText} ${symbol} ${min}${minText}`;
  } catch (err) {
    return "";
  }
};
const ddmmyyhhmm = (date, symbolDate = "/", symbolTime = ":") => {
  if (date) {
    return ddmmyy(date, symbolDate) + " " + hhmm(date, symbolTime);
  }
  return null;
};

const formatDateToShow = (date) => {
  const inputDate = new Date(date);
  const now = new Date();
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const oneHourInMs = 1000 * 60 * 60;
  const oneMinuteInMs = 1000 * 60;
  const diffInDays = Math.floor(
    (now.getTime() - inputDate.getTime()) / oneDayInMs
  );
  const diffInHours = Math.floor(
    (now.getTime() - inputDate.getTime()) / oneHourInMs
  );
  const diffInMinutes = Math.floor(
    (now.getTime() - inputDate.getTime()) / oneMinuteInMs
  );
  if (diffInDays > 0) return `${diffInDays} ngày trước`;
  if (diffInHours > 0) return `${diffInHours} giờ trước`;
  if (diffInMinutes > 0) return `${diffInMinutes} phút trước`;
  return "ngay bây giờ";
};

export { ddmmyy, hhmm, hhmmss, ddmmyyhhmm, formatDateToShow };
