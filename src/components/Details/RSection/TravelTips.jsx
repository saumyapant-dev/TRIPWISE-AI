import {
  Clock3,
  UtensilsCrossed,
  ShieldCheck,
  Camera,
  Lightbulb,
} from "lucide-react";

// Icons based on category
const iconMap = {
  Timing: <Clock3 size={20} />,
  Food: <UtensilsCrossed size={20} />,
  Transport: <ShieldCheck size={20} />,
  Photography: <Camera size={20} />,
};

const colorMap = {
  Timing: "text-indigo-500",
  Food: "text-purple-500",
  Transport: "text-cyan-500",
  Photography: "text-green-500",
};

const TravelTips = ({ tips = [] }) => {
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Lightbulb
              size={18}
              className="text-white"
            />
          </div>

          <h2 className="text-xl font-semibold">
            AI Travel Tips
          </h2>

        </div>

        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-400 text-white text-xs">
          Powered by TripWise AI
        </div>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm"
          >

            {/* Icon + Category */}
            <div className="flex items-center justify-between mb-5">

              <div className={colorMap[tip.category]}>
                {iconMap[tip.category]}
              </div>

              <span
                className={`text-sm font-medium ${colorMap[tip.category]}`}
              >
                {tip.category}
              </span>

            </div>

            {/* Title */}
            <h3 className="text-base font-semibold mb-3 leading-tight">
              {tip.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-6">
              {tip.description}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default TravelTips;