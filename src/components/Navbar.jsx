import { Plane } from "lucide-react";

const Navbar = () => {
  return (
    <nav className=" bg-white border-bottom shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Plane size={22} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold">
            TripWise AI
          </h1>
        </div>

        <div className="flex items-center gap-8 text-gray-500 ">
          <a className="hover:text-black cursor-pointer" href="#features">
            Features
            </a>

          <a className="hover:text-black cursor-pointer" href="#destinations">
            Destinations
          </a>

          <a className="hover:text-black cursor-pointer" href="/login">
            Log In
          </a>

          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 cursor-pointer">
            Get Started
          </button>
        </div>

      </div>
    </nav> 
  );
};

export default Navbar;