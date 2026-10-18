# TripWise AI — Core Code Walkthrough & Line-by-Line Guide

This document breaks down the most important code snippets across the frontend and backend of TripWise AI. Every function, parameter, and algorithmic design choice is explained line-by-line so you can confidently explain the code during an interview.

---

## 1. Frontend: `src/components/Tripgenerator/Form.jsx`

### Snippet 1: Initial State (Zero Hardcoded Defaults)
```javascript
// Lines 11-30 in Form.jsx
const [city, setCity] = useState("");
const [destination, setDestination] = useState(() => {
  const params = new URLSearchParams(location.search || window.location.search);
  return params.get("destination") || "";
});
const [budget, setBudget] = useState("");
const [duration, setDuration] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [selectedStyles, setSelectedStyles] = useState([]);
const [preferences, setPreferences] = useState("");
const [loading, setLoading] = useState(false);
const [errorBanner, setErrorBanner] = useState(null);
```
- **Line-by-line explanation:**
  - `const [city, setCity] = useState("")`: Departure city defaults to an empty string.
  - `const [destination, setDestination] = useState(() => ...)`: Uses a **lazy initializer function**. It checks if the URL has a `?destination=` query parameter (e.g. if the user clicked a destination card from the landing page). If present, it pre-fills that destination; otherwise, it initializes as blank.
  - `budget`, `duration`, `fromDate`, `toDate`: All initialized as empty strings so input placeholders are clearly visible.
  - `selectedStyles`: Initialized as an empty array `[]` requiring the user to choose at least one category chip.
  - `loading`: Boolean state controlling the spinning loader on the submit button.
  - `errorBanner`: Holds user-facing validation error strings or `null` if the form is valid.

---

### Snippet 2: Validation & Submission Handler
```javascript
// Lines 118-160 in Form.jsx
const handleGenerateTrip = async () => {
  setErrorBanner(null);

  if (!city.trim()) {
    setErrorBanner("Please enter a Starting City.");
    return;
  }
  if (!destination.trim()) {
    setErrorBanner("Please enter or select a Destination.");
    return;
  }
  if (!budget || !budget.trim()) {
    setErrorBanner("Please enter a Total Budget.");
    return;
  }
  if (!duration || !duration.trim()) {
    setErrorBanner("Please enter a Trip Duration.");
    return;
  }
  if (selectedStyles.length === 0) {
    setErrorBanner("Please select at least one Travel Style.");
    return;
  }

  const parsedBudget = Number(budget);
  const parsedDuration = Number(duration);

  if (isNaN(parsedBudget) || parsedBudget <= 0) {
    setErrorBanner("Budget must be a valid positive number.");
    return;
  }
  if (isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 30) {
    setErrorBanner("Trip duration must be between 1 and 30 days.");
    return;
  }

  setLoading(true);
  // ... proceed to API request
```
- **Line-by-line explanation:**
  - `setErrorBanner(null)`: Clears any previous error messages before re-evaluating.
  - `!city.trim()`, `!destination.trim()`: Strips whitespace to ensure the user didn't just enter spaces.
  - `selectedStyles.length === 0`: Ensures the user picked at least one category chip.
  - `Number(budget)` / `Number(duration)`: Converts strings to numbers.
  - `isNaN(...) || parsedBudget <= 0`: Guards against strings like `"abc"` or negative budgets like `"-500"`.
  - `parsedDuration > 30`: Enforces a 30-day upper bound to prevent LLM token limits and JSON truncation.
  - `setLoading(true)`: Disables the form button and shows a progress spinner.

---

## 2. Frontend: `src/components/Tripgenerator/CityDropdown.jsx`

### Snippet: Debounced Geocoding & Local In-Memory Filtering
```javascript
// Lines 65-96 in CityDropdown.jsx

// 1. Instant local search (<1ms)
const localCities = useMemo(() => {
  return filterDestinations({
    country: activeCountry,
    search: searchQuery,
  });
}, [activeCountry, searchQuery]);

// 2. Debounced remote geocoding search for worldwide coverage
useEffect(() => {
  const query = searchQuery.trim();
  if (query.length < 2) {
    return;
  }

  const timer = setTimeout(() => {
    setIsSearchingRemote(true);
    searchCities(query, activeCountry)
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setRemoteResults(res.data);
        }
      })
      .catch(() => {
        // Retain local matches if remote search fails
      })
      .finally(() => {
        setIsSearchingRemote(false);
      });
  }, 320);

  return () => clearTimeout(timer);
}, [searchQuery, activeCountry]);
```
- **Line-by-line explanation:**
  - `useMemo(() => ..., [activeCountry, searchQuery])`: Filters the 178-city catalog in RAM. Because it is wrapped in `useMemo`, it only re-runs when the search text or selected country changes.
  - `if (query.length < 2) return`: Prevents firing network requests for single characters like "a".
  - `setTimeout(..., 320)`: Delays the remote API call by 320 milliseconds.
  - `return () => clearTimeout(timer)`: **Cleanup function**. If the user types another letter within 320ms, React cancels the previous timer and starts a fresh one. This eliminates unnecessary network traffic.
  - `setIsSearchingRemote(true/false)`: Toggles the subtle loading spinner inside the search input.

---

## 3. Backend: `server/src/services/geminiService.js`

### Snippet: AI Model Cascade, Markdown Stripping & Duplicate Detection
```javascript
// Lines 580-628 in geminiService.js
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

    if (parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0 && parsed.budgetBreakdown) {
      // Validate non-repetition across days
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
    }
  } catch (err) {
    console.warn(`Gemini generation with ${modelName} failed:`, err.message);
  }
}

console.log("All Gemini attempts failed; generating realistic fallback itinerary.");
return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
```
- **Line-by-line explanation:**
  - `candidateModels`: Prioritized array of Gemini model names to try in sequence.
  - `cleaned = text.replace(...)`: Uses regex to strip markdown code blocks like ` ```json ` and ` ``` ` which LLMs frequently append despite prompt instructions.
  - `const parsed = JSON.parse(cleaned)`: Parses the cleaned string into a JavaScript object.
  - `const seenTitles = new Set()`: Creates an ES6 Set to track activity titles across the entire trip.
  - `if (seenTitles.has(act.title))`: If an activity name was already used on an earlier day, `hasDuplicates` is set to `true`.
  - `if (!hasDuplicates) return parsed`: Returns the validated AI plan.
  - `else ... return generateFallbackItinerary(...)`: Rejects repetitive hallucinations and uses the curated engine.
  - `catch (err)`: Logs errors (e.g. quota limit, network timeout) and gracefully falls through to the next model or fallback generator.

---

## 4. Backend: `server/src/db/repositories.js`

### Snippet: Atomic Transaction for Multi-Table Persistence
```javascript
// Lines 127-250 in repositories.js
db.exec("BEGIN TRANSACTION;");
try {
  // 1. Delete if exists (for upsert or overwrite)
  db.prepare("DELETE FROM trips WHERE id = ?").run(tripId);

  // 2. Insert into trips
  const insertTripStmt = db.prepare(`
    INSERT INTO trips (
      id, user_id, city, destination, country, coordinates, budget, duration,
      from_date, to_date, travel_style, preferences, image_url,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);
  insertTripStmt.run(tripId, userId, city, destination, country, coordinatesStr, budget, duration, fromDate, toDate, travelStyle, preferencesStr, imageUrl);

  // 3. Insert budget breakdown
  const insertBudgetStmt = db.prepare(`
    INSERT INTO budget_breakdown (id, trip_id, flights, hotels, food, transport, activities, shopping)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertBudgetStmt.run(generateId("bb"), tripId, budgetBreakdown.flights, budgetBreakdown.hotels, budgetBreakdown.food, budgetBreakdown.transport, budgetBreakdown.activities, budgetBreakdown.shopping);

  // 4. Insert trip highlights
  const insertHighlightsStmt = db.prepare(`
    INSERT INTO trip_highlights (id, trip_id, flight, hotel, top_rated, activities_count, restaurants_count, nearby_places, travel_tips)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertHighlightsStmt.run(generateId("th"), tripId, tripHighlights.flight, tripHighlights.hotel, tripHighlights.topRated, tripHighlights.activities, tripHighlights.restaurants, JSON.stringify(tripHighlights.nearbyPlaces), JSON.stringify(travelTipsToSave));

  // 5. Insert days and activities
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayId = generateId("day");
    insertDayStmt.run(dayId, tripId, day.day || i + 1, day.title || `Day ${i + 1}`);

    for (const act of day.activities) {
      insertActStmt.run(generateId("act"), dayId, tripId, act.time, act.title, act.type, act.location, act.description, act.duration, act.cost, act.rating, act.bookingRequired ? 1 : 0, act.bestTime, act.additionalDetails, act.aiRecommendation);
    }
  }

  // 6. Commit transaction
  db.exec("COMMIT;");
  return this.getTripById(tripId);
} catch (err) {
  // 7. Rollback on failure
  db.exec("ROLLBACK;");
  console.error("[DB] Transaction failed while saving trip:", err);
  throw err;
}
```
- **Line-by-line explanation:**
  - `db.exec("BEGIN TRANSACTION;")`: Begins a SQLite transaction block.
  - `db.prepare(...).run(...)`: Uses **parameterized queries** (`?` placeholders). This guarantees protection against **SQL Injection attacks** because parameters are treated strictly as data literals, never executable SQL commands.
  - `JSON.stringify(...)`: Encodes arrays (`nearbyPlaces`, `travelTips`) into JSON strings before storing in SQLite TEXT columns.
  - `db.exec("COMMIT;")`: Persists all 5 tables atomically.
  - `catch (err) { db.exec("ROLLBACK;"); throw err; }`: If any error occurs anywhere in the process, every single write is completely undone.

---

## 5. Backend: `server/src/routes/auth.js`

### Snippet: Password Hashing, Scrypt, and Timing Attack Defense
```javascript
// Lines 67-84 in auth.js
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  if (storedHash.includes(":")) {
    const [salt, key] = storedHash.split(":");
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  }
  const sha = crypto.createHash("sha256").update(password).digest("hex");
  return storedHash === sha || storedHash === password;
}
```
- **Line-by-line explanation:**
  - `crypto.randomBytes(16)`: Generates 16 cryptographically secure random bytes to serve as a unique **salt**. The salt prevents attackers from using precomputed **Rainbow Tables** to crack passwords.
  - `crypto.scryptSync(password, salt, 64)`: Uses the **scrypt** key derivation function. Scrypt is memory-hard and computationally intensive, making brute-force attacks via ASICs or GPUs computationally unfeasible.
  - `${salt}:${derivedKey}`: Combines the unique salt and hash with a colon separator for clean storage.
  - `crypto.timingSafeEqual(keyBuffer, derivedKey)`: Standard string comparison (`===`) terminates as soon as the first mismatched byte is encountered, allowing attackers to measure execution time down to nanoseconds to deduce password bytes (a **timing attack**). `timingSafeEqual` takes constant time regardless of where or if a difference occurs, eliminating timing vulnerabilities.
