import React, { useCallback, useEffect, useRef, useState } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../auth/Login";
import { useNavigate } from "react-router-dom";
import useWhatsappHook from "../utilities/useWhatsappHook";
import { useDispatch, useSelector } from "react-redux";
import { setPropertyData } from "../../store/slices/propertyDetails";

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
          `${config.awsApiUrl}/listings/v1/getBestDeals`
        );
        const data = await response.json();
        setProperty(data.results);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };
    fetchLatestProperties();
  }, []);
  const { handleAPI, error } = useWhatsappHook();

  const handleEnquireNow = async (property) => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Enquire Property!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowLoginModal(true);
        return;
      }
      const userDetails = JSON.parse(data);
      const payload = {
        property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        name: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
        interested_status: 4,
        property_user_id: property.user_id,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/v1/postEnquiry`, payload);
      await handleAPI(property);
      // toast.success("Enquire submitted successfully!");
    } catch (err) {
      console.error("Enquiry Failed:", err);
      alert("Something went wrong while submitting enquiry");
    }
  };
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);

  const handleNavigation = useCallback(
    async (property) => {
      let userDetails = null;
      try {
        const data = localStorage.getItem("user");
        if (data) {
          const parsedData = JSON.parse(data);
          userDetails = parsedData || null;
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        userDetails = null;
      }
      if (userDetails?.user_id) {
        const viewData = {
          user_id: userDetails.user_id,
          property_id: property?.unique_property_id || "N/A",
          name: userDetails?.name || "N/A",
          mobile: userDetails?.mobile || "N/A",
          email: userDetails?.email || "N/A",
          property_name: property?.property_name || "N/A",
        };
        try {
          await axios.post(
            `${config.awsApiUrl}/listings/v1/propertyViewed`,
            viewData
          );
        } catch (error) {
          console.error("Failed to record property view:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
        }
      }
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
  const handleNavigate = () => {
    const propertyFor = searchData?.tab === "Rent" ? "rent" : "sale";

    const propertyType = (() => {
      switch (searchData?.sub_type) {
        case "Plot":
          return "plots";
        case "Commercial":
          return "commercial-properties";
        case "Rent":
        case "Buy":
        default:
          return "apartments";
      }
    })();
    const citySlug = searchData.location
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
    const locationSlug = searchData.city
      ? searchData.city
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^_|_$)/g, "")
      : "";
    const seoUrl = `?${propertyType}_for_${propertyFor}_in_${citySlug}${
      locationSlug ? `_${locationSlug}` : ""
    }`;
    const params = {
      city: searchData.location,
      property_for: searchData?.property_for === "Rent" ? "Rent" : "Sell",
      property_type:
        searchData.tab === "Plot"
          ? "Plot"
          : searchData.tab === "Commercial"
          ? "Commercial"
          : "Apartment",
      location: searchData.location,
    };
    navigate(`/listings${seoUrl}`, { state: params });
  };

  return (
    <div className="px-4 py-12">
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
          <button
            onClick={handleNavigate}
            className="text-[#1D3A76] cursor-pointer underline hover:text-yellow-500 font-small flex items-center"
          >
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
        className="pb-10 overflow-hidden h-[640px] lg:h-[350px]"
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
                onClick={() => handleNavigation(property)}
                alt="Property"
                crossOrigin="anonymous"
                className="w-full lg:w-60 h-70 max-h-70 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400?text=${
                    property?.property_name || "No Image Found"
                  }`;
                }}
              />
              <div
                onClick={() => handleNavigation(property)}
                className="p-4 w-full lg:w-2/2 flex flex-col justify-between cursor-pointer"
              >
                <h3 className="text-start text-xl font-semibold mb-2">
                  {property.property_name}
                </h3>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-600" />
                  <span>{property.location_id}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-sm text-gray-600">
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
                <div
                  onClick={() => handleNavigation(property)}
                  className="text-sm text-[#A4A4A4] font-medium mt-2 flex flex-wrap items-center gap-1"
                >
                  <p>Highlights:</p>
                  {[
                    property?.facing && `${property.facing} Facing`,
                    property?.bedrooms && `${property?.bedrooms} BHK`,
                    property?.property_in &&
                      property?.sub_type &&
                      `${property.property_in} ${property.sub_type}`,
                  ]
                    .filter(Boolean)
                    .map((item, index, arr) => (
                      <React.Fragment key={index}>
                        <p>{item}</p>
                        {index !== arr.length - 1 && (
                          <span className="text-gray-500">|</span>
                        )}
                      </React.Fragment>
                    ))}
                </div>
                {(property?.facilities ||
                  property?.car_parking ||
                  property?.bike_parking ||
                  property?.private_washrooms ||
                  property?.public_washrooms ||
                  property?.public_parking ||
                  property?.private_parking) && (
                  <div className="text-sm text-[#A4A4A4] font-medium mt-2 flex flex-wrap items-center gap-1">
                    <p>Amenities:</p>
                    {property?.facilities
                      ? property?.facilities
                          .split(",")
                          .slice(0, 5)
                          .map((facility, index) => (
                            <React.Fragment key={index}>
                              <p>{facility.trim()}</p>
                              {index !== 4 && (
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full inline-block mx-1" />
                              )}
                            </React.Fragment>
                          ))
                      : [
                          property?.car_parking &&
                            `${property?.car_parking} Car Parking`,
                          property?.bike_parking &&
                            `${property?.bike_parking} Bike Parking`,
                          property?.private_washrooms && "Private Washroom",
                          property?.public_washrooms && "Public Washroom",
                          property?.public_parking && "Public Parking",
                          property?.private_parking && "Private Parking",
                        ]
                          .filter(Boolean)
                          .map((item, index, arr) => (
                            <React.Fragment key={index}>
                              <p>{item}</p>
                              {index !== arr.length - 1 && (
                                <span className="text-gray-500">|</span>
                              )}
                            </React.Fragment>
                          ))}
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xl font-bold text-[#1D3A76]">
                    ₹ {formatPrice(property.property_cost)}
                  </div>
                  <button
                    className="bg-[#1D3A76] text-white px-4 py-2 rounded-full"
                    onClick={() => handleEnquireNow(property)}
                  >
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
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
          <div ref={modalRef} className="relative w-[90%] max-w-sm">
            <Login
              setShowLoginModal={setShowLoginModal}
              showLoginModal={showLoginModal}
              onClose={handleClose}
              modalRef={modalRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default DealProperties;
