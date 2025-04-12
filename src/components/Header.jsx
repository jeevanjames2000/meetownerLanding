import React, { useState, useRef, useEffect } from "react";
import logoImage from "../assets/Images/Untitled-22.png";
import favicon from "../assets/Images/Favicon@10x.png";
import { HiMenu, HiX } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import Login from "../auth/Login";
import { useSelector } from "react-redux";
import useAuthStatus from "../auth/useAuthStatus";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { isLoggedIn, user } = useAuthStatus();
  console.log("user: ", user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const modalRef = useRef(null);
  const searchData = useSelector((state) => state.auth);

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
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm px-4 relative z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="Meet Owner Logo"
              className="h-10 hidden md:block"
            />
            <img
              src={favicon}
              alt="Meet Owner"
              className="w-10 h-10 md:hidden"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                window.location.href =
                  "https://play.google.com/store/apps/details?id=com.meetowner.app";
              }}
              className="hidden md:flex border border-[#F0AA00] px-6 py-1 rounded-full text-gray-800 font-medium hover:bg-[#F0AA00] transition-all items-center"
            >
              <img src={favicon} alt="Download" className="w-5 h-5 mr-2" />
              Download App
            </button>
            <button
              onClick={() =>
                (window.location.href = "https://sellers.meetowner.in/")
              }
              className="hidden md:flex border border-[#F0AA00] px-6 py-1 rounded-full text-black font-medium hover:bg-[#F0AA00] hover:text-black transition-all group"
            >
              Add Property
              <span className="ml-1 text-[#F0AA00] group-hover:text-black">
                | Free
              </span>
            </button>
            {isLoggedIn && (
              <p className="font-bold items-center">{user.userDetails.name}</p>
            )}

            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="border border-[#F0AA00] px-6 py-1 rounded-full font-medium cursor-pointer"
              >
                Login
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="border border-[#F0AA00] px-6 py-1 rounded-full font-medium cursor-pointer"
              >
                Log out
              </button>
            )}

            <button
              className="md:hidden text-gray-800 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-md absolute z-10 top-14 right-0 w-52 py-3 px-6">
            <nav className="flex flex-col space-y-1">
              {["Buy", "Rent", "Sell", "Download App", "Add Property"].map(
                (label) => (
                  <button
                    key={label}
                    className="text-gray-800 font-medium text-left py-2 border-b border-gray-200"
                  >
                    {label}
                  </button>
                )
              )}
            </nav>
          </div>
        )}
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
          <div ref={modalRef} className="relative  w-[90%] max-w-sm">
            <Login
              setShowLoginModal={setShowLoginModal}
              showLoginModal={showLoginModal}
              onClose={handleClose}
              modalRef={modalRef}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
