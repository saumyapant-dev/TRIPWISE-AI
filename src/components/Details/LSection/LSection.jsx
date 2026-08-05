import React from "react";
import {
  Calendar,
  Clock,
  Plane,
  Building2,
  Camera,
  Utensils,
  MapPin,
} from "lucide-react";

function LSection({ tripData }) {
  if (!tripData?.days) {
    return (
      <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm">
        No itinerary available
      </div>
    );
  }

  const getActivityIcon = (title) => {
  const text = title.toLowerCase();

  if (
    text.includes("flight") ||
    text.includes("airport") ||
    text.includes("depart") ||
    text.includes("arrival")
  ) {
    return <Plane size={24} />;
  }

  if (
    text.includes("hotel") ||
    text.includes("check-in") ||
    text.includes("accommodation")
  ) {
    return <Building2 size={24} />;
  }

  if (
    text.includes("lunch") ||
    text.includes("dinner") ||
    text.includes("breakfast") ||
    text.includes("food")
  ) {
    return <Utensils size={24} />;
  }

  if (
    text.includes("beach") ||
    text.includes("temple") ||
    text.includes("museum") ||
    text.includes("tower") ||
    text.includes("crossing")
  ) {
    return <Camera size={24} />;
  }

  return <MapPin size={24} />;
};

  return (
    <div className="col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">

      <div className="flex items-center gap-3 mb-10">
        <Calendar className="text-indigo-600" />
        <h2 className="text-2xl font-bold">
          Day-by-Day Itinerary
        </h2>
      </div>

      {tripData.days.map((day) => (
        <div key={day.day} className="mb-12">

          <div className="flex gap-6">

            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-xl font-bold">
              {day.day}
            </div>

            <div className="flex-1">

              <p className="text-gray-500">
                Day {day.day}
              </p>

              <h3 className="text-xl font-bold mb-8">
                {day.title}
              </h3>

              <div className="border-l-2 border-gray-200 pl-2 space-y-10">

                {day.activities.map((activity, index) => (
                  <div key={index} className="relative">

                    <div className="flex gap-4">

                      <div className="w-10 h-10 border border-indigo-600 rounded-full flex items-center justify-center bg-white shrink-0 text-indigo-600">
                        {getActivityIcon(activity.title)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={16} className="text-gray-500" />

                          <span className="font-semibold text-indigo-600">
                            {activity.time}
                          </span>
                        </div>

                        <h4 className="font-bold text-regular">
                          {activity.title}
                        </h4>

                        <p className="text-gray-500 mt-2">
                          {activity.description}
                        </p>
                      </div>

                    </div>

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