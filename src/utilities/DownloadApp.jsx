import React, { useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import QR from "../assets/Images/QR Code.png";

const DownloadApp = ({ onClose }) => {
  const [activeQR, setActiveQR] = useState("android"); // default open

  const toggleQR = (platform) => {
    setActiveQR((prev) => (prev === platform ? "" : platform));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-150 overflow-scroll relative ">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-black hover:text-gray-600"
      >
        <IoClose size={24} />
      </button>

      <h2 className="text-lg font-semibold mb-4 text-center">Download App</h2>

      <div className="mb-4 flex justify-between gap-4">
        {/* Google Play Button */}
        <button
          onClick={() => toggleQR("android")}
          className="flex items-center flex-1 space-x-2 px-4 py-2 rounded-lg bg-yellow-500 text-black"
        >
          <FaGooglePlay className="h-5 w-5" />
          <div className="flex flex-col text-left">
            <span className="text-xs">Get it on</span>
            <span className="text-xs font-semibold">Google Play</span>
          </div>
        </button>
        <button
          onClick={() => toggleQR("apple")}
          className="flex items-center flex-1 space-x-2 px-4 py-2 rounded-lg bg-yellow-500 text-black"
        >
          <FaApple className="h-6 w-6" />
          <div className="flex flex-col text-left">
            <span className="text-xs">Available on the</span>
            <span className="text-xs font-semibold">App Store</span>
          </div>
        </button>
      </div>

      <div className="mt-3 text-center">
        <img src={QR} alt="Apple QR" className="w-full h-full mx-auto" />
      </div>
    </div>
  );
};

export default DownloadApp;
