import React, { useState } from "react";
import {
  MapPin,
  ChevronDown,
  School as Pool,
  ChevronUp,
  Ruler,
  Home,
  Receipt,
  CreditCard,
  Key,
  Compass,
} from "lucide-react";
function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showBankLoan, setShowBankLoan] = useState(true);
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };
  const toggleAmenities = () => {
    setShowAllAmenities(!showAllAmenities);
  };
  const amenities = [
    {
      icon: <Ruler className="w-6 h-6" />,
      title: "Build Up AREA",
      value: "4800 sqft",
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Status",
      value: "Ready to Move",
    },
    {
      icon: <Receipt className="w-6 h-6" />,
      title: "Transaction",
      value: "New Property",
    },
    ...(showBankLoan
      ? [
          {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Bank Loan Facility",
            value: "Yes",
          },
        ]
      : [
          {
            icon: <Key className="w-6 h-6" />,
            title: "OTP",
            value: "Yes",
          },
        ]),
    {
      icon: <Compass className="w-6 h-6" />,
      title: "FACING",
      value: "West",
    },
  ];
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 3);
  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <MapPin className="text-red-300 mr-2" />
          <p className="text-2xl font-normal text-blue-900 text-[#1D3A76]">
            Flats For Sale In Kondapur, Hyderabad
          </p>
        </div>
        <div className="relative flex items-center justify-center gap-2">
          <div className="text-[#000000]">
            <p>Sort by :</p>
          </div>
          <select className="appearance-none bg-[#F5F5F5] border border-[#2C4D60] rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Relevance</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={20}
          />
        </div>
      </div>
      <div className="flex rounded-lg shadow-[4px_4px_6px_5px_rgba(0,_0,_0,_0.1)] gap-8">
        <div className="bg-[#F3F3F3] rounded-[20px] p-4 w-[800px]">
          <div className="flex gap-5">
            <div className="w-[300px]">
              <div className="rounded-lg overflow-hidden mb-4 relative">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&h=300"
                  alt="Property"
                  className="w-full h-75 object-cover rounded-md"
                />
              </div>
            </div>

            <div className="flex-1 max-w-[550px]">
              <div className="mb-4 text-left">
                <p className="text-[#1D3A76] font-semibold text-[22px]">
                  Rs 2Cr EMI option available{" "}
                  <span className="text-[#A4A4A4] font-medium text-[15px]">
                    Lakescape
                  </span>
                </p>
                <p className="text-[#A4A4A4] font-medium text-[15px]">
                  3 BHK Apartment for sell in Kondapur, Telangana, India
                </p>
              </div>

              <div className="mb-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Property Details</h4>
                  <p
                    onClick={toggleAmenities}
                    className="text-[#1D3A76] hover:text-[#A4A4A4] font-medium  rounded-[5px] p-1 flex items-center gap-1 text-[13px]"
                  >
                    {showAllAmenities ? (
                      <>
                        Show Less <ChevronUp className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Show All <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {visibleAmenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 text-left rounded-lg shadow-sm"
                    >
                      <div className="text-[#666666] font-medium text-xs mb-1">
                        {amenity.title}
                      </div>
                      <div className="text-[#1D3A76] font-medium text-xs">
                        {amenity.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[#A4A4A4] text-sm text-left">
                  {isExpanded
                    ? "Lakescape by Candeur offers dream homes with unrivaled lake views in 2BHK to 3.5BHK options. Experience abundant natural light, a spacious clubhouse, and a private outdoor working area. Elevate your lifestyle with this perfect blend of comfort and scenic beauty."
                    : "Lakescape by Candeur offers dream homes with unrivaled lake views in 2BHK to 3.5BHK options. Experience abundant natural..."}{" "}
                  <span
                    onClick={toggleReadMore}
                    className="text-[#1D3A76] font-normal cursor-pointer"
                  >
                    {isExpanded ? "Read Less..." : "Read More..."}
                  </span>
                </p>
              </div>

              <div className="flex gap-4">
                <p
                  onClick={() => alert("Schedule Visit clicked")}
                  className="flex-1 transition text-[15px] bg-[#59788E] rounded-[50px] p-2 text-[#ffffff] font-medium text-center"
                >
                  Schedule Visit
                </p>
                <p
                  onClick={() => alert("Contact Seller clicked")}
                  className="flex-1 transition text-[15px] bg-[#84A3B7] rounded-[50px] p-2 text-[#ffffff] font-medium text-center"
                >
                  Contact Seller
                </p>
                <p
                  onClick={() => alert("Interest clicked")}
                  className="flex-1 transition text-[15px] bg-[#E28B6D] rounded-[50px] p-2 text-[#ffffff] font-medium text-center"
                >
                  Interest
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
