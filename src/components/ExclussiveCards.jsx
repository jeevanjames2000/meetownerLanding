import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    [
      {
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
    ],
    [
      {
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
      {
        image:
          "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=150&q=80",
      },
    ],
  ];
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto p-6">
        {}
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-start">
          Meet Owner Exclusive
        </h1>
        <p className="text-gray-600 mb-6 text-start">
          Sponsored By Projects and Events
        </p>
        {}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {images.map((group, groupIndex) => (
                <div key={groupIndex} className="flex w-full flex-shrink-0">
                  {group.map((item, index) => (
                    <div
                      key={index}
                      className="w-[25%] p-2 box-border lg:w-[25%] md:w-[33.33%] sm:w-[50%] xs:w-full"
                    >
                      {}
                      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                        {}
                        <img
                          src={item.image}
                          alt="House"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {}
          <div className="flex justify-center items-center mt-4">
            {}
            <button
              onClick={handlePrev}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <FaArrowLeft />
            </button>
            {}
            <div className="flex mx-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 mx-1 rounded-full ${
                    currentIndex === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            {}
            <button
              onClick={handleNext}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
