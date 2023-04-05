import currencyReducer from "./currencyReducer";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import wishlistReducer from "./wishlistReducer";
import compareReducer from "./compareReducer";
import { combineReducers } from "redux";
import { createMultilanguageReducer } from "redux-multilanguage";
import modalLoadingReducer from "./modalLoadingReducer";
import userStorageReducer from "./userStorage";
import popupReducer from "./popupReducer";
import filterReducer from "./filterReducer"

const rootReducer = combineReducers({
  multilanguage: createMultilanguageReducer({ currentLanguageCode: "en" }),
  currencyData: currencyReducer,
  productData: productReducer,
  cartData: cartReducer,
  wishlistData: wishlistReducer,
  compareData: compareReducer,
  modalLoading: modalLoadingReducer,
  userStorage: userStorageReducer,
  popup: popupReducer,
  filter: filterReducer
});

export default rootReducer;
