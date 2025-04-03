import React from "react";
import {
  FaHeart,
  FaShareAlt,
  FaMapMarkerAlt,
  FaParking,
  FaBed,
  FaBath,
} from "react-icons/fa";
import { FaRulerCombined, FaEye, FaBuilding } from "react-icons/fa";
const dealProperties = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Elegant Studio Flat",
    location: "Hyderabad, Telangana, India",
    price: "31988000",
    sqft: "1,200",
    facing: "East Facing",
    type: "BHK",
    parking: true,
    bathrooms: true,
    tag: "For Sale",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    title: "Elegant Studio Flat",
    location: "Hyderabad, Telangana, India",
    price: "310000",
    sqft: "1,200",
    facing: "East Facing",
    type: "BHK",
    parking: true,
    bathrooms: true,
    tag: "For Sale",
  },
];
const DealProperties = () => {
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Best Deal Properties
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
        <button className="text-[#1D3A76] cursor-pointer underline hover:text-blue-700 font-small flex items-center">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {dealProperties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row"
          >
            <div className="relative w-full md:w-3/5">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                  {property.tag}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors">
                  <FaHeart />
                </button>
                <button className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-500 transition-colors">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col justify-between w-full md:w-3/5">
              <div>
                <h3 className="text-xl text-left font-semibold mb-2">
                  {property.title}
                </h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <FaMapMarkerAlt className="mr-2 text-gray-600" />
                  <span>{property.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <span className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full mr-2">
                      <FaRulerCombined className="text-gray-400" />
                    </span>
                    <span>{property.area} Sq.yd</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full mr-2">
                      <FaEye className="text-gray-400" />
                    </span>
                    <span>{property.facing}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full mr-2">
                      <FaParking className="text-gray-400" />
                    </span>
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full mr-2">
                      <FaBath className="text-gray-400" />
                    </span>
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
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
export default DealProperties;
