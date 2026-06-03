import React from "react";
import WeatherCard from "./WeatherCard";
import BudgetCard from "./BudgetCard";
import TravelTips from "./TravelTips";
import QuickActions from "./QuickActions";

const RSection = () => {
  return (
    <div className="space-y-6">
      <WeatherCard />
      <BudgetCard />
      <TravelTips />
      <QuickActions />
    </div>
  );
};

export default RSection;