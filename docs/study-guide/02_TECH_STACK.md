# TripWise AI — Technology Stack Deep Dive

This document provides a detailed breakdown of every technology, library, framework, and tool used in the TripWise AI project. Every version listed is verified directly against `package.json` and `server/package.json`.

---

## 1. Complete Technology Inventory

| Layer / Domain | Technology | Exact Version | Primary Role in Project |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React** | `^19.2.6` | Component-based User Interface (SPA) with declarative rendering |
| **Frontend DOM** | **React DOM** | `^19.2.6` | Mounting and updating the React Virtual DOM onto browser DOM |
| **Build Tool & Bundler** | **Vite** | `^8.0.12` | Next-generation ESM dev server with lightning-fast HMR and Rollup bundling |
| **CSS Utility Framework**| **Tailwind CSS** | `^4.3.0` | Utility-first responsive CSS styling with zero runtime CSS-in-JS overhead |
| **Tailwind Vite Plugin** | **@tailwindcss/vite** | `^4.3.0` | Native Vite integration for Tailwind v4 engine |
| **Client-Side Routing**  | **React Router DOM** | `^7.16.0` | Client-side routing, URL navigation, query string parsing (`/`, `/generate-trip`, `/trip-details`, `/dashboard`) |
| **Interactive Maps**     | **Leaflet** | `^1.9.4` | Open-source interactive JavaScript mapping engine |
| **React Map Wrapper**    | **React-Leaflet** | `^5.0.0` | React component bindings for Leaflet map containers, tiles, and markers |
| **Data Visualization**   | **Recharts** | `^3.8.1` | SVG-based responsive charting library for budget breakdown visualizer |
| **Icon Library**         | **Lucide React** | `^1.3.0` | Clean, customizable SVG icons throughout UI (pins, calendar, dollar, weather) |
| **Backend Runtime**      | **Node.js** | `v22.5.0+` | Server runtime executing JavaScript on Google V8 engine with native ESM support |
| **Backend Framework**    | **Express** | `^4.21.2` | Minimalist HTTP web server handling REST routing, middleware, and controllers |
| **Database Engine**      | **node:sqlite** | *Built-in* | Native Node.js embedded relational database (`DatabaseSync`) with WAL mode |
| **Generative AI SDK**    | **@google/generative-ai** | `^0.24.1` | Official Google SDK for Gemini LLM prompting and structured inference |
| **CORS Middleware**      | **cors** | `^2.8.5` | Cross-Origin Resource Sharing middleware enabling frontend-backend communication |
| **Environment Config**   | **dotenv** | `^16.4.7` | Loads environment variables from `.env` file into `process.env` |
| **Cryptography**         | **node:crypto** | *Built-in* | Native password hashing via `scryptSync`, timing defense via `timingSafeEqual`, and HMAC-SHA256 JWTs |

---

## 2. Why Each Technology Was Chosen & Alternatives Evaluated

### A. Frontend: React 19 vs Vanilla JS / Vue / Angular
- **Why React 19?**
  - **Component Reusability:** Complex UI elements like `CityDropdown`, `BudgetCard`, `WeatherCard`, and `InteractiveMap` are self-contained, testable, and reusable.
  - **Virtual DOM Reconciliation:** Frequent updates (such as debounced city typing, toggling style chips, switching itinerary days) re-render with minimal browser DOM repaints.
  - **Ecosystem Maturity:** Robust support for libraries like React-Leaflet and Recharts.
- **Alternatives Considered:**
  - *Vanilla JavaScript:* Requires tedious manual DOM manipulation (`document.createElement`, manual state sync), making complex nested itinerary views unmaintainable.
  - *Angular:* High boilerplate, steep learning curve, and heavyweight framework overhead for a travel planner.
  - *Vue.js:* Excellent reactivity, but React's widespread industry adoption makes it superior for technical viva and portfolio defense.

### B. Bundler: Vite 8 vs Create React App (Webpack)
- **Why Vite 8?**
  - **Native ESM:** Vite serves source code over native ES modules during development, starting up in under 300ms compared to Webpack's 30-second cold starts.
  - **Hot Module Replacement (HMR):** Edits to React components reflect instantly without losing form state.
  - **Lightweight Production Builds:** Uses Rollup under the hood with aggressive tree-shaking.
- **Alternatives Considered:**
  - *Create React App (CRA):* Deprecated by the React team; slow Webpack bundling, outdated dependencies, and sluggish build pipelines.

### C. Styling: Tailwind CSS v4 vs Bootstrap vs Plain CSS
- **Why Tailwind CSS v4?**
  - **Utility-First Speed:** Eliminates context switching between JSX and separate CSS files.
  - **Zero Unused CSS in Production:** Purges unused utility classes, keeping stylesheet payload under 30 KB.
  - **Tailwind v4 Engine:** Powered by a modern Lightning CSS engine built into Vite (`@tailwindcss/vite`), eliminating legacy PostCSS config files.
- **Alternatives Considered:**
  - *Bootstrap:* Generic "cookie-cutter" look, difficult to customize modern travel cards and dark-mode gradients.
  - *Plain CSS / BEM:* Difficult to maintain across 30+ components without class collision.

### D. Backend: Express.js 4 vs Fastify vs NestJS
- **Why Express 4?**
  - **Simplicity & Transparency:** Express is the de facto standard for Node.js REST APIs. Its unopinionated middleware chain (`req`, `res`, `next`) is universally understood and easy to explain in an interview.
  - **Lightweight Footprint:** Does not impose enterprise-level decorators or complex dependency injection frameworks.
- **Alternatives Considered:**
  - *NestJS:* Imposes heavy TypeScript decorator patterns and steep complexity unnecessary for a college project.
  - *Fastify:* Slightly faster request parsing, but smaller ecosystem and harder to demonstrate middleware mechanics simply in a viva.

### E. Database: Native `node:sqlite` vs PostgreSQL / MongoDB / MySQL
- **Why Node's Native `node:sqlite`?**
  - **Zero External Server Dependency:** SQLite is a serverless, self-contained database engine. It stores data in a single file (`server/src/data/tripwise.db`). Anyone who clones the repository can immediately run the project without installing PostgreSQL, Docker, or MySQL servers.
  - **Native Node.js 22+ Integration:** `DatabaseSync` is built directly into Node's standard library (`node:sqlite`). It requires **zero npm packages** to install or compile (no `sqlite3` or `better-sqlite3` native node-gyp build failures on Windows/Mac/Linux).
  - **Full Relational Power:** Supports real relational joins, foreign key constraints (`ON DELETE CASCADE`), indexes, and atomic ACID transactions (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`).
  - **Write-Ahead Logging (WAL):** Enabled via `PRAGMA journal_mode = WAL;`, allowing concurrent readers and writers without database locking errors.
- **Alternatives Considered:**
  - *MongoDB / Mongoose:* NoSQL document stores lack strict relational integrity and require a running MongoDB daemon or Atlas cloud credentials, complicating local examiner evaluation.
  - *PostgreSQL:* Industrial standard, but requires examiners to configure local Postgres services, role permissions, and connection strings.

### F. Generative AI: Google Gemini (`@google/generative-ai`) vs OpenAI GPT-4
- **Why Google Gemini?**
  - **Cost & Free Tier Accessibility:** Gemini offers a generous free tier for developers with high RPM (Requests Per Minute), avoiding paywall lockouts during project grading.
  - **Structured Reasoning Speed:** `gemini-1.5-flash` features sub-second response times and high adherence to JSON output schemas.
  - **Large Context Window:** Capable of ingesting comprehensive city details, hotel preferences, and style constraints without token exhaustion.

---

## 3. Package Scripts Reference

### Frontend Scripts (`package.json`)
- `npm run dev`: Boots Vite development server on port 5173 with instant HMR.
- `npm run build`: Compiles JSX and assets into optimized static bundle inside `/dist`.
- `npm run preview`: Locally previews the production build from `/dist`.
- `npm run lint`: Runs ESLint 10 to check React code quality and hook rules.

### Server Scripts (`server/package.json`)
- `npm run start`: Starts the production Express server on port 5001 via `node src/index.js`.
- `npm run dev` / `npm run server:dev`: Starts Express with Node's native file watcher (`node --watch src/index.js`), auto-restarting whenever backend files change.
- `npm run db:seed`: Executes the database seed script to populate sample trips and destinations.
