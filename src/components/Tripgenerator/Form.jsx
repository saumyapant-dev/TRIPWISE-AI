import { model } from "../../services/gemini";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDestinationImage } from "../../services/unsplash";

const Form = () => {

  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [preferences, setPreferences] = useState("");

  const styles = [
    { name: "Beach & Relaxation", icon: "🏖️" },
    { name: "Adventure", icon: "⛰️" },
    { name: "Culture", icon: "🏛️" },
    { name: "Food & Culinary", icon: "🍜" },
    { name: "City Exploration", icon: "🏙️" },
    { name: "Wildlife", icon: "🦁" },
  ];

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateTrip = async () => {

    console.log("Button clicked");

    if (!city || !budget || !duration || !travelStyle) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {

      console.log("Calling Gemini...");

      const prompt = `
Starting City: ${city}
Destination: ${destination}
Budget: ${budget} USD
Duration: ${duration} Days
Travel Style: ${travelStyle}
Preferences: ${preferences}

You are an expert travel planner.

Create a realistic and well-structured travel itinerary.

IMPORTANT RULES:

- Return ONLY valid JSON.
- Do NOT wrap the response in markdown.
- Do NOT use \`\`\`json.
- Do NOT include explanations outside JSON.
- Use real attractions, hotels, restaurants, airports and flights.
- Match the itinerary to the user's budget.
- Include flight recommendations when appropriate.
- Include hotel recommendations.
- Include restaurant recommendations.
- Include airport transfers when needed.

ITINERARY RULES:

- Each day should contain ONLY 5 to 7 major activities.
- Avoid excessive details.
- Avoid long paragraphs.
- Keep descriptions concise (maximum 1 sentence).
- Focus on the most important experiences.
- Use realistic timings.
- Do not create hour-by-hour schedules.
- Make the itinerary easy to read.

ACTIVITY RULES:

For EVERY activity return:

- type
- location
- duration
- estimatedCost
- rating
- bookingRequired
- bestTime
- additionalDetails
- aiRecommendation

Every field is mandatory.

Do not leave any field empty.

Use realistic values based on the destination.

GOOD EXAMPLE:

08:00 AM - Check-in at L7 Hongdae Hotel
11:00 AM - Explore Gyeongbokgung Palace
01:00 PM - Lunch at Tosokchon Samgyetang
04:00 PM - Visit Bukchon Hanok Village
07:00 PM - Dinner at Myeongdong Kyoja

Return JSON in EXACTLY this format:

BUDGET RULES:

- Estimate a realistic budget breakdown based on destination, duration and total budget.
- Include categories:
  - Flights
  - Hotels
  - Food
  - Transport
  - Activities
  - Shopping
- The sum of all categories should approximately match the user's budget.

TRIP HIGHLIGHTS RULES:

- Include one flight recommendation
- Include one hotel recommendation
- Include one top attraction
- Include total activities count
- Include total restaurants count

DAILY SPENDING RULES:

- Return daily spending estimates for every day.
- Base spending on the itinerary activities.
- Shopping days should cost more.
- Activity-heavy days should cost more.
- Relaxed days should cost less.
- Total spending should roughly match the user's budget.

{

"budgetBreakdown": {
    "flights": 1200,
    "hotels": 980,
    "food": 420,
    "transport": 180,
    "activities": 310,
    "shopping": 270
  },

  "tripHighlights": {
  "flight": "IndiGo 6E 2132 • DED → PNQ",
  "hotel": "Novotel Pune Viman Nagar",
  "topRated": "Aga Khan Palace",
  "activities": 15,
  "restaurants": 8
},

  "dailySpending": [
  {
    "day": "Day 1",
    "amount": 120
  },
  {
    "day": "Day 2",
    "amount": 80
  }
],

"travelTips": [
  {
    "category": "Timing",
    "title": "Best Time to Visit",
    "description": "Visit during off-peak hours."
  },
  {
    "category": "Food",
    "title": "Try Local Food",
    "description": "Explore authentic local cuisine."
  },
  {
    "category": "Transport",
    "title": "Use Public Transport",
    "description": "Save money using metro and buses."
  },
  {
    "category": "Photography",
    "title": "Golden Hour Views",
    "description": "Capture photos around sunset."
  }
],

  "days": [
    {
      "day": 1,
      "title": "Arrival & City Exploration",
      "activities": [
        {
  "time": "08:00 AM",
  "title": "Check-in at L7 Hongdae Hotel",
  "type": "Hotel",
  "location": "Hongdae, Seoul",
  "description": "Modern hotel in the heart of Hongdae.",
  "duration": "2 Hours",
  "estimatedCost": "$45",
  "rating": 4.8,
  "bookingRequired": false,
  "bestTime": "Morning",
  "additionalDetails": "Early check-in depends on room availability. Keep your passport ready.",
  "aiRecommendation": "Arrive early to avoid check-in queues and explore nearby cafés while waiting if the room isn't ready."
},
        {
          "time": "01:00 PM",
          "title": "Lunch at Myeongdong Kyoja",
          "description": "Famous Korean noodle restaurant."
        }
      ]
    }
  ]
}
`;
      const result = await model.generateContent(prompt);

      console.log("Gemini responded");

      const responseText = await result.response.text();

      console.log(responseText);

      const imageUrl = await getDestinationImage(destination);
      console.log("Image URL:", imageUrl);

      navigate("/trip-details", {
        state: {
          city,
          destination,
          budget,
          duration,
          fromDate,
          toDate,
          travelStyle,
          preferences,
          tripData: responseText,
          imageUrl,
        },
      });

    } catch (error) {

      console.error("Gemini Error:", error);

    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-sm border border-gray-100 p-10">

      <div className="grid md:grid-cols-2 gap-8">

        <div>
          <label className="block mb-3 font-medium text-gray-700 ">
            📍 Starting City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="San Francisco, USA"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block mb-3 font-medium text-gray-700">
            📍 Destination (Optional)
          </label>

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Let AI surprise me!"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block mb-3 font-medium text-gray-700">
            💰 Budget (USD)
          </label>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="2000"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block mb-3 font-medium text-gray-700">
            📅 Trip Duration (Days)
          </label>

          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="7"
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block mb-3 font-medium text-gray-700">
            📅 Travel Dates (Optional)
          </label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block mb-3 text-white">
            Hidden
          </label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

      </div>


      <div className="mt-12">
        <h3 className="font-medium text-gray-800 mb-6">
          Select Your Travel Style
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {styles.map((style) => (
            <div
              key={style.name}
              onClick={() => setTravelStyle(style.name)}
              className={`cursor-pointer border rounded-2xl p-6 text-center transition-all duration-300 ${travelStyle === style.name
                ? "border-purple-600 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300"
                }`}
            >
              <div className="text-3xl mb-2">
                {style.icon}
              </div>

              <p className="font-medium">
                {style.name}
              </p>
            </div>
          ))}
        </div>
      </div>


      <div className="mt-12">
        <label className="block mb-3 font-medium text-gray-700">
          Special Preferences (Optional)
        </label>

        <textarea
          rows="5"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="E.g., I love museums, want to try local street food, prefer budget-friendly accommodations..."
          className="w-full border border-gray-200 rounded-2xl p-5 resize-none outline-none"
        />
      </div>


      <button
        onClick={handleGenerateTrip}
        className="block mt-10 w-full py-5 rounded-2xl text-white font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-center transition duration-300 ease-in-out hover:scale-105"
      >
        {loading ? "Generating..." : "✨ Generate My Trip with AI"}
      </button>

      <p className="text-center text-gray-500 mt-8">
        🔒 Your preferences are private and secure
      </p>

    </div>
  );
};

export default Form;