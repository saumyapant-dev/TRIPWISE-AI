import { useLocation } from "react-router-dom";
import Tnavbar from "../components/Tnavbar";
import Hero from "../components/Details/Hero";
import LSection from "../components/Details/LSection/LSection";
import RSection from "../components/Details/RSection/RSection";
import ChatButton from "../components/Details/ChatButton";

function TripDetails() {
  const location = useLocation();

  console.log(location.state);

  const {
    city,
    destination,
    budget,
    duration,
    fromDate,
    toDate,
    travelStyle,
    preferences,
    tripData,
  } = location.state || {};

  const parsedTripData =
  typeof tripData === "string"
    ? JSON.parse(tripData)
    : tripData;

  console.log("tripData =", tripData);

  return (
    <div>
      <Tnavbar />

      <Hero
        city={city}
        destination={destination}
        budget={budget}
        duration={duration}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="grid grid-cols-3 gap-6 mt-8">
          <LSection tripData={parsedTripData} />
          <RSection tripData={parsedTripData} />
        </div>

        <ChatButton />
      </div>
    </div>
  );
}

export default TripDetails;