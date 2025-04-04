import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoChevronDownOutline, IoSearch } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import video1 from "../assets/Images/Bannercorousal1.mp4";
import video2 from "../assets/Images/Bannercorousal2.mp4";
import { FaLocationCrosshairs } from "react-icons/fa6";
export default function SearchBar() {
  const [activeTab, setActiveTab] = useState(0);
  console.log("activeTab: ", activeTab);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const sliderRef = useRef(null);
  const tabs = ["Buy", "Rent", "Plot", "Commercial"];
  const videos = [video1, video2];
  const CustomPrevArrow = ({ onClick }) => (
    <FaAngleLeft
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 p-1 text-white hover:text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300"
    />
  );
  const CustomNextArrow = ({ onClick }) => (
    <FaAngleRight
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 p-1 text-white hover:text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300"
    />
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
    },
    afterChange: (current) => {
      if (videoRefs.current[current] && isPlaying) {
        videoRefs.current[current].play();
      }
    },
  };
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Buy");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
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
    "Anakapalli",
    "Vijayawada",
    "Guntur",
    "Rajamundry",
    "Eluru",
  ];
  const options = ["Buy", "Sell"];
  return (
    <div className="w-full relative  lg:h-[510px] md:h-[500px] sm:h-[200px]">
      <Slider {...settings} ref={sliderRef}>
        {videos.map((video, index) => (
          <div key={index} className="relative">
            <div className="relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                autoPlay
                loop
                muted={isMuted}
                className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        ))}
      </Slider>
      <div
        className="relative bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-10/12 md:w-3/4 lg:w-2/3 
                   bg-white/30 backdrop-blur-lg rounded-lg shadow-xl p-3 sm:p-4 border border-white/20 z-10"
      >
        <div className="inline-flex flex-wrap justify-center gap-1 mb-3 sm:mb-4 bg-gray-100 rounded-full p-1 sm:p-2">
          {tabs.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative z-10 w-auto px-3 py-1 cursor-pointer rounded-full text-xs sm:text-sm duration-300 ${
                activeTab === index
                  ? "bg-[#1D3A76] text-white"
                  : "text-gray-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between space-x-2 bg-white/40 backdrop-blur-md p-2 rounded-lg shadow-sm border border-white/20">
          <div className="flex items-center space-x-1 sm:space-x-2 w-full">
            <div className="relative inline-block w-32">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="w-full text-left px-3 py-1 rounded bg-transparent text-[#1D3A76]  focus:outline-none flex justify-between items-center"
              >
                {location}
                <IoChevronDownOutline className="w-4 h-4 text-[#1D3A76]" />
              </button>
              {isLocationOpen && (
                <ul
                  className="absolute z-99999 left-0 top-12 w-full bg-white rounded-md shadow-md border border-gray-300 max-h-78 overflow-y-auto"
                  onWheel={(e) => e.stopPropagation()}
                >
                  {locations.map((option) => (
                    <li
                      key={option}
                      onClick={() => {
                        if (option !== "Top Cities") {
                          setLocation(option);
                          setIsLocationOpen(false);
                        }
                      }}
                      className={`px-3 py-1 text-left cursor-pointer rounded-md transition-all duration-200 ${
                        option === "Top Cities"
                          ? "font-bold text-gray-600 cursor-default"
                          : "hover:bg-[#1D3A76] hover:text-white"
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="hidden md:block text-gray-400">
              <div style={{ border: "0.5px solid #ddd", height: 40 }}></div>
            </span>
            <IoSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Locality, City, Property"
              className="outline-none flex-1 bg-transparent text-gray-800 placeholder-gray-500 text-sm sm:text-base min-w-0"
            />
            <IoSearch className="w-6 h-6 text-gray-600 cursor-pointer md:hidden" />
          </div>
          <div className="hidden md:flex space-x-1 sm:space-x-2 items-center flex-shrink-0">
            <span className="hidden md:block text-gray-400">
              <div style={{ border: "0.1px solid #ddd", height: 40 }}></div>
            </span>
            {(activeTab === 2 || activeTab === 3) && (
              <div className="relative inline-block w-32">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-left px-3 py-1 rounded bg-transparent text-[#1D3A76]  focus:outline-none flex justify-between items-center"
                >
                  {selected}
                  <IoChevronDownOutline className="w-4 h-4 text-[#1D3A76]" />
                </button>
                {isOpen && (
                  <ul className="absolute left-0 mt-1 w-full bg-white rounded-md shadow-md border border-gray-300">
                    {options.map((option) => (
                      <li
                        key={option}
                        onClick={() => {
                          setSelected(option);
                          setIsOpen(false);
                        }}
                        className="px-3 py-1 text-left hover:bg-[#1D3A76] hover:text-white cursor-pointer rounded-md transition-all duration-200"
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <FaLocationCrosshairs className="hidden md:block p-1 sm:p-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full hover:bg-gray-300 transition-all duration-300 cursor-pointer" />
            <button className="hidden md:block bg-[#1D3A76] text-white px-3 sm:px-4 py-1 rounded-full shadow-lg hover:!bg-yellow-500 hover:text-black hover:border-1 hover:border-black transition-all duration-300 cursor-pointer text-sm sm:text-base whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
