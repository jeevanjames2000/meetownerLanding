import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import config from "../../config";

const RecommendedSellers = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchLatestProperties = async () => {
      setSellers([]);
      try {
        const response = await fetch(
          `${config.awsApiUrl}/listings/v1/getMostPropertiesSeller`
        );
        const data = await response.json();
        setSellers(data.sellers);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
    };
    fetchLatestProperties();
  }, []);
  return (
    <div className="py-2" style={{ backgroundColor: "#ddd" }}>
      <div className="mx-auto px-4">
        <h1 className="text-start text-3xl font-bold text-gray-800 mb-2">
          Recommended Sellers
        </h1>
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
        <p className="text-start text-gray-600 mb-6">
          Sellers With Complete Knowledge About Locality and Verified Listings
        </p>
        <div className="relative ">
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
            className="rounded-lg overflow-hidden h-[320px] sm:h-[300px] md:h-[310px] lg:h-[310px]"
          >
            {sellers.map((seller, index) => (
              <SwiperSlide key={`${index}-${index}`} className="p-2">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src={
                      seller.photo
                        ? `https://api.meetowner.in/${seller.photo}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            seller?.name || "User"
                          )}&color=393E46&size=100&background=fff`
                    }
                    alt={seller?.name}
                    crossOrigin={seller.photo ? "anonymous" : undefined}
                    className="w-full h-48 sm:h-48 md:h-48 lg:h-38 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/assets/user-placeholder.jpg";
                    }}
                  />

                  <div className="p-3 flex justify-between items-center border-t border-gray-200">
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {seller.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        Properties - {seller.property_count}
                      </p>
                    </div>
                    <div className="text-right border-l border-gray-500 pl-3">
                      <p className="text-sm text-gray-600">{seller.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className="swiper-button-prev !text-white !bg-black/30 hover:!bg-white hover:!text-black 
                 !w-10 !h-10 !rounded-full !absolute !left-0 !top-1/2 !-translate-y-1/2 after:!text-lg"
          />
          <div
            className="swiper-button-next !text-white !bg-black/30 hover:!bg-white hover:!text-black 
                 !w-10 !h-10 !rounded-full !absolute !right-0 !top-1/2 !-translate-y-1/2 after:!text-lg"
          />
        </div>
      </div>
    </div>
  );
};
export default RecommendedSellers;
