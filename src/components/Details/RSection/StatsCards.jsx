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
  country,
  fromDate,
  toDate,
  travelStyle,
  preferences,
  currencySymbol = "$",
}) => {
  const avgPerDay =
    duration && Number(duration) > 0 && budget
      ? Math.round(Number(budget) / Number(duration))
      : 0;

  const prefList = Array.isArray(preferences) && preferences.length > 0
    ? preferences
    : (travelStyle ? String(travelStyle).split(",").map((p) => p.trim()).filter(Boolean) : ["Explorer"]);

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
              {currencySymbol}{Number(budget || 0).toLocaleString()}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {currencySymbol}{avgPerDay.toLocaleString()} / day avg
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
              {destination || "Destination"}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {country ? country : (city ? `Origin: ${city}` : "Verified Destination")}
            </p>
          </div>

        </div>
      </div>

      {/* Travel Focus / Preferences */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start gap-4">

          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users
              size={19}
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              Travel Focus
            </p>

            <div className="flex flex-wrap gap-1 mt-1.5">
              {prefList.slice(0, 2).map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-semibold truncate"
                >
                  {p}
                </span>
              ))}
              {prefList.length > 2 && (
                <span className="text-[11px] text-gray-400 font-medium self-center">
                  +{prefList.length - 2} more
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {prefList.length} Preferences Selected
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default StatsCards;