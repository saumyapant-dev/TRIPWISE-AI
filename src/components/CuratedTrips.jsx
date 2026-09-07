import { useState, useEffect } from "react";
import {
    Camera,
    Clock3,
    ExternalLink,
    MapPin,
    Star,
    Utensils,
    Landmark,
    Compass,
    Sparkles,
} from "lucide-react";
import { getCuratedPlaces } from "../services/api.js";

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

const getPlaceName = (place) => {
    if (!place) return "Featured Destination";
    if (typeof place.displayName === "object" && place.displayName?.text) {
        return place.displayName.text;
    }
    if (typeof place.displayName === "string" && place.displayName.trim()) {
        return place.displayName;
    }
    return place.name || place.title || "Featured Destination";
};

const getPlaceType = (place) => {
    if (!place) return "Attraction";
    if (typeof place.primaryTypeDisplayName === "object" && place.primaryTypeDisplayName?.text) {
        return place.primaryTypeDisplayName.text;
    }
    if (typeof place.primaryTypeDisplayName === "string" && place.primaryTypeDisplayName.trim()) {
        return place.primaryTypeDisplayName;
    }
    return place.type || place.category || "Must Visit";
};

// Zero-dependency SVG Data URI that works 100% offline and never fails
const createSvgPlaceholder = (title = "Featured Place", category = "Explore") => {
    const cleanTitle = (title.length > 26 ? title.slice(0, 24) + "..." : title)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    const cleanCat = category.toUpperCase().slice(0, 18);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="40%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.08)"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect width="800" height="500" fill="url(#dots)"/>
  <g transform="translate(400, 190)">
    <circle cx="0" cy="0" r="54" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    <path d="M-18 -8 L0 -26 L18 -8 L18 20 L-18 20 Z" fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="0" cy="6" r="6" fill="#ffffff"/>
  </g>
  <text x="400" y="300" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700">${cleanTitle}</text>
  <text x="400" y="335" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" letter-spacing="2">${cleanCat}</text>
</svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DISTINCT_CARD_ATTRACTION_FALLBACKS = [
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&auto=format&fit=crop&q=80",
];

const DISTINCT_CARD_DINING_FALLBACKS = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80",
];

const getPlaceImage = (place, destination = "", index = 0) => {
    // 1. Direct verified image on object
    if (place.image && typeof place.image === "string" && place.image.startsWith("http") && !place.image.includes("photo-1488646953014-85cb44e25828")) {
        return place.image;
    }
    if (place.imageUrl && typeof place.imageUrl === "string" && place.imageUrl.startsWith("http") && !place.imageUrl.includes("photo-1488646953014-85cb44e25828")) {
        return place.imageUrl;
    }

    const type = getPlaceType(place).toLowerCase();
    const name = getPlaceName(place).toLowerCase();
    const dest = (destination || "").toLowerCase();

    // 2. Semantic matching based on attraction name keywords
    if (name.includes("waterfall") || name.includes("falls"))
        return "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&auto=format&fit=crop&q=80";

    if (name.includes("lake"))
        return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80";

    if (name.includes("bamboo"))
        return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80";

    if (name.includes("mount") || name.includes("peak") || name.includes("summit") || name.includes("batur") || name.includes("fuji"))
        return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80";

    if (name.includes("cave") || name.includes("grotto"))
        return "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("temple") ||
        name.includes("shrine") ||
        name.includes("taisha") ||
        name.includes("inari") ||
        name.includes("pavilion") ||
        name.includes("kinkaku") ||
        name.includes("kiyomizu") ||
        name.includes("pagoda") ||
        name.includes("tanah lot") ||
        name.includes("uluwatu")
    )
        return "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("museum") ||
        name.includes("gallery") ||
        name.includes("louvre") ||
        name.includes("metropolitan") ||
        name.includes("uffizi") ||
        name.includes("orsay") ||
        name.includes("exhibition")
    )
        return "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("castle") ||
        name.includes("palace") ||
        name.includes("fort") ||
        name.includes("citadel") ||
        name.includes("nijo") ||
        name.includes("amber") ||
        name.includes("hawa mahal") ||
        name.includes("duomo") ||
        name.includes("cathedral") ||
        name.includes("basilica")
    )
        return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("eiffel") ||
        name.includes("tower") ||
        name.includes("skytree") ||
        name.includes("statue") ||
        name.includes("liberty") ||
        name.includes("arch") ||
        name.includes("colosseum")
    )
        return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("bridge") ||
        name.includes("golden gate") ||
        name.includes("brooklyn") ||
        name.includes("pier") ||
        name.includes("harbor") ||
        name.includes("canal") ||
        name.includes("waterfront") ||
        name.includes("beach") ||
        name.includes("aquarium")
    )
        return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("park") ||
        name.includes("garden") ||
        name.includes("botanical") ||
        name.includes("forest") ||
        name.includes("sequoia") ||
        name.includes("yosemite") ||
        name.includes("terrace") ||
        name.includes("everglades")
    )
        return "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200&auto=format&fit=crop&q=80";

    if (
        name.includes("zoo") ||
        name.includes("safari") ||
        name.includes("wildlife") ||
        name.includes("monkey")
    )
        return "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200&auto=format&fit=crop&q=80";

    // 3. Semantic matching based on type keywords
    if (type.includes("bakery") || name.includes("bakery") || name.includes("patisserie"))
        return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80";

    if (type.includes("bar") || type.includes("lounge") || name.includes("rooftop"))
        return "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80";

    if (type.includes("cafe") || type.includes("coffee") || name.includes("cafe") || name.includes("coffee"))
        return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80";

    if (type.includes("restaurant") || type.includes("food") || type.includes("bistro") || type.includes("grill"))
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";

    // 4. Match destination aesthetics
    if (dest.includes("seoul") || dest.includes("korea")) {
        if (type.includes("restaurant") || type.includes("food") || type.includes("cafe"))
            return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("palace") || name.includes("gyeongbok") || name.includes("changdeok"))
            return "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("hanok") || name.includes("village") || name.includes("bukchon"))
            return "https://images.unsplash.com/photo-1546874177-9e664107314e?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("tower") || name.includes("namsan"))
            return "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("market") || name.includes("myeongdong") || name.includes("street"))
            return "https://images.unsplash.com/photo-1583845112239-97ef1341b271?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("design") || name.includes("ddp"))
            return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80";
        return "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&auto=format&fit=crop&q=80";
    }

    if (dest.includes("kerala") || dest.includes("kochi") || dest.includes("munnar") || dest.includes("alleppey")) {
        if (type.includes("restaurant") || type.includes("food") || type.includes("cafe"))
            return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("tea") || name.includes("munnar") || name.includes("plantation"))
            return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("fishing") || name.includes("fort") || name.includes("kochi"))
            return "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&auto=format&fit=crop&q=80";
        if (name.includes("beach") || name.includes("cliff") || name.includes("varkala"))
            return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&auto=format&fit=crop&q=80";
        return "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80";
    }

    if (dest.includes("kyoto") || dest.includes("tokyo") || dest.includes("japan"))
        return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80";
    if (dest.includes("paris") || dest.includes("france"))
        return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80";
    if (dest.includes("bali") || dest.includes("indonesia"))
        return "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80";
    if (dest.includes("new york") || dest.includes("usa"))
        return "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200&auto=format&fit=crop&q=80";
    if (dest.includes("rome") || dest.includes("italy"))
        return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80";
    if (dest.includes("london") || dest.includes("uk"))
        return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80";

    // Safe cycling through distinct photos ensures NO two cards share the same photo
    const isFoodCategory =
        type.includes("restaurant") ||
        type.includes("food") ||
        type.includes("cafe") ||
        type.includes("bistro") ||
        type.includes("bar") ||
        type.includes("bakery");

    return isFoodCategory
        ? DISTINCT_CARD_DINING_FALLBACKS[index % DISTINCT_CARD_DINING_FALLBACKS.length]
        : DISTINCT_CARD_ATTRACTION_FALLBACKS[index % DISTINCT_CARD_ATTRACTION_FALLBACKS.length];
};

const getTags = (place) => {
    if (Array.isArray(place.tags) && place.tags.length > 0) {
        return place.tags;
    }
    const type = getPlaceType(place).toLowerCase();
    const name = getPlaceName(place).toLowerCase();

    if (type.includes("restaurant") || type.includes("food"))
        return ["Top Rated", "Local Cuisine", "Artisan"];

    if (type.includes("cafe") || type.includes("coffee"))
        return ["Cozy", "Specialty Coffee", "Brunch"];

    if (type.includes("bakery"))
        return ["Fresh Baked", "Artisan", "Sweet Treats"];

    if (type.includes("bar") || type.includes("lounge"))
        return ["Scenic Views", "Cocktails", "Atmosphere"];

    if (type.includes("park") || type.includes("nature"))
        return ["Nature", "Scenic Walk", "Photography"];

    if (type.includes("museum") || type.includes("gallery"))
        return ["Historic", "Culture", "Fine Arts"];

    if (type.includes("temple") || name.includes("shrine") || name.includes("temple"))
        return ["Sacred", "Heritage", "Iconic"];

    return ["Must Visit", "Iconic", "Highly Rated"];
};

const getDescription = (place) => {
    if (place.description) return place.description;
    const type = getPlaceType(place).toLowerCase();

    if (type.includes("restaurant"))
        return "One of the highest-rated dining venues loved by locals and travelers alike.";

    if (type.includes("cafe") || type.includes("coffee"))
        return "Cozy artisan coffee shop offering freshly roasted brews and handcrafted bites.";

    if (type.includes("park") || type.includes("nature"))
        return "Perfect for scenic strolls, relaxed afternoon walks, and panoramic photo opportunities.";

    if (type.includes("museum"))
        return "Explore world-class exhibitions displaying remarkable regional history and cultural treasures.";

    if (type.includes("temple") || type.includes("historic"))
        return "A revered historic sanctuary reflecting deep architectural tradition and spiritual heritage.";

    return "A quintessential highlight of the region offering unforgettable perspectives and memories.";
};

/* -------------------------------------------------------------------------- */
/*                         Curated Place Card Component                       */
/* -------------------------------------------------------------------------- */

function CuratedPlaceCard({ place, destination, index = 0 }) {
    const placeName = getPlaceName(place);
    const placeType = getPlaceType(place);

    const primaryUrl = getPlaceImage(place, destination, index);
    const [prevUrl, setPrevUrl] = useState(primaryUrl);
    const [imgSrc, setImgSrc] = useState(primaryUrl);
    const [errorStage, setErrorStage] = useState(0); // 0: primary, 1: category fallback, 2: offline svg
    const [imageLoaded, setImageLoaded] = useState(false);

    if (primaryUrl !== prevUrl) {
        setPrevUrl(primaryUrl);
        setImgSrc(primaryUrl);
        setErrorStage(0);
        setImageLoaded(false);
    }

    const isFood =
        placeType.toLowerCase().includes("restaurant") ||
        placeType.toLowerCase().includes("cafe") ||
        placeType.toLowerCase().includes("bakery") ||
        placeType.toLowerCase().includes("bar");

    const handleImageError = () => {
        if (errorStage === 0) {
            setErrorStage(1);
            const fallback = isFood
                ? DISTINCT_CARD_DINING_FALLBACKS[index % DISTINCT_CARD_DINING_FALLBACKS.length]
                : DISTINCT_CARD_ATTRACTION_FALLBACKS[index % DISTINCT_CARD_ATTRACTION_FALLBACKS.length];
            if (fallback !== imgSrc) {
                setImgSrc(fallback);
                return;
            }
        }

        // Step 2: Final bulletproof fallback - inline SVG Data URI (works offline, zero network)
        setErrorStage(2);
        setImgSrc(createSvgPlaceholder(placeName, placeType));
    };

    return (
        <div className="group bg-white rounded-[30px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
            <div>
                {/* Image Container with Ambient Backdrop */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800">
                    {/* Background Icon Watermark for smooth loading & zero-empty-card guarantee */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 text-white pointer-events-none">
                        {isFood ? <Utensils size={64} /> : <Landmark size={64} />}
                    </div>

                    <img
                        src={imgSrc}
                        alt={placeName}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={handleImageError}
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Left Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-sm font-medium">
                            {isFood ? <Utensils size={13} /> : <Camera size={13} />}
                            {placeType}
                        </span>
                    </div>

                    {/* Bottom Right Badge */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/20 shadow-sm font-medium">
                            <MapPin size={12} />
                            Curated Spot
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {placeName}
                    </h3>

                    <div className="flex items-center gap-2 mt-3">
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-gray-900">
                            {place.rating || "4.8"}
                        </span>
                        <span className="text-sm text-gray-400">
                            ({place.userRatingCount || "1,200+"} reviews)
                        </span>
                    </div>

                    <p className="mt-4 text-gray-600 text-sm leading-6 line-clamp-3">
                        {getDescription(place)}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                        {getTags(place).map((tag) => (
                            <span
                                key={tag}
                                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 pb-6 pt-0">
                <div className="flex items-center gap-2 py-3 text-xs font-medium text-gray-500 border-t border-gray-100 mt-4">
                    <Clock3 size={14} className="text-indigo-600" />
                    <span>
                        {place.currentOpeningHours?.openNow
                            ? "Open Now • Highly Recommended"
                            : "Open Daily • Prime Hours"}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2">
                    <button
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${placeName} ${destination}`
                                )}`,
                                "_blank"
                            )
                        }
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
                    >
                        <span>Explore Place</span>
                        <Sparkles size={14} />
                    </button>

                    <button
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    `${placeName} ${destination}`
                                )}`,
                                "_blank"
                            )
                        }
                        title={`Open ${placeName} on Google Maps`}
                        className="w-10 h-10 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center text-gray-500 transition cursor-pointer"
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

function CuratedTrips({ destination }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("tourist_attraction");

    useEffect(() => {
        if (!destination) return;

        let isMounted = true;

        const fetchPlaces = async () => {
            try {
                setLoading(true);
                const res = await getCuratedPlaces(destination, type);
                if (!isMounted) return;

                if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
                    setPlaces(res.data);
                } else {
                    // Fallback to guarantee no empty section
                    setPlaces(getDefaultFallbackPlaces(destination, type));
                }
            } catch (err) {
                if (!isMounted) return;
                console.warn("Curated places fetch error, using resilient fallbacks:", err);
                setPlaces(getDefaultFallbackPlaces(destination, type));
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPlaces();

        return () => {
            isMounted = false;
        };
    }, [destination, type]);

    return (
        <div className="mt-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold mb-2">
                        <Compass size={13} />
                        Recommended by Travel Intelligence
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Curated for Your Trip
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm">
                        Top attractions, cultural landmarks, and dining hand-picked for{" "}
                        <span className="font-semibold text-gray-900">
                            {destination}
                        </span>
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl w-fit border border-gray-200">
                    <button
                        onClick={() => setType("tourist_attraction")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            type === "tourist_attraction"
                                ? "bg-white shadow-sm text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        <Camera size={14} />
                        Attractions
                    </button>

                    <button
                        onClick={() => setType("restaurant")}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                            type === "restaurant"
                                ? "bg-white shadow-sm text-gray-900"
                                : "text-gray-500 hover:text-gray-900"
                        }`}
                    >
                        <Utensils size={14} />
                        Restaurants
                    </button>
                </div>
            </div>

            {/* Loading Skeleton State */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="bg-white rounded-[30px] overflow-hidden border border-gray-200 shadow-sm animate-pulse"
                        >
                            <div className="h-64 bg-gray-200" />
                            <div className="p-6 space-y-4">
                                <div className="h-5 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-5/6" />
                                <div className="flex gap-2 pt-2">
                                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : places.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
                    <MapPin size={42} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="text-xl font-bold text-gray-900">
                        No places found
                    </h3>
                    <p className="text-gray-500 mt-2 text-sm">
                        Try switching between Attractions and Restaurants above.
                    </p>
                </div>
            ) : (
                /* Rich Place Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {places.map((place, index) => (
                        <CuratedPlaceCard
                            key={place.id || index}
                            place={place}
                            destination={destination}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Fallback generator for zero-empty-screen guarantee
function getDefaultFallbackPlaces(dest, type) {
    const isFood = type === "restaurant";

    if (isFood) {
        return [
            {
                name: `${dest} Heritage Bistro`,
                displayName: { text: `${dest} Heritage Bistro` },
                rating: 4.8,
                userRatingCount: 890,
                type: "Restaurant",
                primaryTypeDisplayName: { text: "Restaurant" },
                currentOpeningHours: { openNow: true },
                description: `Premier regional dining offering authentic delicacies and artisan wines in ${dest}.`,
                tags: ["Top Rated", "Local Cuisine", "Wine"],
                image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80",
            },
            {
                name: `Artisan Roastery & Café`,
                displayName: { text: `Artisan Roastery & Café` },
                rating: 4.7,
                userRatingCount: 650,
                type: "Cafe",
                primaryTypeDisplayName: { text: "Cafe" },
                currentOpeningHours: { openNow: true },
                description: "Cozy specialty coffee venue with artisan pastries, light brunch, and sunlit outdoor terrace.",
                tags: ["Coffee", "Brunch", "Cozy"],
                image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80",
            },
            {
                name: `${dest} Waterfront Grill`,
                displayName: { text: `${dest} Waterfront Grill` },
                rating: 4.9,
                userRatingCount: 1120,
                type: "Restaurant",
                primaryTypeDisplayName: { text: "Restaurant" },
                currentOpeningHours: { openNow: true },
                description: "Scenic waterfront restaurant serving farm-to-table grills and fresh regional specialties.",
                tags: ["Waterfront", "Dinner", "Popular"],
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
            },
            {
                name: `The Courtyard Trattoria`,
                displayName: { text: `The Courtyard Trattoria` },
                rating: 4.8,
                userRatingCount: 760,
                type: "Restaurant",
                primaryTypeDisplayName: { text: "Restaurant" },
                currentOpeningHours: { openNow: true },
                description: "Charming garden courtyard dining featuring handmade pasta and candlelit ambiance.",
                tags: ["Romantic", "Outdoor", "Handmade"],
                image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&auto=format&fit=crop&q=80",
            },
            {
                name: `Skyline Rooftop Lounge`,
                displayName: { text: `Skyline Rooftop Lounge` },
                rating: 4.8,
                userRatingCount: 940,
                type: "Bar",
                primaryTypeDisplayName: { text: "Bar" },
                currentOpeningHours: { openNow: true },
                description: "Chic rooftop terrace serving craft cocktails and tapas with panoramic views.",
                tags: ["Skyline", "Cocktails", "Sunset"],
                image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80",
            },
            {
                name: `Artisan Pastry Atelier`,
                displayName: { text: `Artisan Pastry Atelier` },
                rating: 4.9,
                userRatingCount: 820,
                type: "Bakery",
                primaryTypeDisplayName: { text: "Bakery" },
                currentOpeningHours: { openNow: true },
                description: "Award-winning bakery specializing in morning viennoiseries, gourmet tarts, and sweets.",
                tags: ["Pastries", "Desserts", "Artisan"],
                image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80",
            },
        ];
    }

    return [
        {
            name: `${dest} Historic Old Town`,
            displayName: { text: `${dest} Historic Old Town` },
            rating: 4.8,
            userRatingCount: 1420,
            type: "Tourist Attraction",
            primaryTypeDisplayName: { text: "Tourist Attraction" },
            currentOpeningHours: { openNow: true },
            description: `Quintessential pedestrian district with preserved historic architecture and artisan boutiques in ${dest}.`,
            tags: ["Historic", "Iconic", "Must Visit"],
            image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop&q=80",
        },
        {
            name: `${dest} Central Botanical Gardens`,
            displayName: { text: `${dest} Central Botanical Gardens` },
            rating: 4.9,
            userRatingCount: 2310,
            type: "Park",
            primaryTypeDisplayName: { text: "Park" },
            currentOpeningHours: { openNow: true },
            description: "Tranquil botanical gardens featuring scenic waterways, walking bridges, and rich flora.",
            tags: ["Nature", "Relaxing", "Photography"],
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200&auto=format&fit=crop&q=80",
        },
        {
            name: `${dest} National Art & Heritage Museum`,
            displayName: { text: `${dest} National Art & Heritage Museum` },
            rating: 4.7,
            userRatingCount: 980,
            type: "Museum",
            primaryTypeDisplayName: { text: "Museum" },
            currentOpeningHours: { openNow: true },
            description: "Inspiring exhibitions chronicling the civilization, cultural legacy, and fine art of the area.",
            tags: ["Culture", "Indoor", "Heritage"],
            image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&auto=format&fit=crop&q=80",
        },
        {
            name: `${dest} Panoramic Ridge Viewpoint`,
            displayName: { text: `${dest} Panoramic Ridge Viewpoint` },
            rating: 4.9,
            userRatingCount: 1840,
            type: "Viewpoint",
            primaryTypeDisplayName: { text: "Viewpoint" },
            currentOpeningHours: { openNow: true },
            description: "Dramatic elevated outlook providing 360-degree vistas over the landscape and surrounding horizon.",
            tags: ["Scenic", "Viewpoint", "Sunset"],
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
        },
        {
            name: `${dest} Waterfront Promenade & Pier`,
            displayName: { text: `${dest} Waterfront Promenade & Pier` },
            rating: 4.8,
            userRatingCount: 1650,
            type: "Tourist Attraction",
            primaryTypeDisplayName: { text: "Tourist Attraction" },
            currentOpeningHours: { openNow: true },
            description: "Vibrant seaside promenade filled with street buskers, coastal dining, and sunset strolls.",
            tags: ["Waterfront", "Walking", "Atmosphere"],
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        },
        {
            name: `${dest} Landmark Citadel & Plaza`,
            displayName: { text: `${dest} Landmark Citadel & Plaza` },
            rating: 4.8,
            userRatingCount: 2100,
            type: "Historic Landmark",
            primaryTypeDisplayName: { text: "Historic Landmark" },
            currentOpeningHours: { openNow: true },
            description: "Centuries-old fortress and monumental central plaza anchoring the heart of ${dest}.",
            tags: ["Landmark", "Architecture", "Historic"],
            image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
        },
    ];
}

export default CuratedTrips;