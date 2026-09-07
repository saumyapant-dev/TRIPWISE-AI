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

const DEFAULT_TIPS = [
  {
    category: "Timing",
    title: "Beat the Morning Crowds",
    description: "Start early around 08:30 AM to explore marquee landmarks before tour groups arrive.",
  },
  {
    category: "Transport",
    title: "Transit Passes & Cards",
    description: "Pick up a local reloadable transit card or day pass for seamless subway and bus journeys.",
  },
  {
    category: "Food",
    title: "Reserve Dining Early",
    description: "Popular local bistros and izakayas fill up fast—reserve a day ahead or arrive right at opening.",
  },
  {
    category: "Photography",
    title: "Golden Hour Lighting",
    description: "Capture the best architectural and scenic vistas 45 minutes before sunset.",
  },
];

const TravelTips = ({ tips = [] }) => {
  const normalizedTips = (Array.isArray(tips) && tips.length > 0 ? tips : DEFAULT_TIPS).map(
    (tip, index) => {
      if (typeof tip === "string") {
        const categories = ["Timing", "Transport", "Food", "Photography"];
        return {
          category: categories[index % categories.length],
          title: tip.length > 28 ? tip.slice(0, 26) + "..." : tip,
          description: tip,
        };
      }
      return {
        category: tip?.category || "Timing",
        title: tip?.title || "Travel Tip",
        description: tip?.description || "Smart travel recommendation for your itinerary.",
      };
    }
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <Lightbulb size={18} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold">AI Travel Tips</h2>
        </div>

        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-400 text-white text-xs font-medium">
          Powered by TripWise AI
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {normalizedTips.map((tip, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Icon + Category */}
            <div className="flex items-center justify-between mb-5">
              <div className={colorMap[tip.category] || "text-indigo-500"}>
                {iconMap[tip.category] || <Lightbulb size={20} />}
              </div>

              <span
                className={`text-sm font-medium ${
                  colorMap[tip.category] || "text-indigo-500"
                }`}
              >
                {tip.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold mb-3 leading-tight text-gray-900">
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