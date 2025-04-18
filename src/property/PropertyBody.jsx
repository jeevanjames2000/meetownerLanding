import {
  Building,
  ChevronUp,
  Droplet,
  Dumbbell,
  Landmark,
  Medal,
  MonitorCheck,
  PawPrint,
  Phone,
  ShieldCheck,
  TreePalm,
  Users,
  Waves,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { BiBasketball } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import config from "../../config";
import {
  FaBatteryFull,
  FaBicycle,
  FaChild,
  FaDoorOpen,
  FaFilter,
  FaFireExtinguisher,
  FaLeaf,
  FaPlug,
  FaShuttleSpace,
  FaSolarPanel,
  FaToolbox,
  FaWater,
  FaWifi,
} from "react-icons/fa6";
import Login from "../auth/Login";
import { toast } from "react-toastify";
import axios from "axios";
import useWhatsappHook from "../utilities/useWhatsappHook";
import {
  FaAngleLeft,
  FaAngleRight,
  FaBasketballBall,
  FaCogs,
  FaShieldAlt,
} from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
const PropertyBody = () => {
  const { state: property } = useLocation();
  console.log("property: ", property);
  const facilityIconMap = {
    Lift: <Building />,
    CCTV: <MonitorCheck />,
    Gym: <Dumbbell />,
    Garden: <TreePalm />,
    "Club House": <Users />,
    Sports: <Medal />,
    "Swimming Pool": <Waves />,
    Intercom: <Phone />,
    "Gated Community": <ShieldCheck />,
    "Regular Water": <Droplet />,
    "Community Hall": <Landmark />,
    "Pet Allowed": <PawPrint />,
    "Half Basket Ball Court": <FaBasketballBall />,
    "Power Backup": <FaBatteryFull />,
    "Entry / Exit": <FaDoorOpen />,
    "Badminton Court": <FaShuttleSpace />,
    "Children Play Area": <FaChild />,
    "Water Harvesting Pit": <FaWater />,
    "Water Softener": <FaFilter />,
    "Solar Fencing": <FaSolarPanel />,
    "Security Cabin": <FaShieldAlt />,
    Lawn: <FaLeaf />,
    "Transformer Yard": <FaPlug />,
  };
  const fallbackIcons = [
    <FaWifi />,
    <FaBicycle />,
    <FaFireExtinguisher />,
    <FaToolbox />,
    <FaCogs />,
    <FaWater />,
    <FaSolarPanel />,
    <FaShieldAlt />,
  ];
  const getFallbackIcon = (name) => {
    const hash = [...name].reduce(
      (acc, c, i) => acc + c.charCodeAt(0) * (i + 1),
      0
    );
    return fallbackIcons[hash % fallbackIcons.length];
  };
  const facilitiesList = property?.facilities?.split(",").map((f) => f.trim());
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const description = property?.description || "";
  const isLong = description.length > 320;
  const shortText = description.slice(0, 320);
  const [floorplan, setFloorPlan] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const fetchPropertyimages = async () => {
    setImages([]);
    try {
      const response = await fetch(
        `https://api.meetowner.in/property/getpropertyphotos?unique_property_id=${property?.unique_property_id}`
      );
      const data = await response.json();
      setMainImage(data.images[0].url);
      setImages(data.images);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };
  const [aroundProperty, setAroundProperty] = useState("");
  console.log("aroundProperty: ", aroundProperty);
  const fetchAroundThisProperty = async () => {
    try {
      const response = await fetch(
        `${config.awsApiUrl}/listings/v1/getAroundThisProperty?id=${property?.unique_property_id}`
      );
      const data = await response.json();
      setAroundProperty(data.results);
    } catch (error) {
      console.error("Failed to fetch floor plans:", error);
    }
  };
  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        const response = await fetch(
          `${config.awsApiUrl}/listings/v1/getAllFloorPlans/${property?.unique_property_id}`
        );
        const data = await response.json();
        setFloorPlan(data[0]);
      } catch (error) {
        console.error("Failed to fetch floor plans:", error);
      }
    };
    if (property?.unique_property_id) {
      fetchFloorPlans();
      fetchPropertyimages();
      fetchAroundThisProperty();
    }
  }, [property?.unique_property_id]);
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
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
  const { handleAPI } = useWhatsappHook();
  const handleContactSeller = async () => {
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
      toast.success("Details submitted successfully");
    } catch (err) {
      toast.error("Something went wrong while submitting enquiry");
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <div className="p-6 w-full mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-blue-900 font-bold uppercase text-xl md:text-2xl lg:text-3xl">
        {property.property_name} PROPERTY DETAILS
      </h1>
      <p className="text-gray-700 text-left">
        <h2 className="text-xl mb-2 text-left font-bold text-gray-400">
          Property Description
        </h2>
        {isExpanded || !isLong ? description : `${shortText}... `}
        {isLong && (
          <span
            onClick={toggleReadMore}
            className="text-blue-600 cursor-pointer"
          >
            {isExpanded ? "Read Less" : "Read More..."}
          </span>
        )}
      </p>
      <div className="flex flex-col border-b pb-2 mb-2">
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          <h3 className="text-2xl font-bold text-indigo-900">
            {property?.property_name}
          </h3>
          <div className="text-right flex items-center gap-2">
            <p className="text-lg font-bold text-indigo-900">
              ₹{" "}
              {formatToIndianCurrency(
                property?.property_cost
              )?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              - ₹ {parseInt(property?.builtup_unit)?.toLocaleString()} /sq.ft
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
          <div>
            <p className="text-xs text-left font-semibold text-gray-400 uppercase tracking-wide mt-1">
              Construction Pvt Ltd...
            </p>
            <p className="text-xs text-left font-semibold text-gray-600 mt-1">
              {property?.location_id}
            </p>
          </div>
          <div className="text-sm text-blue-00 text-left md:text-right">
            <span className="text-md font-bold text-blue-900">
              {property?.loan_facility && "EMI option available"}
            </span>
            <br />
            <span className="text-xs font-semibold text-gray-400">
              All Inclusive Price
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-800 font-medium mt-3">
            <span className=" h-4 border-gray-300">
              {property.sub_type === "Apartment"
                ? `${property.bedrooms} BHK ${
                    property.property_type
                      ? property.property_type
                      : property.sub_type || ""
                  } for ${
                    property.property_for === "Sell"
                      ? "Sale"
                      : property?.property_for
                  }`
                : `${property.sub_type}`}{" "}
            </span>
            <span className="border-l h-4 border-gray-300"></span>
            <span>
              {property?.builtup_unit || property?.builtup_area} /{" "}
              {property.area_units}
            </span>
            <span className="border-l h-4 border-gray-300"></span>
            <span>{property?.facing} Facing</span>
            <span className="border-l h-4 border-gray-300"></span>
            <span>
              Possession Starts{" "}
              {new Date(property?.under_construction).toLocaleString(
                "default",
                {
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
            <span className="border-l h-4 border-gray-300"></span>
            <span className="flex items-center gap-1">
              <MdOutlineVerified className="text-xl text-green-500" />
              <p>Rera</p>
            </span>
          </div>
          <button
            onClick={() => {
              handleContactSeller();
            }}
            className="bg-[#EC6F51] hover:bg-[#d85e43] text-white text-sm px-4 py-2 rounded-lg mt-2"
          >
            Contact Developer
          </button>
        </div>
      </div>
      <div className="mt-6">
        <img
          src={mainImage}
          alt="Main"
          className="w-full h-auto md:h-[500px] object-cover rounded-2xl shadow-md"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400?text=${
              property?.property_name || "No Image Found"
            }`;
          }}
        />
        {images.length > 1 && (
          <div className="mt-4">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
              slidesPerView={4}
              spaceBetween={16}
              className="mySwiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${img.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    crossOrigin="anonymous"
                    className="w-full h-20 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all"
                    onClick={() => setMainImage(`${img.url}`)}
                  />
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
            </Swiper>
          </div>
        )}
      </div>
      {floorplan?.image && (
        <div>
          <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
            Floor Plan
          </h2>
          <img
            src={`https://api.meetowner.in/uploads/${floorplan?.image}`}
            alt="FloorPlan"
            crossOrigin="anonymous"
            className="rounded-lg shadow-md w-full object-contain h-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/600x400?text=${"No Floor Plan Found"}`;
            }}
          />
        </div>
      )}
      {facilitiesList && (
        <div>
          <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
            Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-gray-500 rounded-lg">
            {facilitiesList.map((facility, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-2 p-4 text-[#4B1D1D]"
              >
                <div className="w-6 h-6">
                  {facilityIconMap[facility] || getFallbackIcon(facility)}
                </div>
                <span className="text-sm text-center md:text-left">
                  {facility}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
          Explore Map
        </h2>
        <div className="w-full h-64 rounded overflow-hidden shadow">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property?.google_address
            )}&output=embed`}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      {showScrollTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition z-10"
        >
          <ChevronUp className="w-6 h-6 text-[#1D3A76]" />
        </div>
      )}
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
export default PropertyBody;
