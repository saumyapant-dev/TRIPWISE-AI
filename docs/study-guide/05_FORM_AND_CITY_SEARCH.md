# TripWise AI — Trip Form & Dual-Tier City Search Engine

This document details the architecture, validation mechanics, and dual-tier geocoding search engine powering the "Create Your Perfect Trip" form in TripWise AI.

---

## 1. Form Inputs & State Architecture

The trip generation form resides in `src/components/Tripgenerator/Form.jsx`. It manages the following state variables:

| Form Field | State Variable | Type | Validation Constraint | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Origin City** | `city` | `string` | Mandatory, non-empty | Where the traveler is departing from (e.g., *Chandigarh, India*) |
| **Destination** | `destination` | `string` | Mandatory, non-empty | Where the traveler wants to visit (e.g., *Athens, Greece*) |
| **Budget** | `budget` | `string -> number` | Mandatory, number > 0 | Total spending budget in USD |
| **Duration** | `duration` | `string -> number` | Mandatory, 1 to 30 days | Length of itinerary |
| **Departure Date**| `fromDate` | `string` (YYYY-MM-DD) | Optional | Desired start date |
| **Return Date** | `toDate` | `string` (YYYY-MM-DD) | Optional | Desired conclusion date |
| **Travel Styles**| `selectedStyles`| `array of strings` | At least 1 selected | 6 lifestyle categories |
| **Special Notes**| `preferences` | `string` | Optional | Custom user requests (e.g. *vegetarian, kid-friendly*) |

### The 6 Travel Style Chips
The form includes 6 interactive style cards:
1. 🏖️ **Beach & Relaxation**
2. ⛰️ **Adventure**
3. 🏛️ **Culture**
4. 🍜 **Food & Culinary**
5. 🏙️ **City Exploration**
6. 🦁 **Wildlife**

Users can select multiple styles simultaneously. The selection is toggled via:
```javascript
const handleToggleStyle = (styleName) => {
  setSelectedStyles((prev) =>
    prev.includes(styleName)
      ? prev.filter((s) => s !== styleName)
      : [...prev, styleName]
  );
  setErrorBanner(null);
};
```

---

## 2. Empty Initial State Design Principle

In earlier development builds, the form contained hardcoded defaults (such as *Seoul*, *San Francisco*, `budget: 2500`, `duration: 5`). This caused severe usability issues because users accidentally created trips for default cities without noticing.

### The Fix: Strict Zero-Default Initialization
In `src/components/Tripgenerator/Form.jsx`, every state is initialized completely blank:
```javascript
const [city, setCity] = useState("");
const [destination, setDestination] = useState(() => {
  // Only pre-populates IF explicitly passed via URL query (e.g. ?destination=Kyoto)
  const params = new URLSearchParams(location.search || window.location.search);
  return params.get("destination") || "";
});
const [budget, setBudget] = useState("");
const [duration, setDuration] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [selectedStyles, setSelectedStyles] = useState([]);
const [preferences, setPreferences] = useState("");
```

- When opening `/generate-trip`, the inputs are 100% clean.
- The user must explicitly choose their origin, destination, budget, duration, and styles.

---

## 3. Strict Validation & Error Handling

Before dispatching an API request to the backend, `handleGenerateTrip` executes synchronous client-side validation:

```javascript
// 1. Mandatory Text Validations
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

// 2. Numeric Range Validations
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
```

### Why Clamp Duration Between 1 and 30 Days?
- Generative AI models have token output limits (e.g., 4096 or 8192 tokens).
- A 30-day itinerary with 4 detailed activities per day produces approximately 6,000 words of structured JSON. Exceeding 30 days would risk token truncation or JSON syntax parsing errors mid-stream.

---

## 4. The Dual-Tier City Search & Geocoding Engine

TripWise AI solves the classic city search problem (spelling mistakes, unknown coordinates, slow search latency) by combining two complementary systems:

```
                          User Types City Name
                                   │
                                   ▼
           ┌───────────────────────────────────────────────┐
           │   TIER 1: Instant In-Memory Local Catalog     │
           │   - 178 cities across 56 countries            │
           │   - Pre-computed latitude & longitude         │
           │   - Execution latency: < 1 millisecond        │
           └───────────────────────┬───────────────────────┘
                                   │
                     Is query length >= 2 chars?
                                   │
                                   ▼
           ┌───────────────────────────────────────────────┐
           │   TIER 2: Debounced Worldwide Geocoding       │
           │   - 320ms debounce timer (clearTimeout)       │
           │   - Backend proxy -> OpenStreetMap Nominatim  │
           │   - Global coverage (small towns, regions)    │
           └───────────────────────┬───────────────────────┘
                                   │
                                   ▼
           ┌───────────────────────────────────────────────┐
           │   DEDUPLICATION & MERGE ENGINE                │
           │   - JavaScript Map keyed by `${city}_${country}`│
           │   - Prioritizes verified local coordinates    │
           │   - Renders unified clean dropdown list       │
           └───────────────────────────────────────────────┘
```

---

### Tier 1: Instant Local Catalog (`src/data/destinations.js`)
- **Size:** Exactly **178 cities across 56 countries**.
- **Execution:** Zero network latency. Searches client memory using JavaScript regex and string matching:
  ```javascript
  export function filterDestinations({ country = "ALL", search = "", region = "ALL" }) {
    const q = search.trim().toLowerCase();
    return DESTINATIONS_DATA.filter((dest) => {
      const matchCountry =
        country === "ALL" ||
        dest.country.toLowerCase() === country.toLowerCase() ||
        dest.countryCode.toLowerCase() === country.toLowerCase();

      const matchSearch =
        !q ||
        dest.city.toLowerCase().includes(q) ||
        dest.country.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q);

      return matchCountry && matchSearch;
    });
  }
  ```
- **Coordinate Guarantee:** Every city has pre-verified GPS coordinates (e.g., Chandigarh: `30.7333, 76.7794`, Athens: `37.9838, 23.7275`).

---

### Tier 2: Debounced Remote Search (OpenStreetMap Nominatim)
If a user searches for a destination not present in the 178-city catalog (e.g., *Gwalior*, *Reykjavik*, *Bhopal*), the second tier activates.

#### What is Debouncing?
Debouncing is a programming pattern that limits the rate at which a function gets executed. When a user types *"C-h-a-n-d-i-g-a-r-h"*, without debouncing, the app would fire 10 simultaneous HTTP requests to the geocoding server.

With a **320ms debounce**:
1. When "C" is typed, a timer starts for 320ms.
2. If "h" is typed after 100ms, the previous timer is canceled (`clearTimeout`) and a new 320ms timer starts.
3. Only when the user *stops typing for 320ms* does the single HTTP request get sent.

#### Implementation in `src/components/Tripgenerator/CityDropdown.jsx`:
```javascript
useEffect(() => {
  const query = searchQuery.trim();
  if (query.length < 2) return;

  const timer = setTimeout(() => {
    setIsSearchingRemote(true);
    searchCities(query, activeCountry)
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setRemoteResults(res.data);
        }
      })
      .catch(() => {
        // Silent catch: Retain local catalog matches if network fails
      })
      .finally(() => setIsSearchingRemote(false));
  }, 320);

  return () => clearTimeout(timer); // Cleanup function resets the timer!
}, [searchQuery, activeCountry]);
```

---

### Deduplication Engine
When merging local results with remote results, duplicate entries could easily appear (for example, if both the local catalog and Nominatim return *"Paris, France"*).

To prevent duplicates, `CityDropdown.jsx` uses an ES6 `Map`:
```javascript
const displayedCities = useMemo(() => {
  const map = new Map();

  // 1. Add instant local matches first
  for (const item of localCities) {
    const key = `${item.city.toLowerCase()}_${item.country.toLowerCase()}`;
    map.set(key, item);
  }

  // 2. Add remote results only if key doesn't already exist
  for (const item of remoteResults) {
    const key = `${item.city.toLowerCase()}_${item.country.toLowerCase()}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values()).slice(0, 20);
}, [localCities, remoteResults]);
```

---

## 5. How Coordinates Flow to the Map & Weather

When the user selects a city:
1. `CityDropdown` passes the full item object:
   ```javascript
   {
     city: "Athens",
     country: "Greece",
     coordinates: { lat: 37.9838, lon: 23.7275 }
   }
   ```
2. `Form.jsx` includes these coordinates in the payload to `POST /api/trips/generate`:
   ```javascript
   {
     city: "London",
     destination: "Athens, Greece",
     coordinates: { lat: 37.9838, lon: 23.7275 },
     budget: 1800,
     duration: 5,
     travelStyle: "Culture, City Exploration"
   }
   ```
3. The backend stores `coordinates` in the SQLite `trips` table as a JSON string: `{"lat":37.9838,"lon":23.7275}`.
4. When `TripDetails.jsx` loads, it passes these exact coordinates to:
   - `<InteractiveMap coordinates={trip.coordinates} />` to center the Leaflet map and drop the destination marker.
   - `getWeather(trip.destination, trip.coordinates.lat, trip.coordinates.lon)` to fetch accurate Open-Meteo forecasts.
