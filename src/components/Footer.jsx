import React from "react";
import { Plane } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
            <Plane size={22} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold">
            TripWise AI
          </h1>
        </div>

        <div className="flex gap-8 text-gray-500">
          <a href="#" className="hover:text-black">
            About
          </a>

          <a href="#" className="hover:text-black">
            Privacy
          </a>

          <a href="#" className="hover:text-black">
            Terms
          </a>

          <a href="#" className="hover:text-black">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-400 text-sm">
          © 2026 TripWise AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
};

export default Footer;