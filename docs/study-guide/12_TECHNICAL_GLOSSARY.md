# TripWise AI — Technical Glossary & Conceptual Guide

This glossary defines over 60 essential web engineering, React, backend, database, AI, and cybersecurity terms used in TripWise AI. Each term includes a simple real-world analogy, an exact technical definition, and where it is used in the project.

---

## Part 1: Frontend & React Architecture

### 1. SPA (Single Page Application)
- **Simple Analogy:** A dynamic TV screen where the channel picture changes smoothly without turning the physical TV off and on again.
- **Technical Definition:** A web app that loads a single HTML file (`index.html`) on the initial request and dynamically updates the DOM via JavaScript as the user navigates, eliminating full page reloads.
- **In TripWise AI:** Navigation between `/generate-trip`, `/trip-details`, and `/dashboard` happens instantly via React Router without page refreshes.

### 2. Virtual DOM (VDOM)
- **Simple Analogy:** A rough architect's sketch. The architect experiments and modifies the sketch quickly, only calling the construction crew when final changes are ready.
- **Technical Definition:** An in-memory JavaScript tree representing the real DOM nodes. React computes differences between VDOM snapshots and applies batched updates to the real browser DOM.
- **In TripWise AI:** Allows smooth keystroke typing in `CityDropdown` while filtering 178 cities without UI stutter.

### 3. Reconciliation & Diffing
- **Simple Analogy:** Spot-the-difference game between two identical photos.
- **Technical Definition:** React’s heuristic **O(N)** diffing algorithm that compares an older Virtual DOM snapshot with a newer one to determine the minimal set of DOM operations required.
- **In TripWise AI:** When a user checks a travel style chip, only that specific chip re-renders; the rest of the form is untouched.

### 4. JSX (JavaScript XML)
- **Simple Analogy:** Writing HTML inside JavaScript with superpower brackets `{}`.
- **Technical Definition:** A syntactic extension for JavaScript that allows developers to write HTML-like markup directly inside JS files, transpiled into `React.createElement()` calls.
- **In TripWise AI:** All components (`Form.jsx`, `Itinerary.jsx`) use JSX.

### 5. Props (Properties)
- **Simple Analogy:** Instructions or ingredients passed from a chef (parent) to an assistant (child).
- **Technical Definition:** Read-only inputs passed from a parent component to a child component to configure its behavior and appearance.
- **In TripWise AI:** `<CityDropdown id="dest" selectedCity={destination} onChange={setDestination} />`.

### 6. State
- **Simple Analogy:** A person's memory of their current mood or current task, which changes over time.
- **Technical Definition:** An internal, mutable JavaScript object managed within a component that stores data that can change and trigger a UI re-render when updated.
- **In TripWise AI:** `const [budget, setBudget] = useState("")` in `Form.jsx`.

### 7. Prop Drilling
- **Simple Analogy:** Passing a bucket of water down a human chain of 10 people just to deliver it to the last person.
- **Technical Definition:** The practice of passing props through several intermediate components that do not need the data themselves, solely to reach a deeply nested child.
- **In TripWise AI:** Handled cleanly in `TripDetails.jsx` by grouping related child components into `<LSection />` and `<RSection />`.

### 8. React Hooks
- **Simple Analogy:** Modular plug-in power tools that give functional components superpowers.
- **Technical Definition:** Special functions starting with `use` (e.g., `useState`, `useEffect`) that let functional components hook into React state and lifecycle features.
- **In TripWise AI:** Used throughout: `useState`, `useEffect`, `useRef`, `useMemo`, `useNavigate`, `useLocation`.

### 9. `useState`
- **Technical Definition:** A hook that declares a state variable and a setter function, returning a tuple `[state, setState]`.
- **In TripWise AI:** Manages form inputs (`city`, `budget`, `duration`, `loading`, `errorBanner`).

### 10. `useEffect`
- **Technical Definition:** A hook that executes side-effects (data fetching, DOM listeners, timers) after rendering. Accepts a callback and a dependency array.
- **In TripWise AI:** Handles outside click listeners to close `CityDropdown` and the 320ms debounced search timer.

### 11. `useRef`
- **Technical Definition:** Returns a mutable ref object with a `.current` property that persists across renders without causing a re-render when modified. Also used for direct DOM access.
- **In TripWise AI:** `searchInputRef.current.focus()` auto-focuses the input when opening the city dropdown.

### 12. `useMemo`
- **Technical Definition:** Caches the result of an expensive calculation between renders, only recalculating when designated dependencies change.
- **In TripWise AI:** Caches the instant local filtering of 178 cities in `CityDropdown.jsx`.

### 13. React StrictMode
- **Technical Definition:** A development-only wrapper (`<React.StrictMode>`) that intentionally double-invokes component renders and effects to surface side-effect bugs and deprecated API usage.
- **In TripWise AI:** Configured in `src/main.jsx`.

### 14. Vite & Hot Module Replacement (HMR)
- **Simple Analogy:** Swapping a burnt-out lightbulb in a house while the party inside keeps going without interruption.
- **Technical Definition:** Vite replaces, adds, or removes individual modules at runtime without reloading the entire browser page or losing application state.
- **In TripWise AI:** Changes saved to `Form.jsx` appear on screen in milliseconds without clearing already-typed form inputs.

### 15. Tailwind CSS Utility-First Styling
- **Technical Definition:** A CSS framework offering low-level utility classes (`flex`, `p-4`, `bg-blue-600`, `rounded-xl`) directly inside JSX instead of writing custom CSS rules.
- **In TripWise AI:** Used across all components with zero external CSS files needed.

---

## Part 2: Backend & Networking

### 16. REST (Representational State Transfer)
- **Technical Definition:** An architectural style for network communication that uses stateless HTTP requests, standard URIs (`/api/trips`), and standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- **In TripWise AI:** All backend routes in `server/src/routes/` follow REST conventions.

### 17. HTTP Status Codes
- **Technical Definition:** Standardized 3-digit integer responses issued by a server to indicate the outcome of a client request:
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource successfully created (used in `POST /api/trips/generate`).
  - `400 Bad Request`: Validation failure (missing parameters, negative budget).
  - `401 Unauthorized`: Invalid credentials or missing JWT.
  - `404 Not Found`: Entity does not exist.
  - `409 Conflict`: Attempting to register an email that already exists.
  - `500 Internal Server Error`: Unhandled server exception.

### 18. Middleware
- **Simple Analogy:** Security guards and baggage scanners at an airport checkpoint that inspect everyone before they board the plane.
- **Technical Definition:** Functions in Express that sit between the raw incoming HTTP request and the final route handler, having access to `req`, `res`, and `next()`.
- **In TripWise AI:** `cors()`, `express.json()`, and the global error handler in `server/src/index.js`.

### 19. CORS (Cross-Origin Resource Sharing)
- **Simple Analogy:** An apartment gatekeeper checking if a visitor from a different street has permission to enter.
- **Technical Definition:** A browser security mechanism that uses HTTP headers (`Access-Control-Allow-Origin`) to tell browsers whether requests originating from a different origin (e.g. port 5173 to port 5001) are permitted.
- **In TripWise AI:** Enabled via `app.use(cors())` so Vite frontend can talk to Express backend.

### 20. Same-Origin Policy (SOP)
- **Technical Definition:** A fundamental web security policy implemented in browsers that restricts scripts on one origin (scheme + domain + port) from interacting with resources on a different origin.

### 21. Debouncing
- **Simple Analogy:** An elevator door sensor that waits 5 seconds after the last person steps inside before closing the door.
- **Technical Definition:** A programming practice that postpones function execution until a predetermined duration has elapsed since the last event invocation.
- **In TripWise AI:** 320ms debounce in `CityDropdown.jsx` to prevent firing HTTP requests to Nominatim on every keystroke.

### 22. AbortController
- **Technical Definition:** A built-in JavaScript object that allows you to abort one or more Web fetch requests on demand or via a timer timeout.
- **In TripWise AI:** Sets a 2.8s - 4.0s timeout on external geocoding requests to prevent frozen server threads.

---

## Part 3: Database & Relational Architecture

### 23. Embedded / Serverless Database
- **Simple Analogy:** Carrying your notebook in your backpack versus having to phone a central library in another town every time you need to read a page.
- **Technical Definition:** A database engine that runs in-process inside the host application and stores data directly in a local file, without running a separate database server process.
- **In TripWise AI:** Native `node:sqlite` stores everything in `server/src/data/tripwise.db`.

### 24. Database Normalization
- **Technical Definition:** Organizing a database into structured tables to reduce data redundancy and improve data integrity (1NF, 2NF, 3NF).
- **In TripWise AI:** 7 separate tables (`users`, `trips`, `itinerary_days`, `activities`, `budget_breakdown`, `trip_highlights`, `saved_places`) rather than dumping one huge unstructured blob.

### 25. Primary Key (PK) & Foreign Key (FK)
- **Technical Definition:** 
  - **PK:** A unique identifier for every row in a table (`id`).
  - **FK:** A column in one table that points to the Primary Key of another table, creating a relational link (`trip_id` in `activities` points to `trips.id`).

### 26. `ON DELETE CASCADE`
- **Technical Definition:** A foreign key constraint rule that automatically deletes all child rows whenever the referenced parent row is deleted.
- **In TripWise AI:** Deleting a trip from `trips` automatically deletes its rows in `activities`, `itinerary_days`, `budget_breakdown`, and `trip_highlights`.

### 27. B-Tree Index
- **Simple Analogy:** The index at the back of a textbook that lets you jump straight to page 142 instead of reading every page from page 1.
- **Technical Definition:** A self-balancing search tree data structure that allows database queries to find matching records in **O(log N)** time rather than scanning every row (**O(N)**).
- **In TripWise AI:** Indexes on `idx_trips_user_id`, `idx_activities_day_id`, etc.

### 28. ACID Properties
- **Technical Definition:** The four core guarantees of reliable database transactions:
  - **Atomicity:** All operations in the transaction succeed, or all are rolled back.
  - **Consistency:** Data must conform to all declared constraints and rules.
  - **Isolation:** Concurrent transactions do not interfere with each other.
  - **Durability:** Committed data is permanently written to non-volatile storage.

### 29. Database Transaction (`BEGIN`, `COMMIT`, `ROLLBACK`)
- **In TripWise AI:** `saveTrip()` executes `BEGIN TRANSACTION;`, writes to 5 tables, and calls `COMMIT;`. If any step fails, `ROLLBACK;` undoes everything cleanly.

### 30. WAL (Write-Ahead Logging)
- **Technical Definition:** A database journaling technique where modifications are recorded sequentially in an auxiliary WAL file before writing to the main database file. Allows readers to read while writers write.
- **In TripWise AI:** Enabled via `PRAGMA journal_mode = WAL;`.

### 31. SQL Injection Prevention & Prepared Statements
- **Technical Definition:** An attack where malicious SQL commands are entered into form fields. Prevented using prepared statements (`db.prepare("INSERT ... VALUES (?, ?)")`) where values are bound strictly as data literals.

---

## Part 4: Artificial Intelligence & Gemini

### 32. LLM (Large Language Model)
- **Technical Definition:** A deep learning transformer model trained on massive text corpora to predict tokens and generate human-like natural language.
- **In TripWise AI:** Google's `gemini-1.5-flash` model.

### 33. Prompt Engineering
- **Technical Definition:** The discipline of designing, structuring, and optimizing textual inputs (prompts) to guide LLMs toward accurate, consistent, and structured responses.
- **In TripWise AI:** Enforces strict JSON schema output, non-repetition of activities, and budget consistency.

### 34. Hallucination
- **Technical Definition:** A phenomenon where an LLM generates plausible-sounding but factually incorrect, illogical, or repetitive statements.
- **In TripWise AI:** Detected via a `Set()` title duplicate checker in `geminiService.js`.

### 35. Multi-Model Cascade
- **Technical Definition:** Sequentially falling back across multiple model endpoints (`gemini-1.5-flash` -> `gemini-2.0-flash` -> `gemini-1.5-pro`) if the primary model fails or experiences rate limits.

### 36. Zero-Failure Fallback Engine
- **Technical Definition:** A resilient software pattern where if external AI services fail completely, deterministic pre-computed or procedural logic generates an authentic response so the user experience never crashes.
- **In TripWise AI:** `generateFallbackItinerary()` delivers authentic schedules for hubs like Seoul, Paris, and Athens.

---

## Part 5: Security & Cryptography

### 37. Cryptographic Salt
- **Technical Definition:** Random binary data added as an additional input to a one-way password hashing function to defend against dictionary attacks and pre-computed rainbow table attacks.
- **In TripWise AI:** Generated via `crypto.randomBytes(16)`.

### 38. Scrypt Key Derivation
- **Technical Definition:** A password-based key derivation function designed to be memory-hard, making hardware-accelerated attacks (ASICs, GPUs) prohibitively expensive.
- **In TripWise AI:** Computed via `crypto.scryptSync(password, salt, 64)`.

### 39. Timing Attack & `timingSafeEqual`
- **Technical Definition:** A side-channel attack where an attacker infers secrets by analyzing the execution duration of string comparisons.
- **In TripWise AI:** Fixed using `crypto.timingSafeEqual()` which compares buffers in constant time.

### 40. JWT (JSON Web Token) & HMAC-SHA256
- **Technical Definition:** A compact, URL-safe standard (RFC 7519) for transmitting claims between parties. Signed with a cryptographic hash (`HMAC-SHA256`) to ensure tamper-proof authentication without database session lookups.
- **In TripWise AI:** Issued in `auth.js` upon signup and login.
