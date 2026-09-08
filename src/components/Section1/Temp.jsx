import { Link } from "react-router-dom";

const Temp = () => {
  const trending = [
    { name: "Tokyo", path: "/generate-trip?destination=Tokyo" },
    { name: "Seoul", path: "/generate-trip?destination=Seoul" },
    { name: "Paris", path: "/generate-trip?destination=Paris" },
    { name: "Busan", path: "/generate-trip?destination=Busan" },
    { name: "Kerala", path: "/generate-trip?destination=Kerala" },
    { name: "Kashmir", path: "/generate-trip?destination=Kashmir" },
    { name: "New York", path: "/generate-trip?destination=New%20York" },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center px-4">
      
      <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6">
        🚀 AI-Powered Travel Planning
      </div>

      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-950">
        Plan Your Dream Trip
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          With Intelligent AI
        </span>
      </h1>

      <p className="text-gray-600 text-base sm:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
        Create personalized travel itineraries in seconds. TripWise AI analyzes your
        preferences, budget, and travel style to craft an unforgettable journey.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link to="/generate-trip" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition shadow-lg shadow-purple-200">
          Generate My Trip ✨
        </Link>

        <a href="#features" className="bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition shadow-sm">
          See How It Works
        </a>
      </div>

      {/* Quick Try Chips */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-400">Popular right now:</span>
        {trending.map((t) => (
          <Link
            key={t.name}
            to={t.path}
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600 transition"
          >
            {t.name}
          </Link>
        ))}
      </div>

    </div>
  );
};

export default Temp;