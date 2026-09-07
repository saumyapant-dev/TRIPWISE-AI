import {
  CalendarDays,
  Wallet,
  MapPin,
  Users,
} from "lucide-react";

const StatsCards = ({
  duration,
  budget,
  city,
  destination,
  fromDate,
  toDate,
  travelStyle,
}) => {
  const avgPerDay =
    duration && Number(duration) > 0 && budget
      ? Math.round(Number(budget) / Number(duration))
      : 0;

  return (
    <div className="grid md:grid-cols-4 gap-4 mt-1">

      {/* Duration */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <CalendarDays
              size={19}
              className="text-gray-600"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Duration
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              {duration || 7} Days
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {fromDate && toDate ? `${fromDate} – ${toDate}` : "Flexible Dates"}
            </p>
          </div>

        </div>
      </div>

      {/* Budget */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Wallet
              size={19}
              className="text-gray-600"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Budget
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              ${budget || 0}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              ${avgPerDay} / day avg
            </p>
          </div>

        </div>
      </div>

      {/* Destinations */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <MapPin
              size={19}
              className="text-gray-600"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Destination
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              {destination || city || "1 City"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {city ? `Origin: ${city}` : "Selected Destination"}
            </p>
          </div>

        </div>
      </div>

      {/* Travel Style */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
            <Users
              size={19}
              className="text-gray-600"
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Travel Style
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              {travelStyle || "Explorer"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Personalized Pace
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StatsCards;