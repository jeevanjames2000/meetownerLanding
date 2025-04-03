import React from "react";
import logoImage from "../assets/Images/logo.png";
import favicon from "../assets/Images/Favicon@10x.png";
const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm px-6 ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <img src={logoImage} alt="Meet Owner Logo" className="h-8" />
        </div>
        {/* <nav className="hidden md:flex items-center space-x-8">
          {["Buy", "Rent", "Sell"].map((label) => (
            <div className="relative group" key={label}>
              <button className="text-gray-800 font-medium flex items-center">
                {label}
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </nav> */}
        <div className="flex items-center space-x-4">
          <button className="border-1 border-[#F0AA00] px-6 py-1 rounded-full text-gray-800 font-medium hover:bg-[#F0AA00] hover:border-[#F0AA00] transition-all flex items-center">
            <img src={favicon} alt="Download" className="w-5 h-5 mr-2" />
            Download App
          </button>
          <div className="h-6 w-px bg-gray-300"></div>

          <button className="border-1 border-[#F0AA00] text-black px-6 py-1 rounded-full font-medium flex items-center hover:bg-[#F0AA00] hover:text-black transition-all">
            Add Property <span className="text-[#F0AA00]  ml-1">| Free</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center space-x-2">
            <img
              src=""
              alt="Profile"
              className="w-6 h-6 rounded-full border-2 border-[#F0AA00]"
            />
            <span className="text-gray-800 font-medium cursor-pointer">
              Login
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
