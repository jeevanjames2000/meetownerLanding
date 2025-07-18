import { useState, useRef, useEffect } from "react";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { HiMenu } from "react-icons/hi";
import Login from "../auth/Login";
import { useNavigate } from "react-router-dom";
import DownloadApp from "../utilities/DownloadApp";
import Sidebar from "../utilities/SideBar";
import { setAuthData, setLoggedIn } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { IoIosHeartEmpty } from "react-icons/io";
import { toast } from "react-toastify";
import { IoDiamondOutline } from "react-icons/io5";
import { setSearchData } from "../../store/slices/searchSlice";
const Header = () => {
  const Data = useSelector((state) => state.auth.loggedIn);
  const user = useSelector((state) => state.auth.userDetails);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      dispatch(
        setAuthData({
          userDetails: user,
          accessToken: token,
          loggedIn: true,
        })
      );
    }
  }, [Data]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const downloadRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowLoginModal(false);
      }
    };
    if (showLoginModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLoginModal]);
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const handleDownloadClose = () => {
    setShowDownloadModal(false);
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(
      setAuthData({
        userDetails: null,
        accessToken: null,
        loggedIn: false,
      })
    );
    dispatch(setLoggedIn(false));
    localStorage.clear();
    navigate("/");
  };
  const handleFavRoute = () => {
    const data = localStorage.getItem("user");
    if (!data) {
      toast.success("Login to get personalised feed!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowLoginModal(true);
      return;
    }
    navigate("/favourites");
  };
  const handleRoute = () => {
    navigate("/");
  };
  useEffect(() => {
    const handleClickOutsideDownload = (e) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target)) {
        setShowDownloadModal(false);
      }
    };
    if (showDownloadModal) {
      document.addEventListener("mousedown", handleClickOutsideDownload);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDownload);
    };
  }, [showDownloadModal]);
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
    <>
      <header className="w-full bg-white shadow-sm px-2 relative  z-10">
        <div className="container mx-auto px-1 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              onClick={handleRoute}
              src={logoImage}
              alt="Meet Owner Logo"
              crossOrigin="anonymous"
              className="h-10 hidden md:block cursor-pointer"
            />
            <img
              src={favicon}
              onClick={handleRoute}
              alt="Meet Owner"
              crossOrigin="anonymous"
              className="w-10 h-10 md:hidden cursor-pointer"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="hidden md:flex border border-[#F0AA00] px-6 py-1 rounded-full text-gray-800 font-medium hover:bg-[#F0AA00] transition-all items-center"
            >
              <img
                src={favicon}
                crossOrigin="anonymous"
                alt="Download"
                className="w-5 h-5 mr-2"
              />
              Download App
            </button>
            <button
              onClick={handleListings}
              className="hidden md:flex border border-[#F0AA00] px-6 py-1 rounded-full text-gray-800 font-medium hover:bg-[#F0AA00] transition-all items-center"
            >
              <IoDiamondOutline className="p-1 w-6 h-6 mr-1 text-blue-900 hover:text-red-500" />
              Upcoming Projects
            </button>
            <button
              onClick={() =>
                window.open("https://sellers.meetowner.in/", "_blank")
              }
              className="hidden md:flex bg-blue-900 px-6 py-1 rounded-full text-white font-medium hover:bg-[#F0AA00] hover:text-black transition-all group"
            >
              Add Property
              <span className="ml-1 text-[#F0AA00] group-hover:text-black">
                | Free
              </span>
            </button>

            {Data && (
              <div
                className="flex cursor-pointer font-medium border border-[#F0AA00] hover:bg-[#F0AA00] px-6 py-1 rounded-full"
                onClick={handleFavRoute}
              >
                <IoIosHeartEmpty className="p-1 w-6 h-6  rounded-2xl text-red-600 hover:text-red-500 " />
                <p>Favourites</p>
              </div>
            )}
            {!Data && (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden md:flex border items-center bg-blue-900 px-6 py-1 rounded-full text-white font-medium hover:bg-[#F0AA00] hover:text-black transition-all group"
              >
                Login
              </button>
            )}
            <button
              className=" text-gray-800 focus:outline-none"
              onClick={() => setMenuOpen(true)}
            >
              <HiMenu size={26} />
            </button>
          </div>
        </div>
      </header>
      <Sidebar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        isLoggedIn={Data}
        user={user}
        setShowLoginModal={setShowLoginModal}
        handleLogout={handleLogout}
      />
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
          <div ref={modalRef} className="relative w-[90%] max-w-sm">
            <Login
              setShowLoginModal={setShowLoginModal}
              showLoginModal={showLoginModal}
              onClose={handleClose}
              modalRef={modalRef}
            />
          </div>
        </div>
      )}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
          <div ref={downloadRef} className="relative w-[90%] max-w-sm">
            <DownloadApp
              setShowDownloadModal={setShowDownloadModal}
              showDownloadModal={showDownloadModal}
              onClose={handleDownloadClose}
              downloadRef={downloadRef}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
