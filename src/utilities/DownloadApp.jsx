import React, { useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import QR from "../assets/Images/QR Code.png";
const DownloadApp = ({ onClose }) => {
  const [showAndroidQR, setShowAndroidQR] = useState(false);
  const [showAppleQR, setShowAppleQR] = useState(false);
  const toggleAndroidQR = () => {
    setShowAndroidQR((prev) => !prev);
    setShowAppleQR(false);
  };
  const toggleAppleQR = () => {
    setShowAppleQR((prev) => !prev);
    setShowAndroidQR(false);
  };
  return (
    <div className="bg-white p-6  rounded-lg shadow-lg w-full max-h-120 overflow-y-scroll relative scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-black hover:text-gray-600"
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-lg font-semibold mb-4 text-center">Download App</h2>

      <div className="mb-4">
        <button
          onClick={toggleAndroidQR}
          className="flex items-center w-full space-x-2 border border-white px-4 py-2 rounded-lg bg-yellow-500 text-black"
        >
          <FaGooglePlay className="h-5 w-5" />
          <div className="flex flex-col text-left">
            <span className="text-xs">Get it on</span>
            <span className="text-xs font-semibold">Google Play</span>
          </div>
        </button>
        {showAndroidQR && (
          <div className="mt-3 text-center">
            <img
              src={QR}
              alt="Android QR"
              crossOrigin="anonymous"
              className="w-full h-full mx-auto"
            />
          </div>
        )}
      </div>

      <div>
        <button
          onClick={toggleAppleQR}
          className="flex items-center w-full space-x-2 border border-white px-4 py-2 rounded-lg bg-yellow-500 text-black"
        >
          <FaApple className="h-6 w-6" />
          <div className="flex flex-col text-left">
            <span className="text-xs">Available on the</span>
            <span className="text-xs font-semibold">App Store</span>
          </div>
        </button>
        {showAppleQR && (
          <div className="mt-3 text-center">
            <img
              src={QR}
              crossOrigin="anonymous"
              alt="Apple QR"
              className="w-full h-full mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default DownloadApp;
