# TripWise AI — Comprehensive Viva & Technical Interview Q&A (150 Questions)

This document contains 150 comprehensive, categorized questions and model answers tailored specifically to TripWise AI. It is organized into 6 distinct tiers to prepare you for any examiner or interviewer.

---

## Category 1: Basic & Conceptual Questions (Q1 – Q30)

### Q1: What is TripWise AI?
**Answer:** TripWise AI is a full-stack automated travel planning web application. It takes user travel preferences—origin, destination, budget, duration, dates, and travel styles—and uses Google's Gemini AI and open-source APIs to generate a realistic, day-by-day itinerary with weather forecasts, interactive maps, expense breakdowns, and persistent storage.

### Q2: What are the main technologies used in this project?
**Answer:** The frontend is built with React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, Leaflet, and Recharts. The backend is built with Node.js v22+ and Express 4, with native `node:sqlite` for database persistence, Google Gemini AI (`@google/generative-ai`), Open-Meteo for weather, and OpenStreetMap Nominatim for geocoding.

### Q3: What is a Single Page Application (SPA)?
**Answer:** A Single Page Application loads a single HTML file on initial load. As the user navigates between pages, JavaScript dynamically updates the DOM without reloading or re-fetching the entire HTML page from the server. TripWise AI uses React Router DOM to achieve this.

### Q4: What is Vite and why did you choose it over Create React App?
**Answer:** Vite is a modern frontend build tool that leverages native ES Modules (ESM) in the browser. It offers instantaneous server start times (<300ms) and lightning-fast Hot Module Replacement (HMR). Create React App is deprecated, slow to bundle, and relies on outdated Webpack configurations.

### Q5: What is JSX?
**Answer:** JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows us to write HTML-like markup inside React component files. It compiles down to standard `React.createElement()` function calls.

### Q6: What is the Virtual DOM and how does it work?
**Answer:** The Virtual DOM is a lightweight, in-memory representation of the real DOM. When state changes, React creates a new Virtual DOM tree, compares it with the previous tree using a diffing algorithm, and updates only the changed elements in the real browser DOM.

### Q7: What is the difference between State and Props?
**Answer:** State is an internal, mutable data store managed inside a component via `useState`. Props are read-only properties passed from a parent component down to a child component to configure it or share data.

### Q8: What does `useState` do?
**Answer:** `useState` is a React Hook that declares a state variable and an updater function. When the updater function is called with a new value, React schedules a re-render of the component with the updated state.

### Q9: What does `useEffect` do?
**Answer:** `useEffect` is a React Hook for executing side-effects in functional components, such as data fetching, setting up event listeners, or timers. It accepts a function and an optional dependency array that controls when the effect executes.

### Q10: What is the purpose of the dependency array in `useEffect`?
**Answer:** The dependency array tells React when to re-run the effect. An empty array `[]` means the effect runs once when the component mounts. Passing variables `[searchQuery, activeCountry]` means the effect re-runs only when any of those values change. Omitting the array causes the effect to run on every single render.

### Q11: What is `useRef` used for in this project?
**Answer:** `useRef` creates a mutable reference object whose `.current` property persists across renders without triggering a re-render when changed. In `CityDropdown.jsx`, we use `dropdownRef` to detect clicks outside the dropdown and `searchInputRef` to auto-focus the search field when opened.

### Q12: What does `useMemo` do and where is it used?
**Answer:** `useMemo` memoizes the result of an expensive calculation so it is only recomputed when specified dependencies change. In `CityDropdown.jsx`, we use `useMemo` to filter our in-memory catalog of 178 cities so it doesn't recalculate on unrelated renders.

### Q13: What is Tailwind CSS?
**Answer:** Tailwind CSS is a utility-first CSS framework that provides single-purpose utility classes (e.g. `flex`, `p-6`, `text-blue-600`, `rounded-xl`). It eliminates the need to write custom CSS stylesheets and purges unused styles during production builds.

### Q14: What is client-side routing?
**Answer:** In client-side routing, the browser's URL changes, but the browser does not make a GET request to the server for a new HTML page. Instead, JavaScript (React Router) listens to the URL change and renders the matching component in place.

### Q15: What HTTP port does the frontend run on? What about the backend?
**Answer:** The Vite frontend runs on port `5173`. The Express backend server runs on port `5001`.

### Q16: What is Node.js?
**Answer:** Node.js is an open-source, cross-platform JavaScript runtime built on Chrome’s V8 JavaScript engine that executes JavaScript code outside a web browser, enabling server-side development.

### Q17: What is Express.js?
**Answer:** Express.js is a minimalist, flexible web application framework for Node.js that provides routing, middleware support, and HTTP utility methods for building RESTful APIs.

### Q18: What is REST?
**Answer:** REST stands for Representational State Transfer. It is an architectural style for networked applications that uses standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) and stateless request-response communication over unique resource URLs.

### Q19: What is the difference between `GET` and `POST` requests?
**Answer:** `GET` is used to retrieve data from a server and should not modify server state; parameters are passed in the URL query string. `POST` is used to send data to the server to create or process a resource; parameters are passed in the HTTP request body.

### Q20: What is CORS and why is it needed?
**Answer:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain, protocol, or port than the one that served the page. Because our frontend is on port 5173 and our backend is on port 5001, CORS middleware is required on Express to permit requests.

### Q21: What does `express.json()` do?
**Answer:** `express.json()` is built-in middleware that parses incoming requests with JSON payloads and populates `req.body` with the parsed JavaScript object.

### Q22: What is SQLite?
**Answer:** SQLite is a C-language library that implements a self-contained, serverless, zero-configuration, transactional SQL database engine. It stores the entire database in a single disk file.

### Q23: Where is the SQLite database file located in your project?
**Answer:** In `server/src/data/tripwise.db`.

### Q24: What is Google Gemini?
**Answer:** Google Gemini is a family of multimodal large language models developed by Google AI. In our project, we use the `@google/generative-ai` SDK to prompt the model to generate structured travel itineraries.

### Q25: What is Open-Meteo?
**Answer:** Open-Meteo is an open-source, free weather API that provides 7-day weather forecasts without requiring an API key. We use it to fetch temperature, weather codes, and precipitation probabilities.

### Q26: What is OpenStreetMap Nominatim?
**Answer:** Nominatim is a search engine for OpenStreetMap data that provides geocoding (converting city names to GPS coordinates) and reverse geocoding.

### Q27: What is Leaflet?
**Answer:** Leaflet is an open-source JavaScript library for mobile-friendly interactive maps. We use `react-leaflet` to render OpenStreetMap tiles and destination pins.

### Q28: What is Recharts?
**Answer:** Recharts is a composable, SVG-based charting library built specifically for React components. We use it to render the visual budget breakdown on the trip details page.

### Q29: What happens if you submit the trip form with an empty city?
**Answer:** The form validation in `Form.jsx` intercepts the submission, displays an inline red error banner saying *"Please enter a Starting City"*, and halts execution without sending an API request.

### Q30: What is `.env` and why is it excluded from GitHub?
**Answer:** `.env` contains environment variables, including secret API keys (`GEMINI_API_KEY`, `JWT_SECRET`). It is excluded via `.gitignore` to prevent leaking private credentials to public version control. We provide `.env.example` as a template.

---

## Category 2: Intermediate Questions (Q31 – Q60)

### Q31: How do components communicate in React?
**Answer:** Components communicate downwards (parent to child) via props. Child components communicate upwards (child to parent) by calling callback functions passed down as props (e.g., `onChange={(val) => setDestination(val)}`). For sibling communication, state is lifted to their common parent.

### Q32: What is "lifting state up"?
**Answer:** Lifting state up is the practice of moving shared state to the closest common ancestor component so that multiple child components can reflect the same data or trigger updates.

### Q33: How does the dual-tier city search work in `CityDropdown.jsx`?
**Answer:** When the user types, Tier 1 immediately filters an in-memory catalog of 178 cities in RAM with `<1ms` latency. Concurrently, if the query has at least 2 characters, Tier 2 waits for a 320ms debounce and calls `/api/places/search-cities`, querying OpenStreetMap Nominatim for worldwide locations. Both result sets are merged and deduplicated using an ES6 `Map`.

### Q34: What is debouncing and why is it important in search inputs?
**Answer:** Debouncing ensures that a time-consuming task is not executed until a specified delay has elapsed since it was last called. Without debouncing, typing "Paris" would fire 5 separate network requests. With a 320ms debounce, only 1 request is fired when the user finishes typing.

### Q35: How does the cleanup function in `useEffect` work?
**Answer:** When `useEffect` returns a function, React executes that function when the component unmounts or before re-running the effect on dependency change. In `CityDropdown`, `return () => clearTimeout(timer)` cancels the pending timeout if the user types another letter before 320ms expires.

### Q36: Why did you use `useRef` instead of `useState` for the search input focus?
**Answer:** `useRef` directly references the underlying HTML `<input>` DOM node without causing a re-render. Calling `.focus()` on a ref is an imperative DOM action that does not require re-rendering the component.

### Q37: How does React Router DOM pass the trip ID to the trip details page?
**Answer:** When a trip is generated, `Form.jsx` calls `navigate('/trip-details?id=' + res.data.id)`. On the details page, `useLocation()` is paired with `new URLSearchParams(location.search)` to extract the `id` parameter and fetch the complete trip data.

### Q38: What are the 7 relational tables in your SQLite database?
**Answer:** `users`, `trips`, `itinerary_days`, `activities`, `budget_breakdown`, `trip_highlights`, and `saved_places`.

### Q39: What is the relationship between `trips` and `itinerary_days`?
**Answer:** It is a One-to-Many relationship. One trip has multiple itinerary days, linked by `itinerary_days.trip_id` referencing `trips.id`.

### Q40: What is the relationship between `itinerary_days` and `activities`?
**Answer:** It is a One-to-Many relationship. One day has multiple activities, linked by `activities.day_id` referencing `itinerary_days.id`.

### Q41: What is the relationship between `trips` and `budget_breakdown`?
**Answer:** It is a One-to-One relationship. Each trip has exactly one budget breakdown, enforced by a `UNIQUE` constraint on `budget_breakdown.trip_id`.

### Q42: What is `PRAGMA foreign_keys = ON;` and why is it required?
**Answer:** By default, SQLite disables foreign key constraint checking for backwards compatibility. Executing this PRAGMA on startup forces SQLite to reject invalid foreign key inserts and enables `ON DELETE CASCADE`.

### Q43: What is `ON DELETE CASCADE`?
**Answer:** It is a referential action that automatically deletes all child records when their parent record is deleted. In TripWise AI, deleting a row in `trips` automatically deletes all its days, activities, budget allocations, and highlights.

### Q44: What is `PRAGMA journal_mode = WAL;`?
**Answer:** WAL stands for Write-Ahead Logging. Instead of locking the entire database during write transactions, SQLite appends changes to a `-wal` log file. This allows concurrent read operations to proceed without blocking writers, drastically improving concurrency.

### Q45: What is an atomic database transaction?
**Answer:** A transaction is a unit of work that must satisfy ACID properties. In `saveTrip()`, writes across 5 tables are wrapped in `BEGIN TRANSACTION;` and `COMMIT;`. If an error occurs, `ROLLBACK;` reverts all changes so no partial or orphaned data remains.

### Q46: How does password hashing work in your authentication route?
**Answer:** When a user registers, `crypto.randomBytes(16)` generates a 16-byte random salt. `crypto.scryptSync(password, salt, 64)` derives a 64-byte cryptographic hash. The salt and hash are stored together as `${salt}:${derivedKey}` in the `password_hash` column.

### Q47: Why do you store a salt with each password?
**Answer:** A salt ensures that two users with identical passwords have completely different password hashes. It prevents attackers from using pre-computed lookup tables (Rainbow Tables) to crack passwords in bulk.

### Q48: What is a timing attack and how did you prevent it?
**Answer:** A timing attack measures the exact time it takes to compare strings character-by-character. Standard comparison `===` exits on the first mismatched byte, leaking information about password characters. We use `crypto.timingSafeEqual()`, which takes constant time regardless of where mismatches occur.

### Q49: How do your JWT tokens work?
**Answer:** Our `generateToken()` function constructs a header (`HS256`) and payload (`id`, `email`, `exp`), base64url encodes them, and generates an HMAC-SHA256 signature using `JWT_SECRET`. The client transmits this token in the `Authorization: Bearer <token>` header, and `verifyToken()` recalculates the HMAC signature to verify authenticity without querying the database.

### Q50: How does the backend validate trip generation inputs?
**Answer:** In `server/src/routes/trips.js`, the route validates that `city` and `destination` are non-empty, `budget` is a positive number, and `duration` is an integer between 1 and 30 days. If any check fails, it responds with `HTTP 400 Bad Request`.

### Q51: Why clamp trip duration between 1 and 30 days?
**Answer:** LLM output tokens are limited. Generating 30+ days of detailed activities with descriptions, tips, and costs would exceed Gemini's output token window, causing the JSON stream to cut off mid-syntax and fail `JSON.parse()`.

### Q52: What is the purpose of `Promise.all` in `POST /api/trips/generate`?
**Answer:** It executes the itinerary generation (`generateItinerary`) and the cover photo fetch (`fetchDestinationImage`) concurrently. Rather than waiting for Gemini to finish before starting the photo search, both run in parallel, cutting total response latency in half.

### Q53: How does the weather service handle coordinates?
**Answer:** In `weatherService.js`, the service first checks an in-memory geocode cache. If missing, it checks a dictionary of known coordinates (`KNOWN_COORDINATES`). If still missing, it queries OpenStreetMap Nominatim with an `AbortController` timeout before calling Open-Meteo.

### Q54: What is an `AbortController`?
**Answer:** It is a standard JavaScript interface that allows an ongoing fetch request to be canceled. We set a 2.8s - 4.0s timeout timer that calls `controller.abort()`, preventing external geocoding delays from holding backend request threads open.

### Q55: Why must you send a custom `User-Agent` header to Nominatim?
**Answer:** The OpenStreetMap Foundation's Acceptable Use Policy strictly requires all API clients to provide a unique, descriptive `User-Agent`. Requests with generic or missing headers are automatically rejected with an HTTP 403 Forbidden.

### Q56: How does the Wikipedia image fallback work?
**Answer:** If no Unsplash key is configured, `unsplashService.js` calls Wikipedia’s REST API (`/api/rest_v1/page/summary/<city>`). Wikipedia provides high-resolution, copyright-cleared photos of major landmarks for virtually every city in the world without requiring an API key.

### Q57: What is the purpose of `ErrorBoundary.jsx`?
**Answer:** `ErrorBoundary` is a React class component that implements `componentDidCatch` to catch JavaScript errors anywhere in child component trees, log the error, and display a friendly fallback UI instead of crashing the entire React app.

### Q58: What is the purpose of `lucide-react`?
**Answer:** `lucide-react` provides lightweight, customizable SVG icon components (e.g. `MapPin`, `Calendar`, `DollarSign`, `CloudSun`, `AlertCircle`) that render crisply at any display resolution with zero layout shift.

### Q59: What is the difference between `npm run dev` and `npm run build`?
**Answer:** `npm run dev` runs Vite in development mode with live ESM serving and HMR. `npm run build` compiles, transpiles, and minifies the code into static HTML, CSS, and JS bundles inside the `/dist` directory for production deployment.

### Q60: How does the backend serve the production frontend build?
**Answer:** In `server/src/index.js`, the server checks if `dist/` exists via `fs.existsSync()`. If present, it serves static files via `express.static()` and handles all unmatched non-API routes by returning `dist/index.html` for client-side routing.

---

## Category 3: Advanced Questions (Q61 – Q90)

### Q61: What is the multi-model cascade implemented in `geminiService.js`?
**Answer:** Instead of hardcoding a single AI model, `generateTripPlan()` loops through `["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]`. If the primary flash model encounters a transient error, timeout, or rate-limiting (HTTP 429), the service automatically retries with the next candidate before engaging the fallback engine.

### Q62: How does the AI prompt enforce JSON-only output?
**Answer:** The prompt explicitly states: *"Return ONLY a valid, parseable JSON object. DO NOT include any markdown fences (like ```json), DO NOT include any explanatory text before or after the JSON."* It also specifies the exact JSON schema structure required.

### Q63: Why does `geminiService.js` still strip markdown fences even after asking the model not to include them?
**Answer:** LLMs are non-deterministic and have strong training priors to wrap code blocks in markdown fences (` ```json ... ``` `). Defensive programming dictates sanitizing the raw response with `.replace(/```json/gi, "").replace(/```/g, "").trim()` before calling `JSON.parse()`.

### Q64: How does TripWise AI detect and handle AI hallucinations like duplicate activities?
**Answer:** After parsing the JSON, `geminiService.js` iterates through all daily activities and tracks their titles using an ES6 `Set` (`seenTitles`). If `seenTitles.has(act.title)` evaluates to true, it detects that the AI generated repetitive schedule items, discards the hallucinated output, and invokes `generateFallbackItinerary()`.

### Q65: How does the curated fallback engine guarantee zero failures?
**Answer:** `CURATED_DESTINATION_ITINERARIES` contains handcrafted, 100% verified multi-day itineraries for major destinations (Seoul, Busan, Tokyo, Kyoto, Paris, London, Athens, etc.) with real landmarks, descriptions, costs, and timings. For uncurated cities, it procedurally synthesizes realistic themed activities and calculates proportional budgets mathematically.

### Q66: Why did you choose native `node:sqlite` over an ORM like Prisma or TypeORM?
**Answer:** Native `node:sqlite` has zero dependencies, compiles zero native C++ code on installation, and introduces zero abstraction overhead. ORMs introduce complex schema migrations, hidden N+1 query problems, and heavy bundle sizes. Native prepared statements provide maximum transparency, predictability, and performance.

### Q67: What is the difference between SQLite rollback journaling and WAL mode?
**Answer:** In traditional rollback journaling, changes are written directly to the database file while the original unchanged pages are kept in a rollback journal. Writers require an exclusive lock, blocking all readers. In WAL mode, changes are appended to a separate write-ahead log file, allowing readers to read uncommitted snapshots concurrently without lock contention.

### Q68: How do B-tree indexes optimize queries in SQLite?
**Answer:** B-trees maintain sorted keys with pointers to row IDs. In our schema, indexes like `idx_activities_trip_id` allow SQLite to locate all activities for a given trip in **O(log N)** time via binary search, rather than scanning thousands of activity rows in **O(N)** time.

### Q69: Explain the ACID guarantees in your `saveTrip()` transaction.
**Answer:**
- **Atomicity:** Wrapped in `BEGIN TRANSACTION;` and `COMMIT;`. If writing Day 4 fails, `ROLLBACK;` cancels everything.
- **Consistency:** Enforces foreign keys (`PRAGMA foreign_keys = ON;`) so activity records cannot exist without a valid day and trip.
- **Isolation:** Concurrent readers cannot observe intermediate states where a trip has been created but its activities haven't been inserted.
- **Durability:** Committed transactions are flushed to disk via SQLite's write-ahead log.

### Q70: How does `crypto.scryptSync()` protect against brute-force attacks?
**Answer:** Unlike fast hashing algorithms like MD5 or SHA-256 (which can be calculated billions of times per second on GPUs), `scrypt` is intentionally designed to be **memory-hard**. It requires significant RAM and CPU cycles to compute each hash, making hardware-accelerated ASIC and GPU brute-force attacks computationally and financially unfeasible.

### Q71: Explain how `crypto.timingSafeEqual()` works internally.
**Answer:** It compares two memory buffers in constant time. Instead of terminating early on the first differing byte (`if (a[i] !== b[i]) return false`), it performs a bitwise OR across all XORed bytes (`result |= a[i] ^ b[i]`) across the entire buffer length, ensuring execution time is identical regardless of password correctness.

### Q72: What is the anatomy of your custom JWT token?
**Answer:** It consists of three Base64URL-encoded strings separated by dots (`header.payload.signature`):
1. **Header:** `{"alg": "HS256", "typ": "JWT"}`
2. **Payload:** User claims (`id`, `email`, `name`, `iat`, `exp`)
3. **Signature:** `HMAC-SHA256(header + "." + payload, JWT_SECRET)`

### Q73: Why is your JWT authentication stateless?
**Answer:** The server does not store active session tokens in the database or in memory. When a request arrives, `verifyToken()` validates the HMAC signature and expiration timestamp mathematically using the server's secret key. If valid, the user identity is trusted, reducing database read overhead to zero.

### Q74: How do you handle lazy state initialization in `Form.jsx`?
**Answer:** `useState(() => { ... })` accepts a function rather than a direct value. This ensures the URL search param parsing logic (`new URLSearchParams(...)`) only executes once during initial mount, rather than on every single render.

### Q75: What is the purpose of `React.StrictMode` in development?
**Answer:** `React.StrictMode` intentionally mounts, unmounts, and re-mounts components in development to detect uncleaned side-effects (such as orphaned timers or unremoved event listeners), memory leaks, and legacy lifecycle usage.

### Q76: How does Leaflet handle dynamic map centering when the destination changes?
**Answer:** In `InteractiveMap.jsx`, the `<MapContainer>` accepts `center={[lat, lon]}` and `zoom={12}`. When coordinates update, a helper component using `useMap()` calls `map.flyTo([lat, lon], 12)` to smoothly pan the camera to the new destination.

### Q77: How are SVG budget charts rendered with Recharts?
**Answer:** Recharts takes the structured `budgetBreakdown` object from SQLite, transforms it into an array of `{ name: "Hotels", value: 600, fill: "#3B82F6" }`, and renders responsive SVG `<PieChart>` and `<Pie>` components with tooltip hover interactions.

### Q78: How do you prevent cross-site scripting (XSS) in React?
**Answer:** React escapes all strings rendered in JSX by default before inserting them into the DOM. Unless a developer explicitly uses `dangerouslySetInnerHTML`, injected HTML or script tags like `<script>alert(1)</script>` are treated as plain text literals.

### Q79: How do you prevent SQL Injection in your backend?
**Answer:** We never concatenate raw user input into SQL queries. We use parameterized prepared statements (`db.prepare("INSERT ... VALUES (?, ?)")`). The SQLite engine compiles the query structure first, and parameters are inserted strictly as data literals.

### Q80: How does the application handle rate-limiting from OpenStreetMap Nominatim?
**Answer:** 
1. Queries are debounced by 320ms on the frontend.
2. The backend caches geocode results in an in-memory `Map`.
3. If Nominatim fails or times out, the backend falls back to its internal `KNOWN_COORDINATES` dictionary.

### Q81: What is the difference between `dependencies` and `devDependencies` in `package.json`?
**Answer:** `dependencies` are packages required for the application to run in production (e.g. `react`, `express`, `leaflet`). `devDependencies` are packages only required during local development and building (e.g. `vite`, `eslint`, `@vitejs/plugin-react`).

### Q82: How does `crypto.randomBytes(4).toString("hex")` work in ID generation?
**Answer:** `Date.now()` provides millisecond uniqueness, and `crypto.randomBytes(4).toString("hex")` appends 8 cryptographically secure random hexadecimal characters (e.g., `trip_1741498800000_a3f8c12e`), eliminating collision risks even under simultaneous user requests.

### Q83: What is the role of `server/src/db/seed.js`?
**Answer:** It is an automated seeder script that clears and populates the SQLite database with realistic sample trips, days, activities, and budget breakdowns so developers or examiners can test the application immediately without manually generating trips.

### Q84: How does the AI Concierge chatbot maintain context in `POST /api/chat`?
**Answer:** The request payload passes `destination` and a truncated `tripContext` (up to 1,000 characters) containing duration, budget, and travel styles. The prompt injects this context so Gemini answers specifically about that user's trip rather than giving generic advice.

### Q85: What happens if an unauthenticated user generates a trip?
**Answer:** Guest trip creation is fully supported. The backend accepts `userId: null`, sets `trips.user_id = NULL`, and saves the trip normally. The user can view the full itinerary, map, and weather. If the user later signs up or logs in, their user ID can be linked.

### Q86: How does the frontend handle network errors during trip generation?
**Answer:** `api.js` wraps `fetch()` in a `try...catch` block. If the server is unreachable, it throws an error that `Form.jsx` catches, resetting `loading` to `false` and rendering an inline error alert explaining that the backend could not be reached.

### Q87: What is tree-shaking and how does Vite use it?
**Answer:** Tree-shaking is a dead-code elimination technique used by Rollup during `vite build`. It analyzes ES module `import` and `export` statements and excludes unused functions from the final production bundle, keeping download sizes small.

### Q88: Why are coordinates stored as JSON strings in SQLite?
**Answer:** SQLite does not have a native Point/Geometry data type like PostGIS. Storing `{ lat: 37.98, lon: 23.72 }` as a JSON string (`coordinates TEXT`) allows simple serialization and deserialization while preserving full floating-point precision.

### Q89: How does the application prevent duplicate cities in the search dropdown?
**Answer:** In `CityDropdown.jsx`, `displayedCities` iterates through local matches and remote matches, inserting items into a `Map` keyed by `${item.city.toLowerCase()}_${item.country.toLowerCase()}`. If a remote result matches a local city, the local verified entry is preserved.

### Q90: What is the difference between synchronous and asynchronous operations in Node.js?
**Answer:** Synchronous operations block the Node.js event loop until completion, preventing other tasks from executing. Asynchronous operations (like `fetch`, timers, or promises) delegate work to background threads or the operating system, allowing the single-threaded event loop to continue processing other requests.

---

## Category 4: Code-Specific Questions (Q91 – Q110)

### Q91: Where is the form validation logic written?
**Answer:** Inside the `handleGenerateTrip` function in `src/components/Tripgenerator/Form.jsx`, lines 118–160.

### Q92: Which file initializes the SQLite schema?
**Answer:** `server/src/db/schema.js` inside the `initSchema()` function.

### Q93: Where are the database foreign keys and WAL mode configured?
**Answer:** In `server/src/db/database.js` on lines 21–22: `db.exec("PRAGMA foreign_keys = ON;");` and `db.exec("PRAGMA journal_mode = WAL;");`.

### Q94: Where is the atomic transaction executed when saving a trip?
**Answer:** In `server/src/db/repositories.js` inside `tripsRepo.saveTrip()` on lines 128–246.

### Q95: Where are candidate Gemini models declared?
**Answer:** In `server/src/services/geminiService.js` on line 580: `const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];`.

### Q96: Where is markdown fence stripping implemented?
**Answer:** In `server/src/services/geminiService.js` on lines 589–592 using `.replace(/```json/gi, "").replace(/```/g, "").trim()`.

### Q97: Where is duplicate activity detection implemented?
**Answer:** In `server/src/services/geminiService.js` on lines 598–612 using `const seenTitles = new Set();`.

### Q98: What is the exact debounce delay in `CityDropdown.jsx`?
**Answer:** 320 milliseconds (`setTimeout(..., 320)` on line 93 of `CityDropdown.jsx`).

### Q99: Where is password hashing defined?
**Answer:** In `server/src/routes/auth.js` in `hashPassword()` on lines 67–71 using `crypto.scryptSync(password, salt, 64)`.

### Q100: Where is constant-time password verification defined?
**Answer:** In `server/src/routes/auth.js` in `verifyPassword()` on line 79 using `crypto.timingSafeEqual(keyBuffer, derivedKey)`.

### Q101: How many destinations are in `src/data/destinations.js`?
**Answer:** Exactly 178 cities across 56 countries.

### Q102: Which component renders the interactive Leaflet map?
**Answer:** `src/components/Details/Explore/InteractiveMap.jsx`.

### Q103: Which component renders the visual budget breakdown chart?
**Answer:** `src/components/Details/RSection/BudgetCard.jsx`.

### Q104: Where is the centralized frontend API client located?
**Answer:** In `src/services/api.js`.

### Q105: How does `src/services/api.js` know which backend URL to call?
**Answer:** Line 7: `const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";`.

### Q106: Where is the Open-Meteo weather endpoint called?
**Answer:** In `server/src/services/weatherService.js` on line 201.

### Q107: Where is the Wikipedia image fallback implemented?
**Answer:** In `server/src/services/unsplashService.js` on lines 145–188.

### Q108: Which function retrieves user-specific saved trips?
**Answer:** `tripsRepo.getAllTrips(userId)` in `server/src/db/repositories.js`.

### Q109: What is the purpose of `src/components/Details/ChatButton.jsx`?
**Answer:** It renders a floating AI Travel Concierge chat modal that queries `POST /api/chat`.

### Q110: Where is the global error handler middleware located?
**Answer:** In `server/src/index.js` on lines 81–88: `app.use((err, req, res, next) => { ... })`.

---

## Category 5: Bugs & Problem-Solving Questions (Q111 – Q130)

### Q111: What was the bug with hardcoded form defaults and how did you resolve it?
**Answer:** Initially, the form pre-loaded with "Seoul", "San Francisco", `$2500`, and `5 days`, causing users to accidentally create unintended trips. We resolved it by initializing all form states to empty strings and empty arrays, requiring explicit manual entry.

### Q112: Why did `CityDropdown` originally have a duplicate key warning for Athens?
**Answer:** Both Athens, Greece and Athens, Georgia (USA) existed in the dataset with overlapping identifiers. We resolved it by generating unique keys combining `${city}_${country}` and disambiguating city records.

### Q113: How did you fix the ESLint warning regarding missing hook dependencies?
**Answer:** React Hooks ESLint rules flagged `useEffect` calls where variables were used inside effects without being listed in the dependency array. We audited all dependencies, wrapping stable calculations in `useCallback` or `useMemo` and adding appropriate dependencies.

### Q114: Why did OpenStreetMap Nominatim occasionally return HTTP 403 Forbidden?
**Answer:** Nominatim requires an explicit, identifiable `User-Agent`. When requests lacked this header, Nominatim blocked them. We added `"User-Agent": "TripWiseAI/1.0"` to the fetch headers.

### Q115: What caused database locking errors before enabling WAL mode?
**Answer:** Under default SQLite journaling, writing to the database placed an exclusive lock on the file, causing concurrent read requests from other routes to fail with `SQLITE_BUSY`. Enabling `PRAGMA journal_mode = WAL;` solved this by isolating writes to the write-ahead log.

### Q116: How did you fix Gemini returning markdown code fences that broke `JSON.parse()`?
**Answer:** Even when prompted for raw JSON, Gemini occasionally wrapped responses in ` ```json ... ``` `. We added regex sanitization `.replace(/```json/gi, "").replace(/```/g, "").trim()` before parsing.

### Q117: What was the issue with AI repeating the same attraction across multiple days?
**Answer:** LLMs sometimes lack cross-day context memory and repeat famous landmarks (e.g. recommending the Louvre on Day 1 and Day 3). We implemented a duplicate activity detector using an ES6 `Set()`. If duplicate titles occur, the response is rejected in favor of the curated non-repeating engine.

### Q118: How did you fix the dropdown staying open after clicking outside?
**Answer:** We added an event listener to `document` on `mousedown` inside a `useEffect`. If `!dropdownRef.current.contains(event.target)`, it calls `setIsOpen(false)`.

### Q119: What happened when the destination had no GPS coordinates?
**Answer:** The Leaflet map would crash with invalid center coordinates. We resolved this by adding automatic fallback geocoding in `weatherService.js` and defaulting to center coordinates if geocoding fails.

### Q120: How did you solve the problem of slow city searches over poor internet?
**Answer:** By implementing a dual-tier search: 178 popular cities are filtered instantly from in-memory RAM in `<1ms`, providing immediate feedback while the debounced remote search runs asynchronously.

### Q121: How did you fix the issue where guest users couldn't generate trips?
**Answer:** The database schema was updated so `trips.user_id` allows `NULL` values and has `ON DELETE SET NULL`. If a user is not logged in, `userId` is passed as `null` and the trip saves successfully.

### Q122: Why did trip duration need an upper limit of 30 days?
**Answer:** Without a limit, a user could request a 100-day trip, which would exceed Gemini's maximum output token limit (8192 tokens) and cause the response to terminate mid-JSON.

### Q123: How did you prevent negative or decimal budgets from breaking calculations?
**Answer:** We added validation checks: `isNaN(parsedBudget) || parsedBudget <= 0`. If invalid, an error banner is displayed and submission is halted.

### Q124: How did you resolve the issue where clicking a curated trip on the landing page didn't populate the form?
**Answer:** We added a query parameter to landing page links (`/generate-trip?destination=Kyoto`). In `Form.jsx`, we used lazy initialization with `new URLSearchParams(location.search).get("destination")` to pre-populate the destination.

### Q125: What was the issue with Unsplash API rate limits and how was it solved?
**Answer:** Unsplash free tier allows only 50 requests per hour. When exceeded, images failed. We implemented a 5-tier fallback cascade that falls back to Wikipedia’s REST API (unlimited and free) and a curated photo dictionary.

### Q126: How did you fix the issue where deleting a trip left orphaned activities in the database?
**Answer:** We enabled `PRAGMA foreign_keys = ON;` and defined all child tables with `FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE`.

### Q127: Why did the map marker icon initially fail to render in Leaflet?
**Answer:** Leaflet has a known Webpack/Vite bundler issue where default marker icon image paths are not automatically resolved. We resolved it by importing marker images explicitly and configuring `L.Icon.Default.mergeOptions`.

### Q128: How did you resolve password verification vulnerabilities?
**Answer:** Legacy plain-text or unsalted SHA-256 hashes are vulnerable to rainbow tables and timing attacks. We migrated to salted `crypto.scryptSync()` and `crypto.timingSafeEqual()`.

### Q129: How did you prevent duplicate accounts during user registration?
**Answer:** The `users` table defines `email TEXT UNIQUE NOT NULL`. In `auth.js`, the route executes `usersRepo.findUserByEmail(email)` and returns `HTTP 409 Conflict` if the email is already registered.

### Q130: What was the issue with Vite dev server refusing external host connections?
**Answer:** When testing via tunnels or network IPs, Vite blocked incoming requests with "Blocked host". We configured `server.allowedHosts: true` in `vite.config.js` to allow development access across local network devices.

---

## Category 6: Architectural & Design Decision Questions (Q131 – Q150)

### Q131: Why did you build TripWise AI as a full-stack app instead of a frontend-only app calling Gemini directly?
**Answer:** Calling Gemini directly from the frontend exposes the private API key to anyone inspecting browser network traffic. A full-stack architecture keeps API keys secure on the server, allows multi-table relational persistence, and enables server-side caching and validation.

### Q132: Why did you choose React over Vanilla JavaScript?
**Answer:** A trip planning interface has high state complexity: autocomplete dropdowns, style chips, collapsible itinerary days, interactive maps, weather tabs, and budget charts. Managing this with vanilla DOM manipulation would lead to spaghetti code. React's declarative component model and Virtual DOM ensure maintainable, high-performance UI rendering.

### Q133: Why did you choose SQLite over MongoDB?
**Answer:** Travel itineraries have inherently relational structures: a User owns Trips, a Trip owns Days, a Day owns Activities, and a Trip owns Budget Breakdown. SQLite enforces strict relational schema integrity, foreign keys, and ACID transactions. Additionally, native `node:sqlite` requires zero external daemon setup.

### Q134: Why did you choose SQLite over PostgreSQL?
**Answer:** PostgreSQL requires installing a separate database server, setting up user roles, and managing connection pools. SQLite is embedded directly into the Node process and stored in a single file (`tripwise.db`). Anyone who clones the repo can run it immediately without external database configuration.

### Q135: Why did you use native `node:sqlite` instead of `better-sqlite3`?
**Answer:** `better-sqlite3` is a third-party npm package that compiles C++ code during installation (`node-gyp`). It frequently fails to build on different operating systems or Node versions. Native `node:sqlite` is built directly into Node.js 22+, eliminating all native compilation failures.

### Q136: Why did you choose Open-Meteo over OpenWeatherMap?
**Answer:** OpenWeatherMap requires developer account creation, credit card verification, and API keys with tight call limits. Open-Meteo is completely free, open-source, requires zero API keys, and provides high-accuracy 7-day forecasts.

### Q137: Why did you choose Tailwind CSS v4 over Bootstrap?
**Answer:** Bootstrap imposes rigid, generic component styles that are difficult to customize for modern travel interfaces. Tailwind provides low-level utility classes that allow pixel-perfect custom designs with zero unused CSS in production.

### Q138: Why do you have both a 178-city local dataset and an external geocoding API?
**Answer:** A pure API search introduces network latency (200-500ms) on every keystroke. A pure local dataset cannot cover every small town on Earth. Our hybrid approach delivers instant `<1ms` search for 178 top destinations while providing universal worldwide search via Nominatim as a fallback.

### Q139: Why did you implement a curated fallback engine instead of just showing an error when Gemini fails?
**Answer:** In software engineering, resilience is a critical quality attribute. If an examiner evaluates the project without an internet connection or without a Gemini API key, the app should still demonstrate its full functionality (itinerary rendering, maps, charts, persistence) rather than failing with a blank screen.

### Q140: Why do you split the trip details view into a two-column layout?
**Answer:** Vacation planning requires comparing sequential schedules with spatial and financial constraints. The left column focuses on the chronological narrative (Day 1, Day 2), while the right column provides spatial and analytical context (Map, Weather, Budget).

### Q141: Why do you use Lucide icons instead of FontAwesome?
**Answer:** FontAwesome requires large web fonts or bulky icon bundles. Lucide React provides individual tree-shakeable SVG components, ensuring that only the specific icons used in the app are bundled into production.

### Q142: Why do you store dates as ISO strings rather than Unix timestamps?
**Answer:** ISO strings (`YYYY-MM-DD`) are human-readable directly in database queries and JSON payloads, and map cleanly to HTML `<input type="date">` elements without requiring time-zone conversion libraries.

### Q143: Why did you choose `scrypt` over `bcrypt` or plain SHA-256?
**Answer:** Plain SHA-256 is vulnerable to GPU-based rainbow table attacks. `bcrypt` has a 72-byte password length limitation and requires third-party C++ bindings. `scrypt` is built directly into Node's `node:crypto` standard library and is memory-hard, making it highly resistant to hardware brute-force attacks.

### Q144: Why did you implement custom JWT generation instead of using `jsonwebtoken`?
**Answer:** Using native `node:crypto` to build HMAC-SHA256 tokens demonstrates a deep, first-principles understanding of cryptographic standards (Base64URL encoding, cryptographic hashing, signature verification) and reduces third-party dependency vulnerabilities.

### Q145: Why did you normalize the database into 7 tables instead of storing one large JSON blob in `trips.itinerary`?
**Answer:** Normalization enables granular querying, updating, and analytics. For example, we can count total activities across all trips, update an individual activity's cost, or delete a single day without reading, parsing, and re-writing an entire monolithic JSON document.

### Q146: Why do you use React Router DOM v7?
**Answer:** Version 7 is the latest, most stable release of React Router, offering enhanced type-safety, efficient nested routing, and seamless declarative navigation hooks.

### Q147: What is the benefit of keeping the backend stateless?
**Answer:** Stateless backends do not maintain user session state in memory. Any instance of the server can handle any user request, making horizontal scaling behind a load balancer trivial.

### Q148: How does the application maintain responsive design across mobile and desktop?
**Answer:** Tailwind’s responsive breakpoint modifiers (`md:`, `lg:`) are used throughout. For example, the trip details page renders a single stacked column on mobile (`flex flex-col`) and automatically transforms into a dual-column split on desktop (`lg:grid lg:grid-cols-12`).

### Q149: If you had 6 more months to work on this project, what would you add?
**Answer:** 
1. Flight and hotel booking API integrations (Amadeus or Skyscanner).
2. Multi-user collaboration for group trip planning via WebSockets.
3. Offline PWA (Progressive Web App) support with service workers.
4. Export itinerary to PDF and Google Calendar synchronization.

### Q150: What was the most important engineering lesson you learned while building TripWise AI?
**Answer:** The importance of designing for failure. Real-world systems depend on external services (AI models, geocoders, weather APIs) that can fail, timeout, or rate-limit at any time. Building defensive architectures—with debouncing, timeouts, input sanitization, multi-model cascades, and deterministic fallback engines—is what separates fragile demos from robust production-grade software.
