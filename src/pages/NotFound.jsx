import { Link } from "react-router-dom";
import { Compass, Home, LayoutDashboard } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-gray-800">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
            <Compass size={42} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              404 • Destination Lost
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Looks like your route went off the map! The page or itinerary you are searching for does not exist or may have been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition shadow-sm hover:shadow"
            >
              <Home size={16} />
              Return Home
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition"
            >
              <LayoutDashboard size={16} />
              My Trips
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
