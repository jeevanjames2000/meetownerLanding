import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import propertyDetails from "./slices/propertyDetails";

const store = configureStore({
  reducer: {
    auth: authSlice,
    property: propertyDetails,
  },
});

export default store;
