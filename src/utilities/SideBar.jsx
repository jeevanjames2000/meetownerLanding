import { IoClose, IoDiamondOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import QR from "../assets/Images/qrcode_193007135_71c6cda8449bb038d4fc90072469a021.png";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { ArrowDownRight, LogOutIcon, User2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { setSearchData } from "../../store/slices/searchSlice";

const Sidebar = ({
  menuOpen,
  setMenuOpen,
  setShowLoginModal,
  isLoggedIn,
  user,
  handleLogout,
}) => {
  const [openSection, setOpenSection] = useState(0);
  const Data = useSelector((state) => state.auth.loggedIn);
  const intrested = useSelector((state) => state.property.intrested);
  const sidebarRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };
  const getRecentActivity = (apiData, reduxData) => {
    if (apiData?.length) return apiData;
    if (reduxData?.length) return reduxData;
    return null;
  };
  const [likedProperties, setLikedProperties] = useState([]);
  useEffect(() => {
    const fetchLikedProperties = async () => {
      const data = localStorage.getItem("user");
      if (!data) return;
      const userDetails = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/v1/getAllFavourites?user_id=${userDetails.user_id}`
        );
        const data = await response.data;
        const liked = data.favourites;
        if (liked && Array.isArray(liked)) {
          setLikedProperties(liked);
        }
      } catch (error) {
        console.error("Failed to fetch liked properties:", error);
      }
    };
    fetchLikedProperties();
  }, []);
  const RecentActivitySwiper = ({ data }) => {
    if (!data?.length) {
      return (
        <p className="text-sm text-gray-500 px-4">No recent activity found.</p>
      );
    }
    const formatToIndianCurrency = (value) => {
      if (!value || isNaN(value)) return "N/A";
      const numValue = parseFloat(value);
      if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
      if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
      if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
      return numValue.toString();
    };

    return (
      <Swiper
        spaceBetween={25}
        slidesPerView={1.5}
        freeMode
        className="w-full py-2"
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-lg border p-2 shadow-sm w-[150px]">
              <img
                src={
                  item.image
                    ? `https://api.meetowner.in/uploads/${item.image}`
                    : `https://placehold.co/600x400?text=${
                        item?.property_name || "No Image Found"
                      }`
                }
                alt="Property"
                crossOrigin="anonymous"
                className="rounded-lg w-full h-22 object-cover mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/600x400?text=${
                    item?.property_name || "No Image Found"
                  }`;
                }}
              />
              <div className="flex flex-col items-start">
                <p className="font-bold text-xs text-blue-900 truncate">
                  {item.property_name}
                </p>
                <p className="font-bold text-xs text-gray-500">
                  {formatToIndianCurrency(item.property_cost)}
                </p>
              </div>
              <button
                onClick={() => handleContactSeller(item)}
                className="bg-[#EC6F51] w-full hover:bg-[#d85e43] text-white text-sm px-4 py-2 rounded-lg mt-2"
              >
                Contact
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };
  const url = "https://meetowner.in/app";

  const recentData = getRecentActivity(likedProperties, intrested);
  const sidebarItems = [
    {
      title: "Recent Activity",
      content: <RecentActivitySwiper data={recentData} />,
    },
    {
      title: "Download App",
      content: (
        <div className="text-sm text-gray-600 flex justify-center">
          <QRCodeSVG value={url} size={220} includeMargin />
        </div>
      ),
    },
  ];
  const handleContactSeller = async (property) => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");
        return;
      }
      const userDetails = JSON.parse(data);
      const payload = {
        unique_property_id: property.property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
    } catch (err) {
      console.log("err: ", err);
    }
  };
  useEffect(() => {}, [isLoggedIn, user, Data]);
  const navigate = useNavigate();
  const handleRoute = () => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.info("Please Login!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowLoginModal(true);
      return;
    }
    navigate("/profile");
  };
  const dispatch = useDispatch();

  const handleListings = () => {
    dispatch(
      setSearchData({
        property_status: "3",
        sub_type: "",
        property_in: "",
      })
    );
    navigate("/listings");
  };
  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 z-[9999]  h-full pb-10 w-64 bg-white  shadow-lg transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-b-yellow-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
            {isLoggedIn && user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            {isLoggedIn ? (
              <>
                <p className="text-xs text-left text-black">Hello!</p>
                <p className="text-gray-500 text-xs">Welcome back!</p>
              </>
            ) : (
              <p className="font-semibold text-left text-sm">Sign in to get</p>
            )}
            <p className="text-sm text-left text-black">
              {isLoggedIn && user?.name ? user.name : "personalised feed!"}
            </p>
          </div>
        </div>
        <button onClick={() => setMenuOpen(false)}>
          <IoClose size={24} />
        </button>
      </div>
      <div className="px-4 py-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300">
        {sidebarItems.map((item, index) => (
          <div key={index} className="border-b ">
            <div
              onClick={() => toggleSection(index)}
              className="flex items-center justify-between py-1 cursor-pointer text-sm font-medium hover:text-[#F0AA00]"
            >
              <span>{item.title}</span>
              <span className="text-gray-500 text-lg">
                {openSection === index ? "−" : "›"}
              </span>
            </div>
            {openSection === index && (
              <div className="pb-3 transition-all duration-300">
                {item.content}
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleListings}
          className="hidden w-full md:flex border mt-6 mb-4 bg-[#F0AA00]  border-[#F0AA00] px-6 py-1 rounded-full hover:text-white text-black font-medium hover:bg-[#F0AA00] transition-all items-center"
        >
          <ArrowDownRight className="p-1 w-6 h-6 mr-1 text-black hover:text-red-500" />
          Upcoming Projects
        </button>
        <button className="w-full  bg-[#F0AA00]  hover:text-black text-black px-4 py-1 rounded-full font-medium mb-4">
          <div
            className="flex flex-row justify-center gap-3 cursor-pointer items-center"
            onClick={handleRoute}
          >
            Profile
            <User2Icon />
          </div>
        </button>
        <button
          onClick={() => {
            if (isLoggedIn) {
              handleLogout();
            } else {
              setShowLoginModal(true);
            }
            setMenuOpen(false);
          }}
          className={`w-full ${
            isLoggedIn ? "bg-red-500" : "bg-green-500"
          }  text-white px-4 py-1 rounded-full font-medium mb-4`}
        >
          <div className="flex flex-row justify-center gap-3 cursor-pointer items-center">
            {isLoggedIn ? "Logout" : "Login"}
            <LogOutIcon />
          </div>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
