import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  Plane,
  X,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";

import StatsCards from "../components/Details/RSection/StatsCards";
import TripHighlights from "../components/Details/RSection/TripHighlights";
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
import { getTripById, saveTrip, updateTrip, deleteTrip } from "../services/api.js";
import { getDestinationCover } from "../services/unsplash.js";
import { findDestinationByCity } from "../data/destinations.js";

const CURRENCY_RATES = {
  USD: { symbol: "$", rate: 1 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
  INR: { symbol: "₹", rate: 86.5 },
  JPY: { symbol: "¥", rate: 152.0 },
};

const ALTERNATIVE_ACTIVITIES = [
  {
    activityTitle: "Artisan Coffee & Hidden Alleys Walk",
    description: "Stroll through historic winding passages, boutique coffee shops, and craft studios.",
    cost: "$15 - $25",
    tags: ["Culture", "Relaxation", "Scenic"],
  },
  {
    activityTitle: "Local Heritage & Architecture Tour",
    description: "Explore renowned landmarks and stunning architectural details with regional insights.",
    cost: "$20 - $35",
    tags: ["History", "Architecture", "Sightseeing"],
  },
  {
    activityTitle: "Sunset Viewpoint & Photography Spot",
    description: "Capture golden hour panoramic views of the city skyline and landscape.",
    cost: "Free",
    tags: ["Photography", "Nature", "Sunset"],
  },
  {
    activityTitle: "Night Market Street Food Tasting",
    description: "Sample beloved regional snacks, savory bites, and sweet pastries.",
    cost: "$10 - $25",
    tags: ["Foodie", "Nightlife", "Local"],
  },
];

function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [currency, setCurrency] = useState("USD");
  const [focusedMapCoords, setFocusedMapCoords] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedExploreCity, setSelectedExploreCity] = useState(null);
  const [tripNotFound, setTripNotFound] = useState(false);

  const [loadingTrip, setLoadingTrip] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return false;
    if (location.state && location.state.id === id) return false;
    try {
      const cached = localStorage.getItem("tripwise_current_trip");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.id === id) return false;
      }
    } catch {
      // Ignore
    }
    return true;
  });

  // Read initial trip from route state or cached localStorage ONLY if ID matches
  const [tripState, setTripState] = useState(() => {
    const currentUrlId = new URLSearchParams(window.location.search).get("id");
    if (location.state && (!currentUrlId || location.state.id === currentUrlId)) {
      return location.state;
    }
    try {
      const cached = localStorage.getItem("tripwise_current_trip");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!currentUrlId || parsed.id === currentUrlId) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch or sync trip by ID from SQLite database
  useEffect(() => {
    const targetUrlId = searchParams.get("id");
    const targetId = targetUrlId || tripState?.id;

    if (targetId && !targetUrlId) {
      setSearchParams({ id: targetId }, { replace: true });
    }

    if (targetUrlId) {
      // If we already have the matching trip loaded, skip refetch
      if (tripState && tripState.id === targetUrlId) {
        return;
      }

      let isMounted = true;

      getTripById(targetUrlId)
        .then((res) => {
          if (isMounted && res && res.success && res.data) {
            setTripState(res.data);
            setTripNotFound(false);
            localStorage.setItem("tripwise_current_trip", JSON.stringify(res.data));
          } else if (isMounted) {
            setTripState(null);
            setTripNotFound(true);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch trip from DB:", err.message);
          if (isMounted) {
            setTripState(null);
            setTripNotFound(true);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingTrip(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setSearchParams, tripState?.id]);

  // Extract trip details
  const {
    id: tripId,
    city = "Origin",
    destination = "Your Destination",
    country = "",
    coordinates = null,
    budget = 2000,
    duration = 7,
    imageUrl = "",
    tripData,
    fromDate = "",
    toDate = "",
    travelStyle = "Explorer",
    preferences = [],
  } = tripState || {};

  // Normalize multi-preferences into a guaranteed array of strings
  let parsedPreferences = [];
  if (Array.isArray(preferences) && preferences.length > 0) {
    parsedPreferences = preferences;
  } else if (typeof preferences === "string" && preferences.trim()) {
    const trimmed = preferences.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        parsedPreferences = JSON.parse(trimmed);
      } catch {
        parsedPreferences = [trimmed];
      }
    } else if (trimmed.includes(",")) {
      parsedPreferences = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
    } else {
      parsedPreferences = [trimmed];
    }
  } else if (travelStyle) {
    parsedPreferences = String(travelStyle).split(",").map((p) => p.trim()).filter(Boolean);
  }
  if (!Array.isArray(parsedPreferences) || parsedPreferences.length === 0) {
    parsedPreferences = ["Culture", "City Exploration"];
  }

  // Dynamically resolve destination cover if imageUrl is empty or airport suitcase fallback
  const resolvedImageUrl = getDestinationCover(destination, imageUrl);

  // Parse tripData if string
  let parsedTripData = tripData;
  if (typeof tripData === "string") {
    try {
      const cleanedText = tripData
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedTripData = JSON.parse(cleanedText);
    } catch (error) {
      console.warn("JSON Parse Error:", error);
    }
  }

  // Edit form state
  const [editForm, setEditForm] = useState({
    destination,
    country,
    coordinates,
    city,
    budget,
    duration,
    fromDate,
    toDate,
    preferences: parsedPreferences,
    notes: "",
  });

  // Open edit modal and prefill current values
  const handleOpenEditModal = () => {
    setEditForm({
      destination,
      country,
      coordinates,
      city,
      budget,
      duration,
      fromDate,
      toDate,
      preferences: parsedPreferences,
      notes: "",
    });
    setIsEditModalOpen(true);
  };

  const handleToggleEditPreference = (prefName) => {
    setEditForm((prev) => {
      const current = Array.isArray(prev.preferences) ? prev.preferences : [];
      const updated = current.includes(prefName)
        ? current.filter((p) => p !== prefName)
        : [...current, prefName];
      return { ...prev, preferences: updated };
    });
  };

  // Submit edit to backend SQLite database
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!tripId) {
      showToast("Cannot edit a trip without an ID.");
      return;
    }

    setEditLoading(true);
    try {
      const matched = findDestinationByCity(editForm.destination);
      const effectiveCountry = matched ? matched.country : (editForm.country || country || "");
      const effectiveCoords = matched ? matched.coordinates : (editForm.coordinates || coordinates || null);
      const effectivePrefs = Array.isArray(editForm.preferences) && editForm.preferences.length > 0
        ? editForm.preferences
        : parsedPreferences;

      const targetImage =
        editForm.destination !== destination
          ? getDestinationCover(editForm.destination)
          : (tripState?.imageUrl || resolvedImageUrl);

      const response = await updateTrip(tripId, {
        destination: editForm.destination,
        country: effectiveCountry,
        coordinates: effectiveCoords,
        city: editForm.city,
        budget: Number(editForm.budget),
        duration: Number(editForm.duration),
        fromDate: editForm.fromDate,
        toDate: editForm.toDate,
        travelStyle: effectivePrefs.join(", "),
        preferences: effectivePrefs,
        imageUrl: targetImage,
      });

      if (response && response.success && response.data) {
        setTripState(response.data);
        localStorage.setItem("tripwise_current_trip", JSON.stringify(response.data));
        setIsEditModalOpen(false);
        showToast("Trip updated successfully in database!");
      } else {
        throw new Error(response?.error || "Failed to update trip.");
      }
    } catch (err) {
      console.error("Update error:", err);
      showToast(err.message || "Failed to save trip updates.");
    } finally {
      setEditLoading(false);
    }
  };

  // Save trip to database and local store
  const handleSaveTrip = async () => {
    try {
      if (tripState) {
        await saveTrip(tripState).catch((e) => console.warn("Backend save notice:", e));
        const existing = JSON.parse(localStorage.getItem("tripwise_saved_trips") || "[]");
        const filtered = existing.filter((t) => t.id !== tripId);
        filtered.unshift(tripState);
        localStorage.setItem("tripwise_saved_trips", JSON.stringify(filtered));
        setIsSaved(true);
        showToast("Trip saved to your Dashboard & Database!");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to save trip.");
    }
  };

  // Delete trip from database
  const handleDeleteTrip = async () => {
    if (!tripId) return;
    if (!window.confirm(`Are you sure you want to delete your trip to ${destination}?`)) return;

    try {
      await deleteTrip(tripId);
      const existing = JSON.parse(localStorage.getItem("tripwise_saved_trips") || "[]");
      const updated = existing.filter((t) => t.id !== tripId);
      localStorage.setItem("tripwise_saved_trips", JSON.stringify(updated));
      localStorage.removeItem("tripwise_current_trip");
      showToast("Trip deleted from database.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete trip.");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/trip-details?id=${tripId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      showToast("Shareable link copied to clipboard!");
    } else {
      showToast(`Share URL: ${shareUrl}`);
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleDeleteActivity = (dayIndex, activityIndex) => {
    if (!parsedTripData || !parsedTripData.days) return;
    const newDays = [...parsedTripData.days];
    const targetDay = { ...newDays[dayIndex] };
    if (!targetDay.activities) return;
    const removed = targetDay.activities[activityIndex];
    targetDay.activities = targetDay.activities.filter((_, idx) => idx !== activityIndex);
    newDays[dayIndex] = targetDay;
    const updatedTripData = { ...parsedTripData, days: newDays };
    const updatedTripState = { ...tripState, tripData: updatedTripData };
    setTripState(updatedTripState);
    localStorage.setItem("tripwise_current_trip", JSON.stringify(updatedTripState));
    if (tripId) {
      updateTrip(tripId, { tripData: updatedTripData }).catch((e) => console.warn(e));
    }
    showToast(`Removed "${removed?.activityTitle || 'Activity'}" from Day ${dayIndex + 1}`);
  };

  const handleSwapActivity = (dayIndex, activityIndex) => {
    if (!parsedTripData || !parsedTripData.days) return;
    const newDays = [...parsedTripData.days];
    const targetDay = { ...newDays[dayIndex] };
    if (!targetDay.activities) return;

    const currentActivity = targetDay.activities[activityIndex];
    const altIndex = (dayIndex * 3 + activityIndex + 1) % ALTERNATIVE_ACTIVITIES.length;
    const randomAlt = ALTERNATIVE_ACTIVITIES[altIndex];

    const swapped = {
      ...currentActivity,
      activityTitle: `${randomAlt.activityTitle} in ${destination}`,
      description: randomAlt.description,
      cost: randomAlt.cost,
      tags: randomAlt.tags,
    };

    targetDay.activities = targetDay.activities.map((act, idx) => idx === activityIndex ? swapped : act);
    newDays[dayIndex] = targetDay;
    const updatedTripData = { ...parsedTripData, days: newDays };
    const updatedTripState = { ...tripState, tripData: updatedTripData };
    setTripState(updatedTripState);
    localStorage.setItem("tripwise_current_trip", JSON.stringify(updatedTripState));
    if (tripId) {
      updateTrip(tripId, { tripData: updatedTripData }).catch((e) => console.warn(e));
    }
    showToast(`Swapped with: "${swapped.activityTitle}"!`);
  };

  const handleAddCuratedPlace = (place, targetDayNumber = 1) => {
    if (!parsedTripData || !parsedTripData.days) return;
    const dayIndex = Math.max(0, Math.min(Number(targetDayNumber) - 1, parsedTripData.days.length - 1));
    const newDays = [...parsedTripData.days];
    const targetDay = { ...newDays[dayIndex] };

    const placeName = place?.displayName?.text || place?.name || "Curated Attraction";
    const newActivity = {
      time: "03:30 PM - 05:30 PM",
      activityTitle: placeName,
      description: place?.description || `Explore and experience ${placeName} in ${destination}.`,
      cost: "$15 - $30",
      tags: [place?.primaryTypeDisplayName?.text || place?.type || "Attraction", "Curated", "Featured"],
      location: place?.formattedAddress || destination,
    };

    targetDay.activities = [...(targetDay.activities || []), newActivity];
    newDays[dayIndex] = targetDay;
    const updatedTripData = { ...parsedTripData, days: newDays };
    const updatedTripState = { ...tripState, tripData: updatedTripData };
    setTripState(updatedTripState);
    localStorage.setItem("tripwise_current_trip", JSON.stringify(updatedTripState));
    if (tripId) {
      updateTrip(tripId, { tripData: updatedTripData }).catch((e) => console.warn(e));
    }
    showToast(`Added "${placeName}" to Day ${dayIndex + 1}!`);
  };

  const handleViewOnMap = (place) => {
    if (place?.coordinates && !isNaN(place.coordinates.lat) && !isNaN(place.coordinates.lon)) {
      setFocusedMapCoords([place.coordinates.lat, place.coordinates.lon]);
    } else if (place?.location && typeof place.location.latitude === "number") {
      setFocusedMapCoords([place.location.latitude, place.location.longitude]);
    }
    const mapElement = document.getElementById("interactive-map-section");
    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Loading state when fetching by ID
  if (loadingTrip && !parsedTripData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800">Loading your trip from database...</h2>
        <p className="text-gray-500 text-sm mt-1">Connecting to SQLite persistence layer</p>
      </div>
    );
  }

  // Graceful Empty State if no trip is loaded or not found
  if (tripNotFound || (!parsedTripData && !tripState)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Tnavbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 text-indigo-600 shadow-sm">
            <Plane size={36} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            No Active Trip Found
          </h2>

          <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
            You haven't generated an itinerary yet, or the requested trip ID was not found. Start planning your dream trip with AI now!
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/generate-trip")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
            >
              ✨ Generate Trip with AI
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold shadow-sm hover:bg-gray-100 transition cursor-pointer"
            >
              View Saved Trips
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  const spendingData = parsedTripData?.dailySpending || [];
  const travelTips = parsedTripData?.travelTips || [];

  const highestDay =
    spendingData.length > 0
      ? spendingData.reduce(
          (max, day) => (day.amount > max.amount ? day : max),
          spendingData[0]
        )
      : { day: "Day 1", amount: 0 };

  const totalActivitiesCount =
    parsedTripData?.days?.reduce(
      (sum, d) => sum + (d.activities?.length || 0),
      0
    ) || 15;

  const curRate = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;

  const convertedBudgetData = budgetData.map((item) => ({
    ...item,
    value: Math.round((Number(item.value) || 0) * curRate.rate),
  }));

  const convertedBudget = Math.round((Number(budget) || 0) * curRate.rate);

  const convertedSpendingData = spendingData.map((item) => ({
    ...item,
    amount: Math.round((Number(item.amount) || 0) * curRate.rate),
  }));

  const convertedHighestDay = highestDay
    ? {
        ...highestDay,
        amount: Math.round((Number(highestDay.amount) || 0) * curRate.rate),
      }
    : { day: "Day 1", amount: 0 };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Print-specific layout optimization */}
      <style>{`
        @media print {
          nav, header, button, .no-print, [title="Edit trip parameters"], [title="Share"], [title="Save trip"] {
            display: none !important;
          }
          body, .min-h-screen, .bg-gray-50 {
            background: white !important;
            color: black !important;
          }
          .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      <Tnavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSaveTrip}
        onShare={handleShare}
        onExportPDF={handleExportPDF}
        onEdit={handleOpenEditModal}
        isSaved={isSaved}
        currency={currency}
        setCurrency={setCurrency}
      />

      {activeTab === "overview" && (
        <Hero
          city={city}
          destination={destination}
          country={country}
          budget={budget}
          duration={duration}
          imageUrl={resolvedImageUrl}
          travelStyle={travelStyle}
          preferences={parsedPreferences}
          onSave={handleSaveTrip}
          onShare={handleShare}
          onExportPDF={handleExportPDF}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTrip}
          isSaved={isSaved}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <StatsCards
            duration={duration}
            budget={convertedBudget}
            city={city}
            destination={destination}
            country={country}
            fromDate={fromDate}
            toDate={toDate}
            travelStyle={travelStyle}
            preferences={parsedPreferences}
            currencySymbol={curRate.symbol}
          />
        )}

        {activeTab === "overview" && <div className="h-8" />}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mb-8 items-start">
              <div className="space-y-6">
                <BudgetCard
                  budgetData={convertedBudgetData}
                  targetBudget={convertedBudget}
                  currencySymbol={curRate.symbol}
                />
                <DailySpending
                  spendingData={convertedSpendingData}
                  highestDay={convertedHighestDay}
                  currencySymbol={curRate.symbol}
                />
              </div>

              <div className="space-y-5">
                <TripHighlights
                  highlights={parsedTripData?.tripHighlights || {}}
                />

                <ViewFullItinerary
                  onClick={() => setActiveTab("itinerary")}
                  duration={duration}
                  activityCount={totalActivitiesCount}
                />

                <ExploreMapWeather
                  onClick={() => setActiveTab("explore")}
                  destination={destination}
                />
              </div>
            </div>

            <div className="mt-6">
              <TravelTips tips={travelTips} />
            </div>
          </>
        )}

        {/* ITINERARY TAB */}
        {activeTab === "itinerary" && (
          <div className="mb-8">
            <Itinerary
              tripData={parsedTripData}
              duration={duration}
              city={city}
              destination={destination}
              fromDate={fromDate}
              toDate={toDate}
              onDeleteActivity={handleDeleteActivity}
              onSwapActivity={handleSwapActivity}
              currency={currency}
            />
          </div>
        )}

        {/* EXPLORE TAB */}
        {activeTab === "explore" && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 text-white text-sm font-medium mb-4">
                🗺️ Explore & Discover
              </div>

              <h1 className="text-3xl font-bold">
                Explore {selectedExploreCity || destination}
              </h1>

              <p className="text-gray-500 mt-1 text-base">
                Maps, weather, attractions and restaurants for your trip
              </p>
            </div>

            {/* City Tabs */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[destination, ...(parsedTripData?.tripHighlights?.nearbyPlaces || [])]
                .filter(Boolean)
                .slice(0, 5)
                .map((place, index) => {
                  const currentCity = selectedExploreCity || destination;
                  const isSelected = currentCity.toLowerCase() === place.toLowerCase();
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedExploreCity(place)}
                      className={`px-5 py-2 rounded-full border transition cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-black shadow-sm"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                      }`}
                    >
                      {place}
                    </button>
                  );
                })}
            </div>

            <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">
              {/* LEFT SIDE */}
              <div id="interactive-map-section" className="space-y-6">
                <InteractiveMap
                  destination={selectedExploreCity || destination}
                  focusedCoords={focusedMapCoords}
                  initialCoords={coordinates && coordinates.lat && coordinates.lon ? [coordinates.lat, coordinates.lon] : null}
                />
                <NearbyPoints destination={selectedExploreCity || destination} />
              </div>

              {/* RIGHT SIDE */}
              <WeatherCard destination={selectedExploreCity || destination} />
            </div>

            <CuratedTrips
              destination={selectedExploreCity || destination}
              onAddToItinerary={handleAddCuratedPlace}
              onViewOnMap={handleViewOnMap}
              duration={duration}
            />
          </div>
        )}
      </div>

      {/* EDIT TRIP MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Edit Trip Details</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={editForm.destination}
                    onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Starting City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Budget ($ USD)
                  </label>
                  <input
                    type="number"
                    value={editForm.budget}
                    onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                    required
                    min="100"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                    required
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={editForm.fromDate}
                    onChange={(e) => setEditForm({ ...editForm, fromDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={editForm.toDate}
                    onChange={(e) => setEditForm({ ...editForm, toDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Travel Preferences (Multi-Select)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    "City Exploration",
                    "Adventure",
                    "Cuisine",
                    "Culture",
                    "Nature",
                    "Relaxation",
                    "Shopping",
                    "History",
                    "Beaches",
                    "Nightlife",
                  ].map((pref) => {
                    const isSelected = Array.isArray(editForm.preferences) && editForm.preferences.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => handleToggleEditPreference(pref)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {pref} {isSelected && "✓"}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Additional Notes
                </label>
                <textarea
                  rows="2"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Notes, must-see places, dietary preferences..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:scale-105 transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {editLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Save size={16} /> Save to Database
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChatButton destination={destination} tripData={parsedTripData} />
    </div>
  );
}

export default TripDetails;