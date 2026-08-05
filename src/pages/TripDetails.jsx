import StatsCards from "../components/Details/RSection/StatsCards";
import TripHighlights from "../components/Details/RSection/TripHighlights";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import NearbyPoints from "../components/Details/RSection/NearbyPoints";

import Tnavbar from "../components/Tnavbar";
import Hero from "../components/Details/Hero";
import Itinerary from "../components/Details/LSection/Itinerary";
import ChatButton from "../components/Details/ChatButton";

import WeatherCard from "../components/Details/RSection/WeatherCard";
import BudgetCard from "../components/Details/RSection/BudgetCard";
import TravelTips from "../components/Details/RSection/TravelTips";
import DailySpending from "../components/Details/RSection/DailySpending";
import ViewFullItinerary from "../components/Details/RSection/ViewFullItinerary";
import ExploreMapWeather from "../components/Details/RSection/ExploreMapWeather";
import InteractiveMap from "../components/Details/Explore/InteractiveMap";
import CuratedTrips from "../components/CuratedTrips";

function TripDetails() {
  const location = useLocation();

  console.log(location.state);

  const [activeTab, setActiveTab] = useState("overview");

  const {
    city,
    destination,
    budget,
    duration,
    imageUrl,
    tripData,
    fromDate,
    toDate
  } = location.state || {};

  let parsedTripData = tripData;

  console.log("PARSED:", parsedTripData);
  console.log("BUDGET:", parsedTripData?.budgetBreakdown);

  if (typeof tripData === "string") {
    try {
      const cleanedText = tripData
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      parsedTripData = JSON.parse(cleanedText);
    } catch (error) {
      console.log("JSON Parse Error:", error);
      console.log("Trip Data:", tripData);
    }
  }

  console.log(parsedTripData);

  const budgetData = [
    {
      name: "Flights",
      value: parsedTripData?.budgetBreakdown?.flights || 0,
      color: "#2563eb",
    },
    {
      name: "Hotels",
      value: parsedTripData?.budgetBreakdown?.hotels || 0,
      color: "#4f46e5",
    },
    {
      name: "Food",
      value: parsedTripData?.budgetBreakdown?.food || 0,
      color: "#06b6d4",
    },
    {
      name: "Transport",
      value: parsedTripData?.budgetBreakdown?.transport || 0,
      color: "#f59e0b",
    },
    {
      name: "Activities",
      value: parsedTripData?.budgetBreakdown?.activities || 0,
      color: "#22c55e",
    },
    {
      name: "Shopping",
      value: parsedTripData?.budgetBreakdown?.shopping || 0,
      color: "#ea580c",
    },
  ];



  const spendingData =
    parsedTripData?.dailySpending || [];

  const travelTips =
    parsedTripData?.travelTips || [];

  const highestDay = spendingData.reduce(
    (max, day) =>
      day.amount > max.amount ? day : max,
    spendingData[0]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Tnavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "overview" && (
        <Hero
          city={city}
          destination={destination}
          budget={budget}
          duration={duration}
          imageUrl={imageUrl}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">

        {activeTab === "overview" && (
          <StatsCards
            duration={duration}
            budget={budget}
            city={city}
            fromDate={fromDate}
            toDate={toDate}
          />
        )}

        {activeTab === "overview" && <div className="h-8" />}

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mb-8 items-start">

              <div className="space-y-6">
                <BudgetCard budgetData={budgetData} />
                <DailySpending
                  spendingData={spendingData}
                  highestDay={highestDay}
                />
              </div>

              <div className="space-y-5">

                <TripHighlights
                  highlights={parsedTripData.tripHighlights}
                />

                <ViewFullItinerary />

                <ExploreMapWeather />

              </div>

            </div>



            <div className="mt-6">
              <TravelTips
                tips={parsedTripData.travelTips}
              />
            </div>
          </>
        )}

        {/* ITINERARY */}
        {activeTab === "itinerary" && (
          <div className="mb-8">
            <Itinerary
              tripData={parsedTripData}
              duration={duration}
            />
          </div>
        )}

        {/* EXPLORE */}
        {activeTab === "explore" && (
          <div className="space-y-8">

            {/* Header */}

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-0.3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 text-white text-sm font-medium mb-4">
                🗺️ Explore & Discover
              </div>

              <h1 className="text-3xl font-bold">
                Explore Your Destinations
              </h1>

              <p className="text-gray-500 mt-1 text-base">
                Maps, weather, attractions and restaurants for your trip
              </p>
            </div>

            {/* City Tabs */}

            <div className="flex flex-wrap gap-3 mt-6">

              {[destination, ...(tripData?.tripHighlights?.nearbyPlaces || [])]
                .filter(Boolean)
                .slice(0, 5)
                .map((place, index) => (

                  <button
                    key={index}
                    className={`px-5 py-2 rounded-full border transition
        ${index === 0
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {place}
                  </button>

                ))}

            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">

              {/* LEFT SIDE */}
              <div className="space-y-6">
                <InteractiveMap destination={destination} />
                <NearbyPoints destination={destination} />
              </div>

              {/* RIGHT SIDE */}
              <WeatherCard destination={destination} />

            </div>
            <CuratedTrips destination={destination} />
          </div>
        )}
      </div>

      <ChatButton />
    </div>
  );
}

export default TripDetails;