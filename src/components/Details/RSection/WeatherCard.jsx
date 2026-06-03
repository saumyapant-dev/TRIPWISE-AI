import { Cloud } from "lucide-react";

const WeatherCard = () => {
  const forecast = [
    { day: "Mon", temp: "22°C", icon: "☀️" },
    { day: "Tue", temp: "22°C", icon: "☀️" },
    { day: "Wed", temp: "22°C", icon: "☀️" },
    { day: "Thu", temp: "22°C", icon: "☀️" },
    { day: "Fri", temp: "22°C", icon: "☀️" },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Cloud className="text-green-500" size={24} />
        <h3 className="text-lg font-semibold">
          Weather Forecast
        </h3>
      </div>

      <div className="space-y-4">
        {forecast.map((item) => (
          <div
            key={item.day}
            className="bg-gray-200 rounded-2xl px-4 py-3 flex justify-between items-center"
          >
            <span className="text-base font-medium">
              {item.day}
            </span>

            <div className="flex items-center gap-4">
              <span className="text-2xl">
                {item.icon}
              </span>

              <span className="text-base font-medium">
                {item.temp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;