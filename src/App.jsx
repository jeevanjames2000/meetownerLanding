import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../App.css";
import Header from "./components/Header";
import Slider from "./components/Slider";
import SearchBar from "./components/SearchBar";
import Dealproperties from "./components/Dealproperties";
import HousingPicks from "./components/HousingPicks";
import HighDemandProjects from "./components/HighdemandProjects";
import RecommendedSellers from "./components/RecommendedSellers";
import ExclussiveCards from "./components/ExclussiveCards";
import Footer from "./components/Footer";
import Listings from "./listings/Listings";
import { Provider } from "react-redux";
import store from "../store/store";
import Property from "./property/Property";
import LoginWrapper from "./auth/LoginWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Careers from "./about/Carrers";
import TermsAndConditions from "./legal/termsAndConditions";
import About from "./legal/about";
import Services from "./legal/services";
import PrivacyAndPolicies from "./legal/privacy";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import Favourites from "./components/favourites";
import ProfileWrapper from "./profile/ProfileWrapper";
import { HelmetProvider } from "react-helmet-async";
import AppRedirect from "./components/AppRedirect";
import UserProfileCheckWrapper from "./utilities/UserProfileCheckWrapper";
import ContactUs from "./legal/contactUs";
import FooterLinks from "./utilities/FooterLinks";
function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const footerLinks = {
    "Properties for Buy": [
      {
        name: "Hyderabad",
        listings: [
          "House For Sale In Hyderabad",
          "House For Sale In LB Nagar",
          "House For Sale In Kondapur",
          "House For Sale In Gachibowli",
          "House For Sale In Kukatpally",
          "Flat For Sale In Manikonda",
          "Flat For Sale In Ameerpet",
          "Villa For Sale In Kompally",
          "Commercial Office For Sale In Hyderabad",
          "Commercial Office For Sale In LB Nagar",
          "Commercial Shop For Sale In Kondapur",
          "Office Space For Sale In Gachibowli",
          "Shop For Sale In Ameerpet",
          "Showroom For Sale In Kukatpally",
          "Commercial Space For Sale In Habsiguda",
          "Upcoming Project In Hyderabad",
          "Upcoming Project In LB Nagar",
          "Upcoming Project In Kondapur",
          "Upcoming Project In Bachupally",
          "Upcoming Project In Kompally",
          "Upcoming Project In Nallagandla",
          "Upcoming Project In TSPA Junction",
        ],
      },
    ],
    "Properties for Rent": [
      {
        name: "Hyderabad",
        listings: [
          "House for Rent in Hi-Tech City",
          "House for Rent in Kollur",
          "House for Rent in Patancheru",
          "House for Rent in Madhapur",
          "Flat for Rent in Kukatpally",
          "Flat for Rent in Gachibowli",
          "House for Rent in Tarnaka",
          "PG for Rent in SR Nagar",
          "Flat for Rent in Uppal",
          "Commercial Office For Rent In Hyderabad",
          "Commercial Office For Rent In LB Nagar",
          "Commercial Shop For Rent In Kondapur",
          "Office Space For Rent In Gachibowli",
          "Showroom For Rent In Madhapur",
          "Shop For Rent In Kukatpally",
          "Retail Space For Rent In KPHB",
          "Independent House For Rent In Hyderabad",
          "Independent House For Rent In LB Nagar",
          "Independent House For Rent In Kondapur",
          "Independent House For Rent In Gachibowli",
          "Independent House For Rent In Miyapur",
          "Independent House For Rent In Uppal",
        ],
      },
    ],
  };
  return (
    <>
      <Header />
      <SearchBar />
      <Slider />
      <Dealproperties />
      <HousingPicks />
      <HighDemandProjects />
      <RecommendedSellers />
      <ExclussiveCards />
      <FooterLinks links={footerLinks} basePath="/listings" />
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {showScrollTop && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition z-10"
        >
          <ChevronUp className="w-6 h-6 text-[#1D3A76]" />
        </div>
      )}
    </>
  );
}
function App() {
  const [loginTrigger, setLoginTrigger] = useState(0);
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        setLoginTrigger((prev) => prev + 1);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setLoginTrigger((prev) => prev + 1);
    }
  }, []);
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <UserProfileCheckWrapper loginTrigger={loginTrigger}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginWrapper />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/property" element={<Property />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/services" element={<Services />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyAndPolicies />} />
              <Route path="/profile" element={<ProfileWrapper />} />
              <Route path="/app" element={<AppRedirect />} />
              <Route path="/contactUs" element={<ContactUs />} />
            </Routes>
          </UserProfileCheckWrapper>
        </Router>
      </HelmetProvider>
    </Provider>
  );
}
export default App;
