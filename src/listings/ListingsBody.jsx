import { useEffect, useState, useCallback, useMemo } from "react";
import { MapPin, ChevronDown, ChevronUp, X } from "lucide-react";
import noPropertiesFound from "../assets/Images/14099.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
import AdsCard from "./AdsCard";
import PropertyCard from "./PropertyCard";
import SkeletonPropertyCard from "./SkeletonPropertyCard";
import { clearSearch } from "../../store/slices/searchSlice";
const formatToIndianCurrency = (value) => {
  if (!value || isNaN(value)) return "N/A";
  const numValue = parseFloat(value);
  if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
  if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
  if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
  return numValue.toString();
};
function  ListingsBody({ setShowLoginModal }) {
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
        }/listings/v1/getAllPropertiesByType?page=${currentPage}&limit=70&property_for=${
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
        }&property_status=${searchData.property_status}&city=${
          searchData.city
        }&furnished_status=${searchData.furnished_status}`;
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
    [searchData, selected, loading]
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
    searchData?.city,
    searchData?.property_in,
    searchData?.tab,
    searchData?.occupancy,
    searchData?.sub_type,
    searchData?.budget,
    searchData?.furnished_status,
    searchData.property_status,
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
  const cache = useMemo(
    () => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 350 }),
    []
  );
  const rowRenderer = useCallback(
    ({ index, key, style, parent }) => {
      const item = cards[index];
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          rowIndex={index}
          parent={parent}
          key={key}
        >
          {({ registerChild }) => (
            <div
              ref={registerChild}
              key={key}
              style={{
                ...style,
                paddingBottom: window.innerWidth < 768 ? "24px" : "32px",
                marginBottom: window.innerWidth < 768 ? "16px" : "24px",
              }}
              className="w-full flex justify-center px-2 mt-3"
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
    },
    [
      cards,
      cache,
      toggleReadMore,
      toggleFacilities,
      handleNavigation,
      readMoreStates,
      expandedCards,
      likedProperties,
      contacted,
      handleLike,
      handleScheduleVisit,
      submittedStates,
      getOwnerDetails,
      setShowLoginModal,
    ]
  );
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
      <div className="flex justify-between flex-wrap gap-2 mb-1 mt-2 px-2  ">
        <div className="flex   flex-grow overflow-hidden  items-center min-w-0">
          <MapPin className="text-yellow-500 mr-1 w-4 h-4 md:w-5 md:h-5" />
          <p className="text-sm  whitespace-nowrap overflow-hidden text-ellipsis font-normal text-[#1D3A76]">
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
        <div className="relative   flex gap-2 sm:gap-0 flex-col sm:flex-row mb-1 text-left z-50 flex-shrink-0  ">
          <Breadcrumb />
          <div className="flex items-center  gap-2">
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
        <div className="text-center mt-5 flex flex-col gap-4">
          <img
            src={noPropertiesFound}
            alt="Property"
            crossOrigin="anonymous"
            className="w-full h-[280px] object-contain rounded-md"
          />
          <h1 className="text-2xl text-blue-900 font-bold">
            Oops, No Properties Found!
          </h1>
          <div className="border border-gray-300 rounded-xl p-4">
            <p className="text-base font-semibold text-gray-600">
              Adjust your filters to find the perfect property.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {searchData &&
                Object.entries(searchData)
                  .filter(
                    ([key, value]) =>
                      ![
                        "loading",
                        "error",
                        "userCity",
                        "tab",
                        "property_status",
                        "plot_subType",
                      ].includes(key) &&
                      value !== null &&
                      value !== "" &&
                      value !== undefined
                  )
                  .map(([key, value]) => {
                    const labels = {
                      city: "City",
                      property_for: "Property For",
                      property_in: "Property In",
                      bhk: "BHK",
                      budget: "Budget",
                      sub_type: "Property Type",
                      commercial_subType: "Commercial Type",
                      occupancy: "Occupancy",
                      location: "Location",
                      furnished_status: "Furnished Status",
                    };

                    const colors = {
                      city: "bg-blue-100 text-blue-800",
                      property_for: "bg-green-100 text-green-800",
                      property_in: "bg-yellow-100 text-yellow-800",
                      bhk: "bg-red-100 text-red-800",
                      budget: "bg-indigo-100 text-indigo-800",
                      sub_type: "bg-teal-100 text-teal-800",
                      commercial_subType: "bg-orange-100 text-orange-800",
                      occupancy: "bg-cyan-100 text-cyan-800",
                      location: "bg-lime-100 text-lime-800",
                      furnished_status: "bg-rose-100 text-rose-800",
                    };

                    return (
                      <span
                        key={key}
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          colors[key] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {labels[key]}: {value}
                      </span>
                    );
                  })}
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="flex flex-row items-center cursor-pointer gap-2 bg-blue-900 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                onClick={() => {
                  dispatch(clearSearch());
                  navigate("/listings");
                }}
                aria-label="Clear all applied filters"
              >
                Reset All Filters
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
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
