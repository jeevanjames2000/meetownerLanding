import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import QR from "../assets/Images/qrcode_193007135_71c6cda8449bb038d4fc90072469a021.png";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import axios from "axios";
import config from "../../config";
import { toast } from "react-toastify";
import { LogOutIcon, User2Icon } from "lucide-react";
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
      const { userDetails } = JSON.parse(data);
      try {
        const response = await axios.get(
          `${config.awsApiUrl}/fav/getAllFavourites?user_id=${userDetails.user_id}`
        );
        const data = await response.data;
        const liked = data.favourites;
        console.log("liked: ", liked);
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
    console.log("data: ", data);
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
                  item.property_image
                    ? `https://api.meetowner.in/uploads/${item.property_image}`
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

  const faq = [
    {
      title: "How secure is my data with MeetOwner?",
      description:
        "meetowner.in prioritizes data security with encryption protocols and strict privacy policies. Your personal and property information is safeguarded against unauthorized access.",
    },
    {
      title: "How are builder and channel partner accounts verified?",
      description:
        "Builders and channel partners must provide valid business registration details, RERA (if applicable), and identity verification before account approval.",
    },
    {
      title: "How can I reach MeetOwner for login or account issues?",
      description: "Email: support@meetowner.in",
    },
    {
      title: "Can I edit my profile on MeetOwner?",
      description:
        'Yes, you can edit your profile by accessing the "Edit Profile" option in your account settings. This allows you to update your name, contact details, and other relevant information.',
    },
  ];
  const recentData = getRecentActivity(likedProperties, intrested);

  const sidebarItems = [
    {
      title: "Recent Activity",
      content: <RecentActivitySwiper data={recentData} />,
    },
    {
      title: "FAQ",
      content: (
        <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
          {faq.map((item, i) => (
            <li key={i}>
              <p className="font-semibold text-left">{item.title}</p>
              <p className="text-gray-500 text-left">{item.description}</p>
            </li>
          ))}
        </ol>
      ),
    },
    {
      title: "Download App",
      content: (
        <div className="text-sm text-gray-600 flex justify-center">
          <img src={QR} alt="QR code to download app" className="h-40 w-40" />
        </div>
      ),
    },
  ];
  const handleContactSeller = async (property) => {
    console.log("property: ", property);
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.error("Please Login to Contact!");

        return;
      }
      const { userDetails } = JSON.parse(data);
      const payload = {
        unique_property_id: property.property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      await axios.post(`${config.awsApiUrl}/enquiry/contactSeller`, payload);
      toast.success("Details submitted successfully");
    } catch (err) {
      toast.error("Something went wrong while submitting enquiry");
    }
  };
  useEffect(() => {
    console.log("Sidebar auth state:", {
      isLoggedIn,
      user,
      userDetails: user,
      name: user,
    });
  }, [isLoggedIn, user, Data]);

  return (
    <div
      className={`fixed top-0 right-0 h-full pb-30 w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${
        menuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-3 border-b border-b-yellow-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
            {isLoggedIn && user?.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="font-semibold text-left text-sm">
              {isLoggedIn ? (
                <>
                  <p className="text-xs text-black">Hello!</p>
                  <p className="text-gray-500 text-xs">Welcome back!</p>
                </>
              ) : (
                "Sign in to get"
              )}
            </p>
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
        <button className="w-full mt-6 bg-[#F0AA00]  hover:text-white text-white px-4 py-2 rounded-full font-medium mb-4">
          <div className="flex flex-row justify-center gap-3 cursor-pointer items-center">
            Profile
            <User2Icon />
          </div>
        </button>
        <button
          onClick={() => {
            console.log("Sidebar button clicked, isLoggedIn:", isLoggedIn);
            if (isLoggedIn) {
              handleLogout();
            } else {
              setShowLoginModal(true);
            }
            setMenuOpen(false);
          }}
          className={`w-full ${
            isLoggedIn ? "bg-red-500" : "bg-green-500"
          } hover:text-black text-white px-4 py-2 rounded-full font-medium mb-4`}
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
