import Tnavbar from "../components/Tnavbar";
import Hero from "../components/Details/Hero";
import LSection from "../components/Details/LSection/LSection";
import RSection from "../components/Details/RSection/RSection";
import ChatButton from "../components/Details/ChatButton";

function TripDetails() {
  return (
    <div>
        <Tnavbar />
        <Hero />
    <div className="max-w-7xl mx-auto px-6 py-8">
      
      
      <div className="grid grid-cols-3 gap-6 mt-8">
        <LSection />
        <RSection />
      </div>
      <ChatButton />
    </div>
    </div>
  );
}

export default TripDetails;