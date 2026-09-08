import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Sparkles } from "lucide-react";
import { generateTrip, searchCities } from "../../services/api.js";
import { filterDestinations, findDestinationByCity } from "../../data/destinations.js";

const Form = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // All fields are strictly empty by default - no hardcoded defaults
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState(() => {
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("destination") || "";
  });
  const [selectedDestinationData, setSelectedDestinationData] = useState(() => {
    const params = new URLSearchParams(location.search || window.location.search);
    const qDest = params.get("destination");
    return qDest ? findDestinationByCity(qDest) : null;
  });

  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [preferences, setPreferences] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  // Autocomplete suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const destinationRef = useRef(null);

  // Original 6 travel style cards
  const styles = [
    { name: "Beach & Relaxation", icon: "🏖️" },
    { name: "Adventure", icon: "⛰️" },
    { name: "Culture", icon: "🏛️" },
    { name: "Food & Culinary", icon: "🍜" },
    { name: "City Exploration", icon: "🏙️" },
    { name: "Wildlife", icon: "🦁" },
  ];

  // Close destination suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (destinationRef.current && !destinationRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle destination typing with instant local search and debounced worldwide search
  const handleDestinationChange = (val) => {
    setDestination(val);
    setErrorBanner(null);

    if (!val.trim()) {
      setSuggestions([]);
      setSelectedDestinationData(null);
      setShowSuggestions(false);
      return;
    }

    // 1. Instant local search from 178 global & Indian cities dataset
    const local = filterDestinations({ search: val.trim() });
    setSuggestions(local.slice(0, 10));
    setShowSuggestions(true);

    // 2. Concurrently query backend for worldwide geocoded cities
    if (val.trim().length >= 2) {
      searchCities(val.trim())
        .then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            setSuggestions((current) => {
              const map = new Map();
              for (const item of current) {
                map.set(`${item.city.toLowerCase()}_${item.country.toLowerCase()}`, item);
              }
              for (const item of res.data) {
                const key = `${item.city.toLowerCase()}_${item.country.toLowerCase()}`;
                if (!map.has(key)) map.set(key, item);
              }
              return Array.from(map.values()).slice(0, 12);
            });
          }
        })
        .catch(() => {
          // Retain local matches if remote search fails
        });
    }
  };

  const handleSelectDestination = (item) => {
    setDestination(`${item.city}, ${item.country}`);
    setSelectedDestinationData(item);
    setShowSuggestions(false);
    setErrorBanner(null);
  };

  // Toggle travel style card selection
  const handleToggleStyle = (styleName) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleName)) {
        return prev.filter((s) => s !== styleName);
      } else {
        return [...prev, styleName];
      }
    });
    setErrorBanner(null);
  };

  const handleGenerateTrip = async () => {
    setErrorBanner(null);

    // Form Validation: ensure all required fields are provided
    if (!city.trim()) {
      setErrorBanner("Please enter a Starting City.");
      return;
    }

    if (!destination.trim()) {
      setErrorBanner("Please enter or select a Destination.");
      return;
    }

    if (!budget || !budget.trim()) {
      setErrorBanner("Please enter a Total Budget.");
      return;
    }

    if (!duration || !duration.trim()) {
      setErrorBanner("Please enter a Trip Duration.");
      return;
    }

    if (selectedStyles.length === 0) {
      setErrorBanner("Please select at least one Travel Style.");
      return;
    }

    const parsedBudget = Number(budget);
    const parsedDuration = Number(duration);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      setErrorBanner("Budget must be a valid positive number.");
      return;
    }

    if (isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 30) {
      setErrorBanner("Trip duration must be between 1 and 30 days.");
      return;
    }

    setLoading(true);

    try {
      let targetDestination = destination.trim();
      let destCountry = selectedDestinationData?.country || "";
      let destRegion = selectedDestinationData?.region || "";
      let destCoords = selectedDestinationData?.coordinates || null;

      // If user typed city name directly without clicking a suggestion, resolve it
      if (!destCoords || !destCountry) {
        const match = findDestinationByCity(targetDestination);
        if (match) {
          destCountry = match.country;
          destRegion = match.region || "";
          destCoords = match.coordinates;
          if (!targetDestination.includes(",")) {
            targetDestination = `${match.city}, ${match.country}`;
          }
        }
      }

      let userId = null;
      try {
        const user = JSON.parse(localStorage.getItem("tripwise_user") || "null");
        userId = user?.id || null;
      } catch {
        // Guest user
      }

      const travelStyleStr = selectedStyles.join(", ");

      const response = await generateTrip({
        userId,
        city: city.trim(),
        destination: targetDestination,
        country: destCountry,
        region: destRegion,
        coordinates: destCoords,
        budget: parsedBudget,
        duration: parsedDuration,
        fromDate,
        toDate,
        travelStyle: travelStyleStr,
        preferences: preferences.trim() ? [preferences.trim(), ...selectedStyles] : selectedStyles,
      });

      if (response && response.success && response.data) {
        navigate(`/trip-details?id=${response.data.id}`, {
          state: response.data,
        });
      } else {
        throw new Error(response?.error || "Failed to generate trip itinerary.");
      }
    } catch (error) {
      console.error("Trip generation error:", error);
      setErrorBanner(
        error.message || "Failed to generate trip. Please check your backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
      {errorBanner && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm animate-in fade-in">
          <AlertCircle size={20} className="shrink-0 text-red-500" />
          <span>{errorBanner}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="origin-city" className="block mb-3 font-medium text-gray-700">
            📍 Starting City <span className="text-red-500">*</span>
          </label>
          <input
            id="origin-city"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setErrorBanner(null);
            }}
            placeholder="San Francisco, USA"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div className="relative" ref={destinationRef}>
          <label htmlFor="trip-destination" className="block mb-3 font-medium text-gray-700">
            📍 Destination <span className="text-red-500">*</span>
          </label>
          <input
            id="trip-destination"
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => {
              if (destination.trim()) setShowSuggestions(true);
            }}
            placeholder="Let AI surprise me!"
            autoComplete="off"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />

          {/* Search Suggestions Floating Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={`${item.city}-${item.region || ""}-${item.country}`}
                  onMouseDown={() => handleSelectDestination(item)}
                  className="px-5 py-3 text-sm hover:bg-purple-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition"
                >
                  <div className="truncate">
                    <span className="font-semibold text-gray-900">{item.city}</span>
                    {item.region && (
                      <span className="text-gray-500 text-xs ml-1.5 font-normal">
                        ({item.region})
                      </span>
                    )}
                    <span className="text-gray-400 text-xs ml-1.5">
                      • {item.country}
                    </span>
                  </div>
                  {item.coordinates && (
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                      {item.coordinates.lat.toFixed(1)}°, {item.coordinates.lon.toFixed(1)}°
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="trip-budget" className="block mb-3 font-medium text-gray-700">
            💰 Budget (USD) <span className="text-red-500">*</span>
          </label>
          <input
            id="trip-budget"
            type="number"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setErrorBanner(null);
            }}
            placeholder="2000"
            min="100"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label htmlFor="trip-duration" className="block mb-3 font-medium text-gray-700">
            📅 Trip Duration (Days) <span className="text-red-500">*</span>
          </label>
          <input
            id="trip-duration"
            type="number"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              setErrorBanner(null);
            }}
            placeholder="7"
            min="1"
            max="30"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label htmlFor="trip-from-date" className="block mb-3 font-medium text-gray-700">
            📅 Departure Date (Optional)
          </label>
          <input
            id="trip-from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label htmlFor="trip-to-date" className="block mb-3 font-medium text-gray-700">
            📅 Return Date (Optional)
          </label>
          <input
            id="trip-to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="font-medium text-gray-800 mb-6">
          Select Your Travel Style <span className="text-red-500">*</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {styles.map((style) => {
            const isSelected = selectedStyles.includes(style.name);
            return (
              <div
                key={style.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => handleToggleStyle(style.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleToggleStyle(style.name);
                  }
                }}
                className={`cursor-pointer border rounded-2xl p-6 text-center transition-all duration-300 select-none ${
                  isSelected
                    ? "border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-400"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className="text-3xl mb-2">{style.icon}</div>
                <p className="font-medium">{style.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <label htmlFor="trip-preferences" className="block mb-3 font-medium text-gray-700">
          Special Preferences (Optional)
        </label>
        <textarea
          id="trip-preferences"
          rows="5"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="E.g., I love museums, want to try local street food, prefer boutique accommodations..."
          className="w-full border border-gray-200 rounded-2xl p-5 resize-none outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
        />
      </div>

      <button
        onClick={handleGenerateTrip}
        disabled={loading}
        className="block mt-10 w-full py-5 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-center transition duration-300 ease-in-out hover:scale-105 disabled:opacity-60 cursor-pointer shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Crafting Your AI Itinerary...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={20} />
            Generate My Trip with AI
          </span>
        )}
      </button>

      <p className="text-center text-gray-500 mt-8 text-sm">
        🔒 Powered by TripWise AI Backend • Your preferences are private and secure
      </p>
    </div>
  );
};

export default Form;