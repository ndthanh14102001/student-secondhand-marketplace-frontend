import callApi from "../utils/callApi";
import { getUserLogin } from "../utils/userLoginStorage";
const wishlistApi = {
  getWishlist: async () => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/me",
      method: "get",
      headers: {
        "authorization": getUserLogin().token,
      },
      params: {
        populate: {
          product_likes: true
        },
      }
    })
    return response;
  },
  getWishlistPopulateAll: async () => {
    const response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/me",
      method: "get",
      headers: {
        "authorization": getUserLogin().token,
      },
      params: {
        populate: {
          product_likes: {
            populate: "*"
          }
        },
      }
    })
    return response;
  },
  updateWishlist: async ({ wishlist }) => {
    const userLogin = getUserLogin().user;
    let response = await callApi({
      url: process.env.REACT_APP_API_ENDPOINT + "/users/" + userLogin.id,
      method: "put",
      data: {
        product_likes: wishlist
      },
    })
    return response;
  }
}
export default wishlistApi;