# TripWise AI 🌍✈️

TripWise AI is a full-stack, AI-assisted travel planning web application. It automates the travel research process by generating structured, day-by-day itineraries, visualizing points of interest on interactive maps, fetching live destination weather forecasts, and providing visual budget breakdowns.

---

## 📌 Project Overview

Planning a trip typically requires juggling multiple tabs: researching activities, checking weather, estimating costs, and pinning destinations on maps. 

**TripWise AI** unifies this workflow into a single responsive web interface:
1. The traveler enters a destination, trip duration, budget, travel style, and specific preferences.
2. The Node.js/Express backend queries the **Google Gemini API** with structured prompting to craft an authentic day-by-day itinerary.
3. Coordinates and destination details are plotted on an interactive **Leaflet / OpenStreetMap** view.
4. Real-time meteorological data is fetched from the **Open-Meteo API**.
5. All generated trips are persisted in an **SQLite** database using Write-Ahead Logging (WAL) for instant recall and offline resilience.

---

## ✨ Actual Features

- **AI Itinerary Generator**: Generates day-by-day travel schedules with specific time slots (morning, afternoon, evening), estimated costs, activity durations, ratings, booking advisories, and insider tips.
- **Searchable City Autocomplete**: Combines an instant local catalog of 200+ major global and domestic cities with debounced remote geocoding to resolve destination names, countries, and latitude/longitude coordinates.
- **Interactive Map**: Renders destination waypoints and activities using Leaflet and OpenStreetMap tiles with custom markers and popup details.
- **Live Weather Forecasts**: Integrated with Open-Meteo to display current temperature, weather conditions, wind speed, humidity, and a 7-day forecast.
- **Visual Budget Tracker**: Categorizes estimated travel expenses (flights, hotels, dining, activities, local transit) and visualizes the allocation using Recharts.
- **AI Travel Concierge**: In-app modal chat assistant providing packing tips, cultural etiquette, transit guidance, and dining suggestions for the selected destination.
- **Trip Management Dashboard**: Browse, filter, search, open, and delete saved itineraries. Includes fallback synchronization to browser `localStorage` for uninterrupted access.
- **Graceful Fallbacks & Offline Resilience**: If a Gemini API key is missing or encounters rate limits, the system provides curated itineraries ensuring the user experience never breaks.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Mapping**: Leaflet & React-Leaflet
- **Data Visualization**: Recharts
- **Routing**: React Router DOM (v7)
- **Networking**: Modern Native `fetch` API

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express 4
- **Database**: SQLite via Node.js native `node:sqlite` (DatabaseSync)
- **AI Engine**: Google Gemini AI (`@google/generative-ai`)
- **Environment Management**: `dotenv`
- **CORS Support**: `cors` middleware

### External APIs
- **Google Gemini API**: Structured generation for itineraries and concierge responses.
- **Open-Meteo API**: Free, open meteorological data (no API key required).
- **OpenStreetMap / Nominatim**: Geocoding and map tile layers.
- **Unsplash API**: High-resolution destination photography (with curated fallback photography).

---

## 📁 Project Structure

```text
TRIPWISE-AI/
├── src/                          # React Frontend
│   ├── assets/                   # Static imagery & brand assets
│   ├── components/               # Modular React Components
│   │   ├── Details/              # Trip detail views
│   │   │   ├── Explore/          # Interactive Leaflet map component
│   │   │   ├── LSection/         # Itinerary day schedule & activities
│   │   │   ├── RSection/         # Weather card, budget charts, quick stats
│   │   │   ├── ChatButton.jsx    # Concierge chat modal
│   │   │   └── Hero.jsx          # Destination hero banner
│   │   ├── Section1/             # Landing page hero & feature highlights
│   │   │   ├── HeroBanner.jsx    # Homepage title & trending destination tags
│   │   │   ├── HeroImage.jsx     # Showcase travel image
│   │   │   └── WhyChooseUs.jsx   # Core feature benefit cards
│   │   ├── Section2/             # "How It Works" 3-step walkthrough
│   │   ├── Section3/             # Popular destination gallery
│   │   ├── Tripgenerator/        # Trip creation form & CityDropdown
│   │   │   ├── CityDropdown.jsx  # Searchable autocomplete dropdown
│   │   │   ├── Form.jsx          # Generator form with empty default state
│   │   │   └── GeneratorHeader.jsx
│   │   ├── ErrorBoundary.jsx     # React runtime error boundary
│   │   ├── Footer.jsx            # Application footer
│   │   └── Navbar.jsx            # Main navigation bar
│   ├── data/
│   │   └── destinations.js       # Curated city dataset with coordinates
│   ├── pages/                    # React Router Page Views
│   │   ├── Home.jsx              # Landing page
│   │   ├── Dashboard.jsx         # User dashboard with saved trips & search
│   │   ├── GenerateTrip.jsx      # Trip generation wizard
│   │   ├── TripDetails.jsx       # Complete itinerary, map, and weather view
│   │   ├── Login.jsx             # User login
│   │   ├── Signup.jsx            # User registration
│   │   └── NotFound.jsx          # 404 error page
│   ├── services/                 # Frontend API clients
│   │   ├── api.js                # Centralized backend HTTP client
│   │   ├── gemini.js             # Client adapter routing to backend
│   │   └── unsplash.js           # Destination photography resolver
│   ├── App.jsx                   # Route configuration
│   ├── index.css                 # Tailwind CSS imports
│   └── main.jsx                  # React application entry point
├── server/                       # Node.js & Express Backend
│   ├── src/
│   │   ├── data/                 # Destination dataset
│   │   ├── db/                   # Database access layer
│   │   │   ├── database.js       # SQLite connection with WAL mode
│   │   │   ├── schema.js         # Table definitions & migrations
│   │   │   ├── repositories.js   # Parameterized CRUD operations
│   │   │   └── seed.js           # Database seed script
│   │   ├── routes/               # Express API endpoints
│   │   │   ├── trips.js          # Itinerary generation & persistence
│   │   │   ├── weather.js        # Weather proxy endpoint
│   │   │   ├── places.js         # Places & geocoding endpoints
│   │   │   ├── chat.js           # AI concierge endpoint
│   │   │   ├── auth.js           # Authentication routes
│   │   │   └── savedPlaces.js    # Bookmarked places routes
│   │   ├── services/             # Business logic & integrations
│   │   │   ├── geminiService.js  # Gemini API prompt & fallback itineraries
│   │   │   ├── weatherService.js # Open-Meteo forecast fetcher
│   │   │   ├── placesService.js  # Geocoding & attraction search
│   │   │   └── unsplashService.js# Image search with local fallback
│   │   └── index.js              # Express server entry point
│   ├── package.json              # Backend dependencies
│   └── .env.example              # Backend environment template
├── .env.example                  # Frontend environment template
├── .gitignore                    # Git exclusions (credentials, databases, logs)
├── package.json                  # Frontend dependencies & scripts
├── vite.config.js                # Vite build and proxy configuration
└── LICENSE                       # MIT License
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9 or higher)
- **Google Gemini API Key** (optional for curated destinations, required for custom AI generation: [Get a free key](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/saumyapant-dev/TRIPWISE-AI.git
cd TRIPWISE-AI
```

### Step 2: Configure Environment Variables

1. **Backend Environment** (`server/.env`):
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` and add your API keys:
   ```env
   PORT=5001
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   UNSPLASH_ACCESS_KEY=your_optional_unsplash_key_here
   DATABASE_PATH=./src/data/tripwise.db
   ```

2. **Frontend Environment** (`.env`):
   ```bash
   cp .env.example .env
   ```
   *(Defaults to `/api`, which is automatically proxied to port 5001 by Vite).*

### Step 3: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 4: Run the Development Servers

Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```
*Backend runs at `http://localhost:5001`.*

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 🗄️ Database Architecture

The application uses an embedded **SQLite** database via Node's native `node:sqlite` module (`DatabaseSync`).

### Schema Design:
- **`trips`**: Primary trip record (destination, country, budget, duration, dates, travel style, coordinates, image URL, timestamps).
- **`itinerary_days`**: Foreign-keyed to `trips` (`trip_id`), representing each day of the journey.
- **`activities`**: Foreign-keyed to `itinerary_days` (`day_id`) and `trips` (`trip_id`). Contains time, activity title, category type, location, cost, duration, rating, and AI recommendation notes.
- **`budget_breakdowns`**: Foreign-keyed 1:1 with `trips`, storing numeric allocations for flights, hotels, food, activities, and transit.
- **`saved_places`**: Stores bookmarked landmarks and attractions per trip.
- **`users`**: Manages basic user profiles and authentication data.

### Reliability Features:
- **WAL Mode (`PRAGMA journal_mode = WAL`)**: Allows simultaneous reading and writing without blocking queries.
- **Foreign Key Constraints (`PRAGMA foreign_keys = ON`)**: Enforces referential integrity with cascading deletes when a trip is removed.
- **Parameterized Queries**: All SQL executions use prepared statements to safeguard against SQL injection.

---

## 🔌 API Integrations

1. **Google Gemini API (`gemini-1.5-flash`)**:
   - Invoked on the server side (`server/src/services/geminiService.js`) to safeguard credentials from client-side bundle leakage.
   - Outputs strictly formatted JSON to construct the structured day-by-day itinerary.
   - Built-in graceful degradation: if no API key is provided, the backend falls back to high-quality curated itineraries for popular global and domestic destinations.

2. **Open-Meteo Forecast API**:
   - Queried by coordinates (`latitude`, `longitude`).
   - Retrieves live weather codes, temperature, wind speeds, humidity, and 7-day daily forecasts without requiring private authentication tokens.

3. **OpenStreetMap / Nominatim**:
   - Powers the interactive map view and provides reverse geocoding lookup for non-cataloged cities.

---

## ⚠️ Known Limitations

- **Single-Instance Storage**: SQLite is embedded and file-based. It is ideal for local development and single-server deployments, but horizontal multi-server scaling would require migrating to PostgreSQL or MySQL.
- **Geocoding Rate Limits**: Nominatim's public endpoint limits request frequencies (1 request per second). The application mitigates this with a 320ms debounce and a local pre-indexed database of 200+ top cities.
- **Free-Tier AI Quotas**: Free Gemini API keys have rate limits (requests per minute). The backend handles this gracefully by serving curated fallback itineraries if rate limits occur.

---

## 🔮 Future Improvements

- **OAuth 2.0 Integration**: Add Google and GitHub one-click authentication alongside the current credentials-based auth.
- **Multi-City Route Planning**: Support multi-leg journeys and calculate driving/transit routes between multiple cities.
- **Export to PDF & Calendar**: Generate downloadable PDF trip booklets and export activities directly to `.ics` / Google Calendar.
- **Collaborative Trip Planning**: Enable multiple travelers to view and edit the same itinerary in real time.

---

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
