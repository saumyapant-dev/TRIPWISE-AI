# TripWise AI — Tech Stack by Webpage

This guide breaks down the exact technologies used on every screen of TripWise AI. Every statement is based strictly on the actual implementation in the repository.

---

## 01 — Home / Landing Page

* **Route:** `/`
* **File Path:** `src/pages/Home.jsx`
* **Components:** `Navbar.jsx`, `Section1.jsx` (`HeroBanner.jsx`, `HeroImage.jsx`, `WhyChooseUs.jsx`), `Section2.jsx`, `Section3.jsx`, `Footer.jsx`

### Technologies & Role on This Page:

- **React 19 & JSX** — Renders the landing page as modular components (`Navbar`, `HeroBanner`, `WhyChooseUs`, `Footer`).
  - *Why needed:* Separates marketing content into organized, reusable blocks instead of one massive HTML file.
  - *How it supports functionality:* Keeps component rendering clean and enables reactive state for the mobile navbar toggle.
- **Tailwind CSS v4** — Provides all styling, responsive grids (`grid md:grid-cols-3`), hero text gradients, and interactive hover animations (`hover:scale-105`).
  - *Why needed:* Delivers a modern travel landing page layout without writing separate CSS files.
  - *How it supports functionality:* Ensures fast loading speeds and adapts seamlessly across mobile phones, tablets, and desktops.
- **React Router DOM (`Link`)** — Powers the primary call-to-action button (`"Generate My Trip ✨"`) and trending city shortcuts (`Tokyo`, `Seoul`, `Paris`, `Kerala`, `New York`).
  - *Why needed:* Enables client-side navigation without full browser page reloads.
  - *How it supports functionality:* Passes destination names directly into the URL query string (e.g. `/generate-trip?destination=Tokyo`) so the form can pre-fill automatically.
- **Lucide React** — Renders clean SVG vector icons (`Plane`, `Compass`, `Sparkles`, `Star`).
  - *Why needed:* Provides lightweight visual icons that scale crisply on any display.
  - *How it supports functionality:* Enhances visual engagement in feature cards without downloading heavy icon fonts.
- **Backend & Database on this page:** *Not directly involved.* The landing page is completely static on the client side for instant initial loading.
- **APIs & External Services on this page:** *None used directly on this page.*

---

## 02 — Generate Trip Form

* **Route:** `/generate-trip`
* **File Path:** `src/pages/GenerateTrip.jsx`
* **Components:** `Gnavbar.jsx`, `Tripgenerator.jsx`, `GeneratorHeader.jsx`, `Form.jsx`, `CityDropdown.jsx`

### Technologies & Role on This Page:

- **React `useState` Hook** — Manages input states for origin city, destination, budget, duration, calendar dates, travel style chips, loading spinners, and validation error banners.
  - *Why needed:* Maintains an **empty initial state** (no hardcoded defaults) so users always start with a clean form.
  - *How it supports functionality:* Updates values as the user types and triggers validation banners if mandatory fields are missing.
- **React `useMemo` Hook** — Filters our local catalog of 178 cities in RAM based on user keystrokes and selected country.
  - *Why needed:* Filters hundreds of city records in under 1 millisecond.
  - *How it supports functionality:* Prevents expensive recalculations on unrelated component re-renders.
- **React `useEffect` & `useRef` Hooks** — Powers the 320ms debounced remote city search, auto-focuses the search input, and closes the dropdown when clicking outside.
  - *Why needed:* Prevents firing API requests on every single keystroke and provides intuitive dropdown behavior.
  - *How it supports functionality:* Cancels pending timers (`clearTimeout`) during rapid typing and checks click boundaries via `dropdownRef.current`.
- **In-Memory City Catalog (`src/data/destinations.js`)** — Contains 178 pre-verified global and Indian cities with pre-computed GPS coordinates.
  - *Why needed:* Provides instant offline city recommendations with verified coordinates.
  - *How it supports functionality:* Automatically attaches latitude and longitude to the destination without waiting for external geocoders.
- **OpenStreetMap Nominatim API (`/api/places/search-cities`)** — Fallback geocoding service called via our Express backend when a user searches for an uncataloged city (e.g. *Gwalior*, *Bhopal*).
  - *Why needed:* Delivers global coverage for any town or city worldwide.
  - *How it supports functionality:* Resolves city names to coordinates with a 2.8s safety timeout.
- **Google Gemini AI API (`POST /api/trips/generate`)** — Invoked when the user submits the form.
  - *Why needed:* Generates an authentic, structured, day-by-day itinerary according to user budget and style.
  - *How it supports functionality:* Operates behind our Express proxy with a multi-model cascade (`1.5-flash`, `2.0-flash`, `1.5-pro`) and curated offline fallback.
- **Node.js, Express & SQLite Database** — Backend server receives the form data and runs an atomic transaction (`BEGIN TRANSACTION ... COMMIT`) saving the trip, days, activities, and budget into `server/src/data/tripwise.db`.
  - *Why needed:* Permanently persists the generated trip in a normalized relational database.
  - *How it supports functionality:* Generates a unique trip ID and returns `HTTP 201 Created`.
- **React Router DOM (`useNavigate`, `useLocation`)** — Reads incoming `?destination=` query params and redirects to `/trip-details?id=trip_...` upon successful generation.
  - *Why needed:* Seamlessly transitions the user from form submission to the generated itinerary.

---

## 03 — Trip Details & Itinerary Dashboard

* **Route:** `/trip-details`
* **File Path:** `src/pages/TripDetails.jsx`
* **Components:** `Tnavbar.jsx`, `Hero.jsx`, `StatsCards.jsx`, `Itinerary.jsx`, `ExploreMapWeather.jsx`, `InteractiveMap.jsx`, `WeatherCard.jsx`, `BudgetCard.jsx`, `TravelTips.jsx`, `DailySpending.jsx`, `ViewFullItinerary.jsx`, `ChatButton.jsx`, `CuratedTrips.jsx`

### Technologies & Role on This Page:

- **React Router DOM (`useLocation`, `useSearchParams`)** — Extracts the `?id=trip_...` parameter from the URL.
  - *Why needed:* Tells the page which specific trip to fetch and display.
  - *How it supports functionality:* Enables bookmarking, sharing, and reloading the exact trip URL.
- **React State & Hooks (`useState`, `useEffect`, `useCallback`)** — Manages active tabs (Overview vs. Map/Weather), currency switching, day accordion collapse/expansion, and modal visibility.
  - *Why needed:* Handles heavy user interactions across multiple analytical widgets.
  - *How it supports functionality:* Renders live data updates without page reloads.
- **Leaflet & React-Leaflet (`MapContainer`, `TileLayer`, `Marker`, `Popup`)** — Displays an interactive map centered over the destination coordinates (`lat`, `lon`).
  - *Why needed:* Visualizes the geographical location of the trip without expensive paid map services.
  - *How it supports functionality:* Renders OpenStreetMap tiles, custom marker pins, and smooth pan/zoom controls.
- **Recharts (`PieChart`, `Pie`, `Cell`, `Tooltip`, `ResponsiveContainer`)** — Renders an interactive SVG donut/pie chart visualizing the budget breakdown (flights, hotels, food, transport, activities, shopping).
  - *Why needed:* Converts raw numbers into an immediate, easy-to-read visual financial breakdown.
  - *How it supports functionality:* Shows animated slices with percentage tooltips when hovering.
- **Open-Meteo Weather API (`/api/weather`)** — Fetches live 7-day meteorological weather projections using the destination coordinates.
  - *Why needed:* Informs travelers about expected temperatures and rain without requiring an API key.
  - *How it supports functionality:* Populates the 7-day weather card with high/low temperatures and WMO weather icons.
- **Google Gemini AI (`POST /api/chat` via `ChatButton.jsx`)** — Powers the floating AI Travel Concierge chatbot modal.
  - *Why needed:* Answers custom, conversational traveler questions in real time.
  - *How it supports functionality:* Receives destination and trip context, returning concise advice on transit, safety, and dining.
- **Wikipedia REST API / Unsplash Image Service** — Resolves dynamic, high-resolution destination cover images on the backend.
  - *Why needed:* Displays authentic imagery for the destination hero banner.
  - *How it supports functionality:* Queries Wikipedia summaries first, then curated fallbacks if API keys are absent.
- **SQLite Database (`GET /api/trips/:id`, `PUT /api/trips/:id`, `DELETE /api/trips/:id`)** — The Express backend queries the database, executing joins across `trips`, `itinerary_days`, `activities`, `budget_breakdown`, and `trip_highlights`.
  - *Why needed:* Retrieves and updates the complete multi-table trip structure.
  - *How it supports functionality:* Populates the entire page with verified relational data.

---

## 04 — Saved Trips Dashboard

* **Route:** `/dashboard`
* **File Path:** `src/pages/Dashboard.jsx`

### Technologies & Role on This Page:

- **Express & SQLite Database (`GET /api/trips`, `DELETE /api/trips/:id`)** — Queries the backend for all saved trips created by the user and executes cascading deletes when a trip is removed.
  - *Why needed:* Provides persistent access to past trips across browser restarts.
  - *How it supports functionality:* Loads trip cards with titles, dates, budgets, and cover images from the database.
- **Web Storage API (`localStorage`)** — Reads the logged-in user profile (`tripwise_user`) and acts as a local fallback if the backend is offline.
  - *Why needed:* Identifies who is currently signed in on the client side.
  - *How it supports functionality:* Filters trips belonging to the logged-in user.
- **React State (`useState`, `useEffect`)** — Manages the trips list, search query filtering, loading skeletons, and trip deletion.
  - *Why needed:* Allows instant in-browser filtering as the user types in the dashboard search bar.
  - *How it supports functionality:* Dynamically filters trips by destination name in real time.
- **React Router DOM (`Link`, `useNavigate`)** — Navigates to `/trip-details?id=...` when clicking any trip card, or to `/generate-trip` if no trips exist.
  - *Why needed:* Seamless transition between the overview dashboard and specific trip details.
- **Lucide React & Tailwind CSS** — Renders responsive trip cards, trash deletion buttons, calendar badges, and empty-state illustrations.
  - *Why needed:* Provides a clean, organized user dashboard layout.

---

## 05 — User Login

* **Route:** `/login`
* **File Path:** `src/pages/Login.jsx`
* **Components:** `Lsection1.jsx`, `Lsection2.jsx` (`Login.jsx`, `Placeholders.jsx`, `Extra.jsx`, `Continue.jsx`)

### Technologies & Role on This Page:

- **React `useState` Hook** — Tracks user email and password inputs, error alerts, and button loading state.
  - *Why needed:* Provides responsive two-way data binding for authentication credentials.
  - *How it supports functionality:* Displays inline error messages if credentials are invalid.
- **Express Backend API (`POST /api/auth/login`)** — Receives credentials and verifies identity on the server.
  - *Why needed:* Keeps sensitive authentication logic off the client browser.
  - *How it supports functionality:* Queries the `users` table in SQLite by email.
- **Node.js `node:crypto` (`scryptSync` & `timingSafeEqual`)** — Server-side cryptography verifying password hashes.
  - *Why needed:* Protects against brute-force attacks and cryptographic timing attacks.
  - *How it supports functionality:* Hashes the entered password with the stored salt and compares memory buffers in constant time.
- **Stateless HMAC-SHA256 Token (Custom JWT Implementation)** — Server creates a signed authentication token upon successful login.
  - *Why needed:* Provides secure, stateless session verification without server session memory.
  - *How it supports functionality:* Returned to the client and stored in `localStorage` for verified requests.
- **Web Storage API (`localStorage`)** — Stores `tripwise_user` and `tripwise_token` upon successful login.
  - *Why needed:* Persists the login session across browser tabs and page reloads.
- **React Router DOM (`useNavigate`, `Link`)** — Redirects to `/dashboard` upon successful login, or links to `/signup` if the user needs an account.

---

## 06 — User Registration (Sign Up)

* **Route:** `/signup`
* **File Path:** `src/pages/Signup.jsx`
* **Components:** `Lsection1.jsx`, Registration Form

### Technologies & Role on This Page:

- **Client-Side Form Validation** — Checks that name, email, and password are non-empty, verifies password length (≥ 6 characters), and confirms that `password === confirmPassword`.
  - *Why needed:* Catches common typing mistakes before making network requests.
  - *How it supports functionality:* Prevents invalid registration requests from reaching the server.
- **Express Backend API (`POST /api/auth/signup`)** — Sends registration data to the backend.
  - *Why needed:* Safely creates user accounts on the server.
  - *How it supports functionality:* Checks for duplicate emails (`HTTP 409 Conflict`) and inserts new user rows.
- **Node.js `crypto.randomBytes(16)` & `crypto.scryptSync()`** — Generates a unique 16-byte cryptographic salt and derives a memory-hard password hash.
  - *Why needed:* Ensures no plain-text passwords or vulnerable unsalted hashes are ever stored.
  - *How it supports functionality:* Saves `${salt}:${derivedKey}` in the SQLite `users` table.
- **SQLite Database (`users` Table)** — Stores user records (`id`, `name`, `email`, `password_hash`, `created_at`).
  - *Why needed:* Persistent relational storage for user accounts.
  - *How it supports functionality:* Enforces email uniqueness via `UNIQUE` constraints.
- **Web Storage API (`localStorage`)** — Automatically saves user session data upon signup.
  - *Why needed:* Instantly signs the user in after registration without forcing a second login step.
- **React Router DOM (`useNavigate`)** — Redirects directly to `/dashboard`.

---

## 07 — 404 Not Found Page

* **Route:** `*` (Catch-All Route)
* **File Path:** `src/pages/NotFound.jsx`
* **Components:** `Navbar.jsx`, `Footer.jsx`

### Technologies & Role on This Page:

- **React Router DOM (`path="*"`)** — Catch-all route declaration in `App.jsx`.
  - *Why needed:* Intercepts invalid, broken, or mistyped URLs.
  - *How it supports functionality:* Prevents empty white screens and handles routing errors gracefully.
- **Tailwind CSS & Lucide React (`Compass`, `Home`, `LayoutDashboard`)** — Displays a centered travel-themed error card with icon illustrations.
  - *Why needed:* Maintains professional visual branding even during error states.
  - *How it supports functionality:* Creates an aesthetically pleasing, clear error message.
- **React Router DOM (`Link`)** — Provides two recovery buttons: `"Return Home"` (`/`) and `"My Trips"` (`/dashboard`).
  - *Why needed:* Guides lost users back into active application workflows.
  - *How it supports functionality:* Restores navigation without browser back-button confusion.
- **Backend & Database on this page:** *Not used on this page.*

---

## 📊 Summary Table: What Each Technology Powers

| Technology | Primarily Powers |
| :--- | :--- |
| **React.js 19** | Component-based UI rendering, state-driven updates, and Virtual DOM diffing across all 7 pages |
| **Vite 8** | Development server, sub-second Hot Module Replacement (HMR), and optimized production Rollup bundling |
| **Express.js / Node.js** | Backend REST API (port 5001), request routing, CORS headers, error handling, and static file serving |
| **Google Gemini API** | Multi-day travel plan generation, structured JSON itinerary schemas, and AI concierge chatbot |
| **SQLite (`node:sqlite`)** | Embedded database persistence across 7 relational tables with ACID transactions, foreign keys, and WAL mode |
| **Leaflet / React-Leaflet** | Interactive OpenStreetMap rendering, zoom/pan controls, and destination GPS pin drops on `/trip-details` |
| **Open-Meteo API** | Free, keyless 7-day meteorological temperature and precipitation forecasts on `/trip-details` |
| **OpenStreetMap Nominatim** | Worldwide debounced city geocoding and coordinate resolution on `/generate-trip` |
| **Recharts** | SVG-based responsive budget breakdown donut/pie charts on `/trip-details` |
| **Tailwind CSS v4** | Utility-first responsive design, layout styling, and CSS variables across all components |
| **React Router DOM v7** | Client-side SPA navigation, query param parsing (`?destination=`, `?id=`), and catch-all 404 routing |
| **Node.js `node:crypto`** | Salted `scrypt` password hashing, `timingSafeEqual` comparison, and stateless HMAC-SHA256 JWT tokens |
| **Lucide React** | Scalable vector SVG icon components throughout the interface |
| **Web Storage (`localStorage`)** | Client-side user session persistence (`tripwise_user`, `tripwise_token`) |

---

## 🚫 Technologies NOT Used in the Current Implementation

To prevent any confusion or inaccurate claims in a viva, the following technologies are **not used** in TripWise AI:

- **MongoDB / Mongoose:** *Not used.* (TripWise AI uses native relational SQLite for structured data).
- **Third-Party ORMs (Prisma, Sequelize, TypeORM):** *Not used.* (Native prepared statements via `DatabaseSync` are used for zero-dependency simplicity).
- **bcrypt:** *Not used.* (Node’s native `node:crypto` with memory-hard `scrypt` is used instead).
- **Third-Party JWT Packages (`jsonwebtoken`):** *Not used.* (A custom, native HMAC-SHA256 implementation is used for zero external package footprint).
- **Google Maps API:** *Not used.* (Leaflet and open-source OpenStreetMap tiles are used to avoid paid API keys).
- **Socket.IO / WebSockets:** *Not used.* (Communication uses standard stateless HTTP REST fetch requests).
- **Cloudinary / AWS S3:** *Not used.* (Images are dynamically resolved via Unsplash and Wikipedia REST APIs).

---

## 🔮 Future Scope Technologies (Recommended for Viva Discussion)

If examiners ask what technologies you would introduce next:

1. **WebSockets / Socket.IO:** For real-time group collaboration so multiple friends can edit a trip simultaneously.
2. **Amadeus / Skyscanner APIs:** For real-time live flight price checking and hotel room booking integration.
3. **PWA (Progressive Web App) Service Workers:** For caching itineraries offline so travelers can read plans in flight without internet.
4. **Redis Cache:** For high-speed caching of frequent Gemini trip plans in a multi-server production environment.
