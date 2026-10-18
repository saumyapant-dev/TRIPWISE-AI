# TripWise AI — Frontend Architecture & React Guide

This guide explains the frontend implementation of TripWise AI. It covers React 19 concepts, Vite tooling, component hierarchies, state management, and React hooks with code references from the actual codebase.

---

## 1. Core React Concepts Explained Simply

### What is React?
React is a declarative, component-based JavaScript library for building user interfaces. Instead of manually manipulating the browser's DOM (e.g., `document.getElementById('budget').innerText = ...`), you declare what the UI should look like for a given state, and React automatically updates the browser efficiently.

### The Virtual DOM & Reconciliation
1. **Virtual DOM (VDOM):** React keeps an in-memory lightweight JavaScript representation of the real DOM elements.
2. **Reconciliation (Diffing):** When component state changes (e.g., the user selects a new travel style), React generates a new Virtual DOM tree, compares it to the previous tree (diffing algorithm), and applies *only the minimal necessary changes* to the actual browser DOM (batching repaints).
3. **Why this matters in TripWise AI:** When a user types into the city search field, the autocomplete list updates dozens of times per second. Because of the Virtual DOM, only the dropdown list items re-render—the rest of the form stays completely intact without flickering.

---

## 2. Component Hierarchy Tree

The following diagram illustrates how components are structured and nested throughout the application:

```
[index.html]
   └── [main.jsx] (ReactDOM.createRoot)
         └── <App /> (App.jsx)
               └── <BrowserRouter>
                     └── <Routes>
                           │
                           ├── <Route path="/" element={<Home />} />
                           │     ├── <Navbar />
                           │     ├── <HeroBanner />
                           │     ├── <Cards />
                           │     ├── <WhyChooseUs />
                           │     ├── <CuratedTrips />
                           │     └── <Footer />
                           │
                           ├── <Route path="/generate-trip" element={<GenerateTrip />} />
                           │     ├── <Navbar />
                           │     └── <Tripgenerator />
                           │           ├── <GeneratorHeader />
                           │           └── <Form />
                           │                 └── <CityDropdown /> (x2 for Origin & Destination)
                           │
                           ├── <Route path="/trip-details" element={<TripDetails />} />
                           │     ├── <Navbar />
                           │     ├── <Hero /> (Cover image, title, dates, budget tags)
                           │     ├── Left Column (<LSection />)
                           │     │     └── <Itinerary /> (Day cards, timeline, activity details)
                           │     ├── Right Column (<RSection />)
                           │     │     ├── <StatsCards /> (Duration, activities count, dining count)
                           │     │     ├── <ExploreMapWeather />
                           │     │     │     ├── <InteractiveMap /> (Leaflet map + markers)
                           │     │     │     └── <WeatherCard /> (7-day forecast tabs)
                           │     │     ├── <BudgetCard /> (Recharts visual breakdown)
                           │     │     ├── <TripHighlights /> (Flight, hotel, top-rated tags)
                           │     │     ├── <TravelTips /> (AI concierge bullet recommendations)
                           │     │     └── <NearbyPoints /> (Bookmarked POIs)
                           │     └── <ChatButton /> (Interactive floating AI travel concierge)
                           │
                           ├── <Route path="/dashboard" element={<Dashboard />} />
                           │     ├── <Navbar />
                           │     └── Saved Trips Grid (Card mapping over trips array)
                           │
                           ├── <Route path="/login" element={<Login />} />
                           ├── <Route path="/signup" element={<Signup />} />
                           └── <Route path="*" element={<NotFound />} />
```

---

## 3. Props vs State in TripWise AI

Understanding the distinction between **State** and **Props** is a mandatory viva question:

| Feature | State (`useState`) | Props (`properties`) |
| :--- | :--- | :--- |
| **Ownership** | Managed internally within the component | Passed down from a parent component |
| **Mutability**| Mutable via its dedicated setter (`setX`) | **Immutable / Read-only** for the child |
| **Purpose** | Holds dynamic data that changes over time | Configures the child or shares parent data |
| **Project Example** | `const [budget, setBudget] = useState("")` inside `Form.jsx` | `<CityDropdown id="dest" label="Destination" onChange={...} />` |

### Code Example: Parent-to-Child Communication
In `src/components/Tripgenerator/Form.jsx` (Parent):
```jsx
// Form owns the state:
const [destination, setDestination] = useState("");

// Form passes state and updater down to CityDropdown as props:
<CityDropdown
  id="destination-city"
  label="📍 Destination City"
  selectedCity={destination}
  onChange={(val) => setDestination(val)}
  error={!!errorBanner && !destination}
/>
```

In `src/components/Tripgenerator/CityDropdown.jsx` (Child):
```jsx
// CityDropdown receives props and renders according to parent instructions:
const CityDropdown = ({ id, label, selectedCity, onChange, error }) => {
  // Child cannot directly modify selectedCity; it invokes onChange(newCity)
  // to notify the parent to update its state!
};
```

---

## 4. React Hooks Used in TripWise AI

### A. `useState` (State Management)
Declares state variables that trigger a re-render when modified.

*Example from `src/components/Tripgenerator/Form.jsx`:*
```javascript
const [city, setCity] = useState("");
const [budget, setBudget] = useState("");
const [duration, setDuration] = useState("");
const [selectedStyles, setSelectedStyles] = useState([]);
const [loading, setLoading] = useState(false);
const [errorBanner, setErrorBanner] = useState(null);
```
- When `setLoading(true)` is called, React re-renders the button into a spinning animation.
- When `setErrorBanner("Please enter a budget")` is called, the alert banner appears above the inputs.

---

### B. `useEffect` (Side Effects & Lifecycle)
Performs side effects (data fetching, DOM listeners, timers) in response to component mounting, updating, or unmounting.

*Example 1: Outside Click Listener in `CityDropdown.jsx`*
```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false); // Close dropdown if user clicked outside
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  // Cleanup function: runs when component unmounts to prevent memory leaks!
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []); // Empty dependency array = runs ONCE on mount
```

*Example 2: Debounced Remote Geocoding Search in `CityDropdown.jsx`*
```javascript
useEffect(() => {
  const query = searchQuery.trim();
  if (query.length < 2) return;

  // Set a 320ms debounce timer
  const timer = setTimeout(() => {
    setIsSearchingRemote(true);
    searchCities(query, activeCountry)
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setRemoteResults(res.data);
        }
      })
      .finally(() => setIsSearchingRemote(false));
  }, 320);

  // If the user types another character before 320ms, cancel the previous timer!
  return () => clearTimeout(timer);
}, [searchQuery, activeCountry]); // Runs whenever search query or country filter changes
```

---

### C. `useRef` (Direct DOM References & Mutable Values)
Holds a persistent reference across renders without triggering a re-render when changed.

*Example from `CityDropdown.jsx`:*
```javascript
const dropdownRef = useRef(null);
const searchInputRef = useRef(null);

// Focusing the search input box immediately when dropdown opens:
useEffect(() => {
  if (isOpen && searchInputRef.current) {
    setTimeout(() => searchInputRef.current?.focus(), 50);
  }
}, [isOpen]);

// JSX binding:
<div ref={dropdownRef}>
  <input ref={searchInputRef} ... />
</div>
```

---

### D. `useMemo` (Performance Optimization)
Memoizes the calculated return value of an expensive operation so it only recalculates when its dependencies change.

*Example from `CityDropdown.jsx`:*
```javascript
// Instant local search filter over 178 destinations
const localCities = useMemo(() => {
  return filterDestinations({
    country: activeCountry,
    search: searchQuery,
  });
}, [activeCountry, searchQuery]); // Only recomputes if country or search text changes!
```
Without `useMemo`, filtering 178 objects would run on *every single render* of the component (e.g., when other states toggle). `useMemo` caches the filtered array.

---

## 5. Client-Side Routing with React Router DOM v7

TripWise AI is a **Single Page Application (SPA)**. When navigating from `/generate-trip` to `/trip-details`, the browser does **not** reload the entire HTML page from the server. Instead, React Router intercepts the URL change and swaps the visible page components in place.

### Key Router Hooks Used:
1. `useNavigate()`: Programmatic redirection.
   ```javascript
   const navigate = useNavigate();
   // Inside Form.jsx after trip generation succeeds:
   navigate(`/trip-details?id=${response.data.id}`);
   ```
2. `useLocation()`: Accessing current route information and query parameters.
   ```javascript
   const location = useLocation();
   // Inside TripDetails.jsx to extract the trip ID:
   const params = new URLSearchParams(location.search);
   const tripId = params.get("id");
   ```

---

## 6. How Data Flows From Form to Details Page

```
1. User enters data in Form.jsx
       │
2. User clicks "Generate Trip" (handleGenerateTrip)
       │
3. Validation checks passed (budget > 0, duration 1-30, styles selected)
       │
4. POST request sent via api.js: generateTrip(params)
       │
5. Backend Express server generates itinerary via Gemini & saves to SQLite
       │
6. Backend responds with: { success: true, data: { id: "trip_1741...", ... } }
       │
7. Frontend receives response: navigate(`/trip-details?id=${res.data.id}`)
       │
8. TripDetails.jsx mounts, reads ?id=trip_1741...
       │
9. TripDetails.jsx executes useEffect:
       ├── getTripById(tripId) -> loads full joined itinerary from SQLite
       └── getWeather(dest, lat, lon) -> loads 7-day forecast from Open-Meteo
       │
10. State populated -> UI renders Itinerary, Leaflet Map, Recharts, Weather Cards
```
