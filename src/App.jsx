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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
