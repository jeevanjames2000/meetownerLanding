import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaShareAlt,
  FaMapMarkerAlt,
  FaParking,
  FaCompass,
  FaBath,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Pagination } from "swiper/modules";
import config from "../../config";
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
  {
    id: 3,
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
const formatPrice = (price) => {
  if (price >= 10000000) {
    return (price / 10000000).toFixed(2) + " Cr";
  } else if (price >= 100000) {
    return (price / 100000).toFixed(2) + " L";
  }
  return price.toLocaleString();
};
const DealProperties = () => {
  const [property, setProperty] = useState([]);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      setProperty([]);
      try {
        const response = await fetch(
          `${config.ngrok_url}/listings/getBestDeals`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await response.json();
        setProperty(data.results);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };
    fetchLatestProperties();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="relative flex items-center mb-4 justify-between">
        <div>
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
        <div>
          <button className="text-[#1D3A76] cursor-pointer underline hover:text-yellow-500 font-small flex items-center">
            View All
          </button>
        </div>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 2 },
        }}
        className="pb-10 overflow-hidden h-[500px] lg:h-[300px]"
      >
        {property.map((property) => (
          <SwiperSlide key={property?.unique_property_id}>
            <div className="bg-white rounded-lg shadow-lg border-1 border-gray-300 overflow-hidden flex flex-col lg:flex-row">
              <img
                src={
                  property.image
                    ? `https://api.meetowner.in/uploads/${property.image}`
                    : `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`
                }
                alt="Property"
                crossOrigin="anonymous"
                className="w-full lg:w-60 h-64 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400?text=${
                    property?.property_name || "No Image Found"
                  }`;
                }}
              />
              <div className="p-4 w-full lg:w-2/2 flex flex-col justify-between">
                <h3 className="text-start text-xl font-semibold mb-2">
                  {property.property_name}
                </h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-600" />
                  <span>{property.location_id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <FaCompass className="mr-2" /> {property?.facing}
                  </div>
                  <div className="flex items-center">
                    <FaParking className="mr-2" /> {property?.parking} Parking
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-2" /> {property?.bedrooms} Bedrooms
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xl font-bold text-[#1D3A76]">
                    ₹{formatPrice(property.property_cost)}
                  </div>
                  <button className="bg-[#1D3A76] text-white px-4 py-2 rounded-full">
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-pagination-custom flex justify-center"></div>

        <style jsx>{`
          .swiper-pagination-custom {
            display: flex;
            align-items: center;
          }
          .swiper-pagination-bullet {
            width: 12px;
            height: 12px;
            background: #d1d5db;
            opacity: 0.7;
            margin: 0 6px;
            border-radius: 50%;
          }
          .swiper-pagination-bullet-active {
            background: #1d3a76;
            opacity: 1;
          }
        `}</style>
      </Swiper>
    </div>
  );
};
export default DealProperties;
