import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaCompass,
  FaBuilding,
  FaParking,
  FaBath,
} from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const projects = [
    [
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "630 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "120 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "80 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "60 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
    ],
    [
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "200 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "200 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "350 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        title: "Moonglade",
        location: "Hyderabad, Telangana, India",
        size: "1500 SQ.YD",
        facing: "East Facing",
        type: "BHK",
        parking: "Parking",
        bathrooms: "Bathrooms",
        price: "₹ 31.11L",
        image:
          "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
    ],
  ];
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-gray-900 text-left">
          High-demand projects to invest now
        </h2>
        <svg
          viewBox="0 0 120 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-44 ml-2 h-4 mt-2 flex items-center"
        >
          <path
            d="M2 6 C20 14, 50 -6, 118 6"
            stroke="#F0AA00"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {projects.map((group, groupIndex) => (
              <div key={groupIndex} className="flex w-full flex-shrink-0">
                {group.map((project, index) => (
                  <div key={index} className="w-[25%] p-2.5 box-border">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-tl-lg rounded-tr-lg"
                      />

                      <div className="p-4">
                        <h3 className="text-start text-lg font-semibold text-[#1D3A76]">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <FaMapMarkerAlt className="mr-1 text-gray-500" />{" "}
                          {project.location}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-gray-700">
                          <div className="flex items-center text-gray-500 mb-1">
                            <FaRulerCombined className="mr-1 text-gray-500" />{" "}
                            {project.size}
                          </div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <FaCompass className="mr-1 text-gray-500" />{" "}
                            {project.facing}
                          </div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <FaBuilding className="mr-1 text-gray-500" />{" "}
                            {project.type}
                          </div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <FaParking className="mr-1 text-gray-500" />{" "}
                            {project.parking}
                          </div>
                          <div className="flex items-center text-gray-500 mb-1">
                            <FaBath className="mr-1 text-gray-500" />{" "}
                            {project.bathrooms}
                          </div>
                        </div>

                        <p className="text-start text-lg font-bold text-[#1D3A76] mt-1">
                          {project.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center mt-4">
          <FaAngleLeft
            onClick={handlePrev}
            className="w-8 h-8 p-1 text-black border-1 border-gray-500 hover:text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300"
          />

          <div className="flex mx-4">
            {projects.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 mx-1 rounded-full ${
                  currentIndex === index ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <FaAngleRight
            onClick={handleNext}
            className="w-8 h-8 p-1 text-black border-1 border-gray-500 hover:text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};
export default App;
