import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Ruler,
  Home,
  CreditCard,
  Key,
  ShieldCheck,
  Building,
} from "lucide-react";
import { IoIosHeart } from "react-icons/io";
import { MdOutlineVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import ScheduleFormModal from "../utilities/ScheduleForm";
import { toast } from "react-toastify";
import Header from "./Header";
import Footer from "./Footer";
import DynamicAds from "../utilities/DynamicAds";
import useWhatsappHook from "../utilities/useWhatsappHook";
import Login from "../auth/Login";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import whatsappIcon from "../assets/Images/whatsapp (3).png";
import { Pagination } from "swiper/modules";

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
        `${config.awsApiUrl}/fav/v1/getAllFavourites?user_id=${userDetails.user_id}`
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
    fetchContactedProperties();
  }, []);
  const toggleReadMore = (index) => {
    setReadMoreStates((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const toggleFacilities = (index) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const [contacted, setContacted] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [submittedStates, setSubmittedStates] = useState({});
  const [owner, setOwner] = useState("");
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
    } catch (err) {}
  };
  const { handleAPI } = useWhatsappHook();
  const navigate = useNavigate();
  const handleNavigation = useCallback(
    async (property) => {
      let userDetails = null;
      try {
        const data = localStorage.getItem("user");
        if (data) {
          const parsedData = JSON.parse(data);
          userDetails = parsedData?.userDetails || null;
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
      navigate("/property", { state: property });
    },
    [navigate]
  );

  const handleLike = useCallback(
    async (property) => {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");
        return;
      }
      const { userDetails } = JSON.parse(data);
      const payload = {
        unique_property_id: property.unique_property_id,
        User_user_id: userDetails.user_id,
        status: 1,
      };
      try {
        await axios.post(`${config.awsApiUrl}/fav/v1/postIntrest`, payload);
        fetchLikedProperties();
      } catch (err) {
        console.error("Error updating interest:", err);
      }
    },
    [likedProperties]
  );
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
  const PropertyCard = memo(
    ({
      property,
      index,
      handleNavigation,
      expandedCards,
      handleLike,
      handleScheduleVisit,
      submittedState,
      contacted,
      getOwnerDetails,
    }) => {
      const formatToIndianCurrency = (value) => {
        if (!value || isNaN(value)) return "N/A";
        const numValue = parseFloat(value);
        if (numValue >= 10000000)
          return (numValue / 10000000).toFixed(2) + " Cr";
        if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
        if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
        return numValue.toString();
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
              property.property_for === "Rent" ? "rent" : "buy";
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
            const seoUrl = `${propertyFor}_${category}_${property.sub_type}_${propertyNameSlug}_in_${locationSlug}_${citySlug}_Id_${propertyId}`;
            const fullUrl = `${window.location.origin}/property?${seoUrl}`;
            const encodedMessage = encodeURIComponent(
              `Hi ${name},\nI'm interested in this property: ${property.property_name}.\n${fullUrl}\nI look forward to your assistance in the home search. Please get in touch with me at ${userData.mobile} to initiate the process.`
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
          className="flex flex-col md:flex-row w-full h-full rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-shadow duration-300 bg-white cursor-pointer mb-6"
          onClick={() => handleNavigation(property)}
        >
          <div className="bg-[#fff] rounded-[20px] p-4 w-full">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-[300px]">
                <div className="rounded-lg overflow-hidden mb-4 relative">
                  <img
                    src={
                      property.image
                        ? `https://api.meetowner.in/uploads/${property.image}`
                        : `https://placehold.co/600x400?text=${
                            property?.image || "No Image Found"
                          }`
                    }
                    alt="Property"
                    crossOrigin="anonymous"
                    className="w-full h-50 max-h-60 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`;
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 max-w-full md:max-w-[450px]">
                <div className="mb-3 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-blue-900 font-bold text-[18px]">
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
                      <span className="text-blue-900 font-medium text-[15px]">
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
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[#A4A4A4] font-medium text-[15px]">
                      Property Details
                    </h4>
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

                <div className="flex flex-row align-middle justify-end sm:flex-row gap-2">
                  <button
                    onClick={handleChatClick}
                    className="flex items-center justify-center gap-1 border border-[#25D366] text-[#25D366] px-6 py-2 rounded-full text-sm font-medium"
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
                    className="bg-blue-900 hover:bg-blue-900 text-white px-6 py-2 rounded-full text-sm font-semibold"
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
        <div className="flex-1 px-4 md:px-10 py-6 pb-10">
          <Swiper
            modules={[Pagination]}
            direction="vertical"
            spaceBetween={24}
            slidesPerView={2}
            className="w-full h-[500px]"
            style={{ overflowY: "auto", overscrollBehavior: "contain" }}
          >
            {likedProperties.map((property, index) => (
              <SwiperSlide key={index} className="w-full">
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
                  submittedState={
                    submittedStates[property.unique_property_id] || {}
                  }
                  setShowLoginModal={setShowLoginModal}
                  contacted={contacted}
                  getOwnerDetails={getOwnerDetails}
                />
              </SwiperSlide>
            ))}
          </Swiper>
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
      {modalOpen && (
        <ScheduleFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
        />
      )}
      <Footer />
    </>
  );
};
export default Favourites;
