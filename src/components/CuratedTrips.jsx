import { useState, useEffect } from "react";
import {
    Camera,
    Clock3,
    ExternalLink,
    MapPin,
    Star,
} from "lucide-react";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

const getPlaceImage = (place) => {
    const type = place.primaryTypeDisplayName?.text?.toLowerCase() || "";
    const name = place.displayName?.text?.toLowerCase() || "";

    if (name.includes("waterfall") || name.includes("falls"))
        return "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200";

    if (name.includes("lake"))
        return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200";

    if (name.includes("mount") || name.includes("peak"))
        return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200";

    if (name.includes("cave"))
        return "https://images.unsplash.com/photo-1511497584788-876760111969?w=1200";

    if (name.includes("temple"))
        return "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200";

    if (name.includes("museum"))
        return "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200";

    if (type.includes("park"))
        return "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200";

    if (type.includes("restaurant"))
        return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200";

    if (
        type.includes("zoo") ||
        name.includes("zoo") ||
        name.includes("zoological")
    )
        return "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200";

    if (type.includes("cafe"))
        return "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200";

    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200";
};

const getTags = (type) => {
    type = type?.toLowerCase() || "";

    if (type.includes("restaurant"))
        return ["Popular", "Local Food", "Top Rated"];

    if (type.includes("park"))
        return ["Nature", "Relaxing", "Photography"];

    if (type.includes("museum"))
        return ["Historic", "Culture", "Indoor"];

    if (type.includes("temple"))
        return ["Historic", "Sacred", "Iconic"];

    if (type.includes("tourist"))
        return ["Must Visit", "Photography", "Iconic"];

    return ["Popular", "Recommended", "Explore"];
};

const getDescription = (place) => {
    const type = place.primaryTypeDisplayName?.text?.toLowerCase() || "";

    if (type.includes("restaurant"))
        return "One of the highest-rated dining spots loved by locals and tourists alike.";

    if (type.includes("park"))
        return "Perfect for relaxing walks and beautiful scenic views.";

    if (type.includes("museum"))
        return "Discover fascinating history, culture and unique exhibitions.";

    if (type.includes("temple"))
        return "A historic landmark and one of the city's most iconic attractions.";

    if (type.includes("tourist"))
        return "One of the must-visit destinations offering unforgettable experiences.";

    return "One of the most recommended places to explore during your trip.";
};

/* -------------------------------------------------------------------------- */

function CuratedTrips({ destination }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("tourist_attraction");

    useEffect(() => {
        if (!destination) return;

        const fetchPlaces = async () => {
            try {
                setLoading(true);

                const searchQuery =
                    type === "restaurant"
                        ? `Best restaurants in ${destination}`
                        : `Top tourist attractions in ${destination}`;

                const response = await fetch(
                    "https://places.googleapis.com/v1/places:searchText",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": API_KEY,
                            "X-Goog-FieldMask":
                                "places.displayName,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.currentOpeningHours",
                        },
                        body: JSON.stringify({
                            textQuery: searchQuery,
                            pageSize: 3,
                        }),
                    }
                );

                const data = await response.json();

                console.log(data);

                setPlaces(data.places || []);
            } catch (err) {
                console.log(err);
                setPlaces([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, [destination, type]);

    return (
        <div className="mt-12">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Curated for Your Trip
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Discover the best places around{" "}
                        <span className="font-semibold text-black">
                            {destination}
                        </span>
                    </p>
                </div>

                <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit">

                    <button
                        onClick={() => setType("tourist_attraction")}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${type === "tourist_attraction"
                            ? "bg-white shadow text-black"
                            : "text-gray-500"
                            }`}
                    >
                        📷 Attractions
                    </button>

                    <button
                        onClick={() => setType("restaurant")}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition ${type === "restaurant"
                            ? "bg-white shadow text-black"
                            : "text-gray-500"
                            }`}
                    >
                        🍽 Restaurants
                    </button>

                </div>

            </div>

            {/* Loading */}

            {loading ? (

                <div className="flex flex-col items-center justify-center py-20">

                    <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>

                    <h3 className="mt-6 text-xl font-semibold">
                        Finding amazing places...
                    </h3>

                </div>

            ) : places.length === 0 ? (

                <div className="text-center py-20">

                    <MapPin
                        size={42}
                        className="mx-auto text-gray-400"
                    />

                    <h3 className="mt-5 text-xl font-semibold">
                        No places found
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Try another destination.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {places.map((place, index) => (

                        <div
                            key={index}
                            className="group bg-white rounded-[30px] overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                        >

                            {/* Image */}

                            <div className="relative h-60 overflow-hidden">

                                <img
                                    src={getPlaceImage(place)}
                                    alt={place.displayName?.text}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                                <div className="absolute top-4 left-4">

                                    <span className="bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">

                                        <Camera size={12} />

                                        {place.primaryTypeDisplayName?.text || "Place"}

                                    </span>

                                </div>

                                <div className="absolute bottom-4 right-4">

                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">

                                        <MapPin size={12} />

                                        Nearby

                                    </span>

                                </div>

                            </div>

                            {/* Content */}

                            <div className="p-6">

                                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                                    {place.displayName?.text}
                                </h3>

                                <div className="flex items-center gap-2 mt-3">

                                    <Star
                                        size={16}
                                        className="fill-yellow-400 text-yellow-400"
                                    />

                                    <span className="font-semibold">
                                        {place.rating || "4.8"}
                                    </span>

                                    <span className="text-sm text-gray-400">
                                        ({place.userRatingCount || "500+"})
                                    </span>

                                </div>

                                <p className="mt-4 text-gray-500 text-sm leading-6">
                                    {getDescription(place)}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-5">

                                    {getTags(place.primaryTypeDisplayName?.text).map((tag) => (

                                        <span
                                            key={tag}
                                            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>

                                    ))}

                                </div>

                                <div className="flex items-center gap-2 mt-6 text-sm text-gray-600">

                                    <Clock3 size={15} />

                                    {place.currentOpeningHours?.openNow
                                        ? "Open Now"
                                        : "Hours Unavailable"}

                                </div>

                                <div className="flex justify-between items-center mt-7">

                                    <button className="text-indigo-600 font-semibold hover:underline">
                                        View Details
                                    </button>

                                    <button
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                    place.displayName?.text
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                        className="w-10 h-10 rounded-full border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition"
                                    >

                                        <ExternalLink size={17} />

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default CuratedTrips;