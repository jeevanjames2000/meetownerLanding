import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaChevronDown,
  FaFilter,
} from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/logo.png";
const Header = () => {
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const cities = ["Hyderabad", "Kondapur", "Telangana"];
  const buyOptions = ["Buy", "Rent"];
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK"];
  const budgetOptions = [
    "Budget in Rs.",
    "50 Lakhs",
    "50-75 Lakhs",
    "75 Lakhs+",
  ];
  const residentialOptions = ["Residential", "Commercial"];
  const propertyTypeOptions = ["Apartment", "Villa", "Plot"];
  const possessionStatusOptions = ["Ready to Move", "Under Construction"];
  return (
    <header className="bg-[#F5F5F5] shadow-[0px_10px_9px_-3px_rgba(0,_0,_0,_0.8)] py-4 px-5 flex items-center justify-between w-full">
      <div className="">
        <img src={logoImage} alt="Meet Owner Logo" className="h-8" />
      </div>

      <div className="flex items-center rounded-full shadow-sm w-full max-w-5xl bg-white">
        <div className="relative">
          <div
            className="flex items-center text-[#ffffff] space-x-2 bg-[#1D3A76] px-4 py-5 rounded-l-full cursor-pointer"
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            <span>{selectedCity}</span>
            <FaFilter />
          </div>
          {isCityDropdownOpen && (
            <div className="absolute mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {cities.map((city) => (
                <div
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-3">
          {[
            buyOptions,
            bhkOptions,
            budgetOptions,
            residentialOptions,
            propertyTypeOptions,
            possessionStatusOptions,
          ].map((options, index) => (
            <select
              key={index}
              className="bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search location..."
            className="w-full pl-3 py-5 pr-9 border-l border-gray-500 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute bg-initial right-0 top-4">
            <img
              src={Searchhome}
              alt="Search Home"
              className="w-[45px] h-[42.2px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
