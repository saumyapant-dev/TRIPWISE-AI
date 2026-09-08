import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Users,
  Heart,
  Share2,
  Download,
  Sparkles,
  Star,
  Edit3,
  Trash2,
} from "lucide-react";
import { getDestinationCover } from "../../services/unsplash.js";
import { getDestinationImage } from "../../services/api.js";

function Hero({
  city,
  destination,
  country,
  duration,
  imageUrl,
  travelStyle,
  preferences,
  onSave,
  onShare,
  onExportPDF,
  onEdit,
  onDelete,
  isSaved,
}) {
  const instantCover = getDestinationCover(destination, imageUrl);
  const [currentCover, setCurrentCover] = useState(instantCover);
  const [prevKey, setPrevKey] = useState(`${destination}_${imageUrl}`);

  if (`${destination}_${imageUrl}` !== prevKey) {
    setPrevKey(`${destination}_${imageUrl}`);
    setCurrentCover(instantCover);
  }

  const prefList = Array.isArray(preferences) && preferences.length > 0
    ? preferences
    : (travelStyle ? String(travelStyle).split(",").map((p) => p.trim()).filter(Boolean) : []);

  useEffect(() => {
    let isMounted = true;

    if (destination) {
      getDestinationImage(destination)
        .then((res) => {
          if (isMounted && res && res.imageUrl && res.imageUrl.startsWith("http")) {
            if (!res.imageUrl.includes("photo-1469854523086-cc02fe5d8800")) {
              setCurrentCover(res.imageUrl);
            }
          }
        })
        .catch(() => {
          // Gracefully keep instant cover
        });
    }

    return () => {
      isMounted = false;
    };
  }, [destination]);

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="relative h-[390px] rounded-3xl overflow-hidden shadow-lg bg-slate-900">
        {/* Background Image */}
        <img
          key={`${destination}_${currentCover}`}
          src={currentCover}
          alt={destination}
          onError={(e) => {
            const fallback = getDestinationCover(destination);
            if (e.currentTarget.src !== fallback) {
              e.currentTarget.src = fallback;
            } else {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=800&fit=crop";
            }
          }}
          className="w-full h-full object-cover object-center transition-opacity duration-500"
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
            <Star size={16} fill="#facc15" color="#facc15" />
            Premium
          </div>
        </div>

        {/* Bottom Left Content */}
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex flex-wrap items-baseline gap-3">
            <span>{destination}</span>
            {country && (
              <span className="text-xl md:text-2xl font-normal opacity-80">
                ({country})
              </span>
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-base md:text-lg mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {destination}{country ? `, ${country}` : ""}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {duration} Days
            </div>

            {city && (
              <div className="flex items-center gap-2 opacity-90 text-sm">
                Departing from: {city}
              </div>
            )}
          </div>

          {/* Multi-Preferences Badges */}
          {prefList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {prefList.map((pref) => (
                <span
                  key={pref}
                  className="px-3 py-1 rounded-full bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-xs"
                >
                  🎯 {pref}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Right Actions */}
        <div className="absolute bottom-8 right-8 flex items-center gap-3">
          {onEdit && (
            <button
              onClick={onEdit}
              title="Edit Trip Details"
              className="w-11 h-9 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer"
            >
              <Edit3 size={17} />
            </button>
          )}

          <button
            onClick={onSave}
            title={isSaved ? "Saved to Dashboard" : "Save Trip"}
            className={`
              w-11 h-9
              rounded-xl
              ${isSaved ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"}
              border border-white/20
              backdrop-blur-md
              flex
              items-center
              justify-center
              transition
              cursor-pointer
            `}
          >
            <Heart size={17} className={isSaved ? "fill-white" : ""} />
          </button>

          <button
            onClick={onShare}
            title="Share Trip"
            className="w-11 h-9 rounded-xl bg-white/20 border border-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
          >
            <Share2 size={17} />
          </button>

          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete Trip"
              className="w-11 h-9 rounded-xl bg-red-500/30 hover:bg-red-600 border border-red-400/40 backdrop-blur-md text-white flex items-center justify-center transition cursor-pointer"
            >
              <Trash2 size={17} />
            </button>
          )}

          <button
            onClick={onExportPDF}
            className="flex items-center gap-2 h-9 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium shadow-md hover:opacity-95 transition cursor-pointer"
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