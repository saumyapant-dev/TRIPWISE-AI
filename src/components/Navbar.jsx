import { Plane } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem("tripwise_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Plane size={22} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            TripWise AI
          </h1>
        </Link>

        <div className="flex items-center gap-8 text-gray-500 font-medium">
          <a className="hover:text-black cursor-pointer" href="#features">
            Features
          </a>

          <a className="hover:text-black cursor-pointer" href="#destinations">
            Destinations
          </a>

          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-indigo-600 cursor-pointer font-semibold text-gray-800"
            >
              Dashboard
            </button>
          ) : (
            <Link className="hover:text-black cursor-pointer" to="/login">
              Log In
            </Link>
          )}

          <button
            onClick={() => navigate("/generate-trip")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 cursor-pointer transition shadow-sm"
          >
            Get Started
          </button>
        </div>

      </div>
    </nav> 
  );
};

export default Navbar;