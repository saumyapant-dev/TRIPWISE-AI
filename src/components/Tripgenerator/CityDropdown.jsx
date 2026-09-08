import { useState, useRef, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Check,
  X,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  COUNTRIES_LIST,
  filterDestinations,
  findDestinationByCity,
} from "../../data/destinations.js";
import { searchCities } from "../../services/api.js";

const CityDropdown = ({
  id = "destination-city",
  label = "📍 Destination City",
  placeholder = "Search and select a city (e.g. Chandigarh, Gwalior, Athens, Paris)...",
  selectedCity = "",
  selectedCountry = "",
  selectedRegion = "",
  onChange,
  error = false,
  required = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCountry, setActiveCountry] = useState(selectedCountry || "ALL");
  const [prevSelectedCountry, setPrevSelectedCountry] = useState(selectedCountry);
  const [remoteResults, setRemoteResults] = useState([]);
  const [isSearchingRemote, setIsSearchingRemote] = useState(false);

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sync active country if selectedCountry prop changes externally
  if (selectedCountry && selectedCountry !== prevSelectedCountry) {
    setPrevSelectedCountry(selectedCountry);
    setActiveCountry(selectedCountry);
  }

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Instant local search (<1ms)
  const localCities = useMemo(() => {
    return filterDestinations({
      country: activeCountry,
      search: searchQuery,
    });
  }, [activeCountry, searchQuery]);

  // 2. Debounced remote geocoding search for worldwide coverage
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      setIsSearchingRemote(true);
      searchCities(query, activeCountry)
        .then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            setRemoteResults(res.data);
          }
        })
        .catch(() => {
          // Retain local matches if remote search fails
        })
        .finally(() => {
          setIsSearchingRemote(false);
        });
    }, 320);

    return () => clearTimeout(timer);
  }, [searchQuery, activeCountry]);

  // Combined and deduplicated list of results
  const displayedCities = useMemo(() => {
    const map = new Map();

    // Add local cities first (they have verified region & coordinates)
    for (const item of localCities) {
      const key = `${item.city.toLowerCase()}_${item.country.toLowerCase()}`;
      map.set(key, item);
    }

    // Merge remote results
    for (const item of remoteResults) {
      const key = `${item.city.toLowerCase()}_${item.country.toLowerCase()}`;
      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    return Array.from(map.values());
  }, [localCities, remoteResults]);

  const handleSelectCity = (dest) => {
    setActiveCountry(dest.country || "ALL");
    if (onChange) {
      onChange({
        city: dest.city,
        region: dest.region || "",
        country: dest.country,
        coordinates: dest.coordinates,
        displayName: `${dest.city}${dest.region ? ", " + dest.region : ""}, ${dest.country}`,
      });
    }
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClearSelection = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        city: "",
        region: "",
        country: "",
        coordinates: null,
        displayName: "",
      });
    }
    setActiveCountry("ALL");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label htmlFor={`${id}-trigger`} className="block mb-2 font-medium text-gray-700 text-sm">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Trigger Button */}
      <button
        id={`${id}-trigger`}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border text-left text-sm transition-all cursor-pointer bg-white ${
          error
            ? "border-red-500 ring-2 ring-red-100"
            : isOpen
            ? "border-purple-600 ring-2 ring-purple-100"
            : "border-gray-200 hover:border-purple-300"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <MapPin
            size={18}
            className={`shrink-0 ${
              selectedCity ? "text-purple-600" : "text-gray-400"
            }`}
          />
          {selectedCity ? (
            <div className="truncate">
              <span className="font-semibold text-gray-900">{selectedCity}</span>
              {selectedRegion && (
                <span className="text-gray-500 text-xs ml-1 font-normal">
                  , {selectedRegion}
                </span>
              )}
              {selectedCountry && (
                <span className="text-purple-700 text-xs ml-1.5 font-medium bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                  {selectedCountry}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 font-normal">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {selectedCity && (
            <span
              onClick={handleClearSelection}
              title="Clear selection"
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-purple-600" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header & Country Filter */}
          <div className="p-3.5 bg-gray-50/80 border-b border-gray-100 space-y-2.5">
            {/* Country Selector */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
              <Globe size={14} className="text-purple-600 shrink-0" />
              <span className="text-gray-500 font-medium shrink-0">Filter Country:</span>
              <select
                value={activeCountry}
                onChange={(e) => setActiveCountry(e.target.value)}
                className="w-full bg-transparent font-semibold text-gray-800 outline-none cursor-pointer truncate"
              >
                <option value="ALL">🌍 Worldwide (All Countries)</option>
                {COUNTRIES_LIST.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  if (val.trim().length < 2) {
                    setRemoteResults([]);
                    setIsSearchingRemote(false);
                  }
                }}
                placeholder={
                  activeCountry === "ALL"
                    ? "Type any city (e.g. Chandigarh, Gwalior, Athens, Paris)..."
                    : `Search cities in ${activeCountry}...`
                }
                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-14 py-2 text-xs text-gray-800 placeholder-gray-400 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
              />

              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {isSearchingRemote && (
                  <Loader2 size={13} className="text-purple-600 animate-spin" />
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setRemoteResults([]);
                      setIsSearchingRemote(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Popular Picks Bar if no search query */}
          {!searchQuery && activeCountry === "ALL" && (
            <div className="px-3.5 py-2 bg-purple-50/50 border-b border-purple-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="flex items-center gap-1 font-bold text-purple-700 shrink-0">
                <Sparkles size={12} /> Popular:
              </span>
              {[
                { city: "Chandigarh", country: "India" },
                { city: "Gwalior", country: "India" },
                { city: "Paris", country: "France" },
                { city: "Tokyo", country: "Japan" },
                { city: "Athens", country: "Greece" },
                { city: "Nairobi", country: "Kenya" },
                { city: "New York", country: "United States" },
                { city: "London", country: "United Kingdom" },
              ].map((p) => (
                <button
                  key={p.city}
                  type="button"
                  onClick={() => {
                    const match = findDestinationByCity(p.city);
                    if (match) handleSelectCity(match);
                  }}
                  className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-800 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition shrink-0 cursor-pointer"
                >
                  {p.city}
                </button>
              ))}
            </div>
          )}

          {/* City Options Scrollable List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 py-1">
            {displayedCities.length > 0 ? (
              displayedCities.map((item) => {
                const isSelected =
                  selectedCity.toLowerCase() === item.city.toLowerCase();

                return (
                  <div
                    key={`${item.id || item.city}-${item.country}`}
                    onClick={() => handleSelectCity(item)}
                    className={`px-4 py-2.5 flex items-center justify-between text-left text-xs cursor-pointer transition ${
                      isSelected
                        ? "bg-purple-50 text-purple-900 font-semibold"
                        : "hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin
                        size={15}
                        className={`shrink-0 ${
                          isSelected ? "text-purple-600" : "text-gray-400"
                        }`}
                      />
                      <div className="truncate">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-medium">{item.city}</span>
                          {item.region && (
                            <span className="text-gray-400 text-xs">
                              ({item.region})
                            </span>
                          )}
                          {item.popular && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                              Top Pick
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 font-normal truncate mt-0.5">
                          <span className="font-medium text-gray-700">{item.country}</span>
                          {item.coordinates && (
                            <span className="ml-1 text-gray-400">
                              • {item.coordinates.lat.toFixed(2)}°, {item.coordinates.lon.toFixed(2)}°
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 ml-2">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <MapPin size={20} />
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  No matching cities found
                </p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                  Try checking the spelling or switch the country filter to "Worldwide (All Countries)".
                </p>
              </div>
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="px-3.5 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>
              {displayedCities.length} {displayedCities.length === 1 ? "city" : "cities"} found
            </span>
            <span className="flex items-center gap-1">
              ✓ Verified global GPS coordinates
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDropdown;
