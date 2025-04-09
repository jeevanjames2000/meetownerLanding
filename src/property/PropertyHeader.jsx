import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setBHK,
  setBudget,
  setCity,
  setLocation,
  setOccupancy,
  setPropertyIn,
  setSubType,
  setTab,
} from "../../store/slices/searchSlice";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const PropertyHeader = () => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);
  const [selectedCity, setSelectedCity] = useState(
    searchData?.city || "Hyderabad"
  );
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const cities = ["Hyderabad", "Kondapur", "Telangana"];
  const [selectedTab, setSelectedTab] = useState(searchData.tab || "Buy");
  const [selectedBHK, setSelectedBHK] = useState(searchData.bhk || "Bhk");
  const [selectedBudget, setSelectedBudget] = useState(searchData.budget || "");
  const [selectedPropertyIn, setSelectedPropertyIn] = useState(
    searchData.property_in || "Residential"
  );
  const [selectedSubType, setSelectedSubType] = useState(
    searchData.sub_type || "Apartment"
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState(
    searchData.occupancy || "Ready to move"
  );
  const dropdownOptions = {
    Buy: ["Buy", "Rent"],
    BHK: ["Bhk", 1, 2, 3, 4, 5, 6, 7, 8],
    Budget: ["50 Lakhs", "50-75 Lakhs", "75 Lakhs+"],
    Residential: ["Residential", "Commercial"],
    Type: ["Apartment", "Villa", "Plot"],
    Status: ["Ready to Move", "Under Construction"],
  };
  const labelToActionMap = {
    Buy: setTab,
    BHK: setBHK,
    Budget: setBudget,
    Residential: setPropertyIn,
    Type: setSubType,
    Status: setOccupancy,
  };
  const labelToLocalSetterMap = {
    Buy: setSelectedTab,
    BHK: setSelectedBHK,
    Budget: setSelectedBudget,
    Residential: setSelectedPropertyIn,
    Type: setSelectedSubType,
    Status: setSelectedOccupancy,
  };
  const [searchInput, setSearchInput] = useState(searchData.location || "");
  const handleClear = () => {
    setSearchInput("");
    dispatch(setLocation(""));
  };
  const getSelectedLabel = (label) => {
    switch (label) {
      case "Buy":
        return selectedTab || label;
      case "BHK":
        return selectedBHK || label;
      case "Budget":
        return selectedBudget || label;
      case "Residential":
        return selectedPropertyIn || label;
      case "Type":
        return selectedSubType || label;
      case "Status":
        return selectedOccupancy || label;
      default:
        return label;
    }
  };
  const navigate = useNavigate();
  const handleNavigation = (property) => {
    navigate("/listings", { state: property });
  };
  return (
    <>
      <header className="w-full bg-white shadow-sm px-6">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Meet Owner Logo"
              className="h-8 w-full hidden md:block"
            />
            <img src={favicon} alt="Meet Owner" className="w-8 h-8 md:hidden" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center rounded-full shadow-md w-full max-w-[65rem] bg-white flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-between">
              <div className="hidden md:flex items-center gap-4 shrink-0">
                <div
                  className="flex items-center space-x-2 bg-[#1D3A76] px-6 py-4 rounded-full cursor-pointer text-white h-13"
                  onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                >
                  <span className="hidden md:inline">{selectedCity}</span>
                  <FaFilter />
                </div>
                <div className="hidden lg:flex items-center gap-4">
                  {Object.entries(dropdownOptions).map(([label, options]) => (
                    <div key={label} className="relative">
                      <button
                        className="flex items-center gap-2 text-gray-700 text-sm px-2 py-2 rounded-lg cursor-pointer"
                        onClick={() => toggleDropdown(label)}
                      >
                        {getSelectedLabel(label)} <FaChevronDown />
                      </button>
                      {dropdowns[label] && (
                        <div className="absolute mt-2 w-36 bg-white rounded-lg shadow-lg z-10 text-left">
                          {options.map((option) => (
                            <div
                              key={option}
                              onClick={() => {
                                dispatch(labelToActionMap[label](option));
                                labelToLocalSetterMap[label](option);
                                toggleDropdown(label);
                              }}
                              className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex-grow min-w-0">
                <input
                  type="text"
                  placeholder="Search locality, city..."
                  value={searchInput}
                  onChange={(e) => {
                    dispatch(setLocation(e.target.value));
                    setSearchInput(e.target.value);
                    setTimeout(() => {
                      handleNavigation();
                    }, 3000);
                  }}
                  className="w-full pl-1 border-l border-gray-200 py-4 pr-10 focus:outline-none focus:ring-0 h-13 text-center placeholder:text-center md:text-left md:placeholder:text-left"
                />
                <div className="absolute right-3 gap-2 items-center justify-center flex flex-row top-3">
                  {searchInput && (
                    <IoCloseCircle
                      onClick={handleClear}
                      className="items-center justify-center text-gray-500 hover:text-red-500 cursor-pointer w-[20px] h-[20px]"
                    />
                  )}
                  <img
                    src={Searchhome}
                    alt="Search Home"
                    className="w-[34px] h-[34px]"
                    onClick={() => handleNavigation()}
                  />
                </div>
              </div>
              {isCityDropdownOpen && (
                <div className="absolute mt-1 w-60 lg:hidden left-0 bg-white rounded-lg shadow-lg z-20 text-left">
                  <div className="border-b px-4 font-semibold text-[#1D3A76]">
                    Select City
                  </div>
                  {cities.map((city) => (
                    <div
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        dispatch(setCity(city));
                        setIsCityDropdownOpen(false);
                      }}
                      className="px-4 hover:bg-gray-100 cursor-pointer"
                    >
                      {city}
                    </div>
                  ))}
                  <div className="border-t px-4 py-2 font-semibold text-[#1D3A76]">
                    Filters
                  </div>
                  <div className="flex flex-col items-start px-4 gap-2">
                    {Object.entries(dropdownOptions).map(([label, options]) => (
                      <div key={label} className="w-full">
                        <div className="font-medium text-sm mb-1">{label}</div>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => (
                            <span
                              key={option}
                              onClick={() => setIsCityDropdownOpen(false)}
                              className="bg-[#F3F3F3] px-3 py-1 rounded text-xs cursor-pointer hover:bg-[#e0e0e0]"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
export default PropertyHeader;
