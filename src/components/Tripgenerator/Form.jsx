import { model } from "../../services/gemini";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
Create a travel itinerary.

Starting City: ${city}
Destination: ${destination}
Budget: ${budget}
Duration: ${duration} days
Travel Style: ${travelStyle}
Preferences: ${preferences}

Return ONLY valid JSON.

Format:

{
  "tripTitle": "",
  "overview": "",
  "days": [
    {
      "day": 1,
      "title": "",
      "activities": [
        {
          "time": "",
          "title": "",
          "description": ""
        }
      ]
    }
  ],
  "budgetBreakdown": [],
  "travelTips": []
}

Do not include markdown.
Do not include explanations.
Return JSON only.
`;
      const result = await model.generateContent(prompt);

      console.log("Gemini responded");

      const responseText = result.response.text();

      console.log(responseText);

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