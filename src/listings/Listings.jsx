import React from "react";
import ListingsHeader from "./ListingHeader";
import ListingsBody from "./ListingsBody";
import ListingAds from "./ListingAds";
import Footer from "../components/Footer";

const Listings = () => {
  return (
    <>
      <ListingsHeader />
      <div className="flex w-full justify-between h-auto p-5 bg-[#F5F5F5]">
        <ListingsBody />
        <ListingAds />
      </div>
      <Footer />
    </>
  );
};
export default Listings;
