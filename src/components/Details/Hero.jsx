import {
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";

const Hero = ({
  city,
  destination,
  budget,
  duration,
}) => {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">

      <img
        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf"
        alt="Tokyo"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45"></div>

      <div className="absolute bottom-10 left-10 text-white">

        <div className="mb-5">
          <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 w-fit font-medium">
            <Sparkles size={18} />
            AI Generated Trip
          </span>
        </div>

        <h1 className="text-6xl font-bold mb-5">
          {destination || "Tokyo"} Adventure
        </h1>

        <div className="flex flex-wrap items-center gap-10">

          <div className="flex items-center gap-3">
            <Calendar size={24} />
            <span className="text-xl font-semibold">
              {duration || 7} Days
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign size={24} />
            <span className="text-xl font-semibold">
              ${budget || 2400} Total Budget
            </span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <span className="text-xl font-semibold">
              {destination || city || "Tokyo"}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Hero;