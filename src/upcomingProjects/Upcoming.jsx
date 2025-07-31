import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IoIosHeartEmpty } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineVerified } from "react-icons/md";
const UpcomingProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/upcoming/v1/getAllUpComingProjects")
      .then((res) => {
        if (res.data.status === "success") {
          setProjects(res.data.data);
        }
      })
      .catch((err) => {
        console.error("API error:", err);
      });
  }, []);
  return (
    <div className="flex py-5 px-4 justify-center">
      <div className="max-w-4xl mx-auto space-y-4">
        {projects.map((project, index) => {
          const isBrochureImage =
            project.brochure?.endsWith(".jpg") ||
            project.brochure?.endsWith(".jpeg") ||
            project.brochure?.endsWith(".png");
          const size = project.sizes?.[0] || {};
          const possessionDate = project.possession_end_date
            ? new Date(project.possession_end_date).toLocaleDateString(
                "en-IN",
                {
                  month: "short",
                  year: "numeric",
                }
              )
            : "N/A";
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              style={{ height: "250px" }}
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-65 flex-shrink-0 h-full">
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    modules={[Pagination]}
                    className="h-full w-full"
                    style={{ height: "100%" }}
                  >
                    {(project.gallery_images?.length > 0
                      ? project.gallery_images
                      : [
                          {
                            image: isBrochureImage
                              ? project.brochure
                              : "https://via.placeholder.com/240x250?text=No+Image",
                          },
                        ]
                    ).map((image, imgIndex) => (
                      <SwiperSlide key={imgIndex} className="h-full">
                        <img
                          src={`https://api.meetowner.in/aws/v1/s3/${image.image}`}
                          alt={`${project.property_name} image ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    {project.gallery_images?.length || 1}/
                    {project.gallery_images?.length || 1}
                  </div>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between text-left h-full overflow-hidden">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <p className="text-xl md:text-2xl font-bold text-gray-600 line-clamp-1">
                          {project.property_name}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {project.location}, {project.city}, {project?.state}
                        </p>
                      </div>
                      <div className="flex gap-5">
                        <div className="flex items-center gap-1 border border-green-500 rounded-full px-1">
                          <MdOutlineVerified className="text-md text-green-500" />
                          <p className="text-[11px] font-semibold lg:text-base text-green-500">
                            Rera
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <IoIosHeartEmpty className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-700 font-medium overflow-hidden">
                      <span className="line-clamp-1">
                        Possession Starts: {possessionDate}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="line-clamp-1">
                        {size.carpet_area} sq.ft Built-up
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="line-clamp-1">
                        {project.furnishing_status || "Semi Furnished"}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="line-clamp-1">
                        ₹ {size.sqft_price || "N/A"} / sq.ft
                      </span>
                    </div>
                    {project.description && (
                      <div className="mt-1">
                        <p className="text-xs md:text-sm text-gray-700 break-words line-clamp-2">
                          {project.description?.length > 100
                            ? `${project.description.slice(0, 100)}...`
                            : project.description}
                        </p>
                      </div>
                    )}
                    {project.around_this_property?.length > 0 && (
                      <div className="mt-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">
                          Around this property:
                        </p>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-700 line-clamp-1">
                          {project.around_this_property.map(
                            (highlight, hIndex) => (
                              <React.Fragment key={hIndex}>
                                <span className="flex items-center">
                                  {highlight.name}
                                  {highlight.distance &&
                                    ` (${highlight.distance}m)`}
                                </span>
                                {hIndex <
                                  project.around_this_property.length - 1 && (
                                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full inline-block"></span>
                                )}
                              </React.Fragment>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 justify-end">
                      <a
                        href={`https://api.meetowner.in/aws/v1/s3/${project.brochure}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900   hover:bg-blue-800 text-white   text-sm font-semibold px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 ease-in-out"
                      >
                        Download Brochure
                      </a>
                      <a
                        href={`https://api.meetowner.in/aws/v1/s3/${project.price_sheet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-900  hover:bg-blue-800 text-white   text-sm font-semibold px-3 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 ease-in-out"
                      >
                        Price Sheet
                      </a>
                      <button className="bg-[#25D366] hover:bg-[#1EB554] cursor-pointer text-white hover:text-white  text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 ease-in-out">
                        <FaWhatsapp className="w-4 h-4" />
                        Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default UpcomingProjects;
