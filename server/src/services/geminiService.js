import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY or GOOGLE_API_KEY found in environment variables.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

export function generateFallbackItinerary(destination, duration, budget, travelStyle) {
  const numDays = Math.min(Math.max(Number(duration) || 3, 1), 10);
  const totalBudget = Number(budget) || 1500;
  const days = [];

  const sampleThemes = [
    "Arrival & City Discovery",
    "Historic Landmarks & Culture",
    "Culinary Adventures & Local Flavors",
    "Nature & Scenic Highlights",
    "Arts, Museums & Shopping",
    "Hidden Gems & Local Neighborhoods",
    "Relaxation & Farewell Views",
  ];

  for (let i = 1; i <= numDays; i++) {
    days.push({
      day: i,
      title: sampleThemes[(i - 1) % sampleThemes.length],
      activities: [
        {
          time: "09:00 AM",
          title: `Morning Exploration in ${destination}`,
          type: "Sightseeing",
          location: `${destination} City Center`,
          description: `Begin your morning taking in the iconic atmosphere, historic streets, and sights of ${destination}.`,
          duration: "2.5 Hours",
          cost: "$20",
          rating: 4.8,
          bookingRequired: false,
          bestTime: "Morning",
          additionalDetails: "Wear comfortable walking shoes and keep a camera ready.",
          aiRecommendation: "Arrive early before morning tour groups for peaceful views.",
        },
        {
          time: "01:00 PM",
          title: `Authentic ${travelStyle || "Local"} Lunch`,
          type: "Dining",
          location: `${destination} Downtown`,
          description: `Savor authentic regional dishes and warm hospitality at a top-rated local dining spot.`,
          duration: "1.5 Hours",
          cost: "$35",
          rating: 4.7,
          bookingRequired: false,
          bestTime: "Afternoon",
          additionalDetails: "Vegetarian and vegan options available upon request.",
          aiRecommendation: "Ask for the daily seasonal chef recommendation.",
        },
        {
          time: "03:30 PM",
          title: `Cultural Discovery & Photo Tour`,
          type: "Sightseeing",
          location: `${destination} Landmark District`,
          description: `Discover heritage architecture, vibrant squares, and memorable photo opportunities.`,
          duration: "2 Hours",
          cost: "$15",
          rating: 4.9,
          bookingRequired: false,
          bestTime: "Afternoon",
          additionalDetails: "Audio guides and local map pamphlets available on site.",
          aiRecommendation: "Golden hour lighting makes this an exceptional photo spot.",
        },
        {
          time: "07:30 PM",
          title: `Evening Dinner & Night Atmosphere`,
          type: "Dining",
          location: `${destination}`,
          description: `Unwind with fine local gastronomy, refreshing beverages, and evening cityscape ambiance.`,
          duration: "2 Hours",
          cost: "$50",
          rating: 4.8,
          bookingRequired: true,
          bestTime: "Evening",
          additionalDetails: "Advance table booking recommended on weekends.",
          aiRecommendation: "Reserve a balcony or window table for memorable evening views.",
        },
      ],
    });
  }

  return {
    budgetBreakdown: {
      flights: Math.round(totalBudget * 0.35),
      hotels: Math.round(totalBudget * 0.3),
      food: Math.round(totalBudget * 0.15),
      transport: Math.round(totalBudget * 0.08),
      activities: Math.round(totalBudget * 0.08),
      shopping: Math.round(totalBudget * 0.04),
    },
    tripHighlights: {
      flight: `Direct Flight to ${destination}`,
      hotel: `Top-Rated Boutique Hotel in ${destination}`,
      topRated: `${destination} Central Landmark`,
      activities: numDays * 4,
      restaurants: numDays * 2,
      nearbyPlaces: [`${destination} Old Town`, `${destination} Waterfront`, `${destination} Hills`, `${destination} Gardens`],
    },
    dailySpending: days.map((d) => ({
      day: `Day ${d.day}`,
      amount: Math.round(totalBudget / numDays),
    })),
    travelTips: [
      {
        category: "Timing",
        title: "Beat the Crowds",
        description: `Visit popular landmarks in ${destination} before 10:00 AM or in the late afternoon for shorter lines.`,
      },
      {
        category: "Food",
        title: "Try Local Specialties",
        description: `Explore neighborhood markets and street food stalls for the freshest and most authentic flavors in ${destination}.`,
      },
      {
        category: "Transport",
        title: "Public Transit Passes",
        description: "Pick up a multi-day metro or bus transit card to save money getting around the city.",
      },
      {
        category: "Photography",
        title: "Golden Hour Views",
        description: "Lookout points across the city offer stunning sunset panoramas for travel photography.",
      },
    ],
    days,
  };
}

export async function generateItinerary({
  city,
  destination,
  budget,
  duration,
  travelStyle,
  preferences,
}) {
  const genAI = getGenAI();

  if (!genAI) {
    console.log("No Gemini API client available; returning high-quality fallback itinerary.");
    return generateFallbackItinerary(destination, duration, budget, travelStyle);
  }

  const prompt = `
Starting City: ${city}
Destination: ${destination}
Budget: ${budget} USD
Duration: ${duration} Days
Travel Style: ${travelStyle}
Preferences: ${preferences || "None specified"}

You are an expert travel planner.
Create a realistic and well-structured travel itinerary in valid JSON format.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT wrap the response in markdown blocks like \`\`\`json.
- Do NOT include any introductory or concluding text outside the JSON.
- Use real attractions, hotels, restaurants, and sights in ${destination}.
- Match the itinerary to the user's budget and travel style.

STRUCTURE:
{
  "budgetBreakdown": {
    "flights": number,
    "hotels": number,
    "food": number,
    "transport": number,
    "activities": number,
    "shopping": number
  },
  "tripHighlights": {
    "flight": "Flight description",
    "hotel": "Hotel name",
    "topRated": "Top attraction name",
    "activities": number,
    "restaurants": number,
    "nearbyPlaces": ["Place 1", "Place 2", "Place 3"]
  },
  "dailySpending": [
    { "day": "Day 1", "amount": number }
  ],
  "travelTips": [
    {
      "category": "Timing" | "Food" | "Transport" | "Photography",
      "title": "Tip title",
      "description": "Tip description"
    }
  ],
  "days": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity name",
          "type": "Sightseeing" | "Dining" | "Hotel" | "Transport" | "Activity",
          "location": "Location name",
          "description": "Short description (max 1 sentence)",
          "duration": "2 Hours",
          "cost": "$25",
          "rating": 4.8,
          "bookingRequired": false,
          "bestTime": "Morning",
          "additionalDetails": "Helpful notes",
          "aiRecommendation": "Pro travel tip"
        }
      ]
    }
  ]
}
`;

  const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  for (const modelName of candidateModels) {
    try {
      console.log(`Calling Gemini with model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (parsed.days && parsed.budgetBreakdown) {
        console.log(`Gemini successfully generated itinerary using ${modelName}`);
        return parsed;
      }
    } catch (err) {
      console.warn(`Gemini generation with ${modelName} failed:`, err.message);
    }
  }

  console.log("All Gemini attempts failed; generating realistic fallback itinerary.");
  return generateFallbackItinerary(destination, duration, budget, travelStyle);
}

export async function chatAboutTrip({ destination, tripContext, question }) {
  const genAI = getGenAI();

  if (!genAI) {
    return `For visiting ${destination}, remember to pack comfortable walking shoes, prepare local payment options (cards and some cash), and download offline map navigation before traveling. Let me know if you need specific advice!`;
  }

  const prompt = `
You are TripWise AI, a helpful, enthusiastic, and knowledgeable travel concierge.
Destination: ${destination}
${tripContext ? `Trip Context: ${tripContext.slice(0, 1000)}` : ""}

User question: "${question}"

Provide a concise, practical, and friendly answer (2 to 4 sentences or quick bullet points).
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return text.trim();
  } catch (error) {
    console.warn("Chat generation failed:", error.message);
    return `Great question about ${destination}! Be sure to check seasonal operating hours for major landmarks, carry local currency for small vendors, and reserve popular dinner spots in advance.`;
  }
}
