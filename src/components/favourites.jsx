import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  MapPin,
  ChevronDown,
  ChevronUp,
  Ruler,
  Home,
  CreditCard,
  Key,
  ShieldCheck,
  Building2,
  Building,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  FaHeart,
  FaPhoneAlt,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import config from "../../config";
import axios from "axios";
import ScheduleFormModal from "../utilities/ScheduleForm";
import { toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
const Favourites = () => {
  const [likedProperties, setLikedProperties] = useState([]);
  console.log("likedProperties: ", likedProperties);
  const [loading, setLoading] = useState(true);
  const [readMoreStates, setReadMoreStates] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const fetchLikedProperties = async () => {
    const data = localStorage.getItem("user");
    if (!data) return;
    const { userDetails } = JSON.parse(data);
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/fav/getAllFavourites?user_id=${userDetails.user_id}`
      );
      const liked = response.data.favourites || [];
      setLikedProperties(liked);
    } catch (error) {
      console.error("Failed to fetch liked properties:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLikedProperties();
  }, []);
  const toggleReadMore = (index) => {
    setReadMoreStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const toggleFacilities = (index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const handleNavigation = (property) => {
    console.log("Navigate to:", property);
  };
  const handleLike = useCallback(
    async (property) => {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");
        return;
      }
      const { userDetails } = JSON.parse(data);
      console.log("userDetails: ", userDetails);

      const payload = {
        property_id: property.property_id,
        user_id: userDetails.user_id,
        property_name: property.property_name,
        property_image: property.property_image,
        property_cost: property.property_cost,
        status: 1,
      };
      try {
        await axios.post(`${config.awsApiUrl}/fav/postIntrest`, payload);
        fetchLikedProperties();
      } catch (err) {
        console.error("Error updating interest:", err);
      }
    },
    [likedProperties]
  );
  const handleScheduleVisit = (property) => {
    console.log("Schedule visit for:", property);
  };
  const handleContactSeller = (property) => {
    console.log("Contact seller for:", property);
  };
  const PropertyCard = memo(
    ({
      property,
      index,
      toggleReadMore,
      toggleFacilities,
      handleNavigation,
      readMoreStates,
      expandedCards,
      likedProperties,
      handleLike,
      handleScheduleVisit,
      handleContactSeller,
    }) => {
      const showReadMore = readMoreStates[index];
      const shortDescription = property.description?.slice(0, 180);
      const formatToIndianCurrency = (value) => {
        if (!value || isNaN(value)) return "N/A";
        const numValue = parseFloat(value);
        if (numValue >= 10000000)
          return (numValue / 10000000).toFixed(2) + " Cr";
        if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
        if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
        return numValue.toString();
      };
      return (
        <div
          key={`property-${index}`}
          className="flex flex-col md:flex-row w-[100%] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white cursor-pointer"
          onClick={() => handleNavigation(property)}
        >
          <div className="bg-[#F3F3F3] rounded-[20px] p-4 w-[100%] max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-[300px]">
                <div className="rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={
                      property.property_image
                        ? `https://api.meetowner.in/uploads/${property.property_image}`
                        : `https://placehold.co/600x400?text=${
                            property?.property_name || "No Image Found"
                          }`
                    }
                    alt="Property"
                    crossOrigin="anonymous"
                    className="w-full h-70 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`;
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 max-w-full md:max-w-[550px]">
                <div className="mb-3 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-[#1D3A76] font-bold text-[15px]">
                      {property.sub_type === "Apartment"
                        ? `${property.bedrooms} BHK ${
                            property.property_type
                              ? property.property_type
                              : property.sub_type || ""
                          } for ${property.property_for}`
                        : `${property.sub_type} for ${property.property_for}`}{" "}
                      in {property.locality_name}, {property.google_address}
                    </p>
                    <div className="flex items-center gap-2 text-[#1D3A76] text-sm font-medium">
                      {likedProperties.includes(property.unique_property_id) ? (
                        <IoIosHeart
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(property);
                          }}
                          className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 cursor-pointer"
                        />
                      ) : (
                        <IoIosHeartEmpty
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(property);
                          }}
                          className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 hover:text-red-500 cursor-pointer"
                        />
                      )}
                      <MdOutlineVerified className="text-xl text-green-500" />
                      <p>Verified</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-[#A4A4A4] font-semibold text-[18px]">
                      {property.property_name}
                    </p>
                    <p className="text-[#1D3A76] font-semibold text-[18px]">
                      {property.project_name || ""}{" "}
                      <span className="text-[#A4A4A4] font-medium text-[15px]">
                        Rs: {formatToIndianCurrency(property.property_cost)}{" "}
                        {property.price_negotiable && " (Negotiable)"}
                      </span>
                      <span className="text-[#A4A4A4] font-medium text-[15px] ml-2">
                        {property?.loan_facility === "Yes"
                          ? "EMI option Available"
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mb-4 relative">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[#A4A4A4] font-medium text-[15px]">
                      Property Details
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFacilities(index);
                      }}
                      className="text-[#1D3A76] cursor-pointer hover:text-[#A4A4A4] font-medium rounded-[5px] text-sm flex items-center gap-1"
                    >
                      {expandedCards[index] ? "Show Less" : "Show All"}
                      {expandedCards[index] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                    {(expandedCards[index]
                      ? [
                          {
                            icon: <Ruler className="w-4 h-4" />,
                            title: property?.builtup_area
                              ? "Built-up Area"
                              : "Built-up Units",
                            value: `${
                              property?.builtup_area ||
                              property?.builtup_unit ||
                              "N/A"
                            } ${property?.area_units || ""}`,
                          },
                          {
                            icon: <Home className="w-4 h-4" />,
                            title: "Facing",
                            value: property?.facing || "N/A",
                          },
                          {
                            icon: <Key className="w-4 h-4" />,
                            title: "Property In",
                            value: property?.property_in || "N/A",
                          },
                          {
                            icon: <Building className="w-4 h-4" />,
                            title: "Sub Type",
                            value: property?.sub_type || "N/A",
                          },
                          {
                            icon: <CreditCard className="w-4 h-4" />,
                            title: "Loan Facility",
                            value:
                              property?.loan_facility === "Yes"
                                ? "Available"
                                : "Not Available",
                          },
                          {
                            icon: <ShieldCheck className="w-4 h-4" />,
                            title: "Furnishing Status",
                            value: property?.furnished_status || "N/A",
                          },
                        ]
                      : [
                          {
                            icon: <Ruler className="w-4 h-4" />,
                            title: property?.builtup_area
                              ? "Built-up Area"
                              : "Built-up Units",
                            value: `${
                              property?.builtup_area ||
                              property?.builtup_unit ||
                              "N/A"
                            } ${property?.area_units || ""}`,
                          },
                          {
                            icon: <Home className="w-4 h-4" />,
                            title: "Facing",
                            value: property?.facing || "N/A",
                          },
                          {
                            icon: <Key className="w-4 h-4" />,
                            title: "Property In",
                            value: property?.property_in || "N/A",
                          },
                        ]
                    ).map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-inherit w-full p-2 rounded-lg shadow-sm text-xs text-[#1D3A76] font-medium flex flex-col sm:basis-1/3"
                      >
                        <span className="text-[11px] text-[#A4A4A4] mb-[2px]">
                          {detail.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {detail.icon}
                          <span className="text-sm text-[#1D3A76]">
                            {detail.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-[#A4A4A4] text-sm text-left">
                    {showReadMore
                      ? property.description
                      : `${shortDescription}... `}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleReadMore(index);
                      }}
                      className="text-[#1D3A76] font-normal cursor-pointer"
                    >
                      {showReadMore ? "Read Less..." : "Read More..."}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScheduleVisit(property);
                    }}
                    className="sm:flex-1 transition text-[15px] bg-[#59788E] rounded-[50px] px-4 py-2 text-[#ffffff] font-medium text-center"
                  >
                    Schedule Visit
                  </p>
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactSeller(property);
                    }}
                    className="sm:flex-1 transition text-[15px] bg-[#84A3B7] rounded-[50px] px-4 py-2 text-[#ffffff] font-medium text-center"
                  >
                    Contact Seller
                  </p>
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(property);
                    }}
                    className="sm:flex-1 transition text-[15px] bg-[#E28B6D] rounded-[50px] px-4 py-2 text-[#ffffff] font-medium text-center"
                  >
                    Interest
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  if (!likedProperties.length) {
    return (
      <>
        <Header />
        <div className="text-center py-10 h-100 text-gray-500">
          No favourites found.
        </div>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="flex flex-col gap-6 px-4 md:px-10 py-6">
        {likedProperties.map((property, index) => (
          <PropertyCard
            key={`fav-${property.unique_property_id}-${index}`}
            property={property}
            index={index}
            toggleReadMore={toggleReadMore}
            toggleFacilities={toggleFacilities}
            handleNavigation={handleNavigation}
            readMoreStates={readMoreStates}
            expandedCards={expandedCards}
            likedProperties={likedProperties.map((p) => p.unique_property_id)}
            handleLike={handleLike}
            handleScheduleVisit={handleScheduleVisit}
            handleContactSeller={handleContactSeller}
          />
        ))}
      </div>
      <Footer />
    </>
  );
};
export default Favourites;
