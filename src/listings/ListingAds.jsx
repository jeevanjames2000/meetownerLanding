import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListingAds = () => {
  const [property, setProperty] = useState([]);
  console.log("property: ", property);
  const fetchLatestProperties = async () => {
    setProperty([]);
    try {
      const response = await fetch(
        `https://4a42-115-98-88-60.ngrok-free.app/listings/getRandomPropertiesAds`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
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
    (property) => {
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
      <div className="hidden relative right-0 top-20 lg:block md:block w-[24%] h-full bg-white  p-3 rounded-xl shadow-lg overflow-hidden">
        <div className="relative rounded-lg">
          <img
            src={`https://api.meetowner.in/uploads/${property[2]?.image}`}
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
                        ? `https://api.meetowner.in/uploads/${item.image}`
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
export default ListingAds;
