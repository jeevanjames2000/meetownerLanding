import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import axios from "axios";

const DynamicAds = () => {
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
  const navigate = useNavigate();
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
      navigate("/property", { state: property });
    },
    [navigate]
  );
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  return (
    <>
      <div className="hidden relative right-0 top-0 lg:block md:block w-[24%] h-full bg-white  p-3 rounded-xl shadow-lg overflow-hidden">
        <div className="relative rounded-lg">
          <img
            src={`https://api.meetowner.in/aws/v1/s3/uploads/${property[2]?.image}`}
            alt="Featured Property"
            crossOrigin="anonymous"
            className="w-full h-44 object-cover rounded-md"
          />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <p
              onClick={() => {
                handleNavigation(property[2]);
              }}
              className="bg-inherit text-[#fff] font-normal hover:bg-white cursor-pointer hover:text-black px-2 rounded-lg border-1 border-[#ffffff] transition"
            >
              View Details
            </p>
            <p className="bg-inherit text-[#fff] font-normal px-2 hover:bg-white hover:text-black cursor-pointer rounded-lg border-1 border-[#ffffff] transition">
              Contact
            </p>
          </div>
        </div>
        <div className="py-3">
          <div className="grid grid-cols-2 gap-4 mb-8">
            {property.slice(0, 2).map((item, i) => (
              <div
                key={item.id || i}
                className="relative rounded-xl shadow-lg overflow-hidden"
                onClick={() => {
                  handleNavigation(item);
                }}
              >
                <div className="bg-[#1D3A76] text-white text-xs font-medium py-2 px-4 text-center">
                  Latest Property
                </div>
                <div className="bg-gray-50 rounded-b-lg overflow-hidden">
                  <img
                    src={
                      item.image
                        ? `https://api.meetowner.in/aws/v1/s3/uploads/${item.image}`
                        : `https://via.placeholder.com/400x200?text=No+Image`
                    }
                    crossOrigin="anonymous"
                    alt={item.property_name || `Property ${i + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 text-left">
                    <p className="font-bold text-gray-900">
                      ₹{formatToIndianCurrency(item.property_cost || 0)}
                    </p>
                    <h4 className="font-normal text-md">
                      {item.property_name || "Unnamed Property"}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DynamicAds;
