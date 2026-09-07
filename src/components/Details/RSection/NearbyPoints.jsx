import { useState, useEffect } from "react";
import {
  Eye,
  Landmark,
  Trees,
  Compass,
  ChevronRight,
  AlertCircle,
  RotateCw,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";
import { getNearbyPlaces } from "../../../services/api.js";

const CATEGORIES = ["All", "Sightseeing", "Museums", "Parks", "Historic"];

const getDefaultFallbacks = (destination) => [
  {
    name: `${destination || "City"} Historic Center`,
    type: "Historic",
    category: "Historic Landmarks",
    distance: "0.9 km",
    rating: 4.8,
    description: `Must-visit heritage quarter and walking square in ${destination || "the city"}.`,
  },
  {
    name: `${destination || "City"} Cultural Museum`,
    type: "Museum",
    category: "Culture & Museums",
    distance: "1.5 km",
    rating: 4.8,
    description: `Premier exhibits showcasing regional history and fine arts.`,
  },
  {
    name: `${destination || "City"} Botanical Park`,
    type: "Park",
    category: "Parks & Nature",
    distance: "2.3 km",
    rating: 4.7,
    description: `Expansive botanical gardens and serene walking paths.`,
  },
  {
    name: `${destination || "City"} Viewpoint & Citadel`,
    type: "Viewpoint",
    category: "Sightseeing",
    distance: "3.1 km",
    rating: 4.9,
    description: `Panoramic vista looking out across ${destination || "the region"} and surrounding landscape.`,
  },
];

function NearbyPoints({ destination }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegion, setIsRegion] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const getIcon = (type = "") => {
    const text = type.toLowerCase();

    if (
      text.includes("museum") ||
      text.includes("gallery") ||
      text.includes("art")
    ) {
      return Eye;
    }

    if (
      text.includes("temple") ||
      text.includes("shrine") ||
      text.includes("historic") ||
      text.includes("castle") ||
      text.includes("palace") ||
      text.includes("church") ||
      text.includes("monument")
    ) {
      return Landmark;
    }

    if (
      text.includes("park") ||
      text.includes("garden") ||
      text.includes("forest") ||
      text.includes("nature")
    ) {
      return Trees;
    }

    return Compass;
  };

  const getTypeBadgeStyle = (type = "") => {
    const text = type.toLowerCase();
    if (text.includes("museum") || text.includes("gallery")) {
      return "bg-purple-50 text-purple-700 border-purple-100";
    }
    if (text.includes("historic") || text.includes("temple") || text.includes("castle")) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }
    if (text.includes("park") || text.includes("garden") || text.includes("nature")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }
    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  useEffect(() => {
    let isMounted = true;

    if (!destination) {
      return;
    }

    const loadPlaces = async () => {
      try {
        const response = await getNearbyPlaces(destination);
        if (!isMounted) return;
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          setPlaces(response.data);
          setIsRegion(Boolean(response.isRegion));
          setError(null);
        } else if (response && response.data && Array.isArray(response.data)) {
          setPlaces(response.data);
          setIsRegion(Boolean(response.isRegion));
          setError(null);
        } else {
          throw new Error("No nearby points found for this location.");
        }
      } catch (err) {
        if (!isMounted) return;
        console.warn("Nearby places notice:", err.message);
        setError("Unable to load real-time points from map services.");
        setPlaces(getDefaultFallbacks(destination));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPlaces();

    return () => {
      isMounted = false;
    };
  }, [destination]);

  const handleRefresh = async () => {
    if (!destination) return;
    setLoading(true);
    setError(null);

    try {
      const response = await getNearbyPlaces(destination);
      if (response && response.data && Array.isArray(response.data)) {
        setPlaces(response.data);
        setIsRegion(Boolean(response.isRegion));
      } else {
        throw new Error("No places returned");
      }
    } catch (err) {
      console.warn("Nearby places refresh notice:", err.message);
      setError("Unable to refresh points from map services.");
      setPlaces(getDefaultFallbacks(destination));
    } finally {
      setLoading(false);
    }
  };

  // Filter places based on activeCategory
  const filteredPlaces = places.filter((place) => {
    if (activeCategory === "All") return true;
    const cat = (place.category || "").toLowerCase();
    const typ = (place.type || "").toLowerCase();

    if (activeCategory === "Sightseeing") {
      return cat.includes("sightseeing") || typ.includes("viewpoint") || typ.includes("landmark") || typ.includes("attraction");
    }
    if (activeCategory === "Museums") {
      return cat.includes("museum") || typ.includes("museum") || typ.includes("gallery") || typ.includes("art");
    }
    if (activeCategory === "Parks") {
      return cat.includes("park") || typ.includes("park") || typ.includes("garden") || typ.includes("nature");
    }
    if (activeCategory === "Historic") {
      return cat.includes("historic") || typ.includes("historic") || typ.includes("temple") || typ.includes("castle") || typ.includes("palace");
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 max-w-3xl shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              Nearby Points of Interest
            </h2>
            {isRegion && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles size={12} />
                Regional
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Top attractions, historic monuments, museums, and green spaces in {destination}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          title="Refresh nearby places"
          className="self-start sm:self-auto p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition cursor-pointer disabled:opacity-50"
        >
          <RotateCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error state notice (subtle banner, never blocks rendering) */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-amber-600" />
            <span>{error} Showing curated recommendations below.</span>
          </div>
          <button
            onClick={handleRefresh}
            className="underline font-semibold hover:text-amber-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-4 animate-pulse"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPlaces.length === 0 ? (
        /* Empty Filter State */
        <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl border border-gray-100">
          <Compass size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="font-semibold text-gray-700 text-sm">
            No places found under &ldquo;{activeCategory}&rdquo;
          </p>
          <p className="text-xs text-gray-500 mt-1 mb-3">
            Try switching to &ldquo;All&rdquo; to explore all highlights.
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            View All Places
          </button>
        </div>
      ) : (
        /* Grid of Places */
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPlaces.map((place, index) => {
            const Icon = getIcon(place.type);
            const badgeStyle = getTypeBadgeStyle(place.type);

            return (
              <div
                key={place.id || index}
                className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-3 transition-all duration-200 hover:shadow-md group cursor-pointer"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm text-indigo-600 group-hover:bg-indigo-50 transition">
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-indigo-600 transition">
                      {place.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${badgeStyle}`}>
                        {place.type || "Attraction"}
                      </span>

                      {place.distance && (
                        <span className="text-gray-500 text-xs flex items-center gap-1 font-medium">
                          <MapPin size={11} className="text-gray-400" />
                          {place.distance}
                        </span>
                      )}

                      {place.rating && (
                        <span className="text-amber-600 text-xs flex items-center gap-0.5 font-semibold">
                          <Star size={11} className="fill-amber-500 text-amber-500" />
                          {place.rating}
                        </span>
                      )}
                    </div>

                    {place.description && (
                      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-indigo-600 shrink-0 mt-2 transition"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NearbyPoints;