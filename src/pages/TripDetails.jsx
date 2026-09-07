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

function TripDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("overview");
  const [toast, setToast] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedExploreCity, setSelectedExploreCity] = useState(null);
  const [loadingTrip, setLoadingTrip] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Boolean(params.get("id") && !location.state);
  });

  // Read initial trip from route state or cached localStorage
  const [tripState, setTripState] = useState(() => {
    if (location.state) return location.state;
    try {
      const cached = localStorage.getItem("tripwise_current_trip");
      return cached ? JSON.parse(cached) : null;
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
    const urlId = searchParams.get("id");
    const targetId = urlId || tripState?.id;

    if (targetId && !urlId) {
      setSearchParams({ id: targetId }, { replace: true });
    }

    if (targetId) {
      let isMounted = true;
      getTripById(targetId)
        .then((res) => {
          if (isMounted && res && res.success && res.data) {
            setTripState(res.data);
            localStorage.setItem("tripwise_current_trip", JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          console.warn("Could not fetch trip from DB, keeping current state:", err.message);
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
  }, [searchParams, setSearchParams, tripState?.id]);

  // Extract trip details
  const {
    id: tripId,
    city = "Origin",
    destination = "Your Destination",
    budget = 2000,
    duration = 7,
    imageUrl = "",
    tripData,
    fromDate = "",
    toDate = "",
    travelStyle = "Explorer",
    preferences = "",
  } = tripState || {};

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
    city,
    budget,
    duration,
    fromDate,
    toDate,
    travelStyle,
    preferences,
  });

  // Open edit modal and prefill current values
  const handleOpenEditModal = () => {
    setEditForm({
      destination,
      city,
      budget,
      duration,
      fromDate,
      toDate,
      travelStyle,
      preferences,
    });
    setIsEditModalOpen(true);
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
      const targetImage =
        editForm.destination !== destination
          ? getDestinationCover(editForm.destination)
          : (tripState?.imageUrl || resolvedImageUrl);

      const response = await updateTrip(tripId, {
        destination: editForm.destination,
        city: editForm.city,
        budget: Number(editForm.budget),
        duration: Number(editForm.duration),
        fromDate: editForm.fromDate,
        toDate: editForm.toDate,
        travelStyle: editForm.travelStyle,
        preferences: editForm.preferences,
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

  // Graceful Empty State if no trip is loaded
  if (!parsedTripData && !tripState) {
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

  return (
    <div className="bg-gray-50 min-h-screen">
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
      />

      {activeTab === "overview" && (
        <Hero
          city={city}
          destination={destination}
          budget={budget}
          duration={duration}
          imageUrl={resolvedImageUrl}
          travelStyle={travelStyle}
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
            budget={budget}
            city={city}
            destination={destination}
            fromDate={fromDate}
            toDate={toDate}
            travelStyle={travelStyle}
          />
        )}

        {activeTab === "overview" && <div className="h-8" />}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            <div className="grid lg:grid-cols-[1.7fr_0.9fr] gap-6 mb-8 items-start">
              <div className="space-y-6">
                <BudgetCard budgetData={budgetData} targetBudget={budget} />
                <DailySpending
                  spendingData={spendingData}
                  highestDay={highestDay}
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
              <div className="space-y-6">
                <InteractiveMap destination={selectedExploreCity || destination} />
                <NearbyPoints destination={selectedExploreCity || destination} />
              </div>

              {/* RIGHT SIDE */}
              <WeatherCard destination={selectedExploreCity || destination} />
            </div>

            <CuratedTrips destination={selectedExploreCity || destination} />
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
                  Preferences & Notes
                </label>
                <textarea
                  rows="3"
                  value={editForm.preferences}
                  onChange={(e) => setEditForm({ ...editForm, preferences: e.target.value })}
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