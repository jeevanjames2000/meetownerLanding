import React from "react";

import Footer from "../components/Footer";
import PropertyHeader from "./PropertyHeader";
import PropertyBody from "./PropertyBody";
import PropertyAds from "./PropertyAds";
import { useLocation } from "react-router-dom";

const Property = () => {
  const { state: property } = useLocation();
  return (
    <>
      <PropertyHeader />

      <h1 className="text-blue-900 font-bold bg-[#F5F5F5] text-2xl">
        {property.property_name} PROPERTY DETAILS
      </h1>

      <div className="flex w-full justify-between h-auto p-5 pt-0 bg-[#F5F5F5]">
        <PropertyBody />
        <PropertyAds />
      </div>
      <Footer />
    </>
  );
};
export default Property;
