import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
const properties = [
  {
    id: 1,
    name: "Sunshine Vihaan",
    location: "Manikonda, Hyderabad",
    priceRange: "2000000",
    priceRange2: "4000000",
    type: "2, 3, 4 BHK Apartments",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    logo: "https://via.placeholder.com/150x50",
  },
  {
    id: 2,
    name: "Sunshine Destino",
    location: "Manikonda, Hyderabad",
    priceRange: "32000000",
    priceRange2: "50000000",
    type: "2, 3, 4 BHK Apartments",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    logo: "https://via.placeholder.com/150x50",
  },
];
const HousingPicks = () => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef(null);
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            swiperRef.current?.slideNext();
            return 0;
          }
          return prevProgress + 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " L";
    }
    return price.toLocaleString();
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 text-left">
            Best Meetowner
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
          <p className="flex items-start mt-1 font-normal">
            Explore Top-Tier Homes with Ease
          </p>
        </div>
        <div className="mt-4 md:mt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full md:w-auto">
          {properties.map((property) => (
            <div
              key={property.id}
              className="relative rounded-lg overflow-hidden w-full md:w-72 h-40 lg:h-30 sm:h-30 md:h-30"
            >
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white text-sm font-semibold">
                  {property.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1.1}
            slidesOffsetBefore={0}
            slidesOffsetAfter={20}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 8000, disableOnInteraction: false }}
            className="rounded-lg overflow-hidden h-auto"
          >
            {properties.map((property) => (
              <SwiperSlide key={property.id}>
                <div className="flex flex-col md:flex-row h-100 bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="w-full md:w-1/3 p-6 bg-gradient-to-r from-blue-900 to-orange-500 text-white flex flex-col justify-between text-left">
                    <div>
                      <h3 className="text-2xl font-bold">{property.name}</h3>
                      <p className="text-white">{property.location}</p>
                      <div className="mt-2">
                        <p className="text-xl font-bold text-[#fff]">
                          ₹{formatPrice(property.priceRange)} - ₹
                          {formatPrice(property.priceRange2)}
                        </p>
                        <p className="text-white/80">{property.type}</p>
                      </div>
                    </div>
                    <button className="mt-4 !bg-[#fff] text-black px-6 py-2 rounded-full hover:!bg-yellow-500 hover:text-black hover:border-1 hover:border-black">
                      Contact
                    </button>
                  </div>
                  {}
                  <div className="w-full md:w-2/3 relative">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-[250px] md:h-full object-cover"
                    />
                    <a
                      href="#"
                      className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      View All Projects
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev !text-white !bg-black/30 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
            <div className="swiper-button-next !text-white !bg-black/30 !w-10 !h-10 !rounded-full !top-1/2 !-translate-y-1/2 after:!text-lg" />
          </Swiper>
        </div>
      </div>
    </div>
  );
};
export default HousingPicks;
