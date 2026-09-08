import { useState, useEffect } from "react";

import {
    Plane,
    Hotel,
    UtensilsCrossed,
    Bus,
    Camera,
    ShoppingBag,
    Landmark,
    Clock,
    CalendarDays,
    MapPin,
    Wallet,
    Route,
    CloudSun,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Trash2,
    RefreshCw,
} from "lucide-react";
import { getWeather } from "../../../services/api.js";

/* =========================================================
   HELPERS
========================================================= */

const DAY_THEMES = [
    "Arrival & City Discovery",
    "Historic Landmarks & Culture",
    "Nature & Scenic Highlights",
    "Adventure & Hidden Gems",
    "Culinary Adventures & Local Flavors",
    "Arts, Markets & Shopping",
    "Departure & Farewell Views",
];

const DAY_ICONS = [
    "✈️",
    "🏛️",
    "🌿",
    "⛰️",
    "🍜",
    "🛍️",
    "🏠",
];

const getActivityType = (type = "", title = "") => {
    const text = `${type} ${title}`.toLowerCase();

    if (
        text.includes("flight") ||
        text.includes("airport") ||
        text.includes("depart") ||
        text.includes("arrive")
    ) {
        return {
            label: type || "Flight",
            icon: Plane,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
        };
    }

    if (
        text.includes("hotel") ||
        text.includes("check in") ||
        text.includes("check-in") ||
        text.includes("stay")
    ) {
        return {
            label: type || "Hotel",
            icon: Hotel,
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-100",
        };
    }

    if (
        text.includes("restaurant") ||
        text.includes("dining") ||
        text.includes("breakfast") ||
        text.includes("lunch") ||
        text.includes("dinner") ||
        text.includes("cafe") ||
        text.includes("food")
    ) {
        return {
            label: type || "Dining",
            icon: UtensilsCrossed,
            color: "text-orange-500",
            bg: "bg-orange-50",
            border: "border-orange-100",
        };
    }

    if (
        text.includes("transfer") ||
        text.includes("bus") ||
        text.includes("train") ||
        text.includes("transport") ||
        text.includes("transit")
    ) {
        return {
            label: type || "Transport",
            icon: Bus,
            color: "text-cyan-600",
            bg: "bg-cyan-50",
            border: "border-cyan-100",
        };
    }

    if (
        text.includes("sightseeing") ||
        text.includes("museum") ||
        text.includes("temple") ||
        text.includes("shrine") ||
        text.includes("castle") ||
        text.includes("explore") ||
        text.includes("tour") ||
        text.includes("landmark")
    ) {
        return {
            label: type || "Sightseeing",
            icon: Landmark,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
        };
    }

    if (text.includes("shopping") || text.includes("market") || text.includes("bazaar")) {
        return {
            label: type || "Shopping",
            icon: ShoppingBag,
            color: "text-pink-600",
            bg: "bg-pink-50",
            border: "border-pink-100",
        };
    }

    return {
        label: type || "Activity",
        icon: Camera,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-100",
    };
};

/* =========================================================
   COMPONENT
========================================================= */

function Itinerary({
    tripData,
    duration,
    fromDate,
    toDate,
    city,
    destination,
    onDeleteActivity,
    onSwapActivity,
}) {

    const [selectedDay, setSelectedDay] = useState(0);
    const [expandedCard, setExpandedCard] = useState(null);
    const [weatherSummary, setWeatherSummary] = useState("Pleasant");

    useEffect(() => {
        const targetCity = destination || tripData?.destination;
        if (targetCity) {
            getWeather(targetCity)
                .then((res) => {
                    if (res?.success && res?.data?.current) {
                        const temp = Math.round(res.data.current.temperature_2m);
                        setWeatherSummary(`${temp}°C Clear`);
                    }
                })
                .catch(() => setWeatherSummary("Mild & Clear"));
        }
    }, [destination, tripData?.destination]);

    if (!tripData?.days) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <CalendarDays
                        size={46}
                        className="mx-auto text-indigo-600"
                    />
                    <h2 className="text-2xl font-bold mt-6">
                        No itinerary found
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Generate a trip to see your AI itinerary.
                    </p>
                </div>
            </div>
        );
    }

    const currentDay = tripData.days[selectedDay] || tripData.days[0];

    const totalFromBreakdown = tripData?.budgetBreakdown
        ? Object.values(tripData.budgetBreakdown).reduce((a, b) => Number(a) + Number(b), 0)
        : null;
    const formattedBudget = tripData?.budget
        ? `$${tripData.budget}`
        : totalFromBreakdown
            ? `$${totalFromBreakdown}`
            : "AI Estimate";

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            {/* =========================================================
          AI SUMMARY BAR
      ========================================================= */}

            <section className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-7">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
                            <Sparkles size={15} />
                            AI Generated Itinerary
                        </div>

                        <h1 className="mt-5 text-4xl font-bold text-gray-900">
                            {destination || tripData?.destination || city || "Your Trip"}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Personalized travel plan crafted around your destination.
                        </p>
                    </div>

                    {/* Right Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* Dates */}
                        <div className="rounded-2xl bg-gray-50 px-5 py-4 border border-gray-100">
                            <CalendarDays
                                size={18}
                                className="text-indigo-600"
                            />
                            <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">
                                Dates
                            </p>
                            <h3 className="mt-1 font-semibold">
                                {fromDate && toDate ? `${fromDate} – ${toDate}` : "Flexible Dates"}
                            </h3>
                        </div>

                        {/* Duration */}
                        <div className="rounded-2xl bg-gray-50 px-5 py-4 border border-gray-100">
                            <Clock
                                size={18}
                                className="text-blue-600"
                            />
                            <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">
                                Duration
                            </p>
                            <h3 className="mt-1 font-semibold">
                                {duration || tripData.days.length} Days
                            </h3>
                        </div>

                        {/* Activities */}
                        <div className="rounded-2xl bg-gray-50 px-5 py-4 border border-gray-100">
                            <Route
                                size={18}
                                className="text-green-600"
                            />
                            <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">
                                Activities
                            </p>
                            <h3 className="mt-1 font-semibold">
                                {tripData.days.reduce(
                                    (sum, day) => sum + (day.activities?.length || 0),
                                    0
                                )}
                            </h3>
                        </div>

                        {/* Budget */}
                        <div className="rounded-2xl bg-gray-50 px-5 py-4 border border-gray-100">
                            <Wallet
                                size={18}
                                className="text-orange-500"
                            />
                            <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">
                                Budget
                            </p>
                            <h3 className="mt-1 font-semibold">
                                {formattedBudget}
                            </h3>
                        </div>

                        {/* Weather */}
                        <div className="rounded-2xl bg-gray-50 px-5 py-4 border border-gray-100">
                            <CloudSun
                                size={18}
                                className="text-yellow-500"
                            />
                            <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">
                                Weather
                            </p>
                            <h3 className="mt-1 font-semibold">
                                {weatherSummary}
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
          MAIN LAYOUT
      ========================================================= */}

            {/* Mobile / Tablet Horizontal Day Bar (Hidden on LG+) */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6 mt-6">
                {tripData.days.map((day, index) => {
                    const active = selectedDay === index;
                    return (
                        <button
                            key={day.day || index}
                            onClick={() => {
                                setSelectedDay(index);
                                setExpandedCard(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap font-medium text-sm transition-all duration-200 cursor-pointer ${
                                active
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-indigo-500"}`} />
                            <span>Day {day.day}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-8 mt-4 lg:mt-8">
                {/* =========================================================
            LEFT SIDEBAR (Desktop Sticky)
        ========================================================= */}

                <aside className="hidden lg:block bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 h-fit sticky top-8">

                    <div className="flex items-center gap-2 mb-6">

                        <CalendarDays
                            size={18}
                            className="text-indigo-600"
                        />

                        <h2 className="font-bold tracking-wide text-gray-900">

                            Days

                        </h2>

                    </div>

                    <div className="space-y-2">

                        {tripData.days.map((day, index) => {

                            const active = selectedDay === index;

                            return (

                                <button
                                    key={day.day}
                                    onClick={() => {

                                        setSelectedDay(index);
                                        setExpandedCard(null);

                                    }}
                                    className={`
                    w-full
                    rounded-2xl
                    transition-all
                    duration-300
                    p-4
                    text-left
                    ${active
                                            ? "bg-indigo-50 border border-indigo-100"
                                            : "hover:bg-gray-50"
                                        }
                  `}
                                >

                                    <div className="flex items-start gap-4">

                                        {/* Active Indicator */}

                                        <div
                                            className={`
                        mt-1
                        w-3
                        h-3
                        rounded-full
                        flex-shrink-0
                        ${active
                                                    ? "bg-indigo-600"
                                                    : "bg-gray-300"
                                                }
                      `}
                                        />

                                        {/* Content */}

                                        <div className="flex-1">

                                            <div className="flex items-center justify-between">

                                                <div>
                                                    <p className="text-xs uppercase tracking-widest text-gray-400">
                                                        Day {day.day}
                                                    </p>
                                                    <h3 className="font-semibold text-gray-900 mt-1 line-clamp-1">
                                                        {day.title || DAY_THEMES[index % DAY_THEMES.length]}
                                                    </h3>
                                                </div>

                                                <span className="text-xl">
                                                    {DAY_ICONS[index % DAY_ICONS.length]}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <p className="text-sm text-gray-500">
                                                    {day.activities?.length || 0} Activities
                                                </p>
                                                {active && (
                                                    <span className="text-xs font-semibold text-indigo-600">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                                Progress
                            </span>
                            <span className="font-semibold">
                                {selectedDay + 1}/{tripData.days.length}
                            </span>
                        </div>

                        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-500"
                                style={{
                                    width: `${((selectedDay + 1) /
                                            tripData.days.length) *
                                        100
                                        }%`,
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* =========================================================
            RIGHT CONTENT
        ========================================================= */}
                <main className="space-y-6">
                    {/* =========================================================
              DAY HEADER
          ========================================================= */}
                    <section className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
                                    {DAY_ICONS[selectedDay % DAY_ICONS.length]}
                                    Day {currentDay.day}
                                </div>

                                <h2 className="mt-5 text-3xl font-bold text-gray-900">
                                    {currentDay.title || DAY_THEMES[selectedDay % DAY_THEMES.length]}
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    {currentDay?.activities?.length || 0} planned activities
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    disabled={selectedDay === 0}
                                    onClick={() => {
                                        setSelectedDay(selectedDay - 1);
                                        setExpandedCard(null);
                                    }}
                                    className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <button
                                    disabled={
                                        selectedDay ===
                                        tripData.days.length - 1
                                    }
                                    onClick={() => {
                                        setSelectedDay(selectedDay + 1);
                                        setExpandedCard(null);
                                    }}
                                    className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40 cursor-pointer"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* =========================================================
              TIMELINE
          ========================================================= */}
                    <section className="space-y-8">
                        {(currentDay?.activities || []).map((activity, index) => {
                            const style = getActivityType(activity.type, activity.title);
                            const Icon = style.icon;

                            return (
                                <div
                                    key={activity.id || index}
                                    className="flex gap-6"
                                >
                                    {/* Timeline */}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`
                        w-12
                        h-12
                        rounded-2xl
                        ${style.bg}
                        ${style.color}
                        flex
                        items-center
                        justify-center
                      `}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        {index !==
                                            currentDay.activities.length - 1 && (
                                                <div className="w-px flex-1 bg-gray-200 my-3" />
                                            )}
                                    </div>

                                    {/* Premium Card */}
                                    <div
                                        onClick={() =>
                                            setExpandedCard(
                                                expandedCard === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                        className="
                      flex-1
                      bg-white
                      rounded-[26px]
                      border
                      border-gray-200
                      shadow-sm
                      hover:shadow-lg
                      transition-all
                      duration-300
                      cursor-pointer
                      overflow-hidden
                    "
                                    >
                                        {/* ---------------- Top ---------------- */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-6">
                                                {/* LEFT */}
                                                <div className="flex-1">
                                                    {/* Time + Badge */}
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-semibold text-gray-500">
                                                            {activity.time || "09:00 AM"}
                                                        </span>

                                                        <span
                                                            className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                ${style.bg}
                                ${style.color}
                              `}
                                                        >
                                                            {activity.type || style.label}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                                                        {activity.title}
                                                    </h3>

                                                    {/* Location */}
                                                    <div className="mt-3 flex items-center gap-2 text-gray-500">
                                                        <MapPin size={15} />
                                                        <span className="text-sm">
                                                            {activity.location || `${destination || "Destination"} Center`}
                                                        </span>
                                                    </div>

                                                    {/* Description */}
                                                    <p className="mt-4 text-gray-500 leading-7">
                                                        {activity.description ||
                                                            activity.details ||
                                                            "Explore this recommended highlight crafted for your personalized trip."}
                                                    </p>

                                                    {/* Chips */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-5">
                                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                                                            ⏱ {activity.duration || "1.5 - 2 Hours"}
                                                        </span>

                                                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                                                            💰 {activity.cost || activity.estimatedCost || "Free / Included"}
                                                        </span>

                                                        <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold">
                                                            ⭐ {activity.rating ? Number(activity.rating).toFixed(1) : "4.8"}
                                                        </span>

                                                        {activity.bookingRequired ? (
                                                            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-1">
                                                                🎟️ Booking Required
                                                            </span>
                                                        ) : (
                                                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1">
                                                                ✓ No Booking Needed
                                                            </span>
                                                        )}

                                                        {(activity.bestTime || activity.best_time) && (
                                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                                                                🕒 Best: {activity.bestTime || activity.best_time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons: Swap, Delete, Expand */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {onSwapActivity && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onSwapActivity(selectedDay, index);
                                                            }}
                                                            title="Swap with alternative activity"
                                                            className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 flex items-center justify-center transition cursor-pointer"
                                                        >
                                                            <RefreshCw size={15} />
                                                        </button>
                                                    )}

                                                    {onDeleteActivity && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteActivity(selectedDay, index);
                                                            }}
                                                            title="Delete this activity"
                                                            className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition cursor-pointer"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}

                                                    {/* Expand Button */}
                                                    <button
                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition"
                                                    >
                                                        {expandedCard === index ? "−" : "+"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ---------------- Expanded ---------------- */}
                                        {expandedCard === index && (
                                            <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            Additional Details
                                                        </h4>
                                                        <p className="mt-2 text-gray-600 leading-7 text-sm">
                                                            {activity.additionalDetails ||
                                                                activity.additional_details ||
                                                                activity.notes ||
                                                                activity.details ||
                                                                "Wear comfortable walking shoes and arrive slightly ahead of time for smooth entry."}
                                                        </p>
                                                        {(activity.bestTime || activity.best_time) && (
                                                            <p className="mt-3 text-xs text-gray-500">
                                                                <span className="font-semibold text-gray-700">Ideal Visiting Time: </span>
                                                                {activity.bestTime || activity.best_time}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">
                                                            AI Recommendation
                                                        </h4>
                                                        <div className="mt-3 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                                                            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs">
                                                                <Sparkles size={15} />
                                                                Attraction Insider Tip
                                                            </div>
                                                            <p className="mt-2 text-sm text-gray-700 leading-6">
                                                                {activity.aiRecommendation ||
                                                                    activity.ai_recommendation ||
                                                                    `Visit during off-peak hours for a relaxed atmosphere. Keep extra time for photos and exploring surrounding streets.`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            );

                        })}

                    </section>

                    {/* ================= DAY SUMMARY ================= */}

                    <section className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-7">

                        <h3 className="text-xl font-bold text-gray-900">

                            Day Summary

                        </h3>

                        <div className="grid md:grid-cols-4 gap-5 mt-6">

                            <div className="rounded-2xl bg-gray-50 p-5">

                                <p className="text-sm text-gray-500">

                                    Activities

                                </p>

                                <h4 className="text-3xl font-bold mt-2">

                                    {currentDay?.activities?.length || 0}

                                </h4>

                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">

                                <p className="text-sm text-gray-500">

                                    Destination

                                </p>

                                <h4 className="text-xl font-semibold mt-2">
                                    {destination || tripData?.destination || city || "Destination"}
                                </h4>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">
                                <p className="text-sm text-gray-500">
                                    Trip Duration
                                </p>
                                <h4 className="text-xl font-semibold mt-2">
                                    {duration || tripData?.days?.length || 1} Days
                                </h4>
                            </div>

                            <div className="rounded-2xl bg-gray-50 p-5">

                                <p className="text-sm text-gray-500">

                                    Status

                                </p>

                                <h4 className="text-xl font-semibold mt-2 text-green-600">

                                    AI Optimized

                                </h4>

                            </div>

                        </div>

                    </section>

                </main>

            </div>

        </div>

    );

}

export default Itinerary;