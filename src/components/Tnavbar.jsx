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

const Tnavbar = ({
  activeTab,
  setActiveTab,
  onSave,
  onShare,
  onExportPDF,
  onEdit,
  isSaved,
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-2xl shadow-sm text-white">
            <Plane size={20} />
          </div>

          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TripWise AI
          </h1>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <LayoutDashboard size={16} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === "itinerary"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <Calendar size={16} />
            Itinerary
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              activeTab === "explore"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600"
            }`}
          >
            <Map size={16} />
            Explore
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4 text-sm">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 text-gray-600 hover:text-purple-600 transition cursor-pointer font-medium"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          <button
            onClick={onSave}
            className={`flex items-center gap-1.5 transition cursor-pointer font-medium ${
              isSaved ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-purple-600"
            }`}
          >
            {isSaved ? <Check size={16} className="text-indigo-600" /> : <Bookmark size={16} />}
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center gap-1.5 text-gray-600 hover:text-purple-600 transition cursor-pointer font-medium"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onExportPDF}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium shadow-sm hover:opacity-95 transition cursor-pointer"
          >
            <Download size={16} />
            PDF
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            <Compass size={16} className="text-purple-600" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Tnavbar;