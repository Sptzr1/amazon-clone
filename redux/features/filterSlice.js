import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  category: "",
  priceRange: { min: 0, max: 1000 },
  rating: 0,
  sortBy: "relevance",
  searchQuery: "",
}

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload
    },
    setPriceRange: (state, action) => {
      state.priceRange = action.payload
    },
    setRating: (state, action) => {
      state.rating = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    resetFilters: (state) => {
      return initialState
    },
  },
})

export const { setCategory, setPriceRange, setRating, setSortBy, setSearchQuery, resetFilters } = filterSlice.actions

export default filterSlice.reducer
