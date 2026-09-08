import { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Luggage,
  Sparkles,
} from "lucide-react";
import { getWeather } from "../../../services/api.js";

function WeatherCard({ destination }) {

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const getWeatherInfo = (code) => {

    if (code === 0)
      return {
        text: "Sunny",
        gradient: "from-sky-500 to-blue-700",
        icon: <Sun size={60} className="text-yellow-300 drop-shadow-lg" />,
        smallIcon: <Sun size={18} className="text-yellow-500" />,
      };

    if (code === 1)
      return {
        text: "Mainly Clear",
        gradient: "from-sky-500 to-indigo-700",
        icon: <CloudSun size={60} className="text-yellow-200" />,
        smallIcon: <CloudSun size={18} />,
      };

    if (code === 2)
      return {
        text: "Partly Cloudy",
        gradient: "from-slate-500 to-slate-700",
        icon: <CloudSun size={60} className="text-white" />,
        smallIcon: <CloudSun size={18} />,
      };

    if ([3, 45, 48].includes(code))
      return {
        text: "Overcast",
        gradient: "from-slate-600 to-slate-800",
        icon: <Cloud size={60} className="text-white" />,
        smallIcon: <Cloud size={18} />,
      };

    if ([51, 53, 55].includes(code))
      return {
        text: "Drizzle",
        gradient: "from-blue-700 to-slate-900",
        icon: <CloudDrizzle size={60} className="text-blue-100" />,
        smallIcon: <CloudDrizzle size={18} />,
      };

    if ([61, 63, 65, 80, 81, 82].includes(code))
      return {
        text: "Rain",
        gradient: "from-blue-800 to-slate-900",
        icon: <CloudRain size={60} className="text-blue-100" />,
        smallIcon: <CloudRain size={18} />,
      };

    if ([71, 73, 75, 77, 85, 86].includes(code))
      return {
        text: "Snow",
        gradient: "from-cyan-500 to-sky-700",
        icon: <CloudSnow size={60} className="text-white" />,
        smallIcon: <CloudSnow size={18} />,
      };

    if ([95, 96, 99].includes(code))
      return {
        text: "Thunderstorm",
        gradient: "from-indigo-900 to-slate-900",
        icon: <CloudLightning size={60} className="text-yellow-300 animate-pulse" />,
        smallIcon: <CloudLightning size={18} />,
      };

    return {
      text: "Cloudy",
      gradient: "from-blue-600 to-purple-700",
      icon: <Cloud size={60} className="text-white" />,
      smallIcon: <Cloud size={18} />,
    };
  };

  const getUVLabel = (uv) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await getWeather(destination);
        if (response?.success && response?.data) {
          setWeather(response.data.current);
          setForecast(response.data.forecast || []);
        } else {
          setWeather(null);
          setForecast([]);
        }
      } catch (err) {
        console.warn("Weather API call failed:", err);
        setWeather(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeatherData();
    }
  }, [destination]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
        <p className="text-gray-500">
          Loading weather...
        </p>
      </div>
    );
  }

  if (!weather) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-10 text-center">
      <p className="text-red-500 font-medium">
        Weather service is temporarily unavailable.
      </p>

      <p className="text-gray-500 mt-2 text-sm">
        Please try again later.
      </p>
    </div>
  );
}

  const weatherInfo = weather
    ? getWeatherInfo(weather.weather_code)
    : getWeatherInfo(0);

  const rainyDay = forecast.find(
    (day) => day.precipitation > 60
  );
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm">

      {/* Top Weather Section */}

      <div
        className={`bg-gradient-to-br ${weatherInfo.gradient} p-6 text-white`}
      >

        <div className="flex justify-between items-start">

          <div>

            <p className="text-sm font-semibold text-white/80">
              {destination} •{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>

            <h1 className="text-4xl font-bold tracking-tight leading-none mt-2">
              {Math.round(weather.temperature_2m)}°C
            </h1>

            <p className="mt-2 text-sm opacity-95">
              {weatherInfo.text} • Feels like{" "}
              {Math.round(weather.apparent_temperature)}°C
            </p>

          </div>

          {weatherInfo.icon}

        </div>

        {/* Stats */}

        <div className="grid grid-cols-3 gap-3 mt-6">

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">

            <Wind
              className="mx-auto mb-2"
              size={16}
            />

            <p className="text-xs opacity-80">
              Wind
            </p>

            <p className="font-semibold text-xs">
              {Math.round(weather.wind_speed_10m)} km/h
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">

            <Droplets
              className="mx-auto mb-2"
              size={16}
            />

            <p className="text-xs opacity-80">
              Humidity
            </p>

            <p className="font-semibold text-xs">
              {weather.relative_humidity_2m}%
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">

            <Thermometer
              className="mx-auto mb-2"
              size={16}
            />

            <p className="text-xs opacity-80">
              UV Index
            </p>

            <p className="font-semibold text-xs">
              {weather.uv_index} ({getUVLabel(weather.uv_index)})
            </p>

          </div>

        </div>

      </div>

      {/* Forecast */}

      <div className="p-5">

        <h3 className="font-semibold text-xs tracking-wide text-gray-500 mb-4">

          7-DAY FORECAST

        </h3>

        <div className="space-y-2">

          {forecast.map((item, index) => (

            <div
              key={index}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${index === 0
                  ? "bg-gray-100"
                  : ""
                }`}
            >

              <div className="flex items-center gap-3">

                <span className="font-medium text-xs w-8">
                  {item.day}
                </span>

                <span>
                  {getWeatherInfo(item.weatherCode).smallIcon}
                </span>

                <span className="text-xs text-gray-600">
                  {getWeatherInfo(item.weatherCode).text}
                </span>

              </div>

              <div className="flex items-center gap-3">

                <span className="text-xs font-medium">
                  {item.high}° {item.low}°
                </span>

                {item.precipitation > 0 && (

                  <span className="text-blue-500 text-xs font-semibold">

                    💧 {item.precipitation}%

                  </span>

                )}

              </div>

            </div>

          ))}

        </div>

        {/* Smart Weather Alert */}

        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">

          {rainyDay ? (

            <>

              <p className="font-semibold text-amber-900 text-sm">

                🌧 Rain expected on {rainyDay.day}

              </p>

              <p className="text-xs text-amber-800 mt-1">

                Carry an umbrella and keep indoor attractions as backup.

              </p>

            </>

          ) : weather.weather_code === 95 ? (

            <>

              <p className="font-semibold text-amber-900 text-sm">

                ⛈ Thunderstorm Alert

              </p>

              <p className="text-xs text-amber-800 mt-1">

                Outdoor activities may be affected today.

              </p>

            </>

          ) : weather.temperature_2m >= 35 ? (

            <>

              <p className="font-semibold text-amber-900 text-sm">

                🔥 Hot Weather

              </p>

              <p className="text-xs text-amber-800 mt-1">

                Stay hydrated and avoid direct sun during midday.

              </p>

            </>

          ) : (

            <>

              <p className="font-semibold text-green-700 text-sm">

                ☀ Great Weather Ahead

              </p>

              <p className="text-xs text-green-600 mt-1">

                No significant rain expected. Perfect for sightseeing.

              </p>

            </>

          )}

        </div>

        {/* Smart Packing Advisory */}
        {weather && (() => {
          const temp = weather.temperature_2m;
          const code = weather.weather_code;
          const isRain = rainyDay || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code);
          const isSnow = [71, 73, 75, 77, 85, 86].includes(code);

          let attire = "Lightweight comfortable clothing & sneakers";
          if (isSnow || temp < 8) {
            attire = "Heavy thermal jacket, beanie & insulated boots";
          } else if (temp < 18) {
            attire = "Light layers, windbreaker & walking shoes";
          } else if (temp > 28) {
            attire = "Breathable fabrics, sunhat & sunglasses";
          }

          const items = [];
          if (isRain) items.push("Compact umbrella", "Waterproof shoes");
          if (weather.uv_index >= 5) items.push("SPF 50+ Sunscreen");
          if (temp > 25) items.push("Electrolyte water bottle");
          if (temp < 16) items.push("Warm scarf / fleece");
          if (items.length === 0) items.push("Sunglasses", "Daypack");

          return (
            <div className="mt-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                <Luggage size={14} className="text-indigo-600" />
                <span>Smart Packing Advisory</span>
              </div>
              <p className="text-xs text-indigo-950 font-medium">
                {attire}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 bg-white border border-indigo-200 text-indigo-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-2xs"
                  >
                    <Sparkles size={10} className="text-indigo-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}

      </div>

    </div>
  );

}

export default WeatherCard;