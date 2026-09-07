import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Trash2,
  ExternalLink,
  Sparkles,
  Plane,
  LogOut,
  User,
} from "lucide-react";
import { getTrips, deleteTrip as deleteTripApi } from "../services/api.js";
import { getDestinationCover } from "../services/unsplash.js";

function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("tripwise_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.warn("Error loading user:", e);
      return null;
    }
  });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch saved trips from backend with localStorage fallback
  useEffect(() => {
    let isMounted = true;

    const fetchTrips = async () => {
      setLoading(true);
      try {
        // First try backend
        const res = await getTrips();
        if (!isMounted) return;

        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTrips(res.data);
          return;
        }

        // Fallback to localStorage
        const local = JSON.parse(localStorage.getItem("tripwise_saved_trips") || "[]");
        setTrips(local);
      } catch (err) {
        if (!isMounted) return;
        console.warn("Backend trips fetch error, checking localStorage fallback:", err);
        try {
          const local = JSON.parse(localStorage.getItem("tripwise_saved_trips") || "[]");
          setTrips(local);
        } catch {
          setTrips([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrips();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteTrip = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this trip?")) return;

    try {
      await deleteTripApi(id).catch((err) => console.warn("Backend delete notice:", err));
    } catch (err) {
      console.warn(err);
    }

    // Update local state and localStorage
    const updated = trips.filter((t) => t.id !== id);
    setTrips(updated);
    try {
      localStorage.setItem("tripwise_saved_trips", JSON.stringify(updated));
    } catch (err) {
      console.warn("Error saving updated trips:", err);
    }
  };

  const handleOpenTrip = (trip) => {
    navigate(`/trip-details?id=${trip.id}`, { state: trip });
  };

  const handleLogout = () => {
    localStorage.removeItem("tripwise_user");
    navigate("/");
  };

  const totalBudget = trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);
  const totalDestinations = new Set(trips.map((t) => t.destination)).size;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Compass size={22} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TripWise AI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/generate-trip"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm hover:scale-105 transition shadow-sm flex items-center gap-2"
            >
              <Sparkles size={16} />
              Plan New Trip
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 text-white shadow-lg mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
              <User size={14} /> Traveler Dashboard
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Explorer"}!
            </h1>
            <p className="text-white/80 mt-2 max-w-xl text-sm md:text-base leading-relaxed">
              Manage your AI-crafted itineraries, explore saved destinations, and plan your next memorable journey.
            </p>
          </div>

          <Link
            to="/generate-trip"
            className="px-6 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-white/90 transition shadow-md shrink-0 flex items-center gap-2"
          >
            <Plane size={18} />
            Create Itinerary
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saved Trips</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">{trips.length}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Destinations</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalDestinations}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Budget</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-2">${totalBudget.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Model</p>
            <p className="text-xl font-bold text-purple-600 mt-3 flex items-center gap-1.5">
              <Sparkles size={16} /> Gemini 1.5
            </p>
          </div>
        </div>

        {/* Saved Trips Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Saved Trips</h2>
            <span className="text-sm text-gray-500">{trips.length} {trips.length === 1 ? "trip" : "trips"} found</span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-5 shadow-sm">
                <Compass size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Saved Trips Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
                You haven't saved any trips yet. Generate your first custom AI itinerary and save it here for offline access!
              </p>
              <Link
                to="/generate-trip"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm shadow hover:scale-105 transition"
              >
                <Sparkles size={16} />
                Generate My First Trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div
                  key={trip.id || trip.destination}
                  onClick={() => handleOpenTrip(trip)}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={getDestinationCover(trip.destination, trip.imageUrl)}
                      alt={trip.destination}
                      onError={(e) => {
                        e.currentTarget.src = getDestinationCover(trip.destination);
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => handleDeleteTrip(trip.id, e)}
                        title="Delete Trip"
                        aria-label={`Delete trip to ${trip.destination || "destination"}`}
                        className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-red-500 flex items-center justify-center shadow transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-medium">
                        {trip.travelStyle || "Vacation"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition">
                        {trip.destination}
                      </h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={13} className="text-gray-400" />
                        From {trip.city || "Origin"}
                      </p>

                      <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-xl">
                          <Calendar size={14} className="text-purple-600" />
                          {trip.duration} Days
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-xl">
                          <DollarSign size={14} className="text-emerald-600" />
                          ${Number(trip.budget).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="text-purple-600 font-semibold group-hover:underline flex items-center gap-1">
                        View Details <ExternalLink size={14} />
                      </span>
                      <span className="text-xs text-gray-400">
                        {trip.savedAt ? new Date(trip.savedAt).toLocaleDateString() : "Saved"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;