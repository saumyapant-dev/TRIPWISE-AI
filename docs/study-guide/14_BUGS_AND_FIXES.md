# TripWise AI — Bugs Encountered & Engineering Solutions

This document details 12 real-world software engineering bugs encountered during the development of TripWise AI. For each bug, you will find the symptom, root cause, code comparison (Before vs. After), and a script on how to explain it during an interview.

---

## Bug 1: Hardcoded Default Form Values

- **Severity:** High (User Experience & Data Quality)
- **Symptom:** When a user opened `/generate-trip`, the inputs automatically populated with *"Seoul"*, *"San Francisco, USA"*, `$2500`, and `5 days`. Users frequently submitted the form without changing these values, cluttering the database with accidental duplicate trips.
- **Root Cause:** The `useState` hooks in `Form.jsx` had static fallback strings hardcoded into their initial declarations.
- **Before (Buggy Code):**
  ```javascript
  const [city, setCity] = useState("San Francisco, USA");
  const [destination, setDestination] = useState("Seoul, South Korea");
  const [budget, setBudget] = useState("2500");
  const [duration, setDuration] = useState("5");
  const [selectedStyles, setSelectedStyles] = useState(["Culture", "City Exploration"]);
  ```
- **After (Fixed Code):**
  ```javascript
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState(() => {
    const params = new URLSearchParams(location.search || window.location.search);
    return params.get("destination") || "";
  });
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  ```
- **Interview Pitch:**
  > *"Initially, the form contained hardcoded defaults for demonstration purposes. During user testing, we noticed users accidentally generated Seoul trips without realizing the form wasn't blank. We refactored all form state to initialize completely empty, using a lazy initializer only if a destination query parameter was explicitly passed from the landing page cards."*

---

## Bug 2: Duplicate Key Warning in City Dropdown

- **Severity:** Medium (React Rendering Warning)
- **Symptom:** React console logged: `Warning: Encountered two children with the same key, 'athens'`.
- **Root Cause:** The dataset contained both Athens, Greece and Athens, Ohio/Georgia (USA), and keys were generated solely from `item.city.toLowerCase()`.
- **Before (Buggy Code):**
  ```jsx
  {displayedCities.map((item) => (
    <div key={item.city.toLowerCase()} onClick={() => handleSelect(item)}>
      {item.city}, {item.country}
    </div>
  ))}
  ```
- **After (Fixed Code):**
  ```jsx
  {displayedCities.map((item) => (
    <div
      key={`${item.city.toLowerCase()}_${item.country.toLowerCase()}_${item.id || ""}`}
      onClick={() => handleSelect(item)}
    >
      {item.city}, {item.country}
    </div>
  ))}
  ```
- **Interview Pitch:**
  > *"We encountered a key collision because multiple cities across different countries share the same name (e.g. Athens, Greece vs Athens, USA). We resolved this by composing compound unique keys from both the city name and country name, disambiguating the React Virtual DOM list reconciliation."*

---

## Bug 3: Missing Hook Dependencies in ESLint (`react-hooks/exhaustive-deps`)

- **Severity:** Medium (Code Quality & Potential Stale State)
- **Symptom:** Running `npm run lint` flagged warnings: `React Hook useEffect has a missing dependency: 'activeCountry'`.
- **Root Cause:** Variables referenced inside `useEffect` were omitted from the dependency array, causing effects to use stale closures when country filters changed.
- **Before (Buggy Code):**
  ```javascript
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchCities(searchQuery, activeCountry);
    }
  }, [searchQuery]); // activeCountry is missing!
  ```
- **After (Fixed Code):**
  ```javascript
  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchCities(searchQuery, activeCountry);
    }
  }, [searchQuery, activeCountry]); // Properly tracks both variables
  ```
- **Interview Pitch:**
  > *"We audited our components with ESLint's `react-hooks/exhaustive-deps` rule. In `CityDropdown.jsx`, we ensured that any state variable read inside `useEffect` or `useMemo` is strictly declared in the dependency array, preventing stale closure bugs when users change filter tabs."*

---

## Bug 4: OpenStreetMap Nominatim 403 Forbidden & Rate-Limiting

- **Severity:** High (External API Failure)
- **Symptom:** City search requests outside the 178-catalog occasionally returned HTTP 403 Forbidden or failed to load.
- **Root Cause:** 
  1. OpenStreetMap Nominatim requires an explicit, identifiable `User-Agent` header. Requests sent with generic Node/fetch headers are automatically blocked.
  2. Typing quickly sent multiple requests within milliseconds, violating Nominatim's 1-request-per-second usage policy.
- **Before (Buggy Code):**
  ```javascript
  // Server route calling Nominatim with no headers
  const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
  ```
- **After (Fixed Code):**
  ```javascript
  // 1. Frontend: 320ms Debounce
  const timer = setTimeout(() => searchCities(query), 320);

  // 2. Backend: Custom User-Agent & AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2800);

  const response = await fetch(nominatimUrl, {
    headers: {
      "User-Agent": "TripWiseAI/1.0 (city-search-service)",
      Accept: "application/json",
    },
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  ```
- **Interview Pitch:**
  > *"Nominatim has strict usage policies. We solved rate-limiting by introducing a 320ms debounce on the frontend and an in-memory cache on the backend. We also added a custom User-Agent header and an AbortController with a 2.8-second timeout to prevent sluggish external responses from blocking our server."*

---

## Bug 5: SQLite Database Locking (`SQLITE_BUSY`)

- **Severity:** High (Backend Concurrency)
- **Symptom:** When a user requested a new trip while another request was reading from `/api/trips`, the server threw: `SqliteError: database is locked`.
- **Root Cause:** SQLite's default rollback journal places an exclusive file lock on the entire database file during writes, blocking concurrent readers.
- **Before (Buggy Code):**
  ```javascript
  export const db = new DatabaseSync(dbPath);
  // Default journal mode: DELETE
  ```
- **After (Fixed Code):**
  ```javascript
  export const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA journal_mode = WAL;");
  ```
- **Interview Pitch:**
  > *"Under concurrent read and write operations, SQLite's default journaling caused `SQLITE_BUSY` locking errors. We resolved this by enabling Write-Ahead Logging via `PRAGMA journal_mode = WAL;`. WAL isolates writes to a dedicated log file, allowing concurrent read operations without blocking."*

---

## Bug 6: Gemini AI Markdown Code Fences Breaking `JSON.parse()`

- **Severity:** High (AI Pipeline Failure)
- **Symptom:** Trip generation crashed with `SyntaxError: Unexpected token '`', "```json..." is not valid JSON`.
- **Root Cause:** LLMs often wrap JSON output in markdown fences (` ```json\n{...}\n``` `) despite prompt instructions to return raw JSON only.
- **Before (Buggy Code):**
  ```javascript
  const text = await result.response.text();
  const parsed = JSON.parse(text); // Crashes if fences are present!
  ```
- **After (Fixed Code):**
  ```javascript
  const text = await result.response.text();
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  const parsed = JSON.parse(cleaned);
  ```
- **Interview Pitch:**
  > *"Generative AI models non-deterministically wrap JSON responses in markdown syntax blocks. To prevent `JSON.parse` syntax exceptions, we implemented defensive regex sanitization that strips markdown fences and trims whitespace before parsing."*

---

## Bug 7: AI Hallucinating Duplicate Activities Across Different Days

- **Severity:** Medium (Itinerary Realism)
- **Symptom:** For longer trips (e.g. 5 days in Paris), Gemini recommended the *Eiffel Tower* on Day 1, Day 3, and Day 5.
- **Root Cause:** LLMs generate text token-by-token and can lose context across large prompt outputs, repeating famous landmarks.
- **Before (Buggy Code):**
  ```javascript
  // Returned parsed JSON directly without inspecting activities
  return parsed;
  ```
- **After (Fixed Code):**
  ```javascript
  const seenTitles = new Set();
  let hasDuplicates = false;

  for (const day of parsed.days) {
    if (!day.activities) continue;
    for (const act of day.activities) {
      if (seenTitles.has(act.title)) {
        hasDuplicates = true;
        break;
      }
      seenTitles.add(act.title);
    }
    if (hasDuplicates) break;
  }

  if (!hasDuplicates) {
    return parsed;
  } else {
    // Graceful fallback to verified non-repeating engine
    return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
  }
  ```
- **Interview Pitch:**
  > *"LLMs frequently suffer from repetition hallucinations. We engineered an automated quality check using an ES6 Set to ensure all activity titles across the entire trip are unique. If duplicates are detected, the response is discarded and our non-repeating curated engine steps in."*

---

## Bug 8: City Dropdown Remaining Open on Outside Click

- **Severity:** Low (UI Annoyance)
- **Symptom:** Clicking anywhere outside the city search menu left the dropdown menu visible over other form elements.
- **Root Cause:** React components do not listen to clicks outside their DOM boundary by default.
- **Before (Buggy Code):**
  ```javascript
  // Only toggled isOpen when clicking the input itself
  <input onClick={() => setIsOpen(!isOpen)} />
  ```
- **After (Fixed Code):**
  ```javascript
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  ```
- **Interview Pitch:**
  > *"To provide a polished user experience, we bound an outside-click listener to `document.addEventListener('mousedown')`. Using a React `useRef` attached to the container, we check if the clicked element is within the dropdown boundaries; if not, we automatically close it."*

---

## Bug 9: Orphaned Database Records on Trip Deletion

- **Severity:** High (Database Integrity)
- **Symptom:** When a trip was deleted from `trips`, rows in `itinerary_days`, `activities`, and `budget_breakdown` remained in the database, causing storage bloat and broken foreign keys.
- **Root Cause:** Foreign keys were not cascading deletions because `PRAGMA foreign_keys = ON;` was missing and tables lacked `ON DELETE CASCADE`.
- **Before (Buggy Code):**
  ```sql
  CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    day_id TEXT,
    trip_id TEXT
  );
  ```
- **After (Fixed Code):**
  ```sql
  CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    day_id TEXT NOT NULL,
    trip_id TEXT NOT NULL,
    FOREIGN KEY (day_id) REFERENCES itinerary_days(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
  );
  ```
- **Interview Pitch:**
  > *"We enforced strict relational integrity by declaring `FOREIGN KEY ... ON DELETE CASCADE` on all child tables and enabling SQLite foreign key enforcement. Deleting a trip now cleanly and automatically purges all related days, activities, and budget records in a single operation."*

---

## Bug 10: Timing Attack Vulnerability in Password Verification

- **Severity:** High (Security)
- **Symptom:** Password hash comparison used standard equality `storedHash === inputHash`.
- **Root Cause:** Standard string comparisons terminate immediately upon encountering the first mismatch, allowing attackers to measure execution time down to nanoseconds to deduce password hashes.
- **Before (Buggy Code):**
  ```javascript
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return key === derivedKey; // Vulnerable to timing attacks!
  ```
- **After (Fixed Code):**
  ```javascript
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey); // Constant-time comparison
  ```
- **Interview Pitch:**
  > *"We identified a cryptographic timing vulnerability where standard string equality leaks information about byte matches. We replaced string comparison with Node's native `crypto.timingSafeEqual()`, ensuring password verification executes in constant time regardless of correctness."*
