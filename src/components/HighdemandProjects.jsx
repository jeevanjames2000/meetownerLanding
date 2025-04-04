import React from "react";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaCompass,
  FaBuilding,
  FaParking,
  FaBath,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const App = () => {
  const projects = [
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "630 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "120 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "80 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "60 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "200 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
    {
      title: "Moonglade",
      location: "Hyderabad, Telangana, India",
      size: "350 SQ.YD",
      facing: "East Facing",
      type: "BHK",
      parking: "Parking",
      bathrooms: "Bathrooms",
      price: "₹ 31.11L",
      image:
        "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
    },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-gray-900 text-left">
          High-demand projects to invest now
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
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="mt-6"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden group">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover"
              />

              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white text-[#1D3A76] px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#1D3A76] hover:text-white transition-all">
                  View Details
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="flex justify-center items-center gap-6 mt-6 max-w-fit mx-auto">
          <button className="swiper-button-prev-custom">
            <FaAngleLeft className="w-6 h-6 p-1 border border-gray-400 rounded-full hover:bg-gray-200" />
          </button>
          <div className="swiper-pagination-custom flex justify-center"></div>
          <button className="swiper-button-next-custom">
            <FaAngleRight className="w-6 h-6 p-1 border border-gray-400 rounded-full hover:bg-gray-200" />
          </button>
        </div>
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
export default App;
