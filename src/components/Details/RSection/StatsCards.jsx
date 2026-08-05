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
  fromDate,
  toDate,
}) => {
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
              {duration} Days
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {fromDate} – {toDate}
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
              ${budget}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              ${Math.round(budget / duration)} / day avg
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
              Destinations
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              1 City
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {city}
            </p>
          </div>

        </div>
      </div>

      {/* Travelers */}
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
              Travelers
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-1">
              2 People
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Adults
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StatsCards;