import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaMapMarkerAlt, FaParking, FaBed, FaBath } from "react-icons/fa";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../../store/slices/searchSlice";
import config from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../auth/Login";
import useWhatsappHook from "../utilities/useWhatsappHook";
const PropertyListing = () => {
  const searchData = useSelector((state) => state.search);
  const [activeTab, setActiveTab] = useState("Latest");
  const [property, setProperty] = useState([]);
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/listings");
  };
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return "N/A";
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchLatestProperties = async () => {
      setLoading(true);
      setProperty([]);
      try {
        const isSellTab = activeTab === "Latest" || activeTab === "Sell";
        const propertyFor = isSellTab ? "Sell" : "Rent";
        const response = await fetch(
          `${config.awsApiUrl}/listings/v1/getLatestProperties?property_for=${propertyFor}`
        );
        const data = await response.json();
        setProperty(data.properties);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestProperties();
  }, [activeTab, searchData.property_for]);
  const [likedProperties, setLikedProperties] = useState([]);
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) return;
      const { userDetails } = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/v1/getAllFavourites?user_id=${userDetails.user_id}`
        );
        const data = await response.data;
        const liked = data.favourites;
        if (liked && Array.isArray(liked)) {
          const likedIds = liked.map((fav) => fav.property_id);
          setLikedProperties(likedIds);
        }
      } catch (error) {
        console.error("Failed to fetch liked properties:", error);
      }
    };
    fetchLikedProperties();
  }, []);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setSearchData({
        tab: activeTab,
        property_for:
          activeTab === "Latest"
            ? "Sell"
            : activeTab === "Sell"
            ? "Sell"
            : "Rent",
      })
    );
  }, [activeTab, dispatch]);
  const { handleAPI } = useWhatsappHook();
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
      const { userDetails } = JSON.parse(data);
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
    } catch (err) {
      console.error("Enquiry Failed:", err);
      alert("Something went wrong while submitting enquiry");
    }
  };
  const handleLike = async (property) => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.info("Please Login to Save Property!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const { userDetails } = JSON.parse(data);
    const isAlreadyLiked = likedProperties.includes(
      property.unique_property_id
    );
    setLikedProperties((prev) =>
      isAlreadyLiked
        ? prev.filter((id) => id !== property.unique_property_id)
        : [...prev, property.unique_property_id]
    );
    const payload = {
      property_id: property.unique_property_id,
      user_id: userDetails.user_id,
      name: userDetails.name,
      email: userDetails.email,
      mobile: userDetails.mobile,
      property_name: property.property_name,
      property_image: property.image,
      property_cost: property.property_cost,
      property_type: property.property_type,
      property_in: property.property_in,
      bathroom: property.bathroom,
      parking: property.parking,
      car_parking: property.car_parking,
      builtup_area: property.builtup_area,
      builtup_unit: property.builtup_unit,
      created_user_id: property.user_id,
      status: isAlreadyLiked ? 1 : 0,
    };
    try {
      await axios.post(`${config.awsApiUrl}/fav/v1/postIntrest`, payload);
    } catch (err) {
      console.error("Error updating interest:", err);
    }
  };
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const handleNavigation = useCallback(
    (property) => {
      navigate("/property", { state: property });
    },
    [navigate]
  );
  const handleShare = (property) => {
    const propertyId = property.unique_property_id;
    const propertyNameSlug = property.property_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
    const locationSlug = property.location_id
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/(^_|_$)/g, "");
    const propertyFor = property.property_for === "Rent" ? "rent" : "buy";
    const category =
      property.property_type === "Plot"
        ? "plots"
        : property.property_type === "Commercial"
        ? "properties"
        : "projects";
    const shareUrl = `${window.location.origin}/${propertyFor}/${category}/${propertyId}_${propertyNameSlug}_in_${locationSlug}`;
    const shareData = {
      title: `${property.property_name} - ${property.location_id}`,
      text: `Check out this ${property.bedrooms || ""} BHK ${
        property.property_type
      } for ${propertyFor} in ${property.location_id}! Price: ₹${
        propertyFor === "rent"
          ? formatPrice(property.monthly_rent)
          : formatPrice(property.property_cost)
      }${propertyFor === "rent" ? " / month" : ""}.`,
      url: shareUrl,
    };
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("Property shared successfully"))
        .catch((error) => console.error("Error sharing property:", error));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert(
            "Property link copied to clipboard! You can paste it to share."
          );
        })
        .catch((error) => {
          console.error("Error copying link:", error);
          alert("Failed to copy link. Please copy this URL: " + shareUrl);
        });
    }
  };
  return (
    <div className=" z-auto mx-auto px-4 py-1">
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
              onClick={() => setActiveTab("Latest")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "Latest"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab("Sell")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "Sell"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Sell
            </button>
            <button
              onClick={() => setActiveTab("Rent")}
              className={`px-6 py-1 rounded-full border cursor-pointer border-black ${
                activeTab === "Rent"
                  ? "bg-[#1D3A76] text-white"
                  : "bg-white text-black"
              }`}
            >
              Rent
            </button>
          </div>
          <div>
            <button
              className="text-[#1D3A76] cursor-pointer underline hover:text-yellow-500 font-small flex items-center"
              onClick={handleNavigate}
            >
              View All
            </button>
          </div>
        </div>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10 overflow-hidden h-[550px] lg:h-[500px]"
      >
        {loading ? (
          <div className="text-center py-10 text-[#1D3A76] font-semibold">
            Loading properties...
          </div>
        ) : property.length > 0 ? (
          property.map((property) => (
            <SwiperSlide key={property.unique_property_id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
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
                    className="w-full h-64 object-fit rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`;
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#F0AA00] text-black px-3 py-1 rounded-full text-sm">
                      For {""}
                      {property.property_for === "Sell"
                        ? "Sale"
                        : property.property_for}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {likedProperties.includes(property.unique_property_id) ? (
                      <IoIosHeart
                        onClick={() => handleLike(property)}
                        className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 cursor-pointer"
                      />
                    ) : (
                      <IoIosHeartEmpty
                        onClick={() => handleLike(property)}
                        className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 hover:text-red-500 cursor-pointer"
                      />
                    )}
                    <IoShareSocialOutline
                      onClick={() => handleShare(property)}
                      className="p-1 w-7 h-7 bg-white rounded-2xl text-black hover:text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-4 cursor-pointer">
                  <div className="flex items-center text-gray-600 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-gray-500" />
                    <span>{property.location_id}</span>
                  </div>
                  <h3
                    className="text-xl font-bold text-[#1D3A76] text-left  mb-2"
                    onClick={() => handleNavigation(property)}
                  >
                    {property.property_name}
                  </h3>
                  <div
                    className="grid grid-cols-3 gap-2 mb-4 text-sm text-gray-700"
                    onClick={() => handleNavigation(property)}
                  >
                    {property?.bedrooms > 0 && (
                      <div className="flex items-center">
                        <FaBed className="mr-2" /> {property.bedrooms} Beds
                      </div>
                    )}
                    {property?.bathroom > 0 && (
                      <div className="flex items-center">
                        <FaBath className="mr-2" /> {property.bathroom} Baths
                      </div>
                    )}
                    {property?.car_parking > 0 && (
                      <div className="flex items-center">
                        <FaParking className="mr-2" /> {property.car_parking}{" "}
                        Car Parking
                      </div>
                    )}
                    {property?.bike_parking > 0 && (
                      <div className="flex items-center">
                        <FaParking className="mr-2" /> {property.bike_parking}{" "}
                        Bike Parking
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-lg font-bold text-[#1D3A76]">
                      ₹{" "}
                      {formatPrice(
                        activeTab === "Rent"
                          ? property?.monthly_rent
                          : property.property_cost
                      )}
                      {activeTab === "Rent" && property?.monthly_rent
                        ? " / month"
                        : ""}
                    </div>
                    <button
                      onClick={() => handleEnquireNow(property)}
                      className="bg-[#1D3A76] text-white px-6 py-2 rounded-full hover:bg-yellow-500 hover:text-black"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">
            No properties found.
          </div>
        )}
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
export default PropertyListing;
