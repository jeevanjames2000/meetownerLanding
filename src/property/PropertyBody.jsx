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
    "Half Basket Ball Court": <BiBasketball />,
  };
  const facilitiesList = property?.facilities?.split(",").map((f) => f.trim());
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  const description = property?.description || "";
  const isLong = description.length > 320;
  const shortText = description.slice(0, 320);
  const [floorplan, setFloorPlan] = useState("");
  console.log("floorplan: ", floorplan);
  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/listings/getAllFloorPlans/${property?.unique_property_id}`
        );
        const data = await response.json();
        console.log("response: ", response);
        console.log("data: ", data);
        setFloorPlan(data[0]);
      } catch (error) {
        console.error("Failed to fetch floor plans:", error);
      }
    };
    if (property?.unique_property_id) {
      fetchFloorPlans();
    }
  }, [property?.unique_property_id]);
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl text-left font-normal text-indigo-800">
        Property Description
      </h2>
      <p className="text-gray-700 text-left">
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
            <p className="text-lg font-bold text-[#4B1D1D]">
              ₹ {parseInt(property?.property_cost)?.toLocaleString()}
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
          src={
            property.image
              ? `https://api.meetowner.in/uploads/${property.image}`
              : `https://placehold.co/600x400?text=${
                  property?.property_name || "No Image Found"
                }`
          }
          alt="Property"
          crossOrigin="anonymous"
          className="w-full h-70 object-fit rounded-md"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400?text=${
              property?.property_name || "No Image Found"
            }`;
          }}
        />
      </div>
      <div>
        <h2 className="text-xl text-left mb-2 font-normal text-indigo-800">
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
        <h2 className="text-xl text-left font-normal space-2 mb-2 text-indigo-800">
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
