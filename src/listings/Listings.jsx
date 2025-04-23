import React, { useEffect } from "react";
import ListingsHeader from "./ListingHeader";
import ListingsBody from "./ListingsBody";
import ListingAds from "./ListingAds";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
const Listings = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <ListingsHeader />
      <div className="flex flex-col lg:flex-row w-full justify-between h-auto  pt-30 sm:pt-24 md:pt-24 lg:pt-20 gap-4">
        <div className="flex w-full max-w-[1400px] flex-col md:flex-row gap-2">
          <div className="w-full md:w-[70%]">
            <ListingsBody />
          </div>
          <div className="hidden md:block w-full md:w-[30%]">
            <ListingAds />
          </div>
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
export default Listings;
