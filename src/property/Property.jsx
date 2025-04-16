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

      <div className="flex flex-col lg:flex-row w-full  justify-between h-auto p-5 mx-5 pt-2 bg-[#F5F5F5] gap-4">
        <div className="w-full lg:w-[80%]">
          <PropertyBody />
        </div>

        <div className="hidden lg:block w-[20%]">
          <PropertyAds />
        </div>
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
