import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
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
const App = () => {
  return (
    <div className="py-2" style={{ backgroundColor: "#DCE8FF" }}>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-start text-3xl font-bold text-gray-800 mb-2">
          Recommended Sellers
        </h1>
        <p className="text-start text-gray-600 mb-6">
          Sellers With Complete Knowledge About Locality and Verified Listings
        </p>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {sellers.map((group, groupIndex) =>
              group.map((seller, index) => (
                <SwiperSlide key={`${groupIndex}-${index}`} className="p-2">
                  <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img
                      src={seller.image}
                      alt={seller.username}
                      className="w-full h-48 object-cover"
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
                </SwiperSlide>
              ))
            )}
          </Swiper>

          <div className="swiper-button-prev !text-white !bg-black/30 hover:!bg-white hover:!text-black !w-8 !h-8 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
          <div className="swiper-button-next !text-white !bg-black/30 hover:!bg-white hover:!text-black !w-8 !h-8 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
        </div>
      </div>
    </div>
  );
};
export default App;
