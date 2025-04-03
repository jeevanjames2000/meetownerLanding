import React, { useState } from "react";
import { FaMapMarkerAlt, FaParking, FaBed, FaBath } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const properties = [
  {
    id: 1,
    type: "sell",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Luxury Villa with Pool",
    location: "Beverly Hills, CA",
    price: "2000000",
    sqft: "4,500",
    beds: "5",
    baths: "4",
    parking: "2",
    tag: "For Sale",
  },
  {
    id: 2,
    type: "rent",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Modern Downtown Apartment",
    location: "Manhattan, NY",
    price: "500000",
    sqft: "1,200",
    beds: "2",
    baths: "2",
    parking: "1",
    tag: "For Rent",
  },
  {
    id: 3,
    type: "sell",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Cozy Family Home",
    location: "Seattle, WA",
    price: "850000",
    sqft: "2,800",
    beds: "4",
    baths: "3",
    parking: "2",
    tag: "For Sell",
  },
];
const PropertyListing = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const filteredProperties =
    activeTab === "latest"
      ? properties
      : properties.filter((prop) => prop.type === activeTab);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/listings");
  };
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-1">
      <div className="mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Latest Properties
          </h2>
          <svg
            viewBox="0 0 120 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-44 ml-2 h-4 mt-2 flex items-center"
          >
            <path
              d="M2 6 C20 14, 50 -6, 118 6"
              stroke="#F0AA00"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "latest"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab("sell")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "sell"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Sell
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "rent"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Rent
            </button>
          </div>
          <div>
            <button
              className="text-[#1D3A76] cursor-pointer underline hover:text-blue-700 font-small flex items-center"
              onClick={handleNavigate}
            >
              View All
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  {property.tag}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <IoIosHeartEmpty className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 hover:text-red-500" />
                <IoShareSocialOutline className="p-1 w-7 h-7 bg-white rounded-2xl text-black hover:text-blue-500" />
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl text-[#1D3A76] text-left font-semibold mb-2">
                {property.title}
              </h3>
              <div className="flex items-center text-gray-500 mb-4">
                <FaMapMarkerAlt className="mr-2 text-gray-700" />
                <span>{property.location}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center">
                  <FaBed className="mr-2 text-gray-700" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center">
                  <FaBath className="mr-2 text-gray-700" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center">
                  <FaParking className="mr-2 text-gray-700" />
                  <span>{property.parking} Parking</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-[#1D3A76]">
                  ₹{formatPrice(property.price)}
                </div>
                <button className="!bg-[#1D3A76] text-white px-6 py-2 rounded-full hover:!bg-yellow-500 hover:text-black hover:border-1 hover:border-black">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PropertyListing;
