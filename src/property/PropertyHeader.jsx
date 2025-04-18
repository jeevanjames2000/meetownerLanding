import React, { useEffect, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { useDispatch, useSelector } from "react-redux";
import {
  setBHK,
  setBudget,
  setOccupancy,
  setPropertyIn,
  setSearchData,
  setSubType,
  setTab,
} from "../../store/slices/searchSlice";
import {
  vizagLocalities,
  bengaluruLocalities,
  customHydCities,
  chennaiLocalities,
  mumbaiLocalities,
  puneLocalities,
} from "../components/customCities";
import { IoCloseCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import config from "../../config";
const PropertyHeader = () => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const toggleDropdown = (key) => {
    setDropdowns((prev) => {
      const newDropdowns = {};
      Object.keys(prev).forEach((k) => {
        newDropdowns[k] = false;
      });
      newDropdowns[key] = !prev[key];
      return newDropdowns;
    });
  };
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
  const handleNavigation = () => {
    navigate("/listings");
  };
  const [location, setLocation] = useState("Hyderabad");
  const locations = [
    "Top Cities",
    "Delhi",
    "Pune",
    "Mumbai",
    "Navi Mumbai",
    "Hyderabad",
    "Bengaluru",
    "Chennai",
    "Kolkata",
    "Coimbatore",
    "Ahmedabad",
    "Visakhapatanam",
    "Vijayawada",
    "Guntur",
    "Rajamundry",
    "Eluru",
  ];
  const cityLocalitiesMap = {
    Hyderabad: customHydCities,
    Visakhapatanam: vizagLocalities,
    Bengaluru: bengaluruLocalities,
    Chennai: chennaiLocalities,
    Mumbai: mumbaiLocalities,
    Pune: puneLocalities,
  };
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const currentLocalities = cityLocalitiesMap[location] || [];
  const filteredLocalities = currentLocalities.filter((locality) =>
    locality.toLowerCase().includes(searchInput.toLowerCase())
  );
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [localites, setLocalities] = useState([]);
  useEffect(() => {
    if (searchInput.trim() === "") {
      setLocalities([]);
      return;
    }
    const fetchLocalities = async () => {
      try {
        const response = await fetch(
          `${config.awsApiUrl}/api/search?query=${searchInput}&city=${location}`
        );
        const data = await response.json();
        setLocalities(data);
      } catch (err) {}
    };
    fetchLocalities();
  }, [searchInput, location]);
  const handleValueChange = (value) => {
    setSearchInput(value);
    dispatch(
      setSearchData({
        location: value,
      })
    );
    setTimeout(() => {
      handleNavigation();
    }, 3000);
  };
  const handleRouteHome = () => {
    navigate("/");
  };
  return (
    <>
      <header className="w-full bg-white shadow-sm px-6">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleRouteHome}
          >
            <img
              src={logoImage}
              alt="Meet Owner Logo"
              className="h-8 w-full hidden md:block cursor-pointer"
              onClick={handleRouteHome}
            />
            <img
              src={favicon}
              alt="Meet Owner"
              className="w-8 h-8 md:hidden cursor-pointer"
              onClick={handleRouteHome}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center rounded-full shadow-md w-full  bg-white flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-between">
              <div className="hidden md:flex items-center gap-4 shrink-0">
                <div className="relative inline-block">
                  <div
                    className="flex items-center space-x-2 bg-[#1D3A76] px-6 py-4 rounded-full cursor-pointer text-white h-13"
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                  >
                    <span className="hidden md:inline">{location}</span>
                    <FaFilter />
                  </div>
                  {isLocationOpen && (
                    <ul
                      className="absolute left-0 top-full mt-1 w-38 bg-white rounded-md shadow-md border border-gray-300 max-h-78 overflow-y-auto overflow-x-hidden z-50"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      {locations.map((option) => {
                        const isDisabled = option === "Top Cities";
                        return (
                          <li
                            key={option}
                            onClick={() => {
                              if (!isDisabled) {
                                setLocation(option);
                                setIsLocationOpen(false);
                                setSearchInput("");
                                setIsSearchDropdownOpen(false);
                              }
                            }}
                            className={`px-3 py-1 text-left rounded-md transition-all duration-200 ${
                              isDisabled
                                ? "text-gray-400 cursor-default"
                                : "hover:bg-[#1D3A76] hover:text-white cursor-default"
                            }`}
                          >
                            {option}
                          </li>
                        );
                      })}
                    </ul>
                  )}
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
                  onChange={(e) => handleValueChange(e.target.value)}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchDropdownOpen(false), 200)
                  }
                  className="w-full pl-1 py-4 pr-10 focus:outline-none focus:ring-0 h-13 text-center placeholder:text-center md:text-left md:placeholder:text-left"
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
              {isSearchDropdownOpen && (
                <ul className="absolute z-50 right-15 top-16 w-52 bg-white rounded-md shadow-md border border-gray-300 max-h-60 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  {searchInput.trim() === "" ? (
                    filteredLocalities.length > 0 ? (
                      filteredLocalities.map((locality) => {
                        const isDisabled = locality === "Most Searched";
                        return (
                          <li
                            key={locality}
                            onClick={() => {
                              if (!isDisabled) {
                                setSearchInput(locality);
                                dispatch(
                                  setSearchData({
                                    location: locality,
                                  })
                                );
                                setIsSearchDropdownOpen(false);
                              }
                            }}
                            className={`px-3 py-1 text-left rounded-md transition-all duration-200 ${
                              isDisabled
                                ? "text-gray-400 cursor-default"
                                : "hover:bg-[#1D3A76] hover:text-white cursor-pointer"
                            }`}
                          >
                            <div className="flex justify-between">
                              <div>{locality}</div>
                              <p
                                className="text-sm text-gray-300 "
                                style={{
                                  display:
                                    locality === "Most Searched" ? "none" : "",
                                }}
                              >
                                Locality
                              </p>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-1 text-gray-500">
                        No matching localities
                      </li>
                    )
                  ) : localites.length > 0 ? (
                    localites.map((item) => (
                      <li
                        key={item.locality}
                        onClick={() => {
                          setSearchInput(item.locality);
                          setIsSearchDropdownOpen(false);
                        }}
                        className="px-3 flex flex-row justify-between py-1 text-left hover:bg-[#1D3A76] hover:text-white rounded-md cursor-pointer transition-all duration-200"
                      >
                        {item.locality}{" "}
                        <p className="text-sm text-gray-300 ">Locality</p>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-1 text-gray-500">
                      No matching localities
                    </li>
                  )}
                </ul>
              )}
              {isCityDropdownOpen && (
                <div className="absolute mt-1 w-60 lg:hidden left-0 bg-white rounded-lg shadow-lg z-20 text-left">
                  <div className="border-b px-4 font-semibold text-[#1D3A76]">
                    Select City
                  </div>
                  {locations.map((option) => {
                    const isDisabled = option === "Top Cities";
                    return (
                      <li
                        key={option}
                        onClick={() => {
                          if (!isDisabled) {
                            setLocation(option);
                            setIsLocationOpen(false);
                            setSearchInput("");
                          }
                        }}
                        className={`px-3 py-1 text-left rounded-md transition-all duration-200 ${
                          isDisabled
                            ? "text-gray-400 cursor-default"
                            : "hover:bg-[#1D3A76] hover:text-white cursor-default"
                        }`}
                      >
                        {option}
                      </li>
                    );
                  })}
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
