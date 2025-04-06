import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate, useNavigation } from "react-router-dom";
function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Relevance");
  const options = [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
  ];
  const toggleReadMore = (index) => {
    setReadMoreStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  const [page, setPage] = useState(1);
  const limit = 50;

  const [data, setData] = useState([]);
  const fetchProperties = async () => {
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(
        `http://localhost:5000/listings/getListingsByLimit?page=${page}&limit=${limit}&offset=${offset}`
      );
      const res = await response.json();
      if (res) {
        setData((prevData) => [...prevData, ...(res?.properties || [])]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const [expandedCards, setExpandedCards] = useState({});
  const [readMoreStates, setReadMoreStates] = useState({});
  const toggleFacilities = (index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  const handleNavigation = (property) => {
    navigate("/property", { state: property });
  };

  return (
    <div className="min-h-screen w-full md:w-[75%] sm:w-[100%] bg-[#F5F5F5] p-1">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start md:items-start">
          <MapPin className="text-yellow-500 mr-2 mt-1 md:mt-0" />
          <p className="text-xl text-left font-normal text-[#1D3A76]">
            Flats For Sale In Kondapur, Hyderabad
          </p>
        </div>
        <div className="relative inline-block text-left">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p className="text-[#000000] whitespace-nowrap">Sort by :</p>
            <div className="bg-[#F5F5F5] border border-[#2C4D60] rounded-lg px-4 py-2 pr-8 flex items-center min-w-[160px]">
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
      <div className="h-[150vh] overflow-y-auto pr-2 pb-2 scroll-smooth flex flex-col gap-8">
        {data.map((property, index) => {
          const showReadMore = readMoreStates[index];

          const shortDescription = property.description?.slice(0, 180);
          return (
            <div
              key={index}
              className="flex flex-col md:flex-row rounded-lg shadow-[4px_4px_6px_4px_rgba(0,_0,_0,_0.1)] gap-8 cursor-pointer"
              onClick={() => handleNavigation(property)}
            >
              <div className="bg-[#F3F3F3] rounded-[20px] p-4 w-full">
                <div className="flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-[300px]">
                    <div className="rounded-lg overflow-hidden mb-4 relative">
                      <img
                        src={`https://api.meetowner.in/uploads/${property?.image}`}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/160x130?text=No+Image";
                        }}
                        alt="Property"
                        crossOrigin="anonymous"
                        className="w-full h-70 object-cover rounded-md"
                      />
                    </div>
                  </div>

                  <div className="flex-1 max-w-full md:max-w-[550px]">
                    <div className="mb-3 text-left">
                      <div className="flex justify-between items-center">
                        <p className="text-[#1D3A76] font-bold text-[15px]">
                          {property.bedrooms} BHK {property.property_type} for{" "}
                          {property.property_for} in {property.locality_name},{" "}
                          {property.google_address}
                        </p>

                        <div className="flex items-center gap-2 text-[#1D3A76] text-sm font-medium">
                          <IoIosHeartEmpty className="text-xl" />
                          <MdOutlineVerified className="text-xl text-green-500" />
                          <p>Verified</p>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <p className="text-[#A4A4A4] font-semibold text-[18px]">
                          {property.property_name}
                        </p>
                        <p className="text-[#1D3A76] font-semibold text-[18px]">
                          {property.project_name || property.listing_title}{" "}
                          <span className="text-[#A4A4A4] font-medium text-[15px]">
                            Rs: {formatToIndianCurrency(property.property_cost)}{" "}
                            {property.price_negotiable && " (Negotiable)"}
                          </span>
                          <span className="text-[#A4A4A4] font-medium text-[15px] ml-2">
                            {property?.loan_facility
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
                          onClick={() => toggleFacilities(index)}
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
                                title: "Built-up Area",
                                value: `${property?.builtup_area || "N/A"} ${
                                  property?.area_units || ""
                                }`,
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
                                icon: <Building2 className="w-4 h-4" />,
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
                                title: "Built-up Area",
                                value: `${property?.builtup_area || "N/A"} ${
                                  property?.area_units || ""
                                }`,
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
                                icon: <Building2 className="w-4 h-4" />,
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
                            ].slice(0, 3)
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
                          onClick={() => toggleReadMore(index)}
                          className="text-[#1D3A76] font-normal cursor-pointer"
                        >
                          {showReadMore ? "Read Less..." : "Read More..."}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <p
                        onClick={() => alert("Schedule Visit clicked")}
                        className="sm:flex-1 transition text-[15px] bg-[#59788E] rounded-[50px] px-4 py-2 text-[#ffffff] font-medium text-center"
                      >
                        Schedule Visit
                      </p>
                      <p
                        onClick={() => alert("Contact Seller clicked")}
                        className="sm:flex-1 transition text-[15px] bg-[#84A3B7] rounded-[50px] px-4 py-2 text-[#ffffff] font-medium text-center"
                      >
                        Contact Seller
                      </p>
                      <p
                        onClick={() => alert("Interest clicked")}
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
        })}
      </div>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => {
            if (page > 1) {
              setPage((prev) => prev - 1);
            }
          }}
          className="px-4 py-2 rounded-lg border-1 border-gray-300 cursor-pointer  hover:bg-yellow-500 text-black font-medium"
        >
          Prev
        </button>

        <span className="text-sm text-gray-700 font-medium">Page {page}</span>

        <button
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          className="px-4 py-2 rounded-lg border-1 border-gray-300 cursor-pointer hover:bg-yellow-500 text-black font-medium"
        >
          Next
        </button>
        <div
          onClick={scrollToTop}
          className=" bottom-5 right-5 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition"
        >
          <ChevronUp className="w-6 h-6 text-[#1D3A76]" />
        </div>
      </div>
    </div>
  );
}
export default App;
