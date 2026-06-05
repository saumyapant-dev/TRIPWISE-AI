import React from "react";
import { Calendar, Clock } from "lucide-react";

function LSection({ tripData }) {
  if (!tripData?.days) {
    return (
      <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm">
        No itinerary available
      </div>
    );
  }

  return (
    <div className="col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      <div className="flex items-center gap-3 mb-10">
        <Calendar className="text-indigo-600" />
        <h2 className="text-3xl font-bold">
          Day-by-Day Itinerary
        </h2>
      </div>

      {tripData.days.map((day) => (
        <div key={day.day} className="mb-12">

          <div className="flex gap-6">

            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
              {day.day}
            </div>

            <div className="flex-1">

              <p className="text-gray-500">
                Day {day.day}
              </p>

              <h3 className="text-2xl font-bold mb-8">
                {day.title}
              </h3>

              <div className="border-l-2 border-gray-200 pl-8 ml-3 space-y-8">

                {day.activities.map((activity, index) => (
                  <div key={index}>

                    <div className="flex items-center gap-3">
                      <Clock
                        size={18}
                        className="text-indigo-600"
                      />

                      <span className="font-semibold text-indigo-600">
                        {activity.time}
                      </span>
                    </div>

                    <h4 className="font-semibold text-lg mt-2">
                      {activity.title}
                    </h4>

                    <p className="text-gray-500">
                      {activity.description}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      ))}
    </div>
  );
}

export default LSection;