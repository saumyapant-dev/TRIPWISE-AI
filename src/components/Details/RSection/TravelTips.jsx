import { Sparkles, Star } from "lucide-react";

const tips = [
  "Book JR Pass before arrival to save 40% on train travel",
  "Visit teamLab Borderless on weekdays to avoid crowds",
  "Download Suica app for contactless payments on public transport",
  "Try breakfast at the hotel - it's included and authentic",
  "Shibuya Sky has better sunset views than Tokyo Skytree",
];

const TravelTips = () => {
  return (
    <div className="bg-purple-50 border border-gray-200 rounded-3xl p-6 shadow-sm">

      <div className="flex items-center gap-3 mb-6">
        <Sparkles
          size={23}
          className="text-purple-500"
        />
        <h3 className="text-lg font-semibold">
          AI Travel Tips
        </h3>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start gap-3"
          >
            <Star
              size={18}
              className="text-purple-500 mt-1 flex-shrink-0"
            />

            <p className="text-base text-gray-800 leading-6">
              {tip}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default TravelTips;