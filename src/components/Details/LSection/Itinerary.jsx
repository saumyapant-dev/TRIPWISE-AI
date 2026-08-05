import React, { useState } from "react";

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
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const DAY_THEMES = [
  "Arrival",
  "Culture",
  "Nature",
  "Adventure",
  "Food Trail",
  "Shopping",
  "Departure",
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

const getActivityType = (title = "") => {

  const text = title.toLowerCase();

  if (
    text.includes("flight") ||
    text.includes("airport") ||
    text.includes("depart") ||
    text.includes("arrive")
  ) {
    return {
      label: "Flight",
      icon: Plane,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    };
  }

  if (
    text.includes("hotel") ||
    text.includes("check in") ||
    text.includes("check-in")
  ) {
    return {
      label: "Hotel",
      icon: Hotel,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
    };
  }

  if (
    text.includes("restaurant") ||
    text.includes("breakfast") ||
    text.includes("lunch") ||
    text.includes("dinner") ||
    text.includes("cafe")
  ) {
    return {
      label: "Dining",
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
    text.includes("transport")
  ) {
    return {
      label: "Transport",
      icon: Bus,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
    };
  }

  if (
    text.includes("museum") ||
    text.includes("temple") ||
    text.includes("explore") ||
    text.includes("tour")
  ) {
    return {
      label: "Sightseeing",
      icon: Landmark,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
    };
  }

  if (text.includes("shopping")) {
    return {
      label: "Shopping",
      icon: ShoppingBag,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-100",
    };
  }

  return {
    label: "Activity",
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
}) {

  const [selectedDay, setSelectedDay] = useState(0);

  const [expandedCard, setExpandedCard] = useState(null);

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

  const currentDay = tripData.days[selectedDay];

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

              {city}

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

                {fromDate} – {toDate}

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

                {duration} Days

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
                  (sum, day) => sum + day.activities.length,
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

                {tripData.budget || "AI Estimate"}

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

                Pleasant

              </h3>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          MAIN LAYOUT
      ========================================================= */}

      <div className="grid grid-cols-[270px_1fr] gap-8 mt-8">
                {/* =========================================================
            LEFT SIDEBAR
        ========================================================= */}

        <aside className="bg-white rounded-[28px] border border-gray-200 shadow-sm p-6 h-fit sticky top-8">

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
                    ${
                      active
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
                        ${
                          active
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

                          <h3 className="font-semibold text-gray-900 mt-1">

                            {DAY_THEMES[index % DAY_THEMES.length]}

                          </h3>

                        </div>

                        <span className="text-xl">

                          {DAY_ICONS[index % DAY_ICONS.length]}

                        </span>

                      </div>

                      <div className="flex items-center justify-between mt-4">

                        <p className="text-sm text-gray-500">

                          {day.activities.length} Activities

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
                  width: `${
                    ((selectedDay + 1) /
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

                  {DAY_THEMES[selectedDay % DAY_THEMES.length]}

                </h2>

                <p className="mt-2 text-gray-500">

                  {currentDay.activities.length} planned activities

                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  disabled={selectedDay === 0}
                  onClick={() => {

                    setSelectedDay(selectedDay - 1);
                    setExpandedCard(null);

                  }}
                  className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
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
                  className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 disabled:opacity-40"
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

            {currentDay.activities.map((activity, index) => {

              const style = getActivityType(activity.title);

              const Icon = style.icon;

              return (

                <div
                  key={index}
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

                            <span className="text-sm font-semibold text-gray-400">

                              {activity.time || "09:00"}

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

                              {style.label}

                            </span>

                          </div>

                          {/* Title */}

                          <h3 className="mt-4 text-xl font-bold text-gray-900">

                            {activity.title}

                          </h3>

                          {/* Location */}

                          {activity.location && (

                            <div className="mt-3 flex items-center gap-2 text-gray-500">

                              <MapPin size={15} />

                              <span className="text-sm">

                                {activity.location}

                              </span>

                            </div>

                          )}

                          {/* Description */}

                          <p className="mt-4 text-gray-500 leading-7">

                            {activity.description ||
                              activity.details ||
                              "No description available."}

                          </p>

                          {/* Chips */}

                          <div className="flex flex-wrap gap-2 mt-5">

                            {activity.duration && (

                              <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">

                                ⏱ {activity.duration}

                              </span>

                            )}

                            {activity.cost && (

                              <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm">

                                💰 {activity.cost}

                              </span>

                            )}

                            {activity.rating && (

                              <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-sm">

                                ⭐ {activity.rating}

                              </span>

                            )}

                          </div>

                        </div>

                        {/* Expand */}

                        <button
                          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                        >

                          {expandedCard === index ? "−" : "+"}

                        </button>

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

                            <p className="mt-2 text-gray-600 leading-7">

                              {activity.notes ||
                                activity.details ||
                                "No additional information available."}

                            </p>

                          </div>

                          <div>

                            <h4 className="font-semibold text-gray-900">

                              AI Recommendation

                            </h4>

                            <div className="mt-3 rounded-2xl bg-indigo-50 border border-indigo-100 p-4">

                              <div className="flex items-center gap-2 text-indigo-600 font-semibold">

                                <Sparkles size={16} />

                                Travel Tip

                              </div>

                              <p className="mt-2 text-sm text-gray-700 leading-6">

                                Try visiting this attraction during
                                non-peak hours for a better experience.
                                Keep some extra time for photography
                                and local exploration nearby.

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

                  {currentDay.activities.length}

                </h4>

              </div>

              <div className="rounded-2xl bg-gray-50 p-5">

                <p className="text-sm text-gray-500">

                  Destination

                </p>

                <h4 className="text-xl font-semibold mt-2">

                  {city}

                </h4>

              </div>

              <div className="rounded-2xl bg-gray-50 p-5">

                <p className="text-sm text-gray-500">

                  Trip Duration

                </p>

                <h4 className="text-xl font-semibold mt-2">

                  {duration} Days

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