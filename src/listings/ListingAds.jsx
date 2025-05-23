import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";
import { toast } from "react-toastify";
import Login from "../auth/Login";
import { setPropertyData } from "../../store/slices/propertyDetails";
import { useDispatch, useSelector } from "react-redux";

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
      const { userDetails } = JSON.parse(data);
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
    return;
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
