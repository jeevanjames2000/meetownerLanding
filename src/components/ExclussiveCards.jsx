import React, { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { setPropertyData } from "../../store/slices/propertyDetails";
import { useDispatch, useSelector } from "react-redux";

const ExclussiveCards = () => {
  const [property, setProperty] = useState([]);

  useEffect(() => {
    const fetchMeetownerExclusive = async () => {
      setProperty([]);
      try {
        const response = await fetch(
          `${config.awsApiUrl}/listings/v1/getMeetOwnerExclusive`
        );
        const data = await response.json();
        setProperty(data.results);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };
    fetchMeetownerExclusive();
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);


  const handleNavigation = useCallback(
    (property) => {
      dispatch(
        setPropertyData({
          propertyName: property.property_name,
          location: property.location_id,
        })
      );
      const propertyFor = property?.property_for === "Rent" ? "rent" : "buy";

      const propertyId = property.unique_property_id;
      const propertyNameSlug = property.property_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^-|-$)/g, "");
      const locationSlug = property.location_id
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^-|-$)/g, "");
      const seoUrl = `${propertyFor}_${property.sub_type}_${propertyNameSlug}_in_${locationSlug}_${searchData?.city}_Id_${propertyId}`;
      navigate(`/property?${seoUrl}`, { state: property });
    },
    [navigate, dispatch, searchData]
  );

  return (
    <div className="mx-auto px-4 py-2">
      <div className="relative">
        <h2 className="text-3xl font-bold text-gray-900 text-left">
          Meet Owner Exclusive
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
        {property.map((property, index) => (
          <SwiperSlide key={index}>
            <div className="relative bg-white shadow-lg rounded-lg overflow-hidden group">
              <img
                src={
                  property.image
                    ? `https://api.meetowner.in/uploads/${property.image}`
                    : `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`
                }
                alt={property?.property_name}
                crossOrigin="anonymous"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400?text=${
                    property?.property_name || "No Image Found"
                  }`;
                }}
              />

              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="bg-white text-[#1D3A76] px-4 py-2 rounded-full font-semibold shadow-md hover:bg-[#1D3A76] hover:text-white transition-all"
                  onClick={() => handleNavigation(property)}
                >
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
            width: 10px;
            height: 10px;
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
export default ExclussiveCards;
