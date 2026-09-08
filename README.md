# TripWise AI

TripWise AI is a full-stack web application designed to help travelers plan trips by combining AI-generated itineraries, destination weather forecasts, interactive maps, and budget tracking in a single dashboard.

This project was built as a portfolio project to demonstrate full-stack development with React, Node.js, Express, SQLite, and external API integrations (Google Gemini, Open-Meteo, and OpenStreetMap).

---

## 🎯 The Problem Being Solved

When planning a trip, travelers usually have to jump across four or five different tabs:
- Searching blogs and travel guides for day-by-day activity ideas
- Looking up addresses and pin-pointing them on map apps
- Checking independent weather forecasting websites for seasonal temperatures
- Calculating expenses on spreadsheets or notes apps

TripWise AI brings all four parts together into one simple interface. Once a user enters their destination, duration, budget, and travel preferences, the application generates a complete travel plan with an itinerary, mapped coordinates, a 7-day weather outlook, and estimated category expenses.

---

## 🔄 Main User Flow

1. **Trip Generation Form (`/generate-trip`)**:
   - The user opens the form (starts completely blank).
   - The user searches for a destination using a searchable dropdown. The dropdown instantly searches an offline dataset of **178 cities across 56 countries**, and falls back to OpenStreetMap Nominatim geocoding for unlisted cities.
   - The user specifies trip duration (in days), total budget, travel style, and preferences (e.g., Culture, Adventure, Foodie, Relaxation).
2. **Backend Processing (`/api/trips/generate`)**:
   - Express validates the input and calls Google Gemini (`gemini-1.5-flash`) with a structured prompt requesting a valid JSON itinerary.
   - If the Gemini API key is missing or encounters a quota limit, the backend automatically serves an authentic, multi-day fallback itinerary so the application never crashes.
   - A destination cover photo is matched from a local photo dictionary or the Unsplash API.
   - The trip is saved directly into the local SQLite database.
3. **Trip Details Page (`/trip-details`)**:
   - **Itinerary View**: Day-by-day morning, afternoon, and evening activities with times, costs, and tips.
   - **Interactive Map**: Renders destination coordinates and attractions using Leaflet.
   - **Live Weather**: Fetches real-time temperature, condition codes, and a 7-day forecast from Open-Meteo.
   - **Budget Breakdown**: Shows flight, hotel, dining, transit, and activity allocations via Recharts.
   - **AI Concierge**: A quick chat modal to ask destination-specific travel questions.
4. **Dashboard (`/dashboard`)**:
   - Users can review, search, filter, and delete their saved trips.
   - If the backend is temporarily unreachable, saved trips fall back to browser `localStorage`.

---

## 🏗️ Technical Architecture & Design Decisions

### 1. Why React and Vite?
- **React 18**: Enables a component-based architecture for distinct UI modules (itinerary timeline, weather widgets, Leaflet map, chat assistant) with predictable state management.
- **Vite**: Chosen over Create React App because of its near-instant hot module replacement (HMR), fast development server start times, and optimized production builds via Rollup.

### 2. Why Express.js?
- **Security**: Direct API calls to Google Gemini from a browser would expose the `GEMINI_API_KEY` in client-side network requests or bundled JavaScript. Using Express keeps all API keys strictly on the server.
- **Data Coordination**: Express serves as the central hub: coordinating geocoding, AI prompting, weather fetching, and database persistence before sending clean, unified JSON back to the frontend.

### 3. How Google Gemini is Called
- Handled in `server/src/services/geminiService.js` using `@google/generative-ai`.
- A detailed system prompt instructs the model to return **only** structured JSON matching a strict schema (days, time slots, activity titles, categories, durations, costs, and budget allocations).
- **Graceful Fallback**: If `GEMINI_API_KEY` is not configured, or if the API returns an error or rate limit, the server seamlessly serves structured fallback itineraries. Pre-built, multi-day itineraries exist for major hubs (Seoul, Tokyo, Paris, London, New York, Delhi, etc.), and a dynamic generator handles any other city.

### 4. How City Coordinates Reach the Map and Weather API
1. When a user selects a city in the dropdown (e.g., *Chandigarh, India*), its coordinates `{ lat: 30.7333, lon: 76.7794 }` are retrieved from the verified city dataset (or resolved via OpenStreetMap Nominatim for unlisted cities).
2. The coordinates are stored with the trip record in SQLite and passed to the frontend in the trip response.
3. On the Trip Details page:
   - **Leaflet (`<InteractiveMap />`)**: Centers on `[coordinates.lat, coordinates.lon]` and plots interactive markers.
   - **Weather (`/api/weather`)**: Sends `lat` and `lon` to the **Open-Meteo API** (`https://api.open-meteo.com/v1/forecast`), which returns current conditions and a 7-day daily forecast without requiring a private API key.

### 5. How Trips are Stored in SQLite
- Stored using Node.js's built-in `node:sqlite` module (`DatabaseSync`), requiring zero external native compilation dependencies.
- **Relational Tables**:
  - `trips`: Destination, country, dates, budget, duration, coordinates, cover image.
  - `itinerary_days`: Individual day numbers and daily theme titles (Foreign Key: `trip_id`).
  - `activities`: Scheduled activities with time, title, category, duration, cost, and notes (Foreign Key: `day_id`).
  - `budget_breakdown`: Category allocations for flights, hotels, food, transport, and activities (Foreign Key: `trip_id`).
  - `saved_places`: Bookmarked user places (Foreign Key: `trip_id`).
  - `users`: User profiles for basic authentication.
- **WAL Mode (`PRAGMA journal_mode = WAL`)**: Write-Ahead Logging allows concurrent reads while writes are occurring, ensuring smooth performance.
- **Transactions**: Multi-table insertions (`trips` + `days` + `activities` + `budget`) are wrapped in `BEGIN TRANSACTION` / `COMMIT` blocks for ACID compliance.

---

## 📊 Verified Dataset Details

- **Curated Cities**: Exactly **178 verified destinations across 56 countries** in both `src/data/destinations.js` and `server/src/data/destinations.js`.
- **Fields per City**: `id`, `city`, `region`, `country`, `coordinates` (`lat`, `lon`), and `popular` flag.
- **Unlisted Cities**: Dynamically resolved worldwide using OpenStreetMap's Nominatim geocoding search with a 320ms debounce.

---

## 🛠️ Tech Stack Summary

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Lucide React, Leaflet, React-Leaflet, Recharts, React Router DOM v7 |
| **Backend** | Node.js, Express 4, `node:sqlite` (built-in SQLite) |
| **APIs** | Google Gemini API (`@google/generative-ai`), Open-Meteo Weather API, OpenStreetMap Nominatim, Unsplash |
| **Tooling** | ESLint 10, Git |

---

## 📁 Project Structure

```text
tripwise-ai/
├── src/                          # React Frontend
│   ├── assets/                   # Static assets
│   ├── components/               # UI components
│   │   ├── Details/              # Itinerary, Leaflet map, weather, budget
│   │   ├── Section1/             # Hero banner, feature highlights
│   │   ├── Section2/             # How it works steps
│   │   ├── Section3/             # Destination gallery
│   │   ├── Tripgenerator/        # Trip generator form & CityDropdown
│   │   ├── ErrorBoundary.jsx     # Catches React rendering errors
│   │   ├── Navbar.jsx            # Main navbar
│   │   └── Footer.jsx            # Application footer
│   ├── data/
│   │   └── destinations.js       # 178 curated cities with coordinates
│   ├── pages/                    # Home, Dashboard, GenerateTrip, TripDetails, Auth
│   ├── services/                 # API client (native fetch), adapters
│   ├── App.jsx                   # Route definitions
│   └── main.jsx                  # React entry point
├── server/                       # Express Backend
│   ├── src/
│   │   ├── data/                 # Synced destination dataset
│   │   ├── db/                   # database.js, schema.js, repositories.js, seed.js
│   │   ├── routes/               # trips.js, weather.js, places.js, chat.js, auth.js
│   │   ├── services/             # geminiService.js, weatherService.js, placesService.js
│   │   └── index.js              # Express entry point
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Backend env template
├── .env.example                  # Frontend env template
├── .gitignore                    # Excludes .env, *.db, *.db-wal, node_modules
├── package.json                  # Frontend dependencies
├── vite.config.js                # Vite build and API proxy setup
└── README.md
```

---

## ⚡ Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Gemini API Key**: (Optional for curated cities, required for custom AI generation) — [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository
```bash
git clone https://github.com/saumyapant-dev/TRIPWISE-AI.git
cd TRIPWISE-AI
```

### 2. Configure Environment Files

**Backend:**
```bash
cp server/.env.example server/.env
```
Add your key inside `server/.env`:
```env
PORT=5001
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend:**
```bash
cp .env.example .env
```
*(Leave empty or set to `/api` for default Vite proxying to port 5001).*

### 3. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 4. Run Locally
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Starts at http://localhost:5001
```

**Terminal 2 (Frontend):**
```bash
npm run dev
# Starts at http://localhost:5173
```

---

## ⚠️ Known Limitations

1. **Single-Node SQLite**: SQLite stores data in a local file (`server/src/data/tripwise.db`). This is lightweight and requires zero database installation, but it is not intended for multi-server distributed hosting without migrating to PostgreSQL.
2. **Nominatim Public Geocoding Rate Limits**: For cities outside the 178 curated dataset, the app queries the public OpenStreetMap Nominatim endpoint. Nominatim has a usage guideline of maximum 1 request per second. The frontend debounces user input by 320ms to stay within limits.
3. **Free-Tier Gemini API Quotas**: Google's free API tier enforces requests-per-minute (RPM) limits. The backend handles this gracefully by serving curated fallback itineraries if rate-limited.
4. **Basic Authentication**: The current login/signup uses a simple password hashing and SQLite user store for demonstration purposes; production deployments would benefit from JWT-based sessions or OAuth 2.0.

---

## 🔮 Realistic Future Improvements

- **OAuth 2.0 Login**: Support single-click sign-in with Google or GitHub accounts.
- **Export to PDF / Calendar**: Add printable itinerary summaries and export activities directly to `.ics` files for Google Calendar / Apple Calendar.
- **Multi-Destination Trips**: Allow planning a road trip or route involving multiple cities with driving times.
- **Custom Activity Editing**: Let users drag, reorder, or add custom notes to individual itinerary activities directly in the UI.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).
