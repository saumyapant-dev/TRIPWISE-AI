import { Plane, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState(() => {
    try {
      const savedUser = localStorage.getItem("tripwise_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-2xl text-white shadow-sm">
            <Plane size={20} />
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TripWise AI
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-600 font-medium text-sm">
          <a className="hover:text-indigo-600 cursor-pointer transition" href="#features">
            Features
          </a>

          <a className="hover:text-indigo-600 cursor-pointer transition" href="#destinations">
            Destinations
          </a>

          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="hover:text-indigo-600 cursor-pointer font-semibold text-gray-900 transition"
            >
              Dashboard
            </button>
          ) : (
            <Link className="hover:text-indigo-600 cursor-pointer transition" to="/login">
              Log In
            </Link>
          )}

          <button
            onClick={() => navigate("/generate-trip")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full hover:opacity-95 cursor-pointer transition shadow-sm font-semibold"
          >
            Plan Trip ✨
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 font-medium hover:text-indigo-600"
          >
            Features
          </a>
          <a
            href="#destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 font-medium hover:text-indigo-600"
          >
            Destinations
          </a>
          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/dashboard");
              }}
              className="block w-full text-left py-2 text-gray-900 font-semibold hover:text-indigo-600"
            >
              Dashboard
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-700 font-medium hover:text-indigo-600"
            >
              Log In
            </Link>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/generate-trip");
            }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-center shadow-sm"
          >
            Plan Trip with AI ✨
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;