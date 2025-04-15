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
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import config from "../../config";
import axios from "axios";
import ScheduleFormModal from "../utilities/ScheduleForm";
import { toast } from "react-toastify";
const AdsCard = memo(() => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const featuredProjects = [
    {
      name: "Swan",
      priceRange: "₹ 2 Cr - ₹ 4 Cr",
      description: "3 BHK Apartment for sell in Nizampet, Telangana, India",
      possession: "Jan, 2025",
      avgPrice: "₹ 14.99 k/sq.ft",
      image: "https://api.meetowner.in/uploads/202401101408101.jpg",
    },
    {
      name: "Tranquil Heights",
      priceRange: "₹ 1.5 Cr - ₹ 3 Cr",
      description: "2 & 3 BHK Flats in Gachibowli, Telangana, India",
      possession: "Dec, 2024",
      avgPrice: "₹ 12.49 k/sq.ft",
      image: "https://placehold.co/600x400",
    },
  ];
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
      >
        {featuredProjects.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-2xl border border-gray-200 p-2 md:p-2 relative bg-white flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-4 right-4 flex gap-3 text-xl text-gray-500 z-10">
                <FaHeart className="text-orange-500 cursor-pointer" />
                <FaShareAlt className="cursor-pointer" />
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src={project.image}
                  alt="Project"
                  className="w-full h-[200px] object-cover rounded-md"
                />
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-xl text-left md:text-2xl font-semibold text-[#442C2E]">
                  {project.priceRange}
                </p>
                <h3 className="text-2xl text-left md:text-3xl font-bold text-[#442C2E] mt-1">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-left text-sm md:text-base mt-1 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-white shadow rounded-md px-4 py-2">
                    <p className="text-xs text-gray-500">Possession Date</p>
                    <p className="font-semibold text-[#1E2A53]">
                      {project.possession}
                    </p>
                  </div>
                  <div className="bg-white shadow rounded-md px-4 py-2">
                    <p className="text-xs text-gray-500">Average Price</p>
                    <p className="font-semibold text-[#1E2A53]">
                      {project.avgPrice}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#EC8F6A] hover:bg-[#e07955] text-white rounded-xl shadow">
                    <FaPhoneAlt />
                    Contact Developer
                  </button>
                  <button className="px-6 py-2 bg-[#EC8F6A] hover:bg-[#e07955] text-white rounded-xl shadow">
                    View More
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10">
          <button
            ref={prevRef}
            className="text-gray-500 text-2xl bg-white shadow rounded-full p-2 ml-2 hover:bg-gray-100"
          >
            <FaChevronLeft />
          </button>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 z-10">
          <button
            ref={nextRef}
            className="text-gray-500 text-2xl bg-white shadow rounded-full p-2 mr-2 hover:bg-gray-100"
          >
            <FaChevronRight />
          </button>
        </div>
      </Swiper>
      <div className="mt-2 flex justify-center items-center gap-2 text-sm text-[#1E2A53] font-medium">
        <img
          src="/src/assets/Images/Favicon@10x.png"
          alt="Meet Owner"
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
      if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
      if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
      if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
      return numValue.toString();
    };
    return (
      <div
        key={`property-${index}`}
        className="flex flex-col md:flex-row rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white cursor-pointer"
        onClick={() => handleNavigation(property)}
      >
        <div className="bg-[#F3F3F3] rounded-[20px] p-4 w-full max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-[300px]">
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
function ListingsBody() {
  const [modalOpen, setModalOpen] = useState(false);
  const searchData = useSelector((state) => state.search);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [readMoreStates, setReadMoreStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [likedProperties, setLikedProperties] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Relevance");
  const cardsContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const options = [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          config.awsApiUrl
        }/listings/getAllPropertiesByType?page=${page}&property_for=${
          searchData?.tab === "Latest"
            ? "Sell"
            : searchData.tab === "Buy"
            ? "Sell"
            : searchData?.tab === "Rent"
            ? "Rent"
            : searchData?.tab === "Plot"
            ? "Plot"
            : "Commercial"
        }&property_in=${searchData?.property_in || ""}&sub_type=${
          searchData?.sub_type === "Others" ? "" : searchData?.sub_type
        }&search=${searchData.location || ""}&bedrooms=${
          searchData?.bhk || ""
        }&property_cost=${
          searchData?.budget || ""
        }&priceFilter=${encodeURIComponent(selected)}&occupancy=${
          searchData?.occupancy
        }&property_status=1`
      );
      const res = await response.json();
      const newData = res.properties || [];
      setData((prevData) => (page === 1 ? newData : [...prevData, ...newData]));
      setHasMore(newData.length > 0);
    } catch (error) {
      setData([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    searchData.location,
    searchData?.bhk,
    searchData.property_in,
    searchData.tab,
    searchData.occupancy,
    searchData.sub_type,
    searchData?.budget,
    selected,
  ]);
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) return;
      const { userDetails } = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/getAllFavourites?user_id=${userDetails.user_id}`
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
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [hasMore, loading]);
  useEffect(() => {
    setPage(1);
    fetchProperties();
  }, [
    fetchProperties,
    searchData.location,
    searchData?.bhk,
    searchData.property_in,
    searchData.tab,
    searchData.occupancy,
    searchData.sub_type,
    searchData?.budget,
    selected,
  ]);
  const toggleReadMore = useCallback((index) => {
    setReadMoreStates((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);
  const toggleFacilities = useCallback((index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);
  const handleNavigation = useCallback(
    (property) => {
      navigate("/property", { state: property });
    },
    [navigate]
  );
  const handleLike = useCallback(
    async (property) => {
      console.log("property: ", property.image, property);
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");
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
        await axios.post(`${config.awsApiUrl}/fav/postIntrest`, payload);
      } catch (err) {
        console.error("Error updating interest:", err);
        setLikedProperties((prev) =>
          isAlreadyLiked
            ? [...prev, property.unique_property_id]
            : prev.filter((id) => id !== property.unique_property_id)
        );
      }
    },
    [likedProperties]
  );
  const [selectedProperty, setSelectedProperty] = useState(null);
  const handleScheduleVisit = (property) => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.error("Please Login to Contact!");
      return;
    }
    setSelectedProperty(property);
    setModalOpen(true);
  };
  const handleModalSubmit = async (formData) => {
    try {
      const { userDetails } = JSON.parse(localStorage.getItem("user"));
      const payload = {
        property_id: selectedProperty.unique_property_id,
        user_id: userDetails.user_id,
        name: formData.name,
        mobile: formData.phone,
        email: formData.email,
        property_user_id: selectedProperty.user_id,
        shedule_date: formData.date,
        shedule_time: formData.time,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/scheduleVisit`, payload);
      toast.success("Enquiry submitted successfully");
      setModalOpen(false);
    } catch (err) {
      console.error("Enquiry Failed:", err);
      toast.error("Something went wrong while submitting enquiry");
    }
  };
  const handleContactSeller = async (property) => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");

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
      await axios.post(`${config.awsApiUrl}/enquiry/contactSeller`, payload);
      toast.success("Details submitted successfully");
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
          handleLike={handleLike}
          handleScheduleVisit={handleScheduleVisit}
          handleContactSeller={handleContactSeller}
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
  ]);
  const cards = prepareCards();
  const rowRenderer = ({ index, key, style }) => {
    const item = cards[index];
    return (
      <div
        key={key}
        style={{
          ...style,
          paddingBottom: window.innerWidth < 768 ? "24px" : "32px",
        }}
        className="w-full px-2"
      >
        {item.content}
      </div>
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
    <div className="min-h-screen w-full md:w-[75%] sm:w-[100%] p-1 pt-20 relative z-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start md:items-start">
          <MapPin className="text-yellow-500 mr-2 mt-1 md:mt-0" />
          <p className="text-xl text-left font-normal text-[#1D3A76]">
            {searchData?.property_in === "Commercial"
              ? "Commercial"
              : searchData?.property_in === "Plot"
              ? "Plot"
              : "Residential"}{" "}
            {searchData.sub_type} For{" "}
            {searchData?.tab === "Buy"
              ? "Sell"
              : searchData?.tab === "Rent"
              ? "Rent"
              : "Sell"}{" "}
            In {searchData?.location || "Hyderabad"}
          </p>
        </div>
        <div className="relative inline-block text-left">
          <div className="flex items-center gap-2">
            <p className="text-[#000000] whitespace-nowrap">Sort by :</p>
            <div
              className="bg-[#F5F5F5] border border-[#2C4D60] rounded-lg cursor-pointer px-4 py-2 pr-8 flex items-center min-w-[160px]"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="text-sm text-gray-800">{selected}</span>
              <ChevronDown
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={20}
              />
            </div>
          </div>
          {isOpen && (
            <div className="absolute mt-2 right-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
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
                  rowHeight={window.innerWidth >= 768 ? 350 : 420}
                  rowRenderer={rowRenderer}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      ) : (
        <div>
          <h1 className="text-2xl text-gray-500 font-bold">
            No Properties Found!
          </h1>
          <AdsCard />
        </div>
      )}
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
      <div className="w-full h-[40px]" ref={bottomRef}></div>
      <ScheduleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
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
