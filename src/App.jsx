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
            </Routes>
          </UserProfileCheckWrapper>
        </Router>
      </HelmetProvider>
    </Provider>
  );
}
export default App;
