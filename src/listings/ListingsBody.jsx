import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  memo,
  useMemo,
} from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import whatsappIcon from "../assets/Images/whatsapp (3).png";
import meetlogo from "../assets/Images/Favicon@10x.png";
import noPropertiesFound from "../assets/Images/14099.jpg";
import { FaPhoneAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  AutoSizer,
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import config from "../../config";
import axios from "axios";
import ScheduleFormModal from "../utilities/ScheduleForm";
import { toast } from "react-toastify";
import useWhatsappHook from "../utilities/useWhatsappHook";
import { setPropertyData } from "../../store/slices/propertyDetails";
import Breadcrumb from "../utilities/BreadCrumb";
import { FaHouse } from "react-icons/fa6";
const AdsCard = memo(() => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [property, setProperty] = useState([]);
  const fetchLatestProperties = async () => {
    setProperty([]);
    try {
      const response = await fetch(
        `${config.awsApiUrl}/listings/v1/getRandomPropertiesAds`
      );
      const data = await response.json();
      setProperty(data.results);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };
  useEffect(() => {
    fetchLatestProperties();
  }, []);
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const navigate = useNavigate();
  const handleNavigation = useCallback(
    (property) => {
      navigate("/property", { state: property });
    },
    [navigate]
  );
  return (
    <div className="bg-white rounded-lg shadow-md relative p-2  max-w-4xl mt-8">
      <h2 className="text-xl text-left md:text-xl font-semibold text-[#1E2A53] mb-4">
        Featured Projects Based on your search
      </h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{ clickable: true }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
        }}
        className="pb-0 overflow-hidden h-[250px]"
      >
        {property?.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-2xl border gap-2 border-gray-200 p-2 md:p-2 relative bg-white flex flex-col md:flex-row items-center ">
              <div className="w-full md:w-1/2">
                <img
                  src={
                    project?.image
                      ? `https://api.meetowner.in/uploads/${project?.image}`
                      : `https://placehold.co/600x400?text=${
                          project?.property_name || "No Image Found"
                        }`
                  }
                  alt="Property"
                  crossOrigin="anonymous"
                  className="w-full h-50 object-contain rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x400?text=${
                      project?.property_name || "No Image Found"
                    }`;
                  }}
                />
              </div>
              <div
                className="w-full md:w-1/2 cursor-pointer"
                onClick={() => handleNavigation(project)}
              >
                <div className="flex flex-row justify-between items-center">
                  <p className="text-md text-left md:text-lg font-bold text-gray-500">
                    Rs:{" "}
                    {formatToIndianCurrency(project?.property_cost) || "N/A"}
                  </p>
                  <h3 className="text-lg text-left  font-bold text-blue-900 mt-1 ">
                    {project?.property_name}
                  </h3>
                </div>
                <p className="text-gray-600 text-left text-sm md:text-base mt-1 mb-4">
                  {project?.description?.length > 100
                    ? project?.description.slice(0, 150) + "..."
                    : project?.description}
                </p>
                <div className="flex justify-end items-center">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#243cc2] hover:bg-blue-700 text-white rounded-xl shadow">
                    <FaHouse />
                    View Property
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
          <button
            ref={prevRef}
            className="text-gray-500 text-1xl bg-white shadow rounded-full p-2 ml-2 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
          <button
            ref={nextRef}
            className="text-gray-500 text-1xl bg-white shadow rounded-full p-2 mr-2 hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </Swiper>
      <div className="flex justify-center items-center gap-2 text-sm text-[#1E2A53] font-medium">
        <img
          src={meetlogo}
          alt="Meet Owner"
          crossOrigin="anonymous"
          className="w-6 h-6"
        />
        <span className="text-[#FFC107] font-bold">MEET OWNER</span>
        <span>Developer</span>
      </div>
    </div>
  );
});
const PropertyCard = memo(
  ({
    property,
    index,
    handleNavigation,
    likedProperties,
    handleLike,
    handleScheduleVisit,
    submittedState,
    contacted,
    getOwnerDetails,
    setShowLoginModal,
  }) => {
    const formatToIndianCurrency = (value) => {
      if (!value || isNaN(value)) return "N/A";
      const numValue = parseFloat(value);
      if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
      if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
      if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
      return numValue.toString();
    };
    const formatValue = (value) => {
      return value % 1 === 0
        ? parseInt(value)
        : parseFloat(value).toFixed(2).replace(/\.00$/, "");
    };
    const handleChatClick = async (e) => {
      e.stopPropagation();
      const data = localStorage.getItem("user");
      const userData = JSON.parse(data);
      if (!data) {
        toast.info("Please Login to Schedule Visits!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowLoginModal(true);
        return;
      }
      try {
        const sellerData = await getOwnerDetails(property);
        const phone = sellerData?.mobile || sellerData?.phone;
        const name = sellerData?.name || "";
        if (phone) {
          const propertyFor =
            property?.property_for === "Rent" ? "rent" : "buy";
          const category =
            property?.sub_type === "Apartment" ||
            property?.sub_type === "Individual house"
              ? `${property?.bedrooms}BHK`
              : property?.sub_type === "Plot"
              ? "Plot"
              : "Property";
          const propertyId = property?.unique_property_id;
          const propertyNameSlug = property?.property_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^-|-$)/g, "");
          const locationSlug = property?.location_id
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^-|-$)/g, "");
          const citySlug = property?.city
            ? property?.city
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/(^-|-$)/g, "")
            : "";
          const seoUrl = `${propertyFor}_${category}_${property?.sub_type}_${propertyNameSlug}_in_${locationSlug}_${citySlug}_Id_${propertyId}`;
          const fullUrl = `${window.location.origin}/property?${seoUrl}`;
          const encodedMessage = encodeURIComponent(
            `Hi ${name},\nI'm interested in this property: ${property?.property_name}.\n${fullUrl}\nI look forward to your assistance in the home search. Please get in touch with me at ${userData?.mobile} to initiate the process.`
          );
          const whatsappUrl = `https://wa.me/+91${phone}?text=${encodedMessage}`;
          window.open(whatsappUrl, "_blank");
        } else {
          toast.error("Owner's phone number is not available.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        console.error("Error in handleChatClick:", error);
        toast.error("Failed to fetch owner's contact details.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };
    const handleContactClick = (property) => {
      if (!property?.unique_property_id) {
        toast.error("Invalid property data!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      handleScheduleVisit(property);
    };
    const getPriceDisplay = (propertyFor, price) => {
      if (propertyFor === "Rent") {
        return price ? `₹ ${formatToIndianCurrency(price)}/month` : "N/A";
      }
      return price ? `₹ ${formatToIndianCurrency(price)}` : "N/A";
    };
    return (
      <div
        key={`property-${index}`}
        className="flex flex-col items-center p-1 md:flex-row rounded-2xl 
             shadow-[0_2px_10px_rgba(0,0,0,0.1)]  
             lg:shadow-[0_4px_20px_rgba(0,0,0,0.15)]  
             hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]  
             lg:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]  
             transition-shadow duration-300 bg-white w-full"
        style={{ minHeight: "auto", height: "auto" }}
      >
        <div className="bg-[#ffff] rounded-[20px] p-3 w-full h-auto flex flex-col">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full h-auto lg:w-[400px] gap-2">
              <div className="rounded-lg overflow-hidden mb-4 relative">
                <img
                  src={
                    property.image
                      ? `https://api.meetowner.in/uploads/${property?.image}`
                      : `https://placehold.co/600x400?text=${
                          property?.property_name || "No Image Found"
                        }`
                  }
                  alt="Property"
                  crossOrigin="anonymous"
                  className="w-full h-50 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/600x400?text=${
                      property?.property_name || "No Image Found"
                    }`;
                  }}
                />
              </div>
            </div>
            <div className="flex-1 max-w-full md:max-w-[500px] flex flex-col">
              <div className="mb-3 text-left">
                <div className="flex flex-col md:flex-row justify-between md:items-center">
                  <p className="text-[#1D3A76] font-bold text-[15px]">
                    {property?.sub_type === "Apartment"
                      ? `${property?.bedrooms} BHK ${
                          property?.property_type
                            ? property?.property_type
                            : property?.sub_type || ""
                        } for ${property?.property_for}`
                      : `${property?.sub_type} for ${property?.property_for}`}{" "}
                    in {property?.locality_name}, {property?.google_address}
                  </p>
                  <div className="flex items-center gap-2 text-[#1D3A76] text-sm font-medium my-2 md:my-0">
                    {likedProperties?.includes(property?.unique_property_id) ? (
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
                    <p className="text-[12px] lg:text-base">Verified</p>
                  </div>
                </div>
                <div
                  className="flex flex-col lg:flex-row justify-between cursor-pointer"
                  onClick={() => handleNavigation(property)}
                >
                  <p className="text-[#1D3A76] font-bold text-base md:text-[18px]">
                    {property?.property_name}
                  </p>
                  <p className="flex flex-col items-end text-[#1D3A76] font-semibold text-[18px] max-h-5">
                    <span className="flex items-center font-bold text-[15px]">
                      {property?.property_for === "Rent" ? (
                        <span className="flex flex-col items-end">
                          {getPriceDisplay(
                            property?.property_for,
                            property?.monthly_rent
                          )}
                          {property?.property_cost_type && (
                            <span>{property.property_cost_type}</span>
                          )}
                          <span className="text-xs font-normal text-[#A4A4A4]">
                            Expected Monthly Rent
                          </span>
                        </span>
                      ) : (
                        <>
                          {getPriceDisplay(
                            property?.property_for,
                            property?.property_cost
                          )}
                          {property?.property_cost_type && (
                            <span>{property.property_cost_type}</span>
                          )}
                        </>
                      )}
                    </span>
                    {property?.loan_facility === "Yes" ? (
                      <span className="text-xs text-[#A4A4A4]">
                        EMI option Available
                      </span>
                    ) : (
                      <span className="text-xs text-[#A4A4A4]">
                        One Time Payment
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div
                className="mb-4 relative flex-1 cursor-pointer"
                onClick={() => handleNavigation(property)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-wrap gap-2 items-center text-[#204691] font-medium text-sm">
                    {[
                      property?.sub_type === "Plot"
                        ? property?.plot_area
                          ? `${formatValue(property?.plot_area)} ${
                              property?.area_units
                            } Plot area`
                          : property?.carpet_area
                          ? `${formatValue(property?.carpet_area)} ${
                              property?.area_units
                            } Carpet area`
                          : null
                        : property?.builtup_area
                        ? `${formatValue(property?.builtup_area)} ${
                            property?.area_units
                          } Builtup area`
                        : null,
                      property?.investor_property === "Yes" &&
                        "Investor Property",
                      property?.under_construction && "Under Construction",
                      property?.under_construction &&
                        `Possession: ${property?.under_construction.slice(
                          2,
                          10
                        )}`,
                      property?.possession_status === "Immediate" &&
                        "Immediate",
                      property?.possession_status === "Future" && "Future",
                      property?.furnished_status &&
                        (property?.furnished_status === "Unfurnished"
                          ? "Unfurnished"
                          : `${property?.furnished_status} Furnished`),
                    ]
                      .filter(Boolean)
                      .map((item, index, arr) => (
                        <React.Fragment key={index}>
                          <p>{item}</p>
                          {index !== arr.length - 1 && (
                            <span className="text-gray-400 mx-1">|</span>
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                </div>
                <div className="text-sm text-[#A4A4A4] font-medium mt-2 flex flex-wrap items-center gap-1">
                  <p className="text-[#1D3A76]">Highlights :</p>
                  {[
                    property?.facing && `${property?.facing} Facing`,
                    property?.bedrooms && `${property?.bedrooms} BHK`,
                    property?.property_in &&
                      property?.sub_type &&
                      `${property?.property_in} ${property?.sub_type}`,
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
                    <p className="text-[#1D3A76]">Amenities :</p>
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
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 border-gray-200 border-1 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 sm:justify-start justify-between w-full">
                  <div className="flex justify-between items-center w-full sm:w-auto">
                    <div className="flex gap-1 items-center">
                      <img src={meetlogo} alt="WhatsApp" className="w-5 h-5" />
                      <p
                        className={`font-medium text-xs ${
                          property?.user?.user_type === 3
                            ? "text-blue-900"
                            : property?.user?.user_type === 4
                            ? "text-purple-600"
                            : property?.user?.user_type === 5
                            ? "text-green-600"
                            : property?.user?.user_type === 6
                            ? "text-orange-500"
                            : "text-blue-900"
                        }`}
                      >
                        {property?.user?.user_type === 3
                          ? "Builder"
                          : property?.user?.user_type === 4
                          ? "Agent"
                          : property?.user?.user_type === 5
                          ? "Owner"
                          : property?.user?.user_type === 6
                          ? "Channel Partner"
                          : "Seller"}
                      </p>
                    </div>
                    <p className="text-gray-500 font-medium text-md sm:hidden">
                      {property.user.name}
                    </p>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm hidden sm:block">
                    {property?.user?.name?.length > 10
                      ? property?.user?.name?.slice(0, 10) + "..."
                      : property?.user?.name}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleChatClick}
                    className="flex items-center cursor-pointer justify-center gap-1 border border-[#25D366] text-[#25D366] px-6 py-2 rounded-full text-sm font-medium"
                  >
                    <img
                      src={whatsappIcon}
                      alt="WhatsApp"
                      className="w-4 h-4"
                    />
                    Chat
                  </button>
                  <button
                    onClick={() => handleContactClick(property)}
                    className="bg-blue-900 cursor-pointer hover:bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
                    disabled={
                      submittedState?.contact ||
                      contacted.includes(property.unique_property_id)
                    }
                  >
                    {contacted.includes(property.unique_property_id) ||
                    submittedState?.contact
                      ? "Submitted"
                      : "Contact"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
const SkeletonPropertyCard = () => {
  return (
    <div className="flex flex-col  items-center p-4 rounded-2xl shadow-md bg-white w-full animate-pulse">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[400px]">
          <div className="w-full h-50 bg-gray-200 rounded-md" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="mb-3 text-left">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="flex items-center gap-2 my-2 md:my-0">
                <div className="w-7 h-7 bg-gray-200 rounded-2xl" />
                <div className="w-5 h-5 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
          <div className="mb-4 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 border border-gray-200 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 sm:justify-start justify-between w-full">
              <div className="flex justify-between items-center w-full sm:w-auto">
                <div className="flex gap-1 items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-24 sm:hidden" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 hidden sm:block" />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="h-10 bg-gray-200 rounded-full w-24" />
              <div className="h-10 bg-gray-200 rounded-full w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const formatToIndianCurrency = (value) => {
  if (!value || isNaN(value)) return "N/A";
  const numValue = parseFloat(value);
  if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
  if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
  if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
  return numValue.toString();
};
function ListingsBody({ setShowLoginModal }) {
  const [modalOpen, setModalOpen] = useState(false);
  const searchData = useSelector((state) => state.search);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [readMoreStates, setReadMoreStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const maxLimit = 500;
  const [likedProperties, setLikedProperties] = useState([]);
  const [contacted, setContacted] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Relevance");
  const navigate = useNavigate();
  const options = [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];
  const handleUserSearched = async () => {
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
    if (userDetails?.user_id && searchData?.city) {
      const viewData = {
        user_id: userDetails.user_id,
        searched_location: searchData?.location || "N/A",
        searched_for: searchData?.tab || "N/A",
        name: userDetails?.name || "N/A",
        mobile: userDetails?.mobile || "N/A",
        email: userDetails?.email || "N/A",
        searched_city: searchData?.city || "N/A",
        property_in: searchData?.property_in || "N/A",
        sub_type: searchData?.sub_type || "N/A",
      };
      try {
        await axios.post(
          `${config.awsApiUrl}/enquiry/v1/userActivity`,
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
  };
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) {
        return;
      }
      const userDetails = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/v1/getAllFavourites?user_id=${userDetails?.user_id}`
        );
        const liked = response.data.favourites || [];
        const likedIds = liked.map((fav) => fav.unique_property_id);
        setLikedProperties(likedIds);
      } catch (error) {
        console.error("Failed to fetch liked properties:", error);
      }
    };
    fetchLikedProperties();
  }, []);
  const fetchProperties = useCallback(
    async (currentPage = 1, reset = false) => {
      if (loading) return;
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleUserSearched();
        const baseUrl = `${
          config.awsApiUrl
        }/listings/v1/getAllPropertiesByType?page=${currentPage}&property_for=${
          searchData?.tab === "Latest"
            ? "Sell"
            : searchData.tab === "Buy"
            ? "Sell"
            : searchData?.tab === "Rent"
            ? "Rent"
            : searchData?.tab === "Plot"
            ? "Sell"
            : "Sell"
        }&property_in=${searchData?.property_in || ""}&sub_type=${
          searchData?.sub_type === "Others" ? "" : searchData?.sub_type
        }&search=${searchData.location || ""}&bedrooms=${
          searchData?.bhk || ""
        }&property_cost=${
          searchData?.budget || ""
        }&priceFilter=${encodeURIComponent(selected)}&possession_status=${
          searchData?.occupancy || ""
        }&property_status=1&city_id=${searchData.city}&furnished_status=${
          searchData.furnished_status
        }`;

        const response = await fetch(`${baseUrl}`);
        const res = await response.json();
        const newData = res.properties || [];
        setData((prevData) => {
          const combined = reset ? newData : [...prevData, ...newData];
          return combined.slice(0, maxLimit);
        });
        setHasMore(
          newData.length > 0 &&
            (reset
              ? newData.length < maxLimit
              : data.length + newData.length < maxLimit)
        );
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setData([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [searchData, searchData.city, selected, loading]
  );
  const fetchContactedProperties = async () => {
    const data = localStorage.getItem("user");
    if (!data) {
      return;
    }
    const userDetails = JSON.parse(data);
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/enquiry/v1/getUserContactSellers?user_id=${userDetails?.user_id}`
      );
      const contacts = response.data || [];
      const contactIds = contacts.results.map(
        (contact) => contact.unique_property_id
      );
      setContacted(contactIds);
    } catch (error) {
      console.error("Failed to fetch liked properties:", error);
    }
  };
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchProperties(1, true);
    fetchContactedProperties();
  }, [
    searchData?.location,
    searchData?.bhk,
    searchData?.property_in,
    searchData?.tab,
    searchData?.occupancy,
    searchData?.sub_type,
    searchData?.budget,
    searchData?.furnished_status,
    selected,
  ]);
  useEffect(() => {
    if (page > 1) fetchProperties(page);
  }, [page]);
  const toggleReadMore = useCallback((index) => {
    setReadMoreStates((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);
  const toggleFacilities = useCallback((index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);
  const dispatch = useDispatch();
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
      try {
        dispatch(
          setPropertyData({
            propertyName: property?.property_name || "N/A",
            location: property?.location_id || "N/A",
          })
        );
        const propertyFor = property?.property_for === "Rent" ? "Rent" : "Buy";
        const propertyId = property?.unique_property_id || "N/A";
        const bedrooms = property?.bedrooms || "N/A";
        const propertyNameSlug = (property?.property_name || "unknown")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^-|-$)/g, "");
        const locationSlug = (property?.location_id || "unknown")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^-|-$)/g, "");
        const typeSegment =
          property?.sub_type === "Apartment"
            ? `${bedrooms}_BHK_${property.sub_type}`
            : property?.sub_type || "";
        const seoUrl = `${propertyFor}_${typeSegment}_${propertyNameSlug}_in_${locationSlug}_${
          searchData?.city || "unknown"
        }_Id_${propertyId}`;
        navigate(`/property?${seoUrl}`, { state: property });
      } catch (navError) {
        console.error("Navigation error:", navError);
      }
    },
    [navigate, dispatch, searchData, selected]
  );
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [submittedStates, setSubmittedStates] = useState({});
  const [shouldSubmit, setShouldSubmit] = useState(false);
  useEffect(() => {
    if (selectedProperty && shouldSubmit) {
      handleModalSubmit();
      setShouldSubmit(false);
    }
  }, [selectedProperty, shouldSubmit]);
  const { handleAPI } = useWhatsappHook(selectedProperty);
  const handleLike = useCallback(
    async (property) => {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Save Property!");
        setShowLoginModal(true);
        return;
      }
      const userDetails = JSON.parse(data);
      const isAlreadyLiked = likedProperties.includes(
        property.unique_property_id
      );
      setLikedProperties((prev) =>
        isAlreadyLiked
          ? prev.filter((id) => id !== property.unique_property_id)
          : [...prev, property.unique_property_id]
      );

      const payload = {
        user_id: userDetails.user_id,
        unique_property_id: property.unique_property_id,
        property_name: property.property_name,
      };
      try {
        await axios.post(`${config.awsApiUrl}/fav/v1/postIntrest`, payload);
      } catch (err) {
        setLikedProperties((prev) =>
          isAlreadyLiked
            ? [...prev, property.unique_property_id]
            : prev.filter((id) => id !== property.unique_property_id)
        );
      }
    },
    [likedProperties]
  );
  const getOwnerDetails = useCallback(async (property) => {
    if (!property?.unique_property_id) {
      console.error("Invalid property in getOwnerDetails:", property);
      throw new Error("Invalid property data");
    }
    try {
      const response = await fetch(
        `https://api.meetowner.in/listings/v1/getSingleProperty?unique_property_id=${property.unique_property_id}`
      );
      const data = await response.json();
      const propertyData = data?.property;
      const sellerData = propertyData?.user;
      if (response.ok && sellerData) {
        return sellerData;
      } else {
        console.error("Failed to fetch owner details:", data);
        throw new Error("Failed to fetch owner details");
      }
    } catch (err) {
      console.error("Error fetching owner details:", err, { property });
      throw err;
    }
  }, []);
  const handleModalSubmit = useCallback(async () => {
    if (!selectedProperty?.unique_property_id) {
      toast.error("No property selected!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(
        "No selectedProperty in handleModalSubmit:",
        selectedProperty
      );
      return;
    }
    try {
      const userDetails = JSON.parse(localStorage.getItem("user"));
      if (!userDetails) {
        toast.info("Please Login to Schedule Visits!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowLoginModal(true);
        return;
      }
      const payload = {
        unique_property_id: selectedProperty.unique_property_id,
        user_id: userDetails?.user_id || "N/A",
        fullname: userDetails?.name || "N/A",
        mobile: userDetails?.mobile || "N/A",
        email: userDetails?.email || "N/A",
      };
      const sellerData = await getOwnerDetails(selectedProperty);
      const SubType =
        selectedProperty.sub_type === "Apartment"
          ? `${selectedProperty.sub_type} ${selectedProperty.bedrooms || ""}BHK`
          : selectedProperty.sub_type || "N/A";
      const smspayload = {
        name: userDetails?.name || "N/A",
        mobile: userDetails?.mobile || "N/A",
        sub_type: SubType,
        location: selectedProperty.location_id?.split(/[\s,]+/)[0] || "N/A",
        property_cost: formatToIndianCurrency(
          selectedProperty.property_cost || 0
        ),
        ownerMobile: sellerData?.mobile || sellerData?.phone || "N/A",
      };
      await axios.post(
        `${config.awsApiUrl}/enquiry/v1/sendLeadTextMessage`,
        smspayload
      );
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
      await handleAPI(selectedProperty);
      fetchContactedProperties();
      localStorage.setItem("visit_submitted", "true");
      setSubmittedStates((prev) => ({
        ...prev,
        [selectedProperty.unique_property_id]: {
          ...prev[selectedProperty.unique_property_id],
          contact: true,
        },
      }));
      setContacted((prev) =>
        prev.includes(selectedProperty.unique_property_id)
          ? prev
          : [...prev, selectedProperty.unique_property_id]
      );
      setModalOpen(false);
    } catch (err) {
      console.error("Error in handleModalSubmit:", err, { selectedProperty });
      toast.error("Something went wrong while scheduling visit", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [
    handleAPI,
    selectedProperty,
    setSubmittedStates,
    setModalOpen,
    setShowLoginModal,
    fetchContactedProperties,
  ]);
  const handleScheduleVisit = useCallback(
    (property) => {
      if (!property?.unique_property_id) {
        toast.error("Invalid property data!", {
          position: "top-right",
          autoClose: 3000,
        });
        console.error("Invalid property in handleScheduleVisit:", property);
        return;
      }
      setSelectedProperty(property);
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Schedule Visits!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowLoginModal(true);
        return;
      }
      const userDetails = JSON.parse(data);
      const alreadySubmitted =
        localStorage.getItem("visit_submitted") === "true";
      const isNameMissing = !userDetails?.name || userDetails?.name === "N/A";
      const isEmailMissing =
        !userDetails?.email || userDetails?.email === "N/A";
      const isMobileMissing =
        !userDetails?.mobile || userDetails?.mobile === "N/A";
      if (
        !isNameMissing &&
        !isEmailMissing &&
        !isMobileMissing &&
        alreadySubmitted
      ) {
        setShouldSubmit(true);
      } else {
        setModalOpen(true);
      }
    },
    [setShowLoginModal, setSelectedProperty, setModalOpen]
  );
  const cards = useMemo(() => {
    const baseCards = data.slice(0);
    if (loading && hasMore) {
      return [...baseCards, ...Array(2).fill({ type: "skeleton" })];
    }
    return baseCards;
  }, [data, loading, hasMore]);
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 500,
  });
  const rowRenderer = ({ index, key, style, parent }) => {
    const item = cards[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={index}
        parent={parent}
        key={key}
      >
        {({ measure, registerChild }) => (
          <div
            ref={registerChild}
            key={key}
            style={{
              ...style,
              paddingBottom: window.innerWidth < 768 ? "24px" : "32px",
              marginBottom: window.innerWidth < 768 ? "16px" : "24px",
            }}
            className="w-full flex justify-center px-2"
          >
            <div className="w-full">
              {item.type === "skeleton" ? (
                <SkeletonPropertyCard />
              ) : (
                <PropertyCard
                  property={item}
                  index={index}
                  toggleReadMore={toggleReadMore}
                  toggleFacilities={toggleFacilities}
                  handleNavigation={handleNavigation}
                  readMoreStates={readMoreStates}
                  expandedCards={expandedCards}
                  likedProperties={likedProperties}
                  contacted={contacted}
                  handleLike={handleLike}
                  handleScheduleVisit={handleScheduleVisit}
                  submittedState={
                    submittedStates[item.unique_property_id] || {}
                  }
                  getOwnerDetails={getOwnerDetails}
                  setShowLoginModal={setShowLoginModal}
                />
              )}
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  };
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="min-h-screen p-1 relative z-0 overflow-visible">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1 mt-2 px-2">
        <div className="flex items-center flex-grow overflow-hidden min-w-0">
          <MapPin className="text-yellow-500 mr-1 w-4 h-4 md:w-5 md:h-5" />
          <p className="text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis font-normal text-[#1D3A76]">
            {searchData?.property_in === "Commercial"
              ? "Commercial"
              : searchData?.property_in === "Plot"
              ? "Plot"
              : "Residential"}{" "}
            {searchData?.sub_type || ""} For{" "}
            {searchData?.tab === "Buy"
              ? "Sell"
              : searchData?.tab === "Rent"
              ? "Rent"
              : "Sell"}{" "}
            In {searchData?.city || ""}
          </p>
        </div>
        <div className="relative  flex flex-row mb-10 text-left z-50 flex-shrink-0 ">
          <Breadcrumb />
          <div className="flex items-center gap-2">
            <p className="text-[#000000] text-sm whitespace-nowrap font-medium">
              Sort by
            </p>
            <div
              className="bg-[#F5F5F5] border border-[#2C4D60] w-30  rounded-lg cursor-pointer px-4 py-1  flex items-center relative"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="text-xs md:text-sm text-gray-800">
                {selected}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>
          {isOpen && (
            <div className="absolute top-10 right-0 w-50 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    setSelected(option);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                    selected === option ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {data.length > 0 ? (
        <WindowScroller>
          {({ height, isScrolling, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  scrollTop={scrollTop}
                  width={width}
                  rowCount={cards.length}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  rowRenderer={rowRenderer}
                  overscanRowCount={4}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      ) : !loading ? (
        <div className="text-center mt-10 flex flex-col gap-5">
          <>
            <img
              src={noPropertiesFound}
              alt="Property"
              crossOrigin="anonymous"
              className="w-[100%] h-70 object-contain rounded-md"
            />
            <h1 className="text-2xl text-gray-500 font-bold">
              No Properties Found!
            </h1>
          </>
          <AdsCard />
        </div>
      ) : null}
      {loading && hasMore && (
        <>
          <div className="flex flex-col gap-4">
            {Array(2)
              .fill(0)
              .map((_id, index) => (
                <SkeletonPropertyCard key={index} />
              ))}
          </div>
          <div className="w-full py-4 flex justify-center items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-[#1D3A76]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span className="text-[#1D3A76] font-medium">
              Loading more properties...
            </span>
          </div>
        </>
      )}
      {!hasMore && data.length > 0 && (
        <div className="w-full py-4 text-center text-[#1D3A76] font-medium">
          No more properties to load.
        </div>
      )}
      {hasMore && data.length < maxLimit && !loading && (
        <div className="w-full py-4 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-[#1D3A76] text-white rounded hover:bg-[#162f5c] transition"
          >
            Load More properties
          </button>
        </div>
      )}
      {modalOpen && (
        <ScheduleFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      {showScrollTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition z-10"
        >
          <ChevronUp className="w-6 h-6 text-[#1D3A76]" />
        </div>
      )}
    </div>
  );
}
export default ListingsBody;
