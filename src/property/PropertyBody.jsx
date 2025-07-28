import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Building,
  ChevronUp,
  Droplet,
  Dumbbell,
  Landmark,
  Medal,
  MonitorCheck,
  PawPrint,
  Phone,
  ShieldCheck,
  Palmtree as TreePalm,
  Users,
  Waves,
  DollarSign,
  IndianRupee,
  Bed,
  Bath,
  Home,
  PersonStanding,
  Table,
  Calendar,
  Lock,
  Car,
  Bike,
  ParkingCircle,
  DoorOpen,
  Ruler,
  Shield,
  ShoppingBag,
  MapPin as MapPinIcon,
} from "lucide-react";
import {
  FaBorderAll,
  FaExpandArrowsAlt,
  FaDoorOpen,
  FaRupeeSign,
  FaHome,
  FaRulerCombined,
  FaSchool,
  FaHospital,
  FaShoppingCart,
  FaFootballBall,
  FaPlane,
  FaTree,
  FaTrain,
  FaHotel,
  FaUniversity,
  FaMapMarkerAlt,
  FaAngleLeft,
  FaAngleRight,
  FaBasketballBall,
  FaCogs,
  FaShieldAlt,
} from "react-icons/fa";
import {
  FaBatteryFull,
  FaBicycle,
  FaChild,
  FaFilter,
  FaFireExtinguisher,
  FaLeaf,
  FaPlug,
  FaShuttleSpace,
  FaSolarPanel,
  FaToolbox,
  FaWater,
  FaWifi,
} from "react-icons/fa6";
import { MdOutlineVerified } from "react-icons/md";
import whatsappIcon from "../assets/Images/whatsapp (3).png";
import Login from "../auth/Login";
import useWhatsappHook from "../utilities/useWhatsappHook";
import { useSelector } from "react-redux";
import config from "../../config";
const PropertyBody = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const modalRef = useRef(null);
  const { handleAPI } = useWhatsappHook();
  const [property, setProperty] = useState(location.state);
  const [loading, setLoading] = useState(!location.state);
  const propertyData = useSelector((state) => state.property);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [floorplan, setFloorPlan] = useState("");
  const [images, setImages] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [aroundProperty, setAroundProperty] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [contacted, setContacted] = useState([]);
  const [submittedStates, setSubmittedStates] = useState({});
  const fetchContactedProperties = async (property) => {
    const data = localStorage.getItem("user");
    if (!data) {
      return;
    }
    const userDetails = JSON.parse(data);
    try {
      const response = await axios.get(
        `${config.awsApiUrl}/enquiry/v1/getUserContactSellersByID?unique_property_id=${property?.unique_property_id}&user_id=${userDetails.user_id}`
      );
      const contacts = response.data || [];
      const contactIds = contacts.results.map(
        (contact) => contact.unique_property_id
      );
      setContacted(contactIds);
    } catch (error) {
      console.error("Failed to fetch liked properties:", error);
    }
  };
  useEffect(() => {
    const fetchPropertyFromQueryParams = async () => {
      if (!location.state) {
        try {
          setLoading(true);
          const url = window.location.href;
          const idMatch = url.match(/Id_([^&]*)/);
          if (idMatch && idMatch[1]) {
            const propertyId = idMatch[1];
            const response = await fetch(
              `${config.awsApiUrl}/listings/v1/getSingleProperty?unique_property_id=${propertyId}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch property details");
            }
            const data = await response.json();
            if (data && data.property) {
              setProperty(data.property);
            } else {
              throw new Error("Invalid property data received");
            }
          } else {
            throw new Error("Property ID not found in URL");
          }
        } catch (err) {
          console.error("Error fetching property:", err);
          setError(err.message || "Failed to load property details");
          toast.error("Failed to load property details");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPropertyFromQueryParams();
  }, [location.state]);
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (property?.unique_property_id) {
        try {
          const floorPlansResponse = await fetch(
            `${config.awsApiUrl}/listings/v1/getAllFloorPlans/${property.unique_property_id}`
          );
          const floorPlansData = await floorPlansResponse.json();
          setFloorPlan(floorPlansData[0]);
          const imagesResponse = await fetch(
            `https://api.meetowner.in/property/getpropertyphotos?unique_property_id=${property.unique_property_id}`
          );
          const imagesData = await imagesResponse.json();
          setImages(imagesData.images);
          setMainImage(imagesData.images[0]?.url);
          const aroundResponse = await fetch(
            `${config.awsApiUrl}/listings/v1/getAroundThisProperty?id=${property.unique_property_id}`
          );
          const aroundData = await aroundResponse.json();
          setAroundProperty(aroundData.results);
        } catch (error) {
          console.error("Error fetching property data:", error);
        }
      }
    };
    fetchContactedProperties(property);
    fetchPropertyData();
  }, [property?.unique_property_id]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (propertyData.location) {
      window.location.reload();
    }
  }, [propertyData.location]);
  const facilityIconMap = {
    Lift: <Building />,
    CCTV: <MonitorCheck />,
    Gym: <Dumbbell />,
    Garden: <TreePalm />,
    "Club House": <Users />,
    Sports: <Medal />,
    "Swimming Pool": <Waves />,
    Intercom: <Phone />,
    "Gated Community": <ShieldCheck />,
    "Regular Water": <Droplet />,
    "Community Hall": <Landmark />,
    "Pet Allowed": <PawPrint />,
    "Half Basket Ball Court": <FaBasketballBall />,
    "Power Backup": <FaBatteryFull />,
    "Entry / Exit": <FaDoorOpen />,
    "Badminton Court": <FaShuttleSpace />,
    "Children Play Area": <FaChild />,
    "Water Harvesting Pit": <FaWater />,
    "Water Softener": <FaFilter />,
    "Solar Fencing": <FaSolarPanel />,
    "Security Cabin": <FaShieldAlt />,
    Lawn: <FaLeaf />,
    "Transformer Yard": <FaPlug />,
  };
  const fallbackIcons = [
    <FaWifi />,
    <FaBicycle />,
    <FaFireExtinguisher />,
    <FaToolbox />,
    <FaCogs />,
    <FaWater />,
    <FaSolarPanel />,
    <FaShieldAlt />,
  ];
  const getFallbackIcon = (name) => {
    const hash = [...name].reduce(
      (acc, c, i) => acc + c.charCodeAt(0) * (i + 1),
      0
    );
    return fallbackIcons[hash % fallbackIcons.length];
  };
  const getPropertyDetails = async (propertyData) => {
    try {
      const response = await fetch(
        `https://api.meetowner.in/listings/v1/getSingleProperty?unique_property_id=${propertyData.unique_property_id}`
      );
      const data = await response.json();
      const propertydata = data.property;
      const sellerdata = propertydata.user;
      if (response.ok) {
        return sellerdata;
      } else {
        throw new Error("Failed to fetch owner details");
      }
    } catch (err) {
      console.error("err: ", err);
    }
  };
  const handleClose = () => {
    setShowLoginModal(false);
  };
  const formatToIndianCurrency = (value) => {
    if (!value || isNaN(value)) return "N/A";
    const numValue = parseFloat(value);
    if (numValue >= 10000000) return (numValue / 10000000).toFixed(2) + " Cr";
    if (numValue >= 100000) return (numValue / 100000).toFixed(2) + " L";
    if (numValue >= 1000) return (numValue / 1000).toFixed(2) + " K";
    return numValue.toString();
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleContactSeller = async () => {
    try {
      const data = localStorage.getItem("user");
      if (!data) {
        toast.info("Please Login to Contact!");
        setShowLoginModal(true);
        return;
      }
      const userDetails = JSON.parse(data);
      const payload = {
        unique_property_id: property.unique_property_id,
        user_id: userDetails.user_id,
        fullname: userDetails.name,
        mobile: userDetails.mobile,
        email: userDetails.email,
      };
      const SubType =
        property.sub_type === "Apartment"
          ? `${property?.sub_type} ${property?.bedrooms}BHK`
          : property?.sub_type;
      const smspayload = {
        name: userDetails?.name,
        mobile: userDetails?.mobile,
        sub_type: SubType,
        location: property?.location_id.split(/[\s,]+/)[0],
        property_cost: formatToIndianCurrency(property?.property_cost),
        ownerMobile: property?.mobile || property?.phone || "N/A",
      };
      await axios.post(
        `${config.awsApiUrl}/enquiry/v1/sendLeadTextMessage`,
        smspayload
      );
      await axios.post(`${config.awsApiUrl}/enquiry/v1/contactSeller`, payload);
      await handleAPI(property);
      setSubmittedStates((prev) => ({
        ...prev,
        [property.unique_property_id]: {
          ...prev[property?.unique_property_id],
          contact: true,
        },
      }));
      setContacted((prev) => [...prev, property.unique_property_id]);
    } catch (err) {}
  };
  const getPlaceIcon = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("school") || lowerTitle.includes("college"))
      return <FaSchool />;
    if (lowerTitle.includes("hospital") || lowerTitle.includes("medical"))
      return <FaHospital />;
    if (lowerTitle.includes("market") || lowerTitle.includes("mall"))
      return <FaShoppingCart />;
    if (lowerTitle.includes("sports") || lowerTitle.includes("arena"))
      return <FaFootballBall />;
    if (lowerTitle.includes("airport") || lowerTitle.includes("travel"))
      return <FaPlane />;
    if (lowerTitle.includes("park") || lowerTitle.includes("zone"))
      return <FaTree />;
    if (lowerTitle.includes("railway") || lowerTitle.includes("station"))
      return <FaTrain />;
    if (lowerTitle.includes("hotel")) return <FaHotel />;
    if (lowerTitle.includes("university")) return <FaUniversity />;
    return <FaMapMarkerAlt />;
  };
  const formatDistance = (distance) => {
    const d = parseInt(distance, 10);
    if (isNaN(d)) return "";
    return d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
  };
  const formatValue = (value) => {
    return value % 1 === 0
      ? parseInt(value)
      : parseFloat(value).toFixed(2).replace(/\.00$/, "");
  };
  const handleChatClick = async (e) => {
    e.stopPropagation();
    const data = localStorage.getItem("user");
    const userData = JSON.parse(data);
    if (!data) {
      toast.info("Please Login to Schedule Visits!", {
        position: "top-right",
        autoClose: 3000,
      });
      setShowLoginModal(true);
      return;
    }
    try {
      const sellerData = await getPropertyDetails(property);
      const phone = sellerData?.mobile || sellerData?.phone;
      const name = sellerData?.name || "";
      if (phone) {
        const propertyFor = property.property_for === "Rent" ? "rent" : "buy";
        const category =
          property.sub_type === "Apartment" ||
          property.sub_type === "Individual house"
            ? `${property.bedrooms}BHK`
            : property.sub_type === "Plot"
            ? "Plot"
            : "Property";
        const propertyId = property.unique_property_id;
        const propertyNameSlug = property.property_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^-|-$)/g, "");
        const locationSlug = property.location_id
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/(^-|-$)/g, "");
        const citySlug = property.city
          ? property.city
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "_")
              .replace(/(^-|-$)/g, "")
          : "hyderabad";
        const seoUrl = `${propertyFor}_${category}_${property.sub_type}_${propertyNameSlug}_in_${locationSlug}_${citySlug}_Id_${propertyId}`;
        const fullUrl = `${window.location.origin}/property?${seoUrl}`;
        const encodedMessage = encodeURIComponent(
          `Hi ${name},\nI'm interested in this property: ${property.property_name}.\n${fullUrl}\nI look forward to your assistance in the home search. Please get in touch with me at ${userData.mobile} to initiate the process.`
        );
        const whatsappUrl = `https://wa.me/+91${phone}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
      } else {
        toast.error("Owner's phone number is not available.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Failed to get owner's contact details.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };
  const isResidential = property?.property_in === "Residential";
  const isCommercial = property?.property_in === "Commercial";
  const isSell = property?.property_for === "Sell";
  const isRent = property?.property_for === "Rent";
  const propertySubtype = property?.sub_type;
  const fieldVisibility = useMemo(
    () => ({
      ...(isResidential &&
        isSell && {
          Apartment: {
            rera_approved: true,
            occupancy: true,
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            facilities: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent House": {
            rera_approved: true,
            occupancy: true,
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            pent_house: true,
            property_cost: true,
            facilities: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent Villa": {
            rera_approved: true,
            occupancy: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            pent_house: true,
            property_cost: true,
            facilities: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          Plot: {
            rera_approved: true,
            property_age: true,
            area_units: true,
            length_area: true,
            builtup_unit: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            property_cost: true,
            possession_status: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            around_places: true,
            description: true,
            plot_number: true,
          },
          Land: {
            rera_approved: true,
            area_units: true,
            length_area: true,
            builtup_unit: true,
            width_area: true,
            total_project_area: true,
            property_cost: true,
            possession_status: true,
            loan_facility: true,
            facing: true,
            around_places: true,
            description: true,
            plot_number: true,
            land_sub_type: true,
          },
        }),
      ...(isCommercial &&
        isSell && {
          Office: {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            zone_types: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          "Retail Shop": {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          "Show Room": {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          Warehouse: {
            rera_approved: true,
            occupancy: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            unit_flat_house_no: true,
            zone_types: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          Plot: {
            rera_approved: true,
            area_units: true,
            length_area: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            possession_status: true,
            ownership_type: true,
            unit_flat_house_no: true,
            suitable: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          Others: {
            rera_approved: true,
            occupancy: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
        }),
      ...(isResidential &&
        isRent && {
          Apartment: {
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent House": {
            bedrooms: true,
            furnished_status: true,
            available_from: true,
            bathroom: true,
            balconies: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            plot_area: true,
            total_project_area: true,
            pent_house: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent Villa": {
            bedrooms: true,
            furnished_status: true,
            bathroom: true,
            balconies: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            plot_area: true,
            total_project_area: true,
            pent_house: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
        }),
      ...(isCommercial &&
        isRent && {
          Office: {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            zone_types: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          "Retail Shop": {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          "Show Room": {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          Warehouse: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            zone_types: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          Plot: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            length_area: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            around_places: true,
            description: true,
          },
          Others: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
        }),
    }),
    [isResidential, isCommercial, isRent, isSell]
  );
  const fieldConfigs = {
    monthly_rent: {
      label: "Expected Monthly Rent",
      value: (prop) => `₹ ${formatToIndianCurrency(prop.monthly_rent)}`,
      icon: <DollarSign className="w-5 h-5" />,
    },
    property_cost: {
      label: "Property Cost",
      value: (prop) => (
        <div className="flex flex-col">
          <span>₹ {formatToIndianCurrency(prop.property_cost)}</span>
          <span className="text-xs text-gray-500">
            `({prop.property_cost_type || "(Cost may vary)"})`
          </span>
        </div>
      ),
      icon: <IndianRupee className="w-5 h-5" />,
    },
    bedrooms: {
      label: "Bedrooms",
      value: (prop) => prop.bedrooms,
      icon: <Bed className="w-5 h-5" />,
    },
    bathroom: {
      label: "Bathrooms",
      value: (prop) => prop.bathroom,
      icon: <Bath className="w-5 h-5" />,
    },
    balconies: {
      label: "Balconies",
      value: (prop) => prop.balconies,
      icon: <Home className="w-5 h-5" />,
    },
    types: {
      label: "Preferred Tenant",
      value: (prop) => prop.types,
      icon: <PersonStanding className="w-5 h-5" />,
    },
    furnished_status: {
      label: "Furnished Status",
      value: (prop) => prop.furnished_status,
      icon: <Table className="w-5 h-5" />,
    },
    total_project_area: {
      label: "Project Area",
      value: (prop) =>
        `${formatValue(prop.total_project_area)} ${
          prop.total_project_area_type || "Acres"
        }`,
      icon: <FaBorderAll className="w-5 h-5" />,
    },
    plot_area: {
      label: "Plot Area",
      value: (prop) =>
        `${formatValue(prop.plot_area)} ${prop.area_units || "Sq.yd"}`,
      icon: <FaExpandArrowsAlt className="w-5 h-5" />,
    },
    length_area: {
      label: "Dimensions",
      value: (prop) => (
        <span>
          <strong className="text-blue-900">L</strong>-
          {formatValue(prop.length_area)} x{" "}
          <strong className="text-blue-900">W</strong>-
          {formatValue(prop.width_area)}
        </span>
      ),
      icon: <FaRulerCombined className="w-5 h-5" />,
    },
    builtup_area: {
      label: "Built-up Area",
      value: (prop) =>
        `${formatValue(prop.builtup_area)} ${prop.area_units || "Sq.ft"}`,
      icon: <Home className="w-5 h-5" />,
    },
    carpet_area: {
      label: "Carpet Area",
      value: (prop) =>
        `${formatValue(prop.carpet_area)} ${prop.area_units || "Sq.ft"}`,
      icon: <Ruler className="w-5 h-5" />,
    },
    occupancy: {
      label: (prop) =>
        prop.possession_status === "Under Construction"
          ? "Possession Starts"
          : "Occupancy Status",
      value: (prop) =>
        ["Apartment", "Independent House", "Independent Villa"].includes(
          prop.sub_type
        )
          ? prop.possession_status === "Under Construction"
            ? `Under Construction${
                prop.under_construction
                  ? ` (${formatDate(prop.under_construction)})`
                  : ""
              }`
            : "Ready to Move"
          : "",
      icon: <DoorOpen className="w-5 h-5" />,
    },
    possession_status: {
      label: "Possession Status",
      value: (prop) =>
        prop.possession_status?.toLowerCase() === "immediate"
          ? "Immediate"
          : "Future",
      icon: <Calendar className="w-5 h-5" />,
    },
    available_from: {
      label: "Available From",
      value: (prop) => formatDate(prop.available_from),
      icon: <Calendar className="w-5 h-5" />,
    },
    maintenance: {
      label: "Maintenance (Monthly)",
      value: (prop) => `₹ ${formatToIndianCurrency(prop.maintenance)}`,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    security_deposit: {
      label: "Security Deposit",
      value: (prop) => prop.security_deposit,
      icon: <Lock className="w-5 h-5" />,
    },
    lock_in: {
      label: "Lock-in Period",
      value: (prop) => prop.lock_in,
      icon: <Lock className="w-5 h-5" />,
    },
    brokerage_charge: {
      label: "Brokerage Charge",
      value: (prop) => prop.brokerage_charge,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    facing: {
      label: "Facing",
      value: (prop) => prop.facing,
      icon: <Home className="w-5 h-5" />,
    },
    car_parking: {
      label: "Car Parking",
      value: (prop) => prop.car_parking,
      icon: <Car className="w-5 h-5" />,
    },
    bike_parking: {
      label: "Bike Parking",
      value: (prop) => prop.bike_parking,
      icon: <Bike className="w-5 h-5" />,
    },
    open_parking: {
      label: "Open Parking",
      value: (prop) => prop.open_parking,
      icon: <ParkingCircle className="w-5 h-5" />,
    },
    pent_house: {
      label: "Pent House",
      value: (prop) => prop.pent_house,
      icon: <Home className="w-5 h-5" />,
    },
    servant_room: {
      label: "Servant Room",
      value: (prop) => prop.servant_room,
      icon: <PersonStanding className="w-5 h-5" />,
    },
    pantry_room: {
      label: "Pantry Room",
      value: (prop) => prop.pantry_room,
      icon: <Home className="w-5 h-5" />,
    },
    passenger_lifts: {
      label: "Passenger Lifts",
      value: (prop) => prop.passenger_lifts,
      icon: <Building className="w-5 h-5" />,
    },
    service_lifts: {
      label: "Service Lifts",
      value: (prop) => prop.service_lifts,
      icon: <Building className="w-5 h-5" />,
    },
    stair_cases: {
      label: "Stair Cases",
      value: (prop) => prop.stair_cases,
      icon: <Home className="w-5 h-5" />,
    },
    private_parking: {
      label: "Private Parking",
      value: (prop) => prop.private_parking,
      icon: <Car className="w-5 h-5" />,
    },
    public_parking: {
      label: "Public Parking",
      value: (prop) => prop.public_parking,
      icon: <ParkingCircle className="w-5 h-5" />,
    },
    private_washrooms: {
      label: "Private Washrooms",
      value: (prop) => prop.private_washrooms,
      icon: <Bath className="w-5 h-5" />,
    },
    public_washrooms: {
      label: "Public Washrooms",
      value: (prop) => prop.public_washrooms,
      icon: <Bath className="w-5 h-5" />,
    },
    property_age: {
      label: "Property Age",
      value: (prop) => `${formatValue(prop.property_age)} Years`,
      icon: <Home className="w-5 h-5" />,
    },
    unit_flat_house_no: {
      label: "Unit/Flat/House No",
      value: (prop) => prop.unit_flat_house_no,
      icon: <Home className="w-5 h-5" />,
    },
    plot_number: {
      label: "Plot Number",
      value: (prop) => prop.plot_number,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    ownership_type: {
      label: "Ownership Type",
      value: (prop) => prop.ownership_type,
      icon: <Shield className="w-5 h-5" />,
    },
    zone_types: {
      label: "Zone Types",
      value: (prop) => prop.zone_types,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    suitable: {
      label: "Suitable For",
      value: (prop) => prop.business_types || prop.suitable,
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    land_sub_type: {
      label: "Land Sub Type",
      value: (prop) => prop.land_sub_type,
      icon: <MapPinIcon className="w-5 h-5" />,
    },
    investor_property: {
      label: "Investor Property",
      value: (prop) => prop.investor_property,
      icon: <DollarSign className="w-5 h-5" />,
    },
    loan_facility: {
      label: "Loan Facility",
      value: (prop) => prop.loan_facility,
      icon: <IndianRupee className="w-5 h-5" />,
    },
    builtup_unit: {
      label: "Unit Cost",
      value: (prop) => (
        <span>
          ₹ {formatToIndianCurrency(prop.builtup_unit)}{" "}
          <span className="text-xs text-gray-500">
            `({prop.unit_cost_type || "(Cost may vary)"})`
          </span>
        </span>
      ),
      icon: <IndianRupee className="w-5 h-5" />,
    },
  };
  const overviewItems = useMemo(() => {
    const items = [];
    const visibleFields = fieldVisibility[propertySubtype] || {};
    Object.keys(visibleFields).forEach((field) => {
      if (
        visibleFields[field] &&
        fieldConfigs[field] &&
        property?.[field] &&
        field !== "facilities" &&
        field !== "around_places" &&
        field !== "description"
      ) {
        items.push({
          label:
            typeof fieldConfigs[field].label === "function"
              ? fieldConfigs[field].label(property)
              : fieldConfigs[field].label,
          value:
            typeof fieldConfigs[field].value === "function"
              ? fieldConfigs[field].value(property)
              : fieldConfigs[field].value,
          icon: fieldConfigs[field].icon,
        });
      }
    });
    if (
      visibleFields.length_area &&
      visibleFields.width_area &&
      property?.length_area &&
      property?.width_area
    ) {
      const dimIndex = items.findIndex((item) => item.label === "Dimensions");
      if (dimIndex === -1) {
        items.splice(dimIndex, 1);
      }
      items.push(fieldConfigs.length_area);
    }
    return items;
  }, [property, propertySubtype, fieldVisibility]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        <p className="ml-3 text-lg font-medium text-blue-900">
          Loading property details...
        </p>
      </div>
    );
  }
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="font-bold">Error loading property</p>
          <p>{error || "Property information not available"}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }
  const facilitiesList = property?.facilities?.split(",").map((f) => f.trim());
  const description = property?.description || "";
  const isLong = description.length > 320;
  const shortText = description.slice(0, 320);
  const toggleReadMore = () => setIsExpanded(!isExpanded);
  return (
    <div className="relative p-1 0 lg:p-6 w-full  rounded-xl shadow-md space-y-4">
      <h1 className="text-blue-900 font-bold text-left lg:text-center uppercase text-xl md:text-2xl lg:text-3xl">
        {property.property_name} PROPERTY DETAILS
      </h1>
      <div className="text-gray-700 text-justify">
        <h2 className="text-xl mb-2 font-bold text-gray-400 text-left">
          Property Description
        </h2>
        <p>
          {isExpanded || !isLong ? description : `${shortText}... `}
          {isLong && (
            <span
              onClick={toggleReadMore}
              className="text-blue-600 cursor-pointer"
            >
              {isExpanded ? "Read Less" : "Read More..."}
            </span>
          )}
        </p>
      </div>
      <div className="flex flex-col border-b pb-2 mb-2">
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          <h3 className="text-2xl font-bold text-indigo-900">
            {property?.property_name}
          </h3>
          <div className="text-right flex items-center gap-2">
            <p className="text-lg font-bold text-indigo-900">
              ₹
              {formatToIndianCurrency(
                property?.property_for === "Rent"
                  ? property?.monthly_rent
                  : property?.property_cost
              )?.toLocaleString()}
            </p>
            {property?.property_cost_type && (
              <span className="text-sm text-gray-600 font-medium">
                ({property.property_cost_type})
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 w-full">
          <div>
            <p className="text-xs text-left font-semibold text-gray-400 uppercase tracking-wide mt-1">
              Construction Pvt Ltd...
            </p>
            <p className="text-xs text-left font-semibold text-gray-600 mt-1">
              {property?.google_address}
            </p>
          </div>
          <div className="text-sm text-blue-00 text-left md:text-right">
            {property?.loan_facility === "Yes" ? (
              <span className="text-sm font-bold text-[#A4A4A4]">
                EMI option Available
              </span>
            ) : (
              <span className="text-sm font-bold text-[#A4A4A4]">
                One Time Payment
              </span>
            )}
            <br />
            <span className="text-xs font-semibold text-gray-400">
              All Inclusive Price
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-800 font-medium">
            <span className=" h-4 border-gray-300">
              {property.sub_type === "Apartment"
                ? `${property.bedrooms} BHK ${
                    property.property_type
                      ? property.property_type
                      : property.sub_type || ""
                  } for ${
                    property.property_for === "Sell"
                      ? "Sale"
                      : property?.property_for
                  }`
                : `${property.sub_type}`}{" "}
            </span>
            {property?.land_sub_type && property?.sub_type === "Land" && (
              <>
                <span className="border-l h-4 border-gray-300"></span>
                <span> {property.land_sub_type} </span>
              </>
            )}
            {property?.builtup_area && (
              <>
                <span className="border-l h-4 border-gray-300"></span>
                <span>
                  Built-up Area: {formatValue(property.builtup_area)}{" "}
                  {property.area_units}
                </span>
              </>
            )}
            {property?.sub_type === "Plot" && (
              <>
                <span className="border-l h-4 border-gray-300"></span>
                <span>
                  Plot Area: {formatValue(property.plot_area)}{" "}
                  {property.area_units}
                </span>
              </>
            )}
            {property?.facing && (
              <>
                <span className="border-l h-4 border-gray-300"></span>
                <span>{property.facing} Facing</span>
                <span className="border-l h-4 border-gray-300"></span>
              </>
            )}
            {(property.sub_type === "Apartment" ||
              property.sub_type === "Independent Villa") && (
              <>
                {property?.occupancy === "Ready to move" ? (
                  <span>Ready to move</span>
                ) : property?.occupancy === "Under Construction" &&
                  property?.under_construction ? (
                  <span>Under Construction</span>
                ) : null}
              </>
            )}
            {(property.sub_type === "Apartment" ||
              property.sub_type === "Independent Villa") && (
              <>
                {property?.occupancy === "Under Construction" &&
                property?.under_construction ? (
                  <>
                    <span className="border-l h-4 border-gray-300"></span>
                    <span>
                      Possession Starts - {""}
                      {new Date(property.under_construction).toLocaleString(
                        "default",
                        {
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </>
                ) : null}
              </>
            )}
            {property.sub_type === "Plot" && (
              <>
                <span>
                  {property.possession_status?.toLowerCase() === "immediate"
                    ? "Immediate"
                    : "Future"}
                </span>
              </>
            )}
            <span className="border-l h-4 border-gray-300"></span>
            <span className="flex items-center gap-1">
              <MdOutlineVerified className="text-xl text-green-500" />
              <p>RERA</p>
            </span>
          </div>
          <div className="flex flex-wrap justify-between sm:flex-nowrap  mt-4 sm:mt-2">
            <button
              onClick={handleChatClick}
              className="w-[48%] h-10 bg-transparent flex items-center justify-center gap-1 text-green-500 border cursor-pointer border-green-500 text-sm px-6 py-2 rounded-lg"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={handleContactSeller}
              disabled={
                submittedStates[property?.unique_property_id]?.contact ||
                contacted.includes(property.unique_property_id)
              }
              className={`w-[48%] h-10 bg-[#EC6F51] items-left hover:bg-[#d85e43] text-white text-sm px-5 py-2 cursor-pointer rounded-lg ${
                submittedStates[property?.unique_property_id]?.contact ||
                contacted.includes(property.unique_property_id)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {submittedStates[property?.unique_property_id]?.contact ||
              contacted.includes(property.unique_property_id)
                ? "Submitted"
                : "Contact"}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <img
          src={
            mainImage
              ? mainImage
              : `https://placehold.co/600x400?text=${
                  property?.property_name || "No Image Found"
                }`
          }
          alt="Property Image"
          className="w-full h-auto md:h-[500px] object-cover rounded-2xl shadow-md"
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.src = `https://placehold.co/600x400?text=${
              property?.property_name || "No Image Found"
            }`;
          }}
        />
        {images.length > 1 && (
          <div className="mt-4">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              pagination={{ clickable: true, el: ".swiper-pagination-custom" }}
              slidesPerView={4}
              spaceBetween={16}
              className="mySwiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`${img.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    crossOrigin="anonymous"
                    className="w-full h-20 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all"
                    onClick={() => setMainImage(`${img.url}`)}
                  />
                </SwiperSlide>
              ))}
              <div className="flex justify-center items-center gap-6 mt-6 max-w-fit mx-auto">
                <button className="swiper-button-prev-custom">
                  <FaAngleLeft className="w-6 h-6 p-1 border border-gray-400 rounded-full hover:bg-gray-200" />
                </button>
                <div className="swiper-pagination-custom flex justify-center"></div>
                <button className="swiper-button-next-custom">
                  <FaAngleRight className="w-6 h-6 p-1 border border-gray-400 rounded-full hover:bg-gray-200" />
                </button>
              </div>
            </Swiper>
          </div>
        )}
      </div>
      {floorplan?.image && (
        <div>
          <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
            Floor Plan
          </h2>
          <div className="bg-[#F9F9F9] rounded-xl border border-gray-300 shadow-sm px-6 py-5 hover:shadow-md transition">
            <img
              src={`https://api.meetowner.in/aws/v1/s3/uploads/${floorplan?.image}`}
              alt="FloorPlan"
              crossOrigin="anonymous"
              className="w-full object- h-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400?text=${"No Floor Plan Found"}`;
              }}
            />
          </div>
        </div>
      )}
      {facilitiesList && (
        <div>
          <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
            Amenities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-[#F9F9F9] rounded-xl border border-gray-300 shadow-sm px-6 py-5 hover:shadow-md transition">
            {facilitiesList.map((facility, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-center gap-2 p-4 text-[#4B1D1D]"
              >
                <div className="w-6 h-6">
                  {facilityIconMap[facility] || getFallbackIcon(facility)}
                </div>
                <span className="text-sm text-center md:text-left">
                  {facility}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {aroundProperty && aroundProperty.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl text-left font-semibold text-indigo-800 ">
            Property Location
          </h2>
          <p className="text-left text-sm text-gray-600 mb-4">
            {property?.google_address}
          </p>
          <div className="bg-[#F9F9F9] rounded-xl border border-gray-300 shadow-sm px-4 py-3 hover:shadow-md transition">
            <h2 className="text-xl text-center font-semibold text-indigo-800 mb-2">
              Around This Property
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {aroundProperty.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded-xl border border-gray-300 shadow-sm px-5 py-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <div className="text-red-600 text-xl">
                      {getPlaceIcon(place.title)}
                    </div>
                    <span className="text-gray-800 font-medium text-xs">
                      {place.title}
                    </span>
                  </div>
                  <span className="bg-[#004B87] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {formatDistance(place.distance)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-xl text-left font-semibold text-indigo-800 mb-5">
          Property Overview
        </h2>
        <div className="bg-[#F9F9F9] rounded-xl  border border-gray-300 shadow-sm px-10 py-6 hover:shadow-lg transition">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {overviewItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="text-[#4B1D1D] text-lg">{item.icon}</div>
                <div className="flex flex-col">
                  <div className="text-gray-700 font-bold text-md text-left">
                    {item.label}
                  </div>
                  <div className="text-gray-900 font-semibold text-sm text-left">
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl text-left font-semibold text-indigo-800 mb-2">
          Explore Map
        </h2>
        <div className="w-full h-74 rounded overflow-hidden shadow">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              property?.google_address
            )}&output=embed`}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      {showScrollTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition z-10"
        >
          <ChevronUp className="w-6 h-6 text-[#1D3A76]" />
        </div>
      )}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30 backdrop-blur-xs">
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
    </div>
  );
};
export default PropertyBody;
