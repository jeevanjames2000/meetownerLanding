import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../store/slices/searchSlice";
import config from "../../config";
const FooterLinks = ({ basePath = "/listings" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Buy");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${config.awsApiUrl}/api/v1/getPropertyLinks`);
        if (!res.ok) throw new Error("Failed to fetch property links");
        const data = await res.json();
        setLinks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);
  const handleLinkClick = (link) => {
    const searchData = {
      location: link.location,
      city_id: link.city,
      property_for: link.property_for,
      tab: link.property_for,
      property_in: link.property_in,
      sub_type: link.sub_type,
    };
    dispatch(setSearchData(searchData));
    const filters = `?city=${encodeURIComponent(
      link.city
    )}&type=${encodeURIComponent(link.property_in)}`;
    navigate(`${basePath}${filters}`);
  };
  const filteredLinks = links.filter((link) => link.property_for === activeTab);
  return (
    <footer className="bg-white text-[#1D3A76] py-12 px-4">
      <div className="max-w-8xl mx-auto px-3 py-8 rounded-xl shadow-lg border border-[#1D3A76]/10">
        <h2 className="text-3xl font-bold text-gray-900 text-left">
          Explore Properties
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
        {}
        <div className="block md:hidden h-4"></div>
        <div className="flex justify-center mb-8">
          <div className="flex justify-center w-full space-x-6 overflow-x-auto scrollbar-hide max-w-full px-1 md:overflow-visible md:space-x-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Buy");
              }}
              className={`whitespace-nowrap px-4 py-2 font-semibold border border-[#ddd] rounded-full transition-colors duration-300 ${
                activeTab === "Buy"
                  ? "text-white bg-[#1D3A76]"
                  : "text-[#1D3A76] hover:bg-[#F5F8FC]"
              }`}
            >
              Properties for Buy
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab("Rent");
              }}
              className={`whitespace-nowrap px-4 py-2 font-semibold border border-[#ddd] rounded-full transition-colors duration-300 ${
                activeTab === "Rent"
                  ? "text-white bg-[#1D3A76]"
                  : "text-[#1D3A76] hover:bg-[#F5F8FC]"
              }`}
            >
              Properties for Rent
            </a>
          </div>
        </div>
        <div className="bg-white">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading links...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No links found.
            </div>
          ) : (
            <>
              {}
              <div className="block md:hidden">
                <Swiper
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  modules={[Pagination]}
                  className="w-full"
                  style={{ paddingBottom: "50px" }}
                >
                  {Array.from({
                    length: Math.ceil(filteredLinks.length / 5),
                  }).map((_, pageIdx) => (
                    <SwiperSlide key={pageIdx}>
                      <ul className="flex flex-col gap-2 items-stretch">
                        {filteredLinks
                          .slice(pageIdx * 5, pageIdx * 5 + 5)
                          .map((link) => (
                            <li key={link.id}>
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleLinkClick(link);
                                }}
                                className="block text-[#1D3A76] text-sm font-medium hover:text-white hover:bg-[#1D3A76] transition-colors duration-200 px-3 py-2 rounded border border-[#1D3A76]/30 w-full text-left"
                              >
                                {link.link_title}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="hidden md:block">
                <ul className="flex flex-wrap gap-2 gap-y-4">
                  {filteredLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link);
                        }}
                        className="text-[#1D3A76] text-sm font-medium hover:text-white hover:bg-[#1D3A76] transition-colors duration-200 px-3 py-1 rounded border border-[#1D3A76]/30"
                      >
                        {link.link_title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
export default FooterLinks;
