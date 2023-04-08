import callApi from "../utils/callApi"

export const forgotPasswordApi = {
  forgotPassword: async (email) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/auth/forgot-password",
      method: "post",
      data: {
        email,
      }
    })
    return response;
  },
  creatNewPassword: async (code, password, confirmPassword) => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/auth/reset-password",
      method: "post",
      data: {
        code,
        password,
        passwordConfirmation: confirmPassword
      }
    })
    return response;
  }
}