import { MapPin, ChevronRight } from "lucide-react";

const ExploreMapWeather = () => {
  return (
    <div className="border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition cursor-pointer">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">

            <MapPin
              size={20}
              className="text-white"
            />

          </div>

          <div>

            <h3 className="text-base font-semibold">
              Explore Map & Weather
            </h3>

            <p className="text-gray-500 text-xs">
              Sunny · 28°C · 5 POIs nearby
            </p>

          </div>

        </div>

        <ChevronRight
          size={24}
          className="text-gray-400"
        />

      </div>

    </div>
  );
};

export default ExploreMapWeather;