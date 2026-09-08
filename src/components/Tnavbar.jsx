import {
  LayoutDashboard,
  Calendar,
  Map,
  Bookmark,
  Share2,
  Download,
  Plane,
  Check,
  Edit3,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Trip Navbar
 * Navigation bar for the Trip Details page with tab switches, currency selector, and action buttons.
 */
const Tnavbar = ({
  activeTab,
  setActiveTab,
  onSave,
  onShare,
  onExportPDF,
  onEdit,
  isSaved,
  currency = "USD",
  setCurrency,
}) => {
  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "INR", symbol: "₹" },
    { code: "JPY", symbol: "¥" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-sm text-white">
            <Plane size={18} />
          </div>

          <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden min-[400px]:inline">
            TripWise
          </h1>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "itinerary"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
            }`}
          >
            <Calendar size={15} />
            <span>Itinerary</span>
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
              activeTab === "explore"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
            }`}
          >
            <Map size={15} />
            <span>Explore</span>
          </button>
        </div>

        {/* Actions & Currency */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
          {/* Currency Toggle */}
          {setCurrency && (
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              aria-label="Currency Selector"
              className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 font-semibold text-gray-700 outline-none hover:bg-gray-100 transition cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          )}

          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer font-medium p-1.5 rounded-lg hover:bg-gray-50"
              title="Edit trip parameters"
            >
              <Edit3 size={15} />
              <span className="hidden md:inline">Edit</span>
            </button>
          )}

          <button
            onClick={onSave}
            className={`flex items-center gap-1 transition cursor-pointer font-medium p-1.5 rounded-lg hover:bg-gray-50 ${
              isSaved ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-purple-600"
            }`}
            title="Save trip"
          >
            {isSaved ? <Check size={15} className="text-indigo-600" /> : <Bookmark size={15} />}
            <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition cursor-pointer font-medium p-1.5 rounded-lg hover:bg-gray-50"
            title="Copy share link"
          >
            <Share2 size={15} />
            <span className="hidden md:inline">Share</span>
          </button>

          <button
            onClick={onExportPDF}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium shadow-sm hover:opacity-95 transition cursor-pointer"
            title="Print or export clean PDF"
          >
            <Download size={14} />
            <span>PDF</span>
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition font-medium"
            title="Dashboard"
          >
            <Compass size={15} className="text-purple-600" />
            <span className="hidden lg:inline">Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Tnavbar;