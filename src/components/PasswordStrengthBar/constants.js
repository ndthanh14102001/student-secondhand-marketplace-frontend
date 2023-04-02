const ERROR = "error";
const SUCCESS = "success";
const WARNING = "warning";

const NEW_PASSWORD_MESSAGE_ERROR = "Mật khẩu: Yếu";
const NEW_PASSWORD_MESSAGE_WARNING = "Mật khẩu: Trung bình";
const NEW_PASSWORD_MESSAGE_SUCCESS = "Mật khẩu: Mạnh";

export {
  ERROR,
  SUCCESS,
  WARNING,
  NEW_PASSWORD_MESSAGE_ERROR,
  NEW_PASSWORD_MESSAGE_SUCCESS,
  NEW_PASSWORD_MESSAGE_WARNING
};

const PASS_WEAK = 0;
const PASS_MEDIUM = 2;
const PASS_HIGH = 3;

const ERROR_COLOR = "error";
const SUCCESS_COLOR = "success";
const WARNING_COLOR = "warning";
const checkStrengthPassword = (password) => {
  let strength = 0;
  if (password.length >= 6) {
    if (/[!@#$%^&*()_+\-=\\{};':"\\|,.<>/?]+/.test(password)) {
      strength++;
    }
    if (/[a-z]+/.test(password)) {
      strength++;
    }
    if (/[A-Z]+/.test(password)) {
      strength++;
    }
    if (/[0-9]+/.test(password)) {
      strength++;
    }
  }
  return strength;
};
export const getColorToPasswordStrength = (value) => {
  const passwordStrength = checkStrengthPassword(value);
  if (passwordStrength <= PASS_WEAK) {
    return ERROR_COLOR;
  } else if (passwordStrength <= PASS_MEDIUM) {
    return WARNING_COLOR;
  } else if (passwordStrength >= PASS_HIGH) {
    return SUCCESS_COLOR;
  }
};
export {
  PASS_WEAK,
  PASS_MEDIUM,
  PASS_HIGH
};
export default checkStrengthPassword;