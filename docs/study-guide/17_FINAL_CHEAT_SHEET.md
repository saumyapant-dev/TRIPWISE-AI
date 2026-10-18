# TripWise AI — Final Viva & Presentation Morning Cheat Sheet

Keep this document open on the morning of your viva, project evaluation, or technical interview. It contains the most vital facts, commands, metrics, and instant answers in a condensed, easy-to-read format.

---

## 1. Quick Commands & Runtime URLs

| Purpose | Terminal Command | Working Directory | Active URL |
| :--- | :--- | :--- | :--- |
| **Start Frontend** | `npm run dev` | `tripwise-ai/` | `http://localhost:5173` |
| **Start Backend** | `npm run server:dev` *(with auto-restart)* | `tripwise-ai/` | `http://localhost:5001` |
| **Backend Health** | `curl http://localhost:5001/api/health` | Anywhere | `status: "ok"` |
| **Database File** | `ls -la server/src/data/tripwise.db*` | `tripwise-ai/` | Binary SQLite file + `-wal` + `-shm` |

---

## 2. Key Architecture Metrics (Memorize These Numbers!)

- **Frontend Framework:** React `19.2.6` (React 19!) + Vite `8.0.12`
- **Styling:** Tailwind CSS `4.3.0`
- **Backend Runtime & Server:** Node.js `v22.5.0+` + Express `4.21.2`
- **Database Engine:** Native `node:sqlite` (`DatabaseSync`) with zero external npm dependencies
- **Database Tables:** Exactly **7 relational tables** (`users`, `trips`, `itinerary_days`, `activities`, `budget_breakdown`, `trip_highlights`, `saved_places`)
- **City Catalog:** Exactly **178 curated cities across 56 countries** with pre-verified GPS coordinates
- **Search Debounce Delay:** **320 milliseconds**
- **AI Models:** Google Gemini (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`)
- **Weather Provider:** Open-Meteo API (**0 API keys required**, 100% free)
- **Geocoding Provider:** OpenStreetMap Nominatim with custom `User-Agent: TripWiseAI/1.0`
- **Password Security:** Salted `crypto.scryptSync(password, salt, 64)` + `crypto.timingSafeEqual()`
- **Token Security:** Custom signed stateless HMAC-SHA256 JWT tokens

---

## 3. Top 10 Viva Questions & Instant Punchy Answers

### 1. What is TripWise AI?
> *"TripWise AI is a full-stack automated travel planning application that transforms user travel preferences—origin, destination, budget, duration, and style—into a day-by-day, hour-by-hour realistic itinerary enriched with live weather forecasts, interactive Leaflet maps, visual budget charts, and persistent SQLite storage."*

### 2. Why did you choose native `node:sqlite` over MongoDB or PostgreSQL?
> *"Because travel itineraries are inherently relational (Users own Trips, Trips own Days, Days own Activities, Trips own Budget Breakdowns). SQLite provides strict foreign keys, cascade deletes, and ACID transactions in an embedded, serverless single file (`tripwise.db`) with zero npm dependencies and zero external database server setup required."*

### 3. How does the city search dropdown work without lagging?
> *"We built a dual-tier hybrid engine: Tier 1 filters 178 popular cities in memory in under 1 millisecond. Tier 2 uses a 320ms debounced asynchronous call to OpenStreetMap Nominatim to cover small towns worldwide. Both result sets are merged and deduplicated using an ES6 Map."*

### 4. What happens if your Gemini API key expires or the internet goes down during the demo?
> *"The app never crashes. We engineered a zero-failure fallback engine with pre-computed, verified multi-day itineraries for major destinations (Seoul, Paris, Tokyo, Athens, etc.) and procedural schedule generators for custom cities, ensuring the app generates a complete, authentic trip under any conditions."*

### 5. How do you prevent the AI from repeating the same landmark across different days?
> *"In `geminiService.js`, we iterate over all generated activities using an ES6 `Set` (`seenTitles`). If any activity title appears more than once across different days, we catch the hallucination, discard the repetitive schedule, and activate our curated non-repeating engine."*

### 6. How are passwords stored and verified securely?
> *"Passwords are never stored in plain text. We generate a 16-byte random salt and derive a 64-byte key using `crypto.scryptSync`. During login, we extract the salt, recompute the hash, and compare buffers using `crypto.timingSafeEqual()` to eliminate cryptographic timing attacks."*

### 7. What is Write-Ahead Logging (WAL) in SQLite?
> *"In traditional SQLite journaling, writes place an exclusive file lock, blocking concurrent readers. Under `PRAGMA journal_mode = WAL;`, writes are appended to a separate log file, allowing concurrent read operations without database lock errors (`SQLITE_BUSY`)."*

### 8. How does `tripsRepo.saveTrip()` ensure data consistency?
> *"Saving a trip touches 5 different tables. We wrap all inserts in an atomic ACID transaction (`BEGIN TRANSACTION ... COMMIT`). If an error occurs on any day or activity, `ROLLBACK` undoes all writes completely, preventing partial or orphaned records."*

### 9. Why did you use Vite instead of Create React App?
> *"Create React App is officially deprecated and relies on slow Webpack bundling. Vite leverages native ES Modules (ESM) in the browser, starting dev servers in under 300 milliseconds and updating components instantly via Hot Module Replacement (HMR)."*

### 10. How do the frontend and backend communicate?
> *"Via a RESTful JSON API. The frontend uses a centralized `api.js` client using the browser's native `fetch()` API. The Express backend uses CORS and `express.json()` middleware to parse requests and return standardized JSON responses with appropriate HTTP status codes (200, 201, 400, 401, 404, 500)."*

---

## 4. Live Demo Golden Path (Step-by-Step Examiner Presentation)

Follow this exact sequence during your live presentation for a flawless demonstration:

1. **Start on Landing Page (`/`):**
   - Point out the modern hero section, clean responsive navbar, and curated trip cards.
   - Click the **"Create Trip"** button in the navbar.
2. **Show the Form (`/generate-trip`):**
   - **Point out that the form is completely blank by default** (no hardcoded defaults!).
   - In **Starting City**, type *"Chandigarh"* (demonstrate instant `<1ms` search from local catalog).
   - In **Destination City**, type *"Athens, Greece"* (show coordinates resolving automatically).
   - Enter **Budget**: `1800`.
   - Enter **Duration**: `5` days.
   - Select **Travel Styles**: Click *Culture* 🏛️ and *City Exploration* 🏙️.
3. **Submit the Trip:**
   - Click **"Generate Trip"**.
   - Point out the loading state spinner.
   - The app navigates to `/trip-details?id=trip_...` within 3–6 seconds.
4. **Walk Through the Trip Details Page (`/trip-details`):**
   - **Hero Section:** Highlight the dynamic destination cover photo, date range, and budget tags.
   - **Left Column:** Expand Day 1 and Day 2. Show the detailed timeline, activity tags, costs, durations, and AI travel recommendations.
   - **Right Column:**
     - Point out the **Interactive Leaflet Map** centered over Athens.
     - Show the **Live 7-day Weather Forecast** from Open-Meteo.
     - Show the **Recharts Budget Breakdown** pie chart.
     - Show the **Travel Tips** and **Trip Highlights** cards.
   - **AI Travel Concierge:** Click the floating chat button in the bottom right corner. Type: *"What is the best way to travel from Athens airport to the city center?"*. Show the prompt and friendly answer.
5. **Demonstrate Persistence on Dashboard (`/dashboard`):**
   - Click **"Dashboard"** in the navbar.
   - Show that the newly generated Athens trip is permanently stored in SQLite and displays in the saved trips grid with its cover photo and metadata.
   - Click the card to reopen the trip details instantly!
