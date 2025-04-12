import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { HiMenu, HiX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import config from "../../config";

import {
  setBHK,
  setBudget,
  setCity,
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
import { useNavigate } from "react-router-dom";
const Header = () => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);
  const [selectedCity, setSelectedCity] = useState(
    searchData?.city || "Hyderabad"
  );
  const [searchInput, setSearchInput] = useState(searchData.location || "");

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
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
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
  const [dropdowns, setDropdowns] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const cities = ["Hyderabad", "Kondapur", "Telangana"];
  const [selectedTab, setSelectedTab] = useState(searchData.tab || "Buy");
  const [selectedBHK, setSelectedBHK] = useState(searchData.bhk || null);
  const [selectedBudget, setSelectedBudget] = useState(searchData.budget || "");
  const [selectedPropertyIn, setSelectedPropertyIn] = useState(
    searchData.property_in || ""
  );
  const [selectedSubType, setSelectedSubType] = useState(
    searchData.sub_type || ""
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState(
    searchData.occupancy || "Ready to move"
  );
  const dropdownOptions = {
    Buy: ["Buy", "Rent"],
    BHK: ["BHK", 1, 2, 3, 4, 5, 6, 7, 8],
    Budget: [
      { label: "Up to 50 Lakhs", value: "50" },
      { label: "50-75 Lakhs", value: "50-75" },
      { label: "75 Lakhs+", value: "75+" },
    ],
    "Property In": ["Property In", "Residential", "Commercial"],
    Status: ["Status", "Ready to Move", "Under Construction"],
  };
  const getTypeOptions = () => {
    if (selectedPropertyIn === "Commercial") {
      return [
        "Type",
        "Office",
        "Retail shop",
        "Show room",
        "Warehouse",
        "Plot",
        "Others",
      ];
    } else if (selectedPropertyIn === "Residential") {
      return [
        "Type",
        "Apartment",
        "Independent House",
        "Indepenedent Villa",
        "Plot",
        "Land",
        "Others",
      ];
    } else {
      return ["Type"];
    }
  };
  const labelToActionMap = {
    Buy: setTab,
    BHK: setBHK,
    Budget: setBudget,
    "Property In": setPropertyIn,
    Type: setSubType,
    Status: setOccupancy,
  };
  const labelToLocalSetterMap = {
    Buy: setSelectedTab,
    BHK: setSelectedBHK,
    Budget: setSelectedBudget,
    "Property In": setSelectedPropertyIn,
    Type: setSelectedSubType,
    Status: setSelectedOccupancy,
  };
  const labelToStoreKeyMap = {
    Buy: "tab",
    BHK: "bhk",
    Budget: "budget",
    "Property In": "property_in",
    Type: "sub_type",
    Status: "occupancy",
  };
  const handleClear = () => {
    setSearchInput("");
  };
  const getSelectedLabel = (label) => {
    const key = labelToStoreKeyMap[label];
    const selectedValue = searchData[key];
    const options =
      label === "Type" ? getTypeOptions() : dropdownOptions[label];
    if (!options) return label;
    const match = options.find((opt) => {
      if (typeof opt === "object") return opt.value === selectedValue;
      return opt === selectedValue;
    });
    return typeof match === "object" ? match.label : match || label;
  };
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [isUserInput, setIsUserInput] = useState(false);

  const handleValueChange = (value) => {
    setIsUserInput(true);
    setSearchInput(value);
    dispatch(
      setSearchData({
        location: value,
      })
    );
  };
  const navigate = useNavigate();
  const handleRouteHome = () => {
    navigate("/");
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-white shadow-sm px-6 z-20"
      >
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
            <div className="flex items-center rounded-full shadow-md w-full max-w-[65rem] bg-white flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-between">
              <div className="hidden md:flex items-center gap-4 shrink-0">
                <div
                  className="flex items-center space-x-2 bg-[#1D3A76] px-6 py-4 rounded-full cursor-pointer text-white h-13"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                  <span className="hidden md:inline">{location}</span>
                  <FaFilter />
                </div>
                {isLocationOpen && (
                  <ul
                    className="absolute z-50 left-72 top-18 w-36 bg-white rounded-md shadow-md border border-gray-300 max-h-78 overflow-y-auto"
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
                <div className="hidden lg:flex items-center gap-4">
                  {[
                    ...Object.entries(dropdownOptions),
                    ["Type", getTypeOptions()],
                  ].map(([label, options]) => (
                    <div key={label} className="relative">
                      <button
                        className="flex items-center gap-2 text-gray-700 text-sm px-2 py-2 rounded-lg cursor-pointer"
                        onClick={() => toggleDropdown(label)}
                      >
                        {getSelectedLabel(label)} <FaChevronDown />
                      </button>
                      {activeDropdown === label && (
                        <div className="absolute mt-2 w-36 bg-white rounded-lg shadow-lg z-10 text-left">
                          {options.map((option, index) => {
                            const isObject = typeof option === "object";
                            const value = isObject ? option.value : option;
                            const display = isObject ? option.label : option;
                            if (
                              (label === "Type" ||
                                label === "Property In" ||
                                label === "Status" ||
                                label === "BHK") &&
                              index === 0
                            ) {
                              return null;
                            }
                            return (
                              <div
                                key={value}
                                onClick={() => {
                                  const key = labelToStoreKeyMap[label];
                                  dispatch(labelToActionMap[label](value));
                                  labelToLocalSetterMap[label](value);
                                  setActiveDropdown(null);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                              >
                                {display}
                              </div>
                            );
                          })}
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
                  className="w-full pl-1 border-l border-gray-200 py-4 pr-10 focus:outline-none focus:ring-0 h-13 text-center placeholder:text-center md:text-left md:placeholder:text-left"
                />
                <div className="absolute right-3 gap-2 items-center justify-center flex flex-row top-3">
                  {searchInput && (
                    <button
                      className=" text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={handleClear}
                    >
                      &times;
                    </button>
                  )}
                  <img
                    src={Searchhome}
                    alt="Search Home"
                    className="w-[34px] h-[34px]"
                  />
                </div>
              </div>

              {isSearchDropdownOpen && (
                <ul className="absolute z-50 right-15 top-16 w-50 bg-white rounded-md shadow-md border border-gray-300 max-h-60 overflow-y-auto">
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
                    {/* {Object.entries(dropdownOptions).map(([label, options]) => (
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
                    ))} */}
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
export default Header;
