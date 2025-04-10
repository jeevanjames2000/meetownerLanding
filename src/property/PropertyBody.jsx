import {
  Building,
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
import React, { useEffect, useState } from "react";
import { BiBasketball } from "react-icons/bi";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
const PropertyBody = () => {
  const { state: property } = useLocation();
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
    "Half Basket Ball Court": <BiBasketball />,
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
  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        const response = await fetch(
          `https://4a42-115-98-88-60.ngrok-free.app/listings/getAllFloorPlans/${property?.unique_property_id}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
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
  return (
    <div className="p-6 w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-blue-900 font-bold uppercase text-3xl">
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
      <div className="flex flex-col border-b pb-1">
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
        <div className="flex justify-between items-start gap-4 w-full">
          <div>
            <p className="text-xs text-left text-gray-400 uppercase tracking-wide mt-1">
              Construction Pvt Ltd...
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {property?.location_id}
            </p>
          </div>
          <div className="text-sm text-indigo-600 text-right">
            EMI starts at ₹{" "}
            {(parseInt(property?.property_cost) / 2400).toFixed(2)} K
            <br />
            <span className="text-xs text-gray-400">All Inclusive Price</span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-800 font-medium mt-3">
            <span>{property?.bedrooms} BHK Apartment</span>
            <span className="border-l h-4 border-gray-300"></span>
            <span>
              ₹ {parseInt(property?.builtup_unit)?.toLocaleString()} /sq.ft
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
          </div>
          <button className="bg-[#EC6F51] hover:bg-[#d85e43] text-white text-sm px-4 py-2 rounded-lg mt-2">
            Contact Developer
          </button>
        </div>
      </div>
      <div className="mt-6">
        <img
          src={mainImage}
          alt="Main"
          className="w-full h-[400px] object-cover rounded-2xl shadow-md"
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
              modules={[Navigation]}
              slidesPerView={4}
              spaceBetween={16}
              navigation
              className="mySwiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${img.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    crossOrigin="anonymous"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all"
                    onClick={() => setMainImage(`${img.url}`)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
          Floor Plan
        </h2>
        <img
          src={`https://api.meetowner.in/uploads/${floorplan?.image}`}
          alt="FloorPlan"
          crossOrigin="anonymous"
          className="rounded-lg shadow-md w-full object-cover h-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400?text=${"No Floor Plan Found"}`;
          }}
        />
      </div>
      <div>
        <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
          Amenities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2  border-1 border-gray-500 rounded-lg">
          {facilitiesList?.map((facility, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-4 text-[#4B1D1D]"
            >
              <div className="w-6 h-6">
                {facilityIconMap[facility] || <Building />}
              </div>
              <span className="text-sm">{facility}</span>
            </div>
          ))}
        </div>
      </div>
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
    </div>
  );
};
export default PropertyBody;
