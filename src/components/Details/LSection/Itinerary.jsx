import React from "react";
import {
  Calendar,
  Plane,
  Building,
  Camera,
  Utensils,
  Coffee,
} from "lucide-react";

const Itinerary = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      {/* Heading */}
      <div className="flex items-center gap-3 mb-10">
        <Calendar className="text-indigo-600" />
        <h2 className="text-2xl font-bold">
          Day-by-Day Itinerary
        </h2>
      </div>

      {/* DAY 1 */}
      <div className="flex gap-6">

        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
          1
        </div>

        <div className="flex-1">
          <p className="text-gray-500">Day 1</p>

          <h3 className="text-xl font-bold mb-8">
            Arrival & Explore Shibuya
          </h3>

          <div className="border-l-2 border-gray-200 pl-8 ml-3 space-y-8">

            <div>
              <div className="flex items-center gap-3">
                <Plane size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  10:00 AM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Arrive at Narita Airport
              </h4>

              <p className="text-gray-500">
                Take Narita Express to Shibuya (90 min, ¥3,020)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Building size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  12:30 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Check-in Hotel
              </h4>

              <p className="text-gray-500">
                Shibuya Excel Hotel Tokyu
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Camera size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  2:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Shibuya Crossing
              </h4>

              <p className="text-gray-500">
                Visit the famous scramble crossing and Hachiko statue
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Utensils size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  6:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Dinner at Ichiran Ramen
              </h4>

              <p className="text-gray-500">
                Try authentic tonkotsu ramen (¥1,200)
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* DAY 2 */}
      <div className="flex gap-6 mt-16">

        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
          2
        </div>

        <div className="flex-1">
          <p className="text-gray-500">Day 2</p>

          <h3 className="text-xl font-bold mb-8">
            Traditional Tokyo
          </h3>

          <div className="border-l-2 border-gray-200 pl-8 ml-3 space-y-8">

            <div>
              <div className="flex items-center gap-3">
                <Coffee size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  8:00 AM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Breakfast at Hotel
              </h4>

              <p className="text-gray-500">
                Traditional Japanese breakfast included
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Building size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  9:30 AM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Senso-ji Temple
              </h4>

              <p className="text-gray-500">
                Explore Tokyo's oldest temple in Asakusa
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Utensils size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  12:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Lunch at Nakamise
              </h4>

              <p className="text-gray-500">
                Street food at Nakamise Shopping Street (¥1,500)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Camera size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  3:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Tokyo Skytree
              </h4>

              <p className="text-gray-500">
                Observation deck with city views (¥2,100)
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* DAY 3 */}
      <div className="flex gap-6 mt-16">

        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
          3
        </div>

        <div className="flex-1">
          <p className="text-gray-500">Day 3</p>

          <h3 className="text-xl font-bold mb-8">
            Modern Tokyo & Nightlife
          </h3>

          <div className="border-l-2 border-gray-200 pl-8 ml-3 space-y-8">

            <div>
              <div className="flex items-center gap-3">
                <Building size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  10:00 AM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                TeamLab Borderless
              </h4>

              <p className="text-gray-500">
                Digital art museum in Odaiba (¥3,200)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Utensils size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  1:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Sushi Lunch
              </h4>

              <p className="text-gray-500">
                Fresh sushi at Tsukiji Outer Market (¥2,500)
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Camera size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  4:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Harajuku & Takeshita Street
              </h4>

              <p className="text-gray-500">
                Fashion district and trendy shops
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <Utensils size={22} className="text-indigo-600" />
                <span className="font-semibold text-indigo-600">
                  7:00 PM
                </span>
              </div>

              <h4 className="font-semibold text-lg mt-2">
                Dinner in Shinjuku
              </h4>

              <p className="text-gray-500">
                Izakaya experience (¥2,800)
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Itinerary;