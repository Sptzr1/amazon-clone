import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./features/cartSlice"
import authReducer from "./features/authSlice"
import filterReducer from "./features/filterSlice"
import productReducer from "./features/productSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    filter: filterReducer,
    product: productReducer,
  },
})
