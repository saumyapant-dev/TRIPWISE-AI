import {
  Plane,
  Hotel,
  Star,
} from "lucide-react";

const TripHighlights = ({ highlights }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">

      <h2 className="text-xl font-semibold mb-5">
        Trip Highlights
      </h2>

      <div className="space-y-3">

        {/* Flight */}
        <div className="bg-gray-100 rounded-2xl p-3 flex gap-3">

          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Plane size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Flight
            </p>

            <p className="font-semibold text-sm line-clamp-1">
              {highlights?.flight || highlights?.flight_info || "Flight options available"}
            </p>
          </div>

        </div>

        {/* Hotel */}
        <div className="bg-gray-100 rounded-2xl p-3 flex gap-3">

          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
            <Hotel size={18} />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Hotel
            </p>

            <p className="font-semibold text-sm line-clamp-1">
              {highlights?.hotel || highlights?.hotel_name || "Recommended boutique stay"}
            </p>
          </div>

        </div>

        {/* Attraction */}
        <div className="bg-gray-100 rounded-2xl p-3 flex gap-3">

          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
            <Star size={18} className="text-amber-500" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Top Rated
            </p>

            <p className="font-semibold text-sm line-clamp-1">
              {highlights?.topRated || highlights?.top_rated || highlights?.attraction || "Iconic City Attractions"}
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 gap-3 mt-5">

        <div className="bg-gradient-to-r from-indigo-100 to-white rounded-2xl py-4 px-3 text-center">

          <h3 className="text-xl font-bold">
            {highlights?.activities ?? highlights?.activities_count ?? 12}
          </h3>

          <p className="text-xs text-gray-500 mt-0.5">
            Activities
          </p>

        </div>

        <div className="bg-gradient-to-l from-indigo-100 to-white rounded-2xl py-4 px-3 text-center">

          <h3 className="text-xl font-bold">
            {highlights?.restaurants ?? highlights?.restaurants_count ?? 6}
          </h3>

          <p className="text-xs text-gray-500 mt-0.5">
            Restaurants
          </p>

        </div>

      </div>

    </div>
  );
};

export default TripHighlights;