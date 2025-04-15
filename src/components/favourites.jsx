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
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import ScheduleFormModal from "../utilities/ScheduleForm";
import { toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import ListingAds from "../listings/ListingAds";
import DynamicAds from "../utilities/DynamicAds";
import useWhatsappHook from "../utilities/useWhatsappHook";
import Login from "../auth/Login";
const Favourites = () => {
  const [likedProperties, setLikedProperties] = useState([]);
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const [selectedProperty, setSelectedProperty] = useState(null);
  console.log("selectedProperty: ", selectedProperty);
  const { handleAPI, error } = useWhatsappHook(selectedProperty);
  useEffect(() => {
    if (selectedProperty) {
      handleAPI();
    }
  }, [selectedProperty, handleAPI]);
  const handleNavigation = (property) => {};
  const handleLike = useCallback(
    async (property) => {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");
        return;
      }
      const { userDetails } = JSON.parse(data);
      const payload = {
        property_id: property.property_id,
        user_id: userDetails.user_id,
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
    setSelectedProperty(property);
  };
  const handleContactSeller = async (property) => {
    console.log("property: ", property);
    setSelectedProperty(property);
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Contact!");
        setShowLoginModal(true);
        return;
      }
      const { userDetails } = JSON.parse(data);
      const payload = {
        unique_property_id: property.property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/contactSeller`, payload);
      await handleAPI(property);
      toast.success("Details submitted successfully");
    } catch (err) {
      toast.error("Something went wrong while submitting enquiry");
    }
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
          className="flex flex-col md:flex-row w-full max-h-[300px] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white cursor-pointer"
          onClick={() => handleNavigation(property)}
        >
          <div className="bg-[#F3F3F3] rounded-[20px] p-4 h-full w-[100%]  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
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
                    className="w-full h-60 object-cover rounded-md"
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
                    <p className="text-[#A4A4A4] font-semibold text-[18px]">
                      {property.property_name}
                    </p>
                    <div className="flex items-center gap-2 text-[#1D3A76] text-sm font-medium">
                      <IoIosHeart
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(property);
                        }}
                        className="p-1 w-7 h-7 bg-white rounded-2xl text-red-600 cursor-pointer"
                      />

                      <MdOutlineVerified className="text-xl text-green-500" />
                      <p>Verified</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
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
      <div className="flex">
        <div className="flex-1 px-4 md:px-10 py-6">
          <div className="w-full h-[calc(100vh-150px)]">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={likedProperties.length}
                  rowHeight={300}
                  rowRenderer={({ index, key, style }) => {
                    const property = likedProperties[index];
                    return (
                      <div style={style} key={key}>
                        <PropertyCard
                          property={property}
                          index={index}
                          toggleReadMore={toggleReadMore}
                          toggleFacilities={toggleFacilities}
                          handleNavigation={handleNavigation}
                          readMoreStates={readMoreStates}
                          expandedCards={expandedCards}
                          likedProperties={likedProperties}
                          handleLike={handleLike}
                          handleScheduleVisit={handleScheduleVisit}
                          handleContactSeller={handleContactSeller}
                        />
                      </div>
                    );
                  }}
                />
              )}
            </AutoSizer>
          </div>
        </div>
        <DynamicAds />
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
      <Footer />
    </>
  );
};
export default Favourites;
