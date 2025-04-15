import React, { useEffect } from "react";

import Footer from "../components/Footer";
import PropertyHeader from "./PropertyHeader";
import PropertyBody from "./PropertyBody";
import PropertyAds from "./PropertyAds";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const Property = () => {
  const { state: property } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <PropertyHeader />

      <div className="flex w-full justify-between h-auto p-5 pt-2 bg-[#F5F5F5]">
        <PropertyBody />
        <PropertyAds />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
};
export default Property;
