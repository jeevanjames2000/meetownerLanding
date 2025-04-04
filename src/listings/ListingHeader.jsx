import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/Untitled-22.png";
const Header = () => {
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const cities = ["Hyderabad", "Kondapur", "Telangana"];
  const dropdownOptions = {
    Buy: ["Buy", "Rent"],
    BHK: ["1 BHK", "2 BHK", "3 BHK"],
    Budget: ["50 Lakhs", "50-75 Lakhs", "75 Lakhs+"],
    Residential: ["Residential", "Commercial"],
    Type: ["Apartment", "Villa", "Plot"],
    Status: ["Ready to Move", "Under Construction"],
  };
  return (
    <header className="bg-[#F5F5F5] shadow-lg py-4 px-5 flex items-center justify-between w-full">
      <div>
        <img src={logoImage} alt="Meet Owner Logo" className="h-12" />
      </div>
      <div className="flex items-center rounded-full shadow-md w-full max-w-5xl bg-white ">
        <div className="relative">
          <div
            className="flex text-white space-x-2 bg-[#1D3A76] px-6 py-4 rounded-l-full cursor-pointer"
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            <span>{selectedCity}</span>
            <FaFilter />
          </div>
          {isCityDropdownOpen && (
            <div className="absolute mt-1 w-40 left-2 bg-white rounded-lg shadow-lg z-10">
              {cities.map((city) => (
                <div
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  className="px-4 py-1 text-left hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
        {}
        <div className="hidden md:flex items-center gap-2 px-4">
          {Object.entries(dropdownOptions).map(([label, options]) => (
            <div key={label} className="relative">
              <button
                className="flex items-center gap-2 text-gray-700 text-sm px-2 py-2 rounded-lg cursor-pointer"
                onClick={() => toggleDropdown(label)}
              >
                {label} <FaChevronDown />
              </button>
              {dropdowns[label] && (
                <div className="absolute mt-2 w-36 bg-white rounded-lg shadow-lg z-10">
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => toggleDropdown(label)}
                      className="px-4 py-2 hover:bg-gray-100 text-sm text-left cursor-pointer"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {}
        <div className="relative w-full md:w-64 mt-2 md:mt-0">
          <input
            type="text"
            placeholder="Search locality, city..."
            className="w-full pl-3 py-4 pr-9 rounded-lg focus:outline-none focus:ring-0"
          />
          <div className="absolute right-2 top-3">
            <img
              src={Searchhome}
              alt="Search Home"
              className="w-[40px] h-[40px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
