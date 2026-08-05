import { CalendarDays, ChevronRight } from "lucide-react";

const ViewFullItinerary = () => {
  return (
    <div className="border border-gray-200 rounded-3xl px-5 py-4 shadow-sm hover:shadow-md transition cursor-pointer">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center">
            <CalendarDays
              size={20}
              className="text-white"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold">
              View Full Itinerary
            </h3>

            <p className="text-xs text-gray-500">
              7 days · 23 activities planned
            </p>
          </div>

        </div>

        <ChevronRight
          size={20}
          className="text-gray-400"
        />

      </div>

    </div>
  );
};

export default ViewFullItinerary;