# TripWise AI 🌍✈️

TripWise AI is a modern full-stack travel planner and itinerary generator powered by Google Gemini AI. It enables travelers to easily search destinations, plan comprehensive day-by-day itineraries, explore interactive maps and curated attractions, inspect live weather forecasts, and track travel budgets.

---

## 🚀 Key Features

- **AI-Powered Itinerary Generation**: Dynamically creates rich, day-by-day schedules with morning, afternoon, and evening activities using Google Gemini.
- **Searchable City Dropdown**: Quick autocomplete and searchable selection across top global and domestic destinations with country and coordinate resolution.
- **Interactive OpenStreetMap**: Visualizes day-by-day destination waypoints, activities, and coordinates using Leaflet.
- **Live Weather Forecasts**: Integrated with Open-Meteo for real-time temperature, weather codes, humidity, and 7-day travel outlooks.
- **Budget Tracking & Cost Breakdown**: Categorized expense breakdowns (flights, accommodation, food, activities, transit).
- **Persistent Local Database**: Built on SQLite with WAL mode for reliable, low-latency trip saving, bookmarking, and retrieval.
- **Concierge Travel Assistant**: Interactive AI chat modal for local tips, packing suggestions, and cultural advice.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Lucide React icons, Framer Motion
- **Maps**: Leaflet & React-Leaflet
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (`better-sqlite3`)
- **AI Integration**: Google Gemini (`@google/genai` / REST API)
- **External Services**: Open-Meteo API (weather), Unsplash API (destination photography)

---

## 📁 Project Structure

```text
tripwise-ai/
├── public/                 # Static public assets
├── src/                    # React Frontend
│   ├── assets/             # Images and design assets
│   ├── components/         # React UI Components
│   │   ├── Details/        # Trip detail sections (Hero, Itinerary, Map, Weather, Budget)
│   │   ├── Tripgenerator/  # Generator form & Searchable CityDropdown
│   │   └── ...
│   ├── data/               # Curated destinations & fallback data
│   ├── pages/              # Route pages (Home, Dashboard, TripDetails, 404)
│   ├── services/           # Client API clients & helpers
│   ├── App.jsx             # Root React application & routing
│   └── main.jsx            # Frontend entrypoint
├── server/                 # Express Backend
│   ├── src/
│   │   ├── data/           # SQLite database schema & destinations
│   │   ├── db/             # Database initialization & repositories
│   │   ├── routes/         # Express API endpoints (trips, places, auth)
│   │   ├── services/       # Services (Gemini AI, weather, places, images)
│   │   └── index.js        # Backend entrypoint
│   ├── package.json        # Backend dependencies
│   └── .env.example        # Backend environment variables template
├── .env.example            # Frontend environment variables template
├── package.json            # Frontend dependencies
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # Tailwind CSS configuration
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/app/apikey))

---

### 1. Clone the Repository
```bash
git clone https://github.com/saumyapant-dev/TRIPWISE-AI.git
cd TRIPWISE-AI
```

### 2. Configure Environment Variables

#### Backend (`server/.env`):
Copy the example environment file:
```bash
cp server/.env.example server/.env
```
Open `server/.env` and add your Google Gemini API key:
```env
PORT=5001
GEMINI_API_KEY=your_actual_gemini_api_key_here
UNSPLASH_ACCESS_KEY=your_optional_unsplash_key_here
```

#### Frontend (`.env`):
Copy the example environment file:
```bash
cp .env.example .env
```
*(Leave `VITE_API_BASE_URL=` blank or set to `/api` for default Vite proxy routing to port 5001).*

---

### 3. Install Dependencies

#### Install Frontend Dependencies:
```bash
npm install
```

#### Install Backend Dependencies:
```bash
cd server
npm install
cd ..
```

---

### 4. Run the Development Servers

#### Start Backend:
```bash
cd server
npm run dev
# or: node src/index.js
```
The server will start on `http://localhost:5001`.

#### Start Frontend (in a new terminal):
```bash
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## 🛡️ License
This project is open source and available under the [MIT License](LICENSE).
