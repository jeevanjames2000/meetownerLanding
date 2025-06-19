import { useEffect, useRef, useState, useCallback } from "react";
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
import { IoCloseCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import config from "../../config";
import axios from "axios";
import { Building, Building2, Home, Landmark, MapPin } from "lucide-react";
const commercialSubTypes = [
  { id: "Office", label: "Office", icon: Building },
  { id: "Retail Shop", label: "Retail Shop", icon: Home },
  { id: "Show Room", label: "Showroom", icon: Building2 },
  { id: "Warehouse", label: "Warehouse", icon: Landmark },
  { id: "Plot", label: "Plot", icon: MapPin },
  { id: "Others", label: "Others", icon: MapPin },
];
const PropertyHeader = () => {
  const dispatch = useDispatch();
  const searchData = useSelector((state) => state.search);
  const [searchInput, setSearchInput] = useState(searchData.location || "");
  const [location, setLocation] = useState(searchData.city || "Hyderabad");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [localities, setLocalities] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(searchData.tab || "Buy");
  const [selectedBHK, setSelectedBHK] = useState(searchData.bhk || null);
  const [selectedBudget, setSelectedBudget] = useState(searchData.budget || "");
  const [selectedPropertyIn, setSelectedPropertyIn] = useState(
    searchData.property_in || "Residential"
  );
  const [selectedSubType, setSelectedSubType] = useState(
    searchData.sub_type || ""
  );
  const [selectedOccupancy, setSelectedOccupancy] = useState(
    searchData.occupancy || ""
  );
  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "https://api.meetowner.in/api/v1/getAllCities"
      );
      const activeCities = response.data?.filter(
        (city) => city.status === "active"
      );
      const cityNames = activeCities.map((item) => item.city);
      setCitiesList(cityNames);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  useEffect(() => {
    fetchCities();
  }, []);
  useEffect(() => {
    if (!location) return;
    const fetchLocalities = async () => {
      try {
        const response = await fetch(
          `${config.awsApiUrl}/api/v1/search?city=${location}&query=${searchInput}`
        );
        const data = await response.json();
        setLocalities(data);
      } catch (err) {
        console.error("Failed to fetch localities:", err);
        setLocalities([]);
      }
    };
    fetchLocalities();
  }, [searchInput, location]);
  useEffect(() => {
    if (
      selectedPropertyIn === "Commercial" &&
      !commercialSubTypes.some((subtype) => subtype.id === selectedSubType)
    ) {
      setSelectedSubType("");
      dispatch(setSubType(""));
    } else if (
      selectedPropertyIn === "Residential" &&
      ![
        "Apartment",
        "Independent House",
        "Independent Villa",
        "Plot",
        "Land",
        "Others",
      ].includes(selectedSubType)
    ) {
      setSelectedSubType("");
      dispatch(setSubType(""));
    }
  }, [selectedPropertyIn, selectedSubType, dispatch]);
  useEffect(() => {
    if (
      ["Plot", "Land"].includes(selectedSubType) &&
      !["Immediate", "Future"].includes(selectedOccupancy)
    ) {
      setSelectedOccupancy("");
      dispatch(setOccupancy(""));
    } else if (
      !["Plot", "Land"].includes(selectedSubType) &&
      !["Ready to Move", "Under Construction"].includes(selectedOccupancy)
    ) {
      setSelectedOccupancy("");
      dispatch(setOccupancy(""));
    }
  }, [selectedSubType, selectedOccupancy, dispatch]);
  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };
  const getTypeOptions = () => {
    if (selectedPropertyIn === "Commercial") {
      return [
        "Property Type",
        ...commercialSubTypes.map((subtype) => subtype.id),
      ];
    } else if (selectedPropertyIn === "Residential") {
      return [
        "Property Type",
        "Apartment",
        "Independent House",
        "Independent Villa",
        "Plot",
        "Land",
        "Others",
      ];
    }
    return ["Property Type"];
  };
  const getStatusOptions = () => {
    if (["Plot", "Land"].includes(selectedSubType)) {
      return ["Possession Status", "Immediate", "Future"];
    }
    return ["Status", "Ready to Move", "Under Construction"];
  };
  const dropdownOptions = {
    Buy: ["Buy", "Rent"],
    BHK: ["BHK", 1, 2, 3, 4, 5, 6, 7, 8],
    Budget: [
      { label: "Budget", value: "" },
      { label: "Up to 50 Lakhs", value: "50" },
      { label: "50-75 Lakhs", value: "50-75" },
      { label: "75 Lakhs+", value: "75+" },
    ],
    "Property In": ["Property In", "Residential", "Commercial"],
    Type: getTypeOptions(),
    Status: getStatusOptions(),
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
  const getSelectedLabel = (label, id) => {
    const key = labelToStoreKeyMap[label];
    const selectedValue = searchData[key];
    if (label === "Type" && id) {
      const subtype = commercialSubTypes.find((st) => st.id === id);
      return subtype ? subtype.label : id || "Property Type";
    }
    const options =
      label === "Type" ? getTypeOptions() : dropdownOptions[label];
    if (!options) return label;
    const match = options.find((opt) => {
      if (typeof opt === "object") return opt.value === selectedValue;
      return opt === selectedValue;
    });
    return typeof match === "object" ? match.label : match || options[0];
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
  const handleUserSearched = useCallback(
    async (searchValue) => {
      let userDetails = null;
      try {
        const data = localStorage.getItem("user");
        if (data) {
          userDetails = JSON.parse(data)?.userDetails || null;
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        userDetails = null;
      }
      if (userDetails?.user_id && location) {
        const viewData = {
          user_id: userDetails.user_id,
          searched_location: searchValue || "N/A",
          searched_for: selectedTab || "N/A",
          name: userDetails?.name || "N/A",
          mobile: userDetails?.mobile || "N/A",
          email: userDetails?.email || "N/A",
          searched_city: location || "N/A",
          property_in: selectedPropertyIn || "N/A",
          sub_type: selectedSubType || "N/A",
          occupancy: selectedOccupancy || "N/A",
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
    },
    [
      selectedTab,
      location,
      selectedPropertyIn,
      selectedSubType,
      selectedOccupancy,
    ]
  );
  const debouncedUserActivity = useCallback(
    debounce((value) => {
      handleUserSearched(value);
    }, 1000),
    [handleUserSearched]
  );
  const debouncedDispatch = useCallback(
    debounce((value) => {
      dispatch(setSearchData({ location: value }));
    }, 1000),
    [dispatch]
  );
  const handleClear = () => {
    setSearchInput("");
    dispatch(setSearchData({ location: "" }));
    setLocalities([]);
    debouncedUserActivity("");
  };
  const handleValueChange = (value) => {
    setSearchInput(value);
    debouncedDispatch(value);
    debouncedUserActivity(value);
  };
  const navigate = useNavigate();
  const handleRouteHome = () => {
    navigate("/");
  };
  const handleRouteListings = () => {
    navigate("/listings");
  };
  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full bg-white shadow-sm p-2 md:px-6 z-20"
      >
        <div className="flex justify-between items-center">
          <div
            className="flex text-left items-center cursor-pointer mr-auto"
            onClick={handleRouteHome}
          >
            <img
              src={logoImage}
              alt="Meet Owner Logo"
              className="h-10 w-full max-w-30 hidden md:block cursor-pointer"
              onClick={handleRouteHome}
            />
            <img
              src={favicon}
              alt="Meet Owner"
              className="w-10 h-10 max-w-14 md:hidden cursor-pointer"
              onClick={handleRouteHome}
            />
          </div>
          <div className="flex justify-end w-full max-w-[65rem] px-4">
            <div className="flex items-center rounded-full shadow-md w-full bg-white flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-between">
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
                    <ul className="absolute left-0 mt-2 w-36 bg-white rounded-md shadow-md border border-gray-300 max-h-78 overflow-y-auto z-50">
                      {citiesList.map((option) => {
                        const isDisabled = option === "Top Cities";
                        return (
                          <li
                            key={option}
                            onClick={() => {
                              if (!isDisabled) {
                                setLocation(option);
                                dispatch(
                                  setSearchData({
                                    location: option,
                                    city: option,
                                  })
                                );
                                setIsLocationOpen(false);
                                setSearchInput("");
                                setIsSearchDropdownOpen(false);
                                debouncedUserActivity(option);
                              }
                            }}
                            className={`px-3 py-1 text-left rounded-md transition-all duration-200 ${
                              isDisabled
                                ? "text-gray-400 cursor-default"
                                : "hover:bg-[#1D3A76] hover:text-white cursor-pointer"
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
                        {label === "Type"
                          ? getSelectedLabel(label, selectedSubType)
                          : getSelectedLabel(label)}
                        <FaChevronDown />
                      </button>
                      {activeDropdown === label && (
                        <div className="absolute mt-2 w-36 bg-white rounded-lg shadow-lg z-50 text-left">
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
                                key={`${label}-${value}`}
                                onClick={() => {
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
                    setTimeout(() => setIsSearchDropdownOpen(false), 300)
                  }
                  className="w-full pl-1 pr-10 
                  py-2 h-11
                  text-center placeholder:text-center 
                  bg-[#fff] rounded-lg border border-gray-300
                  md:py-4 md:h-13 
                  md:bg-transparent md:rounded-none md:border-none 
                  md:text-left md:placeholder:text-left 
                  focus:outline-none focus:ring-0"
                />
                <div className="absolute right-3 gap-2 items-center justify-center flex flex-row top-2">
                  {searchInput && (
                    <button
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={handleClear}
                    >
                      <IoCloseCircleOutline className="w-5 h-5" />
                    </button>
                  )}
                  <img
                    src={Searchhome}
                    onClick={handleRouteListings}
                    alt="Search Home"
                    className="w-[34px] h-[34px]"
                  />
                </div>
                {isSearchDropdownOpen && (
                  <ul className="absolute left-0 top-full mt-2 w-full bg-white rounded-md shadow-md border border-gray-300 max-h-60 overflow-y-auto z-50">
                    {searchInput?.trim() === "" ? (
                      localities?.length > 0 ? (
                        localities?.map((item) => {
                          const isDisabled = item?.locality === "Most Searched";
                          return (
                            <li
                              key={item.locality}
                              onClick={() => {
                                if (!isDisabled) {
                                  setSearchInput(item?.locality);
                                  dispatch(
                                    setSearchData({ location: item?.locality })
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
                                <div>{item?.locality}</div>
                                <p className="text-sm text-gray-300">
                                  {item?.locality === "Most Searched"
                                    ? ""
                                    : "Locality"}
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
                    ) : localities?.length > 0 ? (
                      localities?.map((item) => (
                        <li
                          key={item?.locality}
                          onClick={() => {
                            setSearchInput(item?.locality);
                            dispatch(
                              setSearchData({ location: item?.locality })
                            );
                            setIsSearchDropdownOpen(false);
                          }}
                          className="px-3 flex flex-row justify-between py-1 text-left hover:bg-[#1D3A76] hover:text-white rounded-md cursor-pointer transition-all duration-200"
                        >
                          {item?.locality}
                          <p className="text-sm text-gray-300">Locality</p>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-1 text-gray-500">
                        No matching localities
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden mt-3 flex overflow-x-auto gap-2 px-4 relative pb-3">
          {[
            "Buy",
            "BHK",
            "Budget",
            "Property In",
            ...(selectedPropertyIn === "Commercial"
              ? commercialSubTypes.map((subtype) => subtype.id)
              : ["Type"]),
          ].map((label) => (
            <div key={label} className="relative flex-shrink-0">
              <button
                className="flex items-center gap-1 text-gray-700 text-sm px-3 py-1 bg-gray-100 rounded-full cursor-pointer whitespace-nowrap"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleDropdown(label);
                }}
              >
                {getSelectedLabel(
                  label === "Type" ||
                    commercialSubTypes.some((st) => st.id === label)
                    ? "Type"
                    : label,
                  commercialSubTypes.some((st) => st.id === label)
                    ? label
                    : undefined
                )}
                <FaChevronDown className="text-xs" />
              </button>
              {activeDropdown === label && (
                <div
                  className="fixed inset-0 bg-transparent bg-opacity-30 z-40"
                  onClick={() => setActiveDropdown(null)}
                ></div>
              )}
              {activeDropdown === label && (
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 p-4 max-h-[60vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">
                      {commercialSubTypes.some((st) => st.id === label)
                        ? commercialSubTypes.find((st) => st.id === label)
                            ?.label
                        : label}
                    </h3>
                    <button
                      onClick={() => setActiveDropdown(null)}
                      className="text-gray-500"
                    >
                      ×
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(label === "Type" ||
                    commercialSubTypes.some((st) => st.id === label)
                      ? getTypeOptions()
                      : dropdownOptions[label] || []
                    ).map((option, index) => {
                      const isObject = typeof option === "object";
                      const value = isObject ? option.value : option;
                      const display = isObject ? option.label : option;
                      if (
                        (label === "BHK" ||
                          label === "Property In" ||
                          label === "Type" ||
                          commercialSubTypes.some((st) => st.id === label) ||
                          label === "Budget") &&
                        index === 0
                      )
                        return null;
                      return (
                        <button
                          key={`${label}-${value}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              labelToActionMap[
                                commercialSubTypes.some((st) => st.id === label)
                                  ? "Type"
                                  : label
                              ](value)
                            );
                            labelToLocalSetterMap[
                              commercialSubTypes.some((st) => st.id === label)
                                ? "Type"
                                : label
                            ](value);
                            setActiveDropdown(null);
                          }}
                          className={`px-4 py-2 rounded-lg text-left text-sm ${
                            searchData[
                              commercialSubTypes.some((st) => st.id === label)
                                ? "sub_type"
                                : labelToStoreKeyMap[label]
                            ] === value ||
                            (value === "" &&
                              !searchData[
                                commercialSubTypes.some((st) => st.id === label)
                                  ? "sub_type"
                                  : labelToStoreKeyMap[label]
                              ])
                              ? "bg-[#1D3A76] text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {display}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="relative flex-shrink-0">
            <button
              className="flex items-center gap-1 text-sm px-3 py-[2px] bg-gray-100 rounded-full cursor-pointer whitespace-nowrap border-2 border-blue-900 text-blue-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMoreFiltersOpen(!isMoreFiltersOpen);
              }}
            >
              MORE FILTERS <FaChevronDown className="text-xs" />
            </button>
            {isMoreFiltersOpen && (
              <div
                className="fixed inset-0 bg-transparent bg-opacity-10 z-40"
                onClick={() => setIsMoreFiltersOpen(false)}
              ></div>
            )}
            {isMoreFiltersOpen && (
              <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-lg shadow-lg z-50 p-4 max-h-[60vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-xl text-blue-900">
                    More Filters
                  </h3>
                  <button
                    onClick={() => setIsMoreFiltersOpen(false)}
                    className="text-gray-500"
                  >
                    ×
                  </button>
                </div>
                {["Status"].map((label) => (
                  <div key={label} className="mb-4">
                    <h4 className="font-medium mb-2 text-left">
                      {getSelectedLabel(label, undefined)}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(dropdownOptions[label] || []).map((option, index) => {
                        const isObject = typeof option === "object";
                        const value = isObject ? option.value : option;
                        const display = isObject ? option.label : option;
                        if (index === 0) return null;
                        return (
                          <button
                            key={`${label}-${value}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(labelToActionMap[label](value));
                              labelToLocalSetterMap[label](value);
                            }}
                            className={`px-4 py-2 text-left rounded-lg text-sm ${
                              searchData[labelToStoreKeyMap[label]] === value ||
                              (value === "" &&
                                !searchData[labelToStoreKeyMap[label]])
                                ? "bg-[#1D3A76] text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            {display}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
export default PropertyHeader;
