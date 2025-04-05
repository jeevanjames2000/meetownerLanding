import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import Searchhome from "../assets/Images/Searchhome.png";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { HiMenu, HiX } from "react-icons/hi";
const Header = () => {
  const [selectedCity, setSelectedCity] = useState("Hyderabad");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const [menuOpen, setMenuOpen] = useState(false);
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
            <button className="hidden md:flex border border-[#F0AA00] px-5 py-1 rounded-full text-gray-800 font-sm hover:bg-[#F0AA00] transition-all items-center">
              <img src={favicon} alt="Download" className="w-5 h-5 mr-2" />
              Download App
            </button>
            <button className="hidden md:flex border border-[#F0AA00] px-5 py-1 rounded-full text-black font-sm hover:bg-[#F0AA00] hover:text-black transition-all group">
              Add Property
              <span className="ml-1 text-[#F0AA00] group-hover:text-black">
                | Free
              </span>
            </button>
            <button className="border border-[#F0AA00] px-6 py-1 rounded-full font-medium cursor-pointer">
              Login
            </button>
            <button
              className="md:hidden text-gray-800 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white shadow-md absolute z-1000 top-14 right-0 w-52 py-3 px-6">
            <nav className="flex flex-col space-y-1">
              {["Buy", "Rent", "Sell", "Download App", "Add Property"].map(
                (label) => (
                  <button
                    key={label}
                    className="text-gray-800 font-medium text-left py-2 border-b border-gray-200"
                  >
                    {label}
                  </button>
                )
              )}
            </nav>
          </div>
        )}
      </header>
      <header className="bg-[#F5F5F5] shadow-lg py-3 px-4 flex items-center justify-center w-full">
        <div className="flex items-center rounded-full shadow-md w-full max-w-5xl bg-white flex-wrap md:flex-nowrap gap-2 md:gap-4 justify-between">
          {}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <div
              className="flex items-center space-x-2 bg-[#1D3A76] px-6 py-4 rounded-full cursor-pointer text-white"
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
            >
              <span className="hidden md:inline">{selectedCity}</span>
              <FaFilter />
            </div>
            {Object.entries(dropdownOptions).map(([label, options]) => (
              <div key={label} className="relative">
                <button
                  className="flex items-center gap-2 text-gray-700 text-sm px-2 py-2 rounded-lg cursor-pointer"
                  onClick={() => toggleDropdown(label)}
                >
                  {label} <FaChevronDown />
                </button>
                {dropdowns[label] && (
                  <div className="absolute mt-2 w-36 bg-white rounded-lg shadow-lg z-10 text-left">
                    {options.map((option) => (
                      <div
                        key={option}
                        onClick={() => toggleDropdown(label)}
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

          <div className="relative flex-grow min-w-0">
            <input
              type="text"
              placeholder="Search locality, city..."
              className="w-full pl-3 py-4 pr-10 rounded-lg focus:outline-none focus:ring-0"
            />
            <div className="absolute right-3 top-3">
              <img
                src={Searchhome}
                alt="Search Home"
                className="w-[34px] h-[34px]"
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
      </header>
    </>
  );
};
export default Header;
