import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import propertyDetails from "./slices/propertyDetails";
import searchSlice from "./slices/searchSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    property: propertyDetails,
    search: searchSlice,
  },
});

export default store;
