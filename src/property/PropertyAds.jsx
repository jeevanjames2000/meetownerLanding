import { property } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../store/slices/searchSlice";
import config from "../../config";
const PropertyAds = () => {
  const { state: property } = useLocation();
  const [videos, setVideos] = useState([]);
  const [images, setImages] = useState([]);
  const fetchPropertyVideos = async () => {
    setVideos([]);
    try {
      const response = await fetch(
        `https://api.meetowner.in/property/getpropertyvideos?unique_property_id=${property?.unique_property_id}`
      );
      const data = await response.json();
      setVideos(data?.videos);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };
  const fetchPropertyimages = async () => {
    setImages([]);
    try {
      const response = await fetch(
        `https://api.meetowner.in/property/getpropertyphotos?unique_property_id=${property?.unique_property_id}`
      );
      const data = await response.json();
      setImages(data?.images);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };
  const [properties, setProperties] = useState([]);
  const fetchUserProperties = async () => {
    setProperties([]);
    try {
      const response = await fetch(
        `${config.awsApiUrl}/listings/v1/getPropertiesByUserID?user_id=${property?.user_id}`
      );
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
  };
  useEffect(() => {
    fetchPropertyVideos();
    fetchPropertyimages();
    fetchUserProperties();
  }, []);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(true);
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };
  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  const handleForward = () => {
    videoRef.current.currentTime += 10;
  };
  const handleBackward = () => {
    videoRef.current.currentTime -= 10;
  };
  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => setCurrentTime(video.currentTime);
    const setVideoDuration = () => setDuration(video.duration);
    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", setVideoDuration);
    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", setVideoDuration);
    };
  }, []);
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleNavigation = useCallback(() => {
    dispatch(
      setSearchData({
        location: property?.property_name,
      })
    );
    navigate("/listings");
  }, [navigate]);
  const handleProperty = useCallback(
    (property) => {
      navigate("/property", { state: property });
    },
    [navigate]
  );
  return (
    <>
      <div className="hidden lg:block h-auto top-10 bg-white relative p-3 rounded-xl shadow-lg overflow-hidden hide-scrollbar">
        <div className="relative w-full">
          <video
            ref={videoRef}
            src={videos[0]?.url || ""}
            className="w-full h-44 object-cover rounded-md"
            autoPlay
            crossOrigin="anonymous"
            muted={muted}
            loop
            playsInline
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2 flex items-center gap-2">
            <button onClick={handleBackward}>
              <FaBackward />
            </button>
            <button onClick={togglePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={handleForward}>
              <FaForward />
            </button>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-blue-500"
            />
            <span className="text-sm w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <button onClick={toggleMute}>
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
        </div>
        <div className="py-3">
          <div className="border-t pt-6 text-left">
            <h3 className="text-sm font-semibold mb-4">
              More Properties By{" "}
              {property?.user?.name
                ? property?.user?.name
                : property?.property_name}
            </h3>
            <div className="flex gap-4 mb-4">
              {properties.properties?.slice(0, 2).map((property) => (
                <div
                  key={property.id}
                  className="flex flex-row items-center gap-2 border border-gray-300 rounded-lg p-2 w-1/2 cursor-pointer"
                  onClick={() => {
                    handleProperty(property);
                  }}
                >
                  <img
                    src={
                      property.image
                        ? `https://api.meetowner.in/uploads/${property.image}`
                        : `https://placehold.co/600x400?text=${
                            property?.property_name || "No Image Found"
                          }`
                    }
                    alt="Property"
                    crossOrigin="anonymous"
                    className="w-15 h-15 object-cover rounded-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x400?text=${
                        property?.property_name || "No Image Found"
                      }`;
                    }}
                  />
                  <div className="flex flex-col">
                    <p className="font-bold text-xs text-gray-900">
                      ₹{formatToIndianCurrency(property.property_cost)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {property?.bedrooms}{" "}
                      {property?.sub_type === "Apartment"
                        ? "BHK"
                        : property?.sub_type === "Plot"
                        ? "Plot"
                        : "Land"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleNavigation}
              className="w-full bg-gray-100 text-blue-600 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              View All Properties
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PropertyAds;
