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
function Home() {
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
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginWrapper />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property" element={<Property />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
