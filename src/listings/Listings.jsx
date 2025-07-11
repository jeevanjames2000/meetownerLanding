import React, { useEffect, useRef, useState } from "react";
import ListingsHeader from "./ListingHeader";
import ListingsBody from "./ListingsBody";
import ListingAds from "./ListingAds";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import LoginModal from "../utilities/LoginModal";
import { Helmet } from "react-helmet-async";
const Listings = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };

  return (
    <>
      <Helmet>
        <title>Buy Properties in Hyderabad | Listings | MeetOwner</title>
        <meta
          name="description"
          content="Browse listings of apartments for sale in Hyderabad on MeetOwner."
        />
      </Helmet>
      <ListingsHeader />
      <div className="flex flex-col lg:flex-row w-full justify-center h-auto  pt-30 sm:pt-24 md:pt-24 lg:pt-20 gap-4">
        <div className="flex w-full max-w-[1400px] flex-col md:flex-row gap-6">
          <div className="w-full md:w-[70%]">
            <ListingsBody setShowLoginModal={setShowLoginModal} />
          </div>
          <div className="hidden md:block z-0  w-full md:w-[30%]">
            <ListingAds />
          </div>
        </div>
      </div>
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        onClose={handleClose}
        modalRef={modalRef}
      />
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
