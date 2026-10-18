# TripWise AI — Project Architecture & File-by-File Guide

This document explains the purpose, dependencies, internal mechanics, and connections of every key file in the TripWise AI repository.

---

## 1. High-Level Folder Structure

```
TRIPWISE/
└── tripwise-ai/
    ├── docs/                       # Project documentation, study guides, and screenshots
    │   ├── screenshots/            # Verified application screenshots (Home, Form, Details, Dashboard)
    │   └── study-guide/            # 17 comprehensive viva and technical study guides
    ├── public/                     # Static assets served directly by Vite
    ├── src/                        # Frontend React source code
    │   ├── assets/                 # Local images and branding (hero.png)
    │   ├── components/             # Reusable React UI components
    │   │   ├── Details/            # Trip details page components (Itinerary, Budget, Weather, Map)
    │   │   │   ├── Explore/        # Interactive Leaflet Map component
    │   │   │   ├── LSection/       # Left column (Day-by-day Itinerary accordion)
    │   │   │   └── RSection/       # Right column (BudgetCard, WeatherCard, Highlights, Tips)
    │   │   ├── Tripgenerator/      # Form & CityDropdown components
    │   │   ├── Section1..3/        # Home landing page sections (Hero, Cards, WhyChooseUs)
    │   │   ├── Lsection1..2/       # Alternate landing layout components
    │   │   ├── ErrorBoundary.jsx   # React error boundary catching render exceptions
    │   │   ├── Footer.jsx          # App-wide footer with links
    │   │   ├── Navbar.jsx          # Main navigation bar with auth session awareness
    │   │   └── CuratedTrips.jsx    # Showcase cards for pre-set destinations
    │   ├── data/
    │   │   └── destinations.js     # 178 curated cities across 56 countries dataset & helper functions
    │   ├── pages/                  # React Router page-level route components
    │   │   ├── Home.jsx            # Landing page (/)
    │   │   ├── GenerateTrip.jsx    # Create trip form page (/generate-trip)
    │   │   ├── TripDetails.jsx     # Full itinerary & analytics view (/trip-details)
    │   │   ├── Dashboard.jsx       # User saved trips dashboard (/dashboard)
    │   │   ├── Login.jsx           # Sign in page (/login)
    │   │   ├── Signup.jsx          # Register account page (/signup)
    │   │   └── NotFound.jsx        # 404 catch-all page
    │   ├── services/
    │   │   ├── api.js              # Centralized backend HTTP fetch client (15 REST methods)
    │   │   ├── gemini.js           # Client-side AI fallback helper
    │   │   └── unsplash.js         # Client-side image fallback helper
    │   ├── App.jsx                 # Route declarations via React Router DOM v7
    │   ├── App.css                 # Component-level styling overrides
    │   ├── index.css               # Global Tailwind CSS v4 imports
    │   └── main.jsx                # Application entrypoint (ReactDOM.createRoot)
    ├── server/                     # Backend Node.js & Express source code
    │   ├── src/
    │   │   ├── data/
    │   │   │   ├── destinations.js # Server copy of the 178-city geocoded dataset
    │   │   │   └── tripwise.db     # SQLite database file (WAL mode)
    │   │   ├── db/
    │   │   │   ├── database.js     # Node native DatabaseSync instance & PRAGMA configurations
    │   │   │   ├── schema.js       # Table definitions (7 tables), indices, and migrations
    │   │   │   ├── repositories.js # CRUD query methods, transactions, and user repos
    │   │   │   └── seed.js         # Initial mock data seeder
    │   │   ├── routes/             # Express REST router modules
    │   │   │   ├── auth.js         # Authentication (/signup, /login, /verify)
    │   │   │   ├── trips.js        # Trip generation, retrieval, update, delete (/api/trips)
    │   │   │   ├── weather.js      # Weather endpoints (/api/weather)
    │   │   │   ├── places.js       # City search, curated & nearby POIs, geocoding (/api/places)
    │   │   │   ├── savedPlaces.js  # Bookmark places endpoints (/api/places/saved)
    │   │   │   └── chat.js         # AI concierge chatbot endpoint (/api/chat)
    │   │   ├── services/           # External API adapters and domain logic
    │   │   │   ├── geminiService.js# Google Generative AI integration + fallback itinerary generator
    │   │   │   ├── weatherService.js# Open-Meteo weather API client + Nominatim geocoder
    │   │   │   ├── placesService.js# Curated attractions & POI catalog
    │   │   │   └── unsplashService.js# Dynamic Wikipedia & Unsplash destination photo fetcher
    │   │   └── index.js            # Express server entry point, middleware, routes, and error handlers
    │   └── package.json            # Backend dependency specifications
    ├── package.json                # Root / Frontend dependency specifications
    ├── vite.config.js              # Vite bundler configuration
    ├── eslint.config.js            # ESLint code quality rules
    ├── .env.example                # Safe environment variable template
    └── .gitignore                  # Git exclusion rules (excluding .env, node_modules, tripwise.db)
```

---

## 2. Detailed Breakdown: Frontend Core Files

### `src/main.jsx`
- **What it does:** The JavaScript entry point. It finds the `<div id="root">` element in `index.html` and creates a React 19 root using `ReactDOM.createRoot()`, rendering the `<App />` component wrapped in `<React.StrictMode>`.
- **Key imports:** `react`, `react-dom/client`, `./App.jsx`, `./index.css`.

### `src/App.jsx`
- **What it does:** Declares the client-side routing structure using `react-router-dom` v7 (`BrowserRouter`, `Routes`, `Route`).
- **Registered Routes:**
  - `/` -> `<Home />`
  - `/login` -> `<Login />`
  - `/signup` -> `<Signup />`
  - `/dashboard` -> `<Dashboard />`
  - `/generate-trip` -> `<GenerateTrip />`
  - `/trip-details` -> `<TripDetails />`
  - `*` -> `<NotFound />` (Graceful 404 handling)

### `src/services/api.js`
- **What it does:** Centralized HTTP API client for all frontend communication with the backend.
- **Key Mechanics:**
  - Base URL defaults to `import.meta.env.VITE_API_BASE_URL || "/api"`.
  - Reusable `request(endpoint, options)` wrapper with automatic `Content-Type: application/json` headers, response parsing, and error propagation.
  - **Exported Methods (15 total):**
    - `generateTrip(params)`: `POST /trips/generate`
    - `getTrips(userId)`: `GET /trips?userId=...`
    - `getTripById(id)`: `GET /trips/:id`
    - `saveTrip(data)`: `POST /trips`
    - `updateTrip(id, data)`: `PUT /trips/:id`
    - `deleteTrip(id)`: `DELETE /trips/:id`
    - `signup(data)`: `POST /auth/signup`
    - `login(credentials)`: `POST /auth/login`
    - `getWeather(dest, lat, lon)`: `GET /weather`
    - `getCuratedPlaces(dest, type)`: `GET /places/curated`
    - `getNearbyPlaces(dest)`: `GET /places/nearby`
    - `getGeocode(query)`: `GET /places/geocode`
    - `chatWithAI(payload)`: `POST /chat`
    - `savePlace(data)`, `getSavedPlaces()`, `deleteSavedPlace(id)`: Bookmark operations
    - `getDestinationImage(dest)`: `GET /places/destination-image`
    - `searchCities(q, country)`: `GET /places/search-cities`

### `src/data/destinations.js`
- **What it does:** The primary frontend geospatial catalog containing **exactly 178 destinations across 56 countries**.
- **Data Structure:** Each entry contains `city`, `country`, `region`, `countryCode`, and `coordinates: { lat, lon }`.
- **Exported Utilities:**
  - `DESTINATIONS_DATA`: The 178-element array.
  - `COUNTRIES_LIST`: Sorted list of 56 unique countries with total city counts.
  - `filterDestinations({ country, search, region })`: Case-insensitive instant multi-criteria filter.
  - `findDestinationByCity(cityName)`: Normalizes city names and returns exact coordinate matches.

### `src/components/Tripgenerator/CityDropdown.jsx`
- **What it does:** The searchable dropdown component providing dual-tier geocoding.
- **Key Mechanics:**
  - **Local Tier:** Filters `DESTINATIONS_DATA` instantly (`< 1ms`) via `useMemo`.
  - **Remote Tier:** A 320ms debounced `useEffect` triggers `searchCities()` against OpenStreetMap Nominatim when the user types a city outside the 178 catalog.
  - **Deduplication:** Merges local and remote results using a JavaScript `Map` keyed by `${city}_${country}`.
  - **Accessibility:** Auto-focuses the search input upon opening and closes on clicks outside via a `useRef` listener.

### `src/components/Tripgenerator/Form.jsx`
- **What it does:** The core trip generation form.
- **Key Mechanics:**
  - **Empty by Default:** Every input state (`city`, `destination`, `budget`, `duration`, `selectedStyles`) initializes as empty/blank—no hardcoded default city or values.
  - **Validation:** Enforces non-empty strings, positive numeric budget, duration clamped between 1 and 30 days, and at least one selected travel style chip.
  - **Coordinate Resolution:** Automatically identifies whether the entered destination matches the 178-city catalog or has remote geocodes before submitting to `generateTrip()`.

### `src/pages/TripDetails.jsx`
- **What it does:** The comprehensive dashboard rendering a generated or saved trip.
- **Key Mechanics:**
  - Reads `?id=<tripId>` from URL query parameters.
  - Fetches the full trip object from `GET /api/trips/:id` (which joins all 7 database tables).
  - Fetches live 7-day weather via `getWeather(destination, lat, lon)`.
  - Splits UI into a two-column responsive layout:
    - **Left Column:** Day-by-day itinerary accordion with timing, activity cards, and tips.
    - **Right Column:** Stats cards, interactive Leaflet map, weather forecast, budget breakdown charts, and AI travel concierge chat.

---

## 3. Detailed Breakdown: Backend Core Files

### `server/src/index.js`
- **What it does:** Express application entry point.
- **Execution Lifecycle:**
  1. Calls `initSchema()` from `db/schema.js` to create or verify SQLite tables on startup.
  2. Sets up middleware: `cors()`, `express.json()`, and a custom request logger.
  3. Registers REST routers: `/api/auth`, `/api/trips`, `/api/weather`, `/api/places`, `/api/chat`.
  4. Checks if the Vite production build exists in `../../dist`. If present, serves static files and routes all non-API GET requests to `index.html` (SPA fallback).
  5. 404 handlers for missing API endpoints and global error handling middleware.
  6. Starts listening on `PORT` (default `5001`).

### `server/src/db/database.js`
- **What it does:** Establishes the connection to the SQLite database.
- **Key Code:**
  ```javascript
  import { DatabaseSync } from "node:sqlite";
  export const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA journal_mode = WAL;");
  ```
- **Why it matters:** Uses Node 22's native SQLite API. Enables relational foreign key enforcement and Write-Ahead Logging for high concurrency without locks.

### `server/src/db/schema.js`
- **What it does:** Creates the relational schema across 7 tables:
  1. `users`: Stores user credentials (`id`, `name`, `email`, `password_hash`, `created_at`).
  2. `trips`: Main trip metadata (`id`, `user_id`, `city`, `destination`, `country`, `coordinates`, `budget`, `duration`, `dates`, `travel_style`, `image_url`).
  3. `itinerary_days`: Individual trip days (`id`, `trip_id`, `day_number`, `title`).
  4. `activities`: Specific scheduled events (`id`, `day_id`, `trip_id`, `time`, `title`, `type`, `location`, `cost`, `rating`, `booking_required`, `ai_recommendation`).
  5. `budget_breakdown`: Itemized expense allocations (`flights`, `hotels`, `food`, `transport`, `activities`, `shopping`).
  6. `trip_highlights`: Summary cards and JSON string arrays for `nearby_places` and `travel_tips`.
  7. `saved_places`: Bookmarked attractions per user and trip.
- Includes B-tree indexes (`idx_trips_user_id`, `idx_itinerary_days_trip_id`, etc.) for fast joins.

### `server/src/db/repositories.js`
- **What it does:** The data access layer (DAO / Repository pattern).
- **Core Methods:**
  - `tripsRepo.saveTrip(tripRecord)`: Executes an **atomic transaction** (`BEGIN TRANSACTION ... COMMIT / ROLLBACK`) that inserts data across `trips`, `budget_breakdown`, `trip_highlights`, `itinerary_days`, and `activities`.
  - `tripsRepo.getTripById(id)`: Queries and joins all related records into a single structured JavaScript object.
  - `tripsRepo.getAllTrips(userId)`: Fetches all trips or filters by authenticated user.
  - `usersRepo.createUser()`, `findUserByEmail()`, `findUserById()`: User account management.

### `server/src/services/geminiService.js`
- **What it does:** The AI orchestration service.
- **Key Mechanics:**
  - Instantiates `GoogleGenerativeAI` with `process.env.GEMINI_API_KEY`.
  - Executes a multi-model cascade: tries `gemini-1.5-flash`, then `gemini-2.0-flash`, then `gemini-1.5-pro`.
  - Enforces strict JSON output schemas via prompt instructions.
  - **Duplicate Activity Detection:** Iterates through activities with a `Set()`; if the AI repeats activities across days, it rejects the hallucinated schedule and activates the curated fallback engine.
  - **Curated Fallback Engine:** Features authentic multi-day itineraries for major hubs (Seoul, Busan, Tokyo, Kyoto, Paris, London, Athens, New York, Bali, Kerala, Rajasthan, Kashmir, etc.) and procedural generation for custom destinations.

### `server/src/services/weatherService.js`
- **What it does:** Weather forecasts and geocoding.
- **Key Mechanics:**
  - Queries the free, open-source **Open-Meteo API** (`https://api.open-meteo.com/v1/forecast`).
  - Returns current temperature, apparent temperature, humidity, wind speed, UV index, and 7-day daily high/low forecasts with WMO weather codes.
  - Includes an internal `KNOWN_COORDINATES` dictionary and an OpenStreetMap Nominatim resolver with 4-second timeout abort controllers.

### `server/src/routes/auth.js`
- **What it does:** User registration, login, and token verification.
- **Key Mechanics:**
  - **Password Hashing:** Uses `crypto.randomBytes(16)` for salt and `crypto.scryptSync(password, salt, 64)`.
  - **Timing Defense:** Uses `crypto.timingSafeEqual()` to verify hashes, preventing timing attack vulnerabilities.
  - **Stateless Tokens:** Generates custom signed HMAC-SHA256 tokens with expiration timestamps (`exp`).
