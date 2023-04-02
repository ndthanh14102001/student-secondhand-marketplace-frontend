import axios from "axios";

const METHOD_MUST_DATA = ["post", "put", "patch"];
const METHOD_MUST_NOT_DATA = ["request", "get", "delete", "head", "options"];

const SERVER_CONNECT_ERROR = "Server connection failed!";
const NETWORK_ERROR = "Network not connected";

const RESPONSE_TYPE = "response";
const ERROR_TYPE = "error";
const STATUS_FORBIDDEN_ERROR = 403;
const STATUS_ERROR_SERVER = 500;
const STATUS_NOT_FOUND = 404;
const STATUS_BAD_REQUEST = 400;
const ERROR_AUTHORIZE = 401;
const ERROR_NETWORK_AXIOS_STATUS = "ERR_NETWORK";
const createResponse = (type, status, data) => {
  return {
    type,
    status,
    data
  };
};
const callApi = async ({ url, method, data, headers, params }) => {
  try {
    let response = {};
    if (METHOD_MUST_NOT_DATA.includes(method)) {
      response = await axios[method](url, { headers, params });

    } else if (METHOD_MUST_DATA.includes(method)) {
      response = await axios[method](url, data, { headers, params });
    }
    return createResponse(RESPONSE_TYPE, response.status, response.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    if (error.response) {
      return createResponse(ERROR_TYPE, error.response.status, error.response.data);
    }
    if (!window.navigator.onLine && !error.response && error.code === ERROR_NETWORK_AXIOS_STATUS) {
      return createResponse(ERROR_TYPE, NETWORK_ERROR, error);
    }
    return createResponse(ERROR_TYPE, SERVER_CONNECT_ERROR, error);

  }
};
// Example
// React.useEffect(() => {
//   const testAPI = async () => {
//     const result = await callApi({
//       url: "http://localhost:8000/v1/auth/login",
//       method: "post",
//       data: {
//         "username": "nguyenducthanh123",
//         "password": "nguyenducthanh1233"
//       }
//     });
//     if (result.type === RESPONSE_TYPE) {
//       // Handle data receive from Server
//       console.log("response", result);
//     } else if (result.type === ERROR_TYPE) {
//       // Handle Error
//       console.log("error", result);
//     }
//   };
//   testAPI();
// }, []);
export default callApi;
export {
  NETWORK_ERROR,
  SERVER_CONNECT_ERROR,
  RESPONSE_TYPE,
  ERROR_TYPE,
  STATUS_FORBIDDEN_ERROR,
  STATUS_ERROR_SERVER,
  STATUS_NOT_FOUND,
  STATUS_BAD_REQUEST,
  ERROR_AUTHORIZE
};