# TripWise AI — Google Gemini AI Integration & Fallback Engine

This document details how Google Gemini Generative AI is integrated into TripWise AI. It explores prompt engineering, schema enforcement, duplicate detection, model cascades, and the curated fallback engine.

---

## 1. Integration Architecture & Model Cascade

TripWise AI uses the official `@google/generative-ai` SDK (`GoogleGenerativeAI`) on the backend in `server/src/services/geminiService.js`.

### Why Call Gemini from the Backend Instead of the Frontend?
1. **API Key Security:** If Gemini were called directly from React in the browser, the secret `GEMINI_API_KEY` would be exposed in the browser's Network inspector or client bundle. Calling it from Express keeps the key completely safe on the server.
2. **Server-Side Validation & Sanitization:** The backend can inspect the AI's response, validate its schema, deduplicate activities, and run the fallback engine before persisting to the database.

### The Multi-Model Fallback Cascade
In `generateItinerary()`, the service does not rely on a single model endpoint. It iterates through a prioritized candidate list:

```javascript
const candidateModels = [
  "gemini-1.5-flash",  // Tier 1: Fastest response (<1s), lowest latency, high JSON fidelity
  "gemini-2.0-flash",  // Tier 2: Next-gen flash model for fallback
  "gemini-1.5-pro"     // Tier 3: High reasoning capability for complex prompts
];

for (const modelName of candidateModels) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    // ... parse and validate ...
  } catch (err) {
    console.warn(`Gemini generation with ${modelName} failed:`, err.message);
  }
}
```

If one model experiences temporary rate limits or regional maintenance, the loop automatically attempts the next candidate.

---

## 2. Prompt Engineering & Strict Schema Enforcement

LLMs naturally tend to produce conversational text (e.g. *"Here is your 5-day itinerary for Athens: ..."*). However, our React application requires structured data to render cards, charts, and maps.

### The System Prompt Architecture
The prompt in `geminiService.js` incorporates strict prompt engineering techniques:

```
You are an expert, realistic, and highly knowledgeable travel planner.
Generate a realistic, non-repeating day-by-day travel itinerary for:
Destination: ${destination}
Duration: ${duration} Days
Total Budget: $${budget} USD
Travel Style: ${travelStyle}
Preferences: ${preferences.join(", ")}

STRICT REQUIREMENTS:
1. OUTPUT FORMAT: Return ONLY a valid, parseable JSON object.
   DO NOT include any markdown fences (like ```json), DO NOT include any explanatory text before or after the JSON.
2. NON-REPETITION: Every day MUST feature completely unique, realistic landmarks, activities, and dining spots. DO NOT repeat the same attraction across different days.
3. BUDGET CONSISTENCY: The sum of numbers in budgetBreakdown must equal approximately ${budget}.
4. DAYS COUNT: You MUST return exactly ${duration} day objects in the "days" array.

JSON SCHEMA:
{
  "tripHighlights": {
    "flight": "Flight from origin to destination",
    "hotel": "Recommended accommodation name & area",
    "topRated": "Most iconic landmark in destination",
    "activities": number,
    "restaurants": number,
    "nearbyPlaces": ["Place 1", "Place 2", "Place 3"]
  },
  "budgetBreakdown": {
    "flights": number,
    "hotels": number,
    "food": number,
    "transport": number,
    "activities": number,
    "shopping": number
  },
  "travelTips": [
    { "category": "Timing" | "Food" | "Transport" | "Photography", "title": "...", "description": "..." }
  ],
  "days": [
    {
      "day": 1,
      "title": "Day 1 Theme Title",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Unique Activity Name",
          "type": "Sightseeing" | "Dining" | "Hotel" | "Transport" | "Activity",
          "location": "Specific Location Name",
          "description": "Short description (1-2 sentences)",
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
```

---

## 3. Parsing & Markdown Sanitization

Even when instructed not to output markdown, LLMs often wrap responses in markdown code fences (` ```json ... ``` `). 

To ensure bulletproof parsing, `geminiService.js` performs a two-step sanitization:
```javascript
const text = await result.response.text();

// Strip markdown fences and whitespace
const cleaned = text
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

const parsed = JSON.parse(cleaned);
```

---

## 4. Hallucination & Duplicate Activity Detection

A common flaw in AI-generated travel itineraries is **activity repetition** (e.g., suggesting the Eiffel Tower on Day 1, Day 3, and Day 5).

TripWise AI implements an automated **Duplicate Activity Detector** using a JavaScript `Set`:

```javascript
const seenTitles = new Set();
let hasDuplicates = false;

for (const day of parsed.days) {
  if (!day.activities) continue;
  for (const act of day.activities) {
    if (seenTitles.has(act.title)) {
      hasDuplicates = true;
      break;
    }
    seenTitles.add(act.title);
  }
  if (hasDuplicates) break;
}

if (!hasDuplicates) {
  console.log(`Gemini successfully generated non-repeating itinerary using ${modelName}`);
  return parsed;
} else {
  console.log(`Gemini generated repeating activities across days; falling back to curated non-repeating engine.`);
  return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
}
```

If the AI hallucinates repeating activities, the response is discarded and the reliable curated engine steps in.

---

## 5. The Curated Fallback Itinerary Engine

A vital architectural strength of TripWise AI is its **Zero-Failure Guarantee**. Even if:
- No `GEMINI_API_KEY` is provided in `.env`
- The user runs out of API quota
- The internet goes offline during an examiner demo
- Gemini returns malformed JSON or repeating activities

The application **never crashes**. It transparently generates a 100% realistic itinerary via `generateFallbackItinerary()`.

### A. Authentic Curated Hubs (`CURATED_DESTINATION_ITINERARIES`)
The backend maintains pre-computed, verified multi-day itineraries for major destinations:
- **Seoul & Busan (South Korea):** Gyeongbokgung Palace, Tosokchon Samgyetang, Bukchon Hanok Village, Haeundae Beach, Gamcheon Culture Village.
- **Tokyo & Kyoto (Japan):** Senso-ji, Fushimi Inari-taisha, Tsukiji Market, Arashiyama Bamboo Grove.
- **Athens (Greece):** Acropolis, Parthenon, Plaka District, Ancient Agora, Temple of Olympian Zeus.
- **Paris, London, New York, Bali, Rome, Dubai, Sydney, Switzerland, and 15+ Indian states** (Kerala, Kashmir, Rajasthan, Himachal Pradesh, etc.).

### B. Procedural Engine for Custom Cities
If a user creates a trip for an uncurated city (e.g., *Chandigarh* or *Gwalior*), the fallback engine dynamically synthesizes a realistic plan using category templates (Heritage morning walk, iconic regional dining, botanical gardens, sunset panorama viewpoints) ensuring no duplicate titles and adjusting budget allocations mathematically:

```javascript
budgetBreakdown: {
  flights: Math.round(budget * 0.35),
  hotels: Math.round(budget * 0.30),
  food: Math.round(budget * 0.15),
  transport: Math.round(budget * 0.08),
  activities: Math.round(budget * 0.08),
  shopping: Math.round(budget * 0.04),
}
```

---

## 6. The Interactive AI Travel Concierge (`/api/chat`)

TripWise AI includes a floating interactive concierge on the trip details page (`src/components/Details/ChatButton.jsx`).

- **Endpoint:** `POST /api/chat`
- **Request Payload:**
  ```json
  {
    "destination": "Athens, Greece",
    "tripContext": "5-day trip, budget $1800, Culture & City Exploration",
    "question": "What is the best way to get from Athens airport to Syntagma Square?"
  }
  ```
- **Backend Function (`chatAboutTrip`):**
  Uses `gemini-1.5-flash` with a focused conversational prompt.
- **Fallback Response:** If the API key is unavailable, it provides practical local travel tips (e.g. metro advice, comfortable walking shoes, currency recommendations) instead of failing.
