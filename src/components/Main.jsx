import "../../App.css";

import Header from "./Header";
import Slider from "./Slider";
import SearchBar from "./SearchBar";
import Dealproperties from "./Dealproperties";
import HousingPicks from "./HousingPicks";
import HighDemandProjects from "./HighdemandProjects";
import RecommendedSellers from "./RecommendedSellers";
import ExclussiveCards from "./ExclussiveCards";
import Footer from "./Footer";
export default Main =()=>{
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
    )
}