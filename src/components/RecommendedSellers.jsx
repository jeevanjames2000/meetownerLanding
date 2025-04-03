import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sellers = [
    [
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
    [
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
      {
        username: "chakravarthy",
        listings: 1,
        location: "Hyderabad",
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      },
    ],
  ];
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sellers.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sellers.length - 1 ? 0 : prevIndex + 1
    );
  };
  return (
    <div className="py-2" style={{ backgroundColor: "#DCE8FF" }}>
      <div className="max-w-7xl mx-auto p-6">
        {" "}
        <h1 className="text-start text-3xl font-bold text-gray-800 mb-2">
          Recommended Sellers
        </h1>
        <p className="text-start text-gray-600 mb-6">
          Sellers With Complete Knowledge About Locality and Verified Listings
        </p>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {sellers.map((group, groupIndex) => (
                <div key={groupIndex} className="flex w-full flex-shrink-0">
                  {group.map((seller, index) => (
                    <div
                      key={index}
                      className="w-[16.67%] p-2 box-border lg:w-[16.67%] md:w-[25%] sm:w-[33.33%] xs:w-[50%]"
                    >
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img
                          src={seller.image}
                          alt={seller.username}
                          className="w-full h-32 object-cover"
                        />

                        <div className="p-3 flex justify-between items-center border-t border-gray-200">
                          <div className="text-left">
                            <p className="text-sm font-semibold text-gray-800">
                              {seller.username}
                            </p>
                            <p className="text-xs text-gray-600">
                              Properties - {seller.listings}
                            </p>
                          </div>
                          <div className="text-right border-l border-gray-200 pl-3">
                            <p className="text-sm text-gray-600">
                              {seller.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center mt-4">
            <button
              onClick={handlePrev}
              className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
            >
              <FaArrowLeft />
            </button>

            <div className="flex mx-4">
              {sellers.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 mx-1 rounded-full ${
                    currentIndex === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

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
