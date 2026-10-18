# TripWise AI — 8-Day Mastery Study Plan

This study plan guides you step-by-step through the TripWise AI codebase, preparing you for college project vivas, technical presentations, and developer interviews. Spend 60 to 90 minutes each day following the structured tasks and self-tests.

---

## Day 1: Project Vision, Architecture & The 3 Pitches

### Focus:
Understand what problem the project solves, how user journeys flow, and memorize your elevator pitches.

### Tasks:
1. Read `01_PROJECT_OVERVIEW.md`.
2. Inspect the live application in your browser (`http://localhost:5173`):
   - Explore the Landing page (`/`).
   - Open `/generate-trip` and observe the form.
   - Click "Generate Trip" and review the resulting `/trip-details` page.
3. Practice reciting the **30-Second Elevator Pitch** aloud 3 times until fluent.
4. Review the **1-Minute** and **3-Minute** comprehensive pitches.

### Self-Test:
- [ ] Can I explain why manual trip planning is frustrating without looking at notes?
- [ ] Can I name the 4 key layers of the system (React, Express, SQLite, Gemini)?
- [ ] Can I deliver the 30-second elevator pitch without hesitation?

---

## Day 2: Tech Stack Deep Dive & Dependency Auditing

### Focus:
Master the exact technologies and version numbers, and justify why each tool was chosen over industry alternatives.

### Tasks:
1. Read `02_TECH_STACK.md`.
2. Open `package.json` in the project root:
   - Identify `react` (`^19.2.6`), `vite` (`^8.0.12`), `tailwindcss` (`^4.3.0`), `leaflet` (`^1.9.4`), `recharts` (`^3.8.1`).
3. Open `server/package.json`:
   - Identify `@google/generative-ai` (`^0.24.1`), `express` (`^4.21.2`), `cors` (`^2.8.5`).
   - Note that `node:sqlite` and `node:crypto` are **built directly into Node.js 22+** and require zero npm packages!
4. Learn the answers to: *"Why Vite over Create React App?"* and *"Why native SQLite over MongoDB?"*

### Self-Test:
- [ ] What version of React is used in this project? (React 19)
- [ ] Why does SQLite have no npm package in `server/package.json`? (Built into Node.js 22)
- [ ] What port does each service run on? (Frontend: 5173, Backend: 5001)

---

## Day 3: Frontend Architecture, Component Hierarchy & React Hooks

### Focus:
Understand how React components communicate, the difference between props and state, and how React hooks power the UI.

### Tasks:
1. Read `04_FRONTEND_GUIDE.md`.
2. Open `src/App.jsx` and review the React Router DOM route declarations.
3. Inspect `src/components/Tripgenerator/Form.jsx`:
   - Identify every `useState` call (lines 11–30).
   - Identify the lazy initializer reading `location.search`.
4. Inspect `src/components/Tripgenerator/CityDropdown.jsx`:
   - Identify `useMemo` for local search.
   - Identify `useEffect` for the 320ms debounce and outside-click listener.
   - Identify `useRef` for input auto-focus.

### Self-Test:
- [ ] Can I explain the difference between State and Props with a code example?
- [ ] Why is `useMemo` used in `CityDropdown.jsx`?
- [ ] How does `useRef` auto-focus the search input without causing a re-render?

---

## Day 4: Trip Form, Empty-State Principles & Dual-Tier Geocoding

### Focus:
Understand form validation, zero-default UX principles, and how the hybrid local/remote geocoding engine operates.

### Tasks:
1. Read `05_FORM_AND_CITY_SEARCH.md`.
2. Open `src/data/destinations.js`:
   - Verify that there are exactly **178 cities across 56 countries**.
   - Review the `filterDestinations()` helper function.
3. Open `src/components/Tripgenerator/CityDropdown.jsx`:
   - Trace the 320ms `setTimeout` and `clearTimeout` cleanup.
   - Trace how the ES6 `Map` deduplicates cities using `${city}_${country}`.
4. Review the validation constraints in `Form.jsx` (positive budget, duration between 1 and 30 days, at least one style chip).

### Self-Test:
- [ ] Why was having hardcoded defaults (like Seoul) a bad UX design?
- [ ] What happens when a user types a city with 1 character vs 2+ characters?
- [ ] How does `clearTimeout` prevent unnecessary HTTP requests during rapid typing?

---

## Day 5: Backend Architecture, Express Middleware & REST APIs

### Focus:
Understand the Express request-response cycle, middleware mechanics, HTTP status codes, and endpoint routing.

### Tasks:
1. Read `06_BACKEND_GUIDE.md`.
2. Open `server/src/index.js`:
   - Trace the middleware pipeline: `cors()`, `express.json()`, request logger, routers, static handler, global error handler.
3. Open `server/src/routes/trips.js`:
   - Trace `POST /generate`: input validation, `Promise.all` calling Gemini and Unsplash, saving to SQLite, returning `HTTP 201`.
4. Study the HTTP status codes: `200`, `201`, `400`, `401`, `404`, `409`, `500`.

### Self-Test:
- [ ] Why is `cors()` required?
- [ ] What is the purpose of `express.json()`?
- [ ] What HTTP status code is returned when a new trip is generated? (`201 Created`)

---

## Day 6: Google Gemini AI, Prompt Engineering & Fallback Engine

### Focus:
Understand how the LLM is prompted, how JSON schemas are strictly enforced, how hallucinations are caught, and how the fallback engine guarantees 100% uptime.

### Tasks:
1. Read `07_GEMINI_INTEGRATION.md`.
2. Open `server/src/services/geminiService.js`:
   - Review the system prompt and JSON schema constraints.
   - Review the candidate models loop: `["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"]`.
   - Review the regex sanitization stripping markdown backticks (`replace(/```json/gi, "")`).
   - Review the `seenTitles` Set duplicate activity detection.
   - Review `CURATED_DESTINATION_ITINERARIES` for Seoul, Tokyo, Paris, and Athens.
3. Test running the app with the Gemini API key commented out in `server/.env` to see the fallback engine in action.

### Self-Test:
- [ ] Why call Gemini from the backend instead of the frontend? (API key security)
- [ ] How does TripWise AI detect if the AI recommended the same landmark twice?
- [ ] What happens if the user has no Gemini API key or runs out of quota?

---

## Day 7: Database Architecture, SQLite Schema & Security

### Focus:
Master the 7 relational tables, foreign key constraints, atomic transactions, WAL mode, and password cryptography.

### Tasks:
1. Read `08_DATABASE_GUIDE.md` and `11_CODE_EXPLANATION.md`.
2. Open `server/src/db/schema.js`:
   - Trace the 7 tables: `users`, `trips`, `itinerary_days`, `activities`, `budget_breakdown`, `trip_highlights`, `saved_places`.
   - Identify the B-Tree indexes and `ON DELETE CASCADE`.
3. Open `server/src/db/repositories.js`:
   - Trace `tripsRepo.saveTrip()`: `BEGIN TRANSACTION`, parameter bindings, `COMMIT`, and `ROLLBACK`.
4. Open `server/src/routes/auth.js`:
   - Review `crypto.scryptSync()` and `crypto.timingSafeEqual()`.
   - Review the HMAC-SHA256 JWT generation.

### Self-Test:
- [ ] What are the ACID properties and how does `saveTrip()` enforce them?
- [ ] What does `PRAGMA journal_mode = WAL;` do?
- [ ] Why use `crypto.timingSafeEqual()` instead of `===` for passwords?

---

## Day 8: Viva Rehearsal, Bug Explanations & Final Polish

### Focus:
Practice answering real examiner questions and confidently explaining the bugs you solved.

### Tasks:
1. Read `14_BUGS_AND_FIXES.md` and pick your favorite 3 bugs to explain in an interview.
2. Read `15_TESTING_GUIDE.md` and execute the 5 core curl commands in your terminal.
3. Randomly select and answer 15 questions from `13_VIVA_QUESTIONS.md`.
4. Keep `17_FINAL_CHEAT_SHEET.md` handy for morning-of-presentation review.

### Self-Test:
- [ ] Can I explain 2 major bugs I encountered and how I fixed them?
- [ ] Can I demonstrate the app live, create a trip, and show the database entry?
- [ ] Am I confident and ready to ace the viva? **Yes!**
