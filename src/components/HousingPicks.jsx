import React, { useState, useEffect, useRef, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import config from "../../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../auth/Login";
import { setPropertyData } from "../../store/slices/propertyDetails";
import { useDispatch, useSelector } from "react-redux";

const HousingPicks = () => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef(null);
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            swiperRef.current?.slideNext();
            return 0;
          }
          return prevProgress + 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, []);
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  const [property, setProperty] = useState([]);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      setProperty([]);
      try {
        const response = await fetch(
          `${config.awsApiUrl}/listings/v1/getBestMeetowner`
        );
        const data = await response.json();
        setProperty(data.results);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };
    fetchLatestProperties();
  }, []);
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
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };

  const handleContactSeller = async (property) => {
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
        unique_property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      const SubType =
        property.sub_type === "Apartment"
          ? `${property?.sub_type} ${property?.bedrooms}BHK`
          : property?.sub_type;
      const smspayload = {
        name: userDetails?.name,
        mobile: userDetails?.mobile,
        sub_type: SubType,
        location: property?.location_id.split(/[\s,]+/)[0],
        property_cost: formatToIndianCurrency(property?.property_cost),
        ownerMobile: property?.mobile || property?.phone || "N/A",
      };

      await axios.post(
        `${config.awsApiUrl}/enquiry/v1/sendLeadTextMessage`,
        smspayload
      );
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
    } catch (err) {
      toast.error("Something went wrong! Please try again");
    }
  };
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="mx-auto px-4 py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Best Meetowner
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
          <p className="flex items-start mt-1 font-normal">
            Explore Top-Tier Homes with Ease
          </p>
        </div>
        <div className="mt-4 md:mt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full md:w-auto">
          {property.slice(0, 2).map((property) => (
            <div
              key={property.id}
              className="relative rounded-lg overflow-hidden w-full md:w-72 h-40 lg:h-30 sm:h-30 md:h-30"
            >
              <img
                src={
                  property.image
                    ? `https://api.meetowner.in/uploads/${property.image}`
                    : `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`
                }
                onClick={() => handleNavigation(property)}
                alt={property?.property_name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400?text=${
                    property?.property_name || "No Image Found"
                  }`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-semibold">
                  {property.property_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1.4}
            slidesOffsetBefore={0}
            slidesOffsetAfter={20}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            className="pb-10 overflow-hidden h-[500px] lg:h-[450px]"
          >
            {property.map((property) => (
              <SwiperSlide key={property.unique_property_id}>
                <div className="flex flex-col md:flex-row h-100 bg-white rounded-lg shadow-lg overflow-hidden">
                  <div
                    onClick={() => handleNavigation(property)}
                    className="w-full md:w-1/3 p-6 text-white flex flex-col justify-between text-left bg-gradient-to-r from-[#1D3A76] via-[#1D3A76] to-orange-500 bg-[length:110%_100%] bg-[position:0%_0%]"
                  >
                    <div>
                      <h3 className="text-2xl font-bold">
                        {property.property_name}
                      </h3>
                      <p className="text-white">{property.location_id}</p>
                      <div className="mt-2">
                        <p className="text-xl font-bold text-[#fff]">
                          ₹{formatPrice(property.property_cost)} - ₹
                          {formatPrice(property.property_cost * 1.2)}
                        </p>
                        <p className="text-white/80">
                          {property.property_in} {property.sub_type}
                        </p>
                      </div>
                    </div>
                    <button
                      className="mt-4 !bg-[#fff] text-black w-fit px-10 py-2 rounded-full hover:!bg-yellow-500 hover:text-black hover:border-1 hover:border-black"
                      onClick={() => handleContactSeller(property)}
                    >
                      Contact
                    </button>
                  </div>
                  {}
                  <div className="w-full md:w-2/3 relative">
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
                      className="w-full h-[250px] md:h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/600x400?text=${
                          property?.property_name || "No Image Found"
                        }`;
                      }}
                    />
                    <a
                      href="#"
                      className="absolute top-4 right-4 text-white font-bold hover:text-blue-900  transition-colors"
                    >
                      View Project
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev !text-white !bg-black/30 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
            <div className="swiper-button-next !text-white !bg-black/30 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
          </Swiper>
        </div>
      </div>
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
export default HousingPicks;
