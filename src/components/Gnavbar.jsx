import { ArrowLeft, Plane } from "lucide-react";

const Gnavbar = () => {
  return (
    <nav className="bg-white border-bottom shadow-sm w-full z-10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <button className="flex items-center gap-2 ml-30 text-black font-medium hover:cursor-pointer transition">
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-full">
            <Plane size={18} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mr-30">
            TripWise AI
          </h1>
        </div>

      </div>
    </nav>
  );
};

export default Gnavbar;