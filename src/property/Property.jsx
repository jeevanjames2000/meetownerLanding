import React from "react";

import Footer from "../components/Footer";
import PropertyHeader from "./PropertyHeader";
import PropertyBody from "./PropertyBody";
import PropertyAds from "./PropertyAds";

const Property = () => {
  return (
    <>
      <PropertyHeader />
      <div className="flex w-full justify-between h-auto p-5 bg-[#F5F5F5]">
        <PropertyBody />
        <PropertyAds />
      </div>
      <Footer />
    </>
  );
};
export default Property;
