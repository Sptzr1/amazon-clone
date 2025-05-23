import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false
      state.products = action.payload
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
  },
})

export const { fetchProductsStart, fetchProductsSuccess, fetchProductsFailure, selectProduct } = productSlice.actions

export default productSlice.reducer
