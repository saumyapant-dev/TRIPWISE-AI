import {
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  Download,
  Sparkles,
  Star
} from "lucide-react";

function Hero({
  city,
  destination,
  duration,
  imageUrl,
}) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">

      <div className="relative h-[390px] rounded-3xl overflow-hidden shadow-lg">

        {/* Background Image */}
        <img
          src={imageUrl}
          alt={destination}
          className="w-full h-full object-cover object-center"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Left Badges */}
        <div className="absolute top-6 left-6 flex gap-3">

          <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium flex items-center gap-2">
            <Sparkles size={16} />
            AI-Planned
          </div>

          <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium flex items-center gap-2">
            <Star
              size={16}
              fill="#facc15"
              color="#facc15"
            />
            Premium
          </div>

        </div>

        {/* Bottom Left Content */}
        <div className="absolute bottom-8 left-8 text-white">

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {destination}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-lg">

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {destination}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {duration} Days
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} />
              2 Travelers
            </div>

          </div>

        </div>

        {/* Bottom Right Actions */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">

          <button
            className="
              w-11 h-8
              rounded-xl
              bg-white/20
              border-1 border-solid border-white/20
              backdrop-blur-md
              text-white
              flex
              items-center
              justify-center
              hover:bg-white/30
              transition
            "
          >
            <Heart size={17} />
          </button>

          <button
            className="
              w-11 h-8
              rounded-xl
              bg-white/20
              border-1 border-solid border-white/20
              backdrop-blur-md
              text-white
              flex
              items-center
              justify-center
              hover:bg-white/30
              transition
            "
          >
            <Share2 size={17} />
          </button>

          <button
            className="
              flex items-center gap-2
              h-8 px-5 
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-purple-400
              text-white
              font-medium
              shadow-md
            "
          >
            <Download size={18} />
            Export PDF
          </button>

        </div>

      </div>

    </div>
  );
}

export default Hero;