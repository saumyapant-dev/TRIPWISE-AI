import WeatherCard from "./WeatherCard";
import BudgetCard from "./BudgetCard";
import TravelTips from "./TravelTips";
import QuickActions from "./QuickActions";
import ExploreMapWeather from "./ExploreMapWeather";

const RSection = () => {
  return (
    <div className="space-y-6">
      <WeatherCard />
      <BudgetCard />
      <TravelTips />
      <QuickActions />
      <ExploreMapWeather />
    </div>
  );
};

export default RSection;