import React from "react";
import WeatherCard from "./WeatherCard";
import BudgetCard from "./BudgetCard";
import TravelTips from "./TravelTips";
import QuickActions from "./QuickActions";
import SummaryCard from "./SummaryCard";
import ExploreMapWeather from "./ExploreMapWeather";

const RSection = () => {
  return (
    <div className="space-y-6">
      <WeatherCard />
      <BudgetCard />
      <TravelTips />
      <QuickActions />
      <SummaryCard />
      <ExploreMapWeather />
    </div>
  );
};

export default RSection;