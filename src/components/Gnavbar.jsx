import { ArrowLeft, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Gnavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm w-full z-10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-black font-medium hover:text-indigo-600 hover:cursor-pointer transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-full">
            <Plane size={18} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            TripWise AI
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Gnavbar;