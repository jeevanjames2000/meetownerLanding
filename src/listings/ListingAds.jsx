import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../auth/Login";
import { setPropertyData } from "../../store/slices/propertyDetails";
import { useDispatch, useSelector } from "react-redux";
import noPropertiesFound from "../assets/Images/urban-planning_10891692.png";

const ListingAds = () => {
  const [property, setProperty] = useState([]);
  const searchData = useSelector((state) => state.search);
  const fetchLatestProperties = async () => {
    setProperty([]);
    try {
      const response = await fetch(
        `${config.awsApiUrl}/adAssets/v1/getAds?ads_page=listing_ads&city=${searchData.city}`
      );
      const data = await response.json();
      setProperty(data.ads);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };

  useEffect(() => {
    fetchLatestProperties();
  }, [searchData]);
  const navigate = useNavigate();
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
    [navigate, dispatch, searchData]
  );

  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const handleContactSeller = async (property) => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Contact!");
        setShowLoginModal(true);
        return;
      }
      const userDetails  = JSON.parse(data);
      const payload = {
        unique_property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
      // toast.success("Details submitted successfully");
    } catch (err) {
      toast.error("Something went wrong while submitting enquiry");
    }
  };
  if (property.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-gray-300 rounded-xl p-6 bg-white shadow-sm text-center">
        <img
          src={noPropertiesFound}
          alt="Property"
          crossOrigin="anonymous"
          className="w-[100%] h-20 object-contain rounded-md"
        />
        <div className="text-md font-semibold text-gray-600 mb-4">
          😕 We couldn't find any properties for the selected filters.
        </div>
        <div className="text-sm text-gray-500">
          🔄 Try changing the location or filters to see available properties.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden sticky right-0 top-20 lg:block md:block h-auto z-0 bg-white  p-3 rounded-xl shadow-lg overflow-hidden">
        <div className="relative rounded-lg cursor-pointer">
          <img
            src={
              property[2]?.property_data?.image
                ? `https://api.meetowner.in/uploads/${property[2].property_data.image}`
                : `https://via.placeholder.com/400x200?text=No+Image`
            }
            alt="Featured Property"
            crossOrigin="anonymous"
            className="w-full h-44 object-cover rounded-md"
          />

          <div className="absolute bottom-2 right-2 flex md:flex-col lg:flex-row justify-center  gap-2">
            <p
              onClick={() => {
                handleNavigation(property[2].property_data);
              }}
              className="bg-inherit text-[#fff] font-normal hover:bg-white cursor-pointer hover:text-black px-2 rounded-lg border-1 border-[#ffffff] transition"
            >
              View Details
            </p>
            <p
              onClick={() => {
                handleContactSeller(property[2].property_data);
              }}
              className="bg-inherit text-[#fff] font-normal px-2 hover:bg-white hover:text-black cursor-pointer rounded-lg border-1 border-[#ffffff] transition"
            >
              Contact
            </p>
          </div>
        </div>
        <div className="py-3">
          <div className="grid xl:grid-cols-2 gap-4 mb-8">
            {property.slice(0, 2).map((item, i) => (
              <div
                key={item.id || i}
                className="relative rounded-xl shadow-lg overflow-hidden"
                onClick={() => {
                  handleNavigation(item.property_data);
                }}
              >
                <div className="bg-[#1D3A76] text-white text-xs font-medium py-2 px-4 text-center">
                  Latest Property
                </div>
                <div className="bg-gray-50 rounded-b-lg overflow-hidden cursor-pointer">
                  <img
                    src={
                      item.property_data?.image
                        ? `https://api.meetowner.in/uploads/${item.property_data.image}`
                        : `https://via.placeholder.com/400x200?text=No+Image`
                    }
                    crossOrigin="anonymous"
                    alt={
                      item.property_data?.property_name || `Property ${i + 1}`
                    }
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 text-left">
                    <p className="font-bold text-gray-900">
                      ₹
                      {formatToIndianCurrency(
                        item.property_data?.property_cost || 0
                      )}
                    </p>
                    <h4 className="font-normal text-md">
                      {item.property_data?.property_name || "Unnamed Property"}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
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
        </div>
      </div>
    </>
  );
};
export default ListingAds;
