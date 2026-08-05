import {
  LayoutDashboard,
  Calendar,
  Map,
  Bookmark,
  Share2,
  Download,
  Plane
} from "lucide-react";

const Tnavbar = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Plane size={20} className="text-white" />
          </div>

          <h1 className="text-xl font-bold">
            TripWise AI
          </h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">

          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition ${activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-gray-600 hover:text-purple-600"
              }`}
          >
            <LayoutDashboard size={18} />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === "itinerary"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600"
              }`}
          >
            <Calendar size={18} />
            Itinerary
          </button>

          <button
            onClick={() => setActiveTab("explore")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${activeTab === "explore"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-gray-600 hover:text-purple-600"
              }`}
          >
            <Map size={18} />
            Explore
          </button>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">

          <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <Bookmark size={18} />
            Save
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <Share2 size={18} />
            Share
          </button>

          <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-400 text-white font-medium shadow-sm">
            <Download size={18} />
            Export PDF
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Tnavbar;