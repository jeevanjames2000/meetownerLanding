import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoChevronDownOutline, IoSearch } from "react-icons/io5";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import video1 from "../assets/Images/Bannercorousal1.mp4";
import video2 from "../assets/Images/Bannercorousal2.mp4";
import { VscSettings } from "react-icons/vsc";
import { FaLocationCrosshairs } from "react-icons/fa6";
export default function SearchBar() {
  const [activeTab, setActiveTab] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const sliderRef = useRef(null);
  const tabs = ["Buy", "Rent", "Plot", "Commercial", "Lands", "Business Deals"];
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
      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 p-1 text-white  hover:text-black  rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300"
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
  return (
    <div className="w-full relative overflow-x-hidden">
      <Slider {...settings} ref={sliderRef}>
        {videos.map((video, index) => (
          <div key={index} className="relative">
            <div className="relative">
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                autoPlay
                loop
                muted={isMuted}
                className="w-full h-[400px] md:h-[400px] object-cover"
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
        className="relative bottom-20 left-1/2 transform -translate-x-1/2 w-11/12 md:w-3/4 lg:w-2/3 
                   bg-white/30 backdrop-blur-lg rounded-lg shadow-xl p-4 border border-white/20 z-10"
      >
        <div className="relative inline-flex space-x-1 mb-4 bg-gray-100 rounded-full p-2 px-5 w-auto">
          {tabs.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative z-10 px-8 py-2 cursor-pointer rounded-full text-sm duration-300 ${
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
          <div className="flex items-center space-x-2 w-full">
            <div className="text-gray-600 flex row align-middle gap-1.5 items-center cursor-pointer">
              Hyderabad <IoChevronDownOutline />
            </div>
            <span className="text-gray-400">
              <div style={{ border: "0.5px solid gray", height: 40 }}></div>
            </span>
            <IoSearch />
            <input
              type="text"
              placeholder='Search "Gachibowli"'
              className="outline-none flex-1 bg-transparent text-gray-800 placeholder-gray-500"
            />
          </div>
          <div className="flex space-x-2 items-center">
            <VscSettings className="p-2 w-8 h-8 bg-white rounded-full hover:bg-gray-300 transition-all duration-300 cursor-pointer" />
            <FaLocationCrosshairs className="p-2 w-8 h-8 bg-white rounded-full hover:bg-gray-300 transition-all duration-300 cursor-pointer" />
            <button className="bg-[#1D3A76] text-white px-4 py-1 rounded-full shadow-lg hover:!bg-yellow-500 hover:text-black hover:border-1 hover:border-black transition-all duration-300 cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
