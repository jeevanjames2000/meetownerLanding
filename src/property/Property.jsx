import React, { useEffect } from "react";
import Footer from "../components/Footer";
import PropertyHeader from "./PropertyHeader";
import PropertyBody from "./PropertyBody";
import PropertyAds from "./PropertyAds";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Breadcrumb from "../utilities/BreadCrumb";
const Property = () => {
  const { state: property } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <PropertyHeader />
      <div className="flex flex-col lg:flex-row w-full justify-between h-auto p-5 pt-20 sm:pt-20 md:pt-20 lg:pt-20 gap-3">
        <div className="w-full lg:w-[70%]">
          <Breadcrumb />
          <PropertyBody />
        </div>
        <div className="hidden lg:block w-[30%]">
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
