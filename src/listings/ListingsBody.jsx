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
    <div className="bg-white rounded-lg shadow-md relative p-2 mb-4 md:mb-4 max-w-6xl mx-auto mt-8">
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
        className="pb-10 overflow-hidden h-[350px]"
      >
        {property?.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-2xl border border-gray-200 p-2 md:p-2 relative bg-white flex flex-col md:flex-row items-center gap-8">
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
                  className="w-full h-70 object-cover rounded-md"
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
                  <p className="text-sm text-left md:text-2xl font-bold text-gray-500">
                    Rs:{" "}
                    {formatToIndianCurrency(project?.property_cost) || "N/A"}
                  </p>
                  <h3 className="text-2xl text-left  font-bold text-blue-900 mt-1 ">
                    {project?.property_name}
                  </h3>
                </div>
                <p className="text-gray-600 text-left text-sm md:text-base mt-1 mb-4">
                  {project?.description?.length > 100
                    ? project?.description.slice(0, 150) + "..."
                    : project?.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-white shadow rounded-md px-4 py-2">
                    <p className="text-xs text-gray-500">Possession Date</p>
                    <p className="font-semibold text-[#1E2A53]">
                      {project?.possession_status}
                    </p>
                  </div>
                  <div className="bg-white shadow rounded-md px-4 py-2">
                    <p className="text-xs text-gray-500">Facing</p>
                    <p className="font-semibold text-[#1E2A53]">
                      {project?.facing}
                    </p>
                  </div>
                  <div className="bg-white shadow rounded-md px-4 py-2">
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="font-semibold text-[#1E2A53]">
                      {project?.bedroom}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#EC8F6A] hover:bg-[#e07955] text-white rounded-xl shadow">
                    <FaPhoneAlt />
                    Contact Developer
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
      <div className="mt-2 flex justify-center items-center gap-2 text-sm text-[#1E2A53] font-medium">
        <img
          src="/src/assets/Images/Favicon@10x.png"
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
    const handleChatClick = async (e) => {
      e.stopPropagation();
      const data = localStorage.getItem("user");
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
        if (phone) {
          const propertyFor = property.property_for === "Rent" ? "rent" : "buy";
          const category =
            property.sub_type === "Apartment" ||
            property.sub_type === "Individual house"
              ? `${property.bedrooms}BHK`
              : property.sub_type === "Plot"
              ? "Plot"
              : "Property";
          const propertyId = property.unique_property_id;
          const propertyNameSlug = property.property_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^-|-$)/g, "");
          const locationSlug = property.location_id
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^-|-$)/g, "");
          const citySlug = property.city
            ? property.city
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/(^-|-$)/g, "")
            : "hyderabad";
          const seoUrl = `${propertyFor}_${category}_${property.sub_type}_${propertyNameSlug}_in_${locationSlug}_${citySlug}_Id=${propertyId}`;
          const fullUrl = `${window.location.origin}/property?${seoUrl}`;
          const encodedMessage = encodeURIComponent(
            `Hi, I'm interested in this property: ${property.property_name}\n${fullUrl}`
          );
          const whatsappUrl = `https://wa.me/+91${phone}?text=${encodedMessage}`;
          window.open(whatsappUrl, "_blank");
        } else {
          console.error("Phone number not found in seller data:", sellerData);
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
    const handleContactClick = (e) => {
      e.stopPropagation();
      handleScheduleVisit(property);
    };
    return (
      <div
        key={`property-${index}`}
        className="flex flex-col items-center p-1 md:flex-row rounded-2xl 
               shadow-none  
               lg:shadow-[0_4px_20px_rgba(0,0,0,0.15)]  
               hover:shadow-none  
               lg:hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]  
               transition-shadow duration-300 bg-white cursor-pointer w-full"
        onClick={() => handleNavigation(property)}
        style={{ minHeight: "auto", height: "auto" }}
      >
        <div className="bg-[#ffff] rounded-[20px] p-3 w-full h-auto flex flex-col">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full h-auto lg:w-[400px] gap-2">
              <div className="rounded-lg overflow-hidden mb-4 relative">
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
                    {property.sub_type === "Apartment"
                      ? `${property.bedrooms} BHK ${
                          property.property_type
                            ? property.property_type
                            : property.sub_type || ""
                        } for ${property.property_for}`
                      : `${property.sub_type} for ${property.property_for}`}{" "}
                    in {property.locality_name}, {property.google_address}
                  </p>
                  <div className="flex items-center gap-2 text-[#1D3A76] text-sm font-medium my-2 md:my-0">
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
                    <p className="text-[12px] lg:text-base">Verified</p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-between">
                  <p className="text-[#A4A4A4] font-bold text-base md:text-[18px]">
                    {property.property_name}
                  </p>
                  <p className="text-[#1D3A76] font-semibold text-[18px]">
                    {property.project_name || ""}{" "}
                    <span className="text-[#1D3A76] font-bold text-[15px]">
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
              <div className="mb-4 relative flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-wrap gap-2 items-center text-[#204691] font-medium text-sm">
                    {[
                      property.sub_type === "Plot"
                        ? property.plot_area
                          ? `${property.plot_area} ${property?.area_units} Plot area`
                          : property.carpet_area
                          ? `${property.carpet_area} ${property?.area_units} Carpet area`
                          : null
                        : property.builtup_area
                        ? `${property.builtup_area} ${property?.area_units} Builtup area`
                        : null,
                      property?.investor_property === "Yes" &&
                        "Investor Property",
                      property?.under_construction && "Under Construction",
                      property?.under_construction &&
                        `Possession: ${property.under_construction.slice(
                          2,
                          10
                        )}`,
                      property?.possession_status === "Immediate" &&
                        "Ready to move",
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
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 border-gray-200 border-1 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 sm:justify-start justify-between w-full">
                  <div className="flex justify-between items-center w-full sm:w-auto">
                    <div className="flex gap-1 items-center">
                      <img src={meetlogo} alt="WhatsApp" className="w-4 h-4" />
                      <p className="text-blue-900 font-medium text-xs">
                        Seller
                      </p>
                    </div>
                    <p className="text-gray-500 font-medium text-md sm:hidden">
                      {property.user.name}
                    </p>
                  </div>
                  <p className="text-gray-500 font-medium text-sm hidden sm:block">
                    {property.user.name}
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
                    onClick={handleContactClick}
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
function ListingsBody({ setShowLoginModal }) {
  const [modalOpen, setModalOpen] = useState(false);
  const searchData = useSelector((state) => state.search);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [readMoreStates, setReadMoreStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const maxLimit = 50;
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
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) {
        return;
      }
      const { userDetails } = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/v1/getAllFavourites?user_id=${userDetails.user_id}`
        );
        const liked = response.data.favourites || [];
        const likedIds = liked.map((fav) => fav.property_id);
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
        const response = await fetch(
          `${
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
          }&priceFilter=${encodeURIComponent(selected)}&occupancy=${
            searchData?.occupancy || ""
          }&property_status=1`
        );
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
    [searchData, selected, loading]
  );
  const fetchContactedProperties = async () => {
    const data = localStorage.getItem("user");
    if (!data) {
      return;
    }
    const { userDetails } = JSON.parse(data);
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/enquiry/v1/getUserContactSellers?user_id=${userDetails.user_id}`
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
    [navigate, dispatch, searchData, selected]
  );
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [submittedStates, setSubmittedStates] = useState({});
  const { handleAPI } = useWhatsappHook(selectedProperty);
  const handleLike = useCallback(
    async (property) => {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Save Property!");
        setShowLoginModal(true);
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
        setLikedProperties((prev) =>
          isAlreadyLiked
            ? [...prev, property.unique_property_id]
            : prev.filter((id) => id !== property.unique_property_id)
        );
      }
    },
    [likedProperties]
  );
  const [owner, setOwner] = useState("");
  const getOwnerDetails = async (property) => {
    try {
      const response = await fetch(
        `https://api.meetowner.in/listings/getsingleproperty?unique_property_id=${property.unique_property_id}`
      );
      const data = await response.json();
      const propertydata = data.property_details;
      const sellerdata = propertydata.seller_details;
      if (response.ok) {
        setOwner(sellerdata);
        return sellerdata;
      } else {
        throw new Error("Failed to fetch owner details");
      }
    } catch (err) {
      setError("Error fetching owner details");
      throw err;
    }
  };
  const handleScheduleVisit = (property) => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.info("Please Login to Schedule Visits!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowLoginModal(true);
      return;
    }
    const { userDetails } = JSON.parse(data);
    setSelectedProperty(property);
    const alreadySubmitted = localStorage.getItem("visit_submitted") === "true";
    const isNameMissing = !userDetails?.name || userDetails.name === "N/A";
    const isEmailMissing = !userDetails?.email || userDetails.email === "N/A";
    const isMobileMissing =
      !userDetails?.mobile || userDetails.mobile === "N/A";
    if (
      !isNameMissing &&
      !isEmailMissing &&
      !isMobileMissing &&
      alreadySubmitted
    ) {
      handleModalSubmit(property);
    } else {
      setModalOpen(true);
    }
  };
  const handleModalSubmit = async (property) => {
    try {
      const { userDetails } = JSON.parse(localStorage.getItem("user"));
      const payload = {
        unique_property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        name: userDetails.name,
        mobile: userDetails.phone,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
      await handleAPI(property);
      localStorage.setItem("visit_submitted", "true");
      setSubmittedStates((prev) => ({
        ...prev,
        [property.unique_property_id]: {
          ...prev[property.unique_property_id],
          contact: true,
        },
      }));
      setModalOpen(false);
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };
  const handleContactSeller = async (property) => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Contact!");
        setShowLoginModal(true);
        return;
      }
      const { userDetails } = JSON.parse(data);
      const payload = {
        unique_property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
      await handleAPI(property);
      setSubmittedStates((prev) => ({
        ...prev,
        [property.unique_property_id]: {
          ...prev[property.unique_property_id],
          chat: true,
        },
      }));
    } catch (err) {
      toast.error("Something went wrong while submitting enquiry");
    }
  };
  const prepareCards = useCallback(() => {
    return data.map((property, index) => ({
      type: "property",
      content: (
        <PropertyCard
          property={property}
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
          handleContactSeller={handleContactSeller}
          submittedState={submittedStates[property.unique_property_id] || {}}
          getOwnerDetails={getOwnerDetails}
          setShowLoginModal={setShowLoginModal}
        />
      ),
    }));
  }, [
    data,
    readMoreStates,
    expandedCards,
    toggleReadMore,
    toggleFacilities,
    handleNavigation,
    likedProperties,
    handleLike,
    submittedStates,
    getOwnerDetails,
  ]);
  const cards = useMemo(() => prepareCards(), [prepareCards]);
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 400,
  });
  const rowRenderer = ({ index, key, style, parent }) => {
    const item = cards[index];
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        rowIndex={index}
        parent={parent}
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
            <div className="w-full">{item.content}</div>
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
      <div className="flex flex-row items-center justify-between gap-2 mb-4 mt-2 px-2">
        <div className="flex items-center flex-shrink-0 max-w-[70%]">
          <MapPin className="text-yellow-500 mr-1 w-4 h-4 md:w-5 md:h-5" />
          <p className="text-sm md:text-base text-nowrap overflow-hidden text-ellipsis font-normal text-[#1D3A76]">
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
            In {searchData?.location || "Hyderabad"}
          </p>
        </div>
        <div className="relative flex flex-col text-left z-50 flex-shrink-0">
          <div className="flex items-center gap-1 ">
            <p className="text-[#000000] text-sm whitespace-nowrap font-medium">
              Sort:
            </p>
            <div
              className="bg-[#F5F5F5] border border-[#2C4D60] rounded-lg cursor-pointer px-2 py-1 pr-6 flex items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="text-xs md:text-sm text-gray-800">
                {selected}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>
          {isOpen && (
            <div className="absolute mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                  overscanRowCount={2}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      ) : !loading ? (
        <div className="text-center">
          <h1 className="text-2xl text-gray-500 font-bold">
            No Properties Found!
          </h1>
          <AdsCard />
        </div>
      ) : null}
      {loading && hasMore && (
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
