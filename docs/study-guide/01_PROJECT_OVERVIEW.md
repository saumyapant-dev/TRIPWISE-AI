# TripWise AI — Project Overview & Pitch Guide

Welcome to the comprehensive study guide for **TripWise AI**. This document is designed to take you from a basic conceptual understanding to a confident, articulate presenter in any college viva, project evaluation, or technical interview.

---

## 1. What is TripWise AI?

**TripWise AI** is a full-stack, AI-powered intelligent travel planning and itinerary generation web application. It automates the complex, time-consuming process of vacation planning by transforming high-level user preferences (origin, destination, budget, duration, dates, and travel styles) into a day-by-day, hour-by-hour realistic travel itinerary.

Beyond static travel itineraries, TripWise AI enriches the plan with:
- **Interactive Geospatial Mapping:** Leaflet-powered maps displaying exact geographic coordinates and key landmarks.
- **Real-Time Weather Forecasting:** 7-day temperature and precipitation projections via the Open-Meteo API without requiring external API keys.
- **Budget Categorization & Visual Analytics:** Breakdown of expenses across flights, accommodation, food, transportation, activities, and shopping with interactive Recharts data visualizations.
- **Curated & Nearby Points of Interest:** Dynamic attractions, local dining spots, and cultural landmarks.
- **Interactive AI Travel Concierge:** A destination-aware chatbot that answers contextual traveler questions.
- **Persistent Relational Storage:** Complete trip data saved into a normalized SQLite database engine (`node:sqlite`), allowing users to revisit, inspect, and manage saved trips on a personal dashboard.

---

## 2. The Real-World Problem It Solves

### The Problem: Decision Fatigue & Disjointed Planning
Planning a vacation is traditionally fragmented across dozens of browser tabs:
1. Searching blog posts and travel sites for things to do.
2. Checking separate weather websites to decide what to pack.
3. Manually calculating budgets on spreadsheets.
4. Pinning locations on mapping services to see if daily routes make geographic sense.
5. Worrying if attractions are open or require booking.

This disjointed process takes an average of **10 to 20 hours** of research per trip.

### The Solution: TripWise AI
TripWise AI consolidates this entire pipeline into a single workflow:
- The user provides their parameters in a single form.
- The system connects with Google Gemini AI (`@google/generative-ai`) to produce an authentic schedule.
- The backend coordinates geocoding, weather forecasts, destination imagery, and budget calculations in parallel.
- Everything is delivered on an interactive, responsive dashboard and saved in a relational database for instant recall.

---

## 3. High-Level System Architecture

TripWise AI follows a clean **Client-Server-Database Architecture**:

```
+-------------------------------------------------------------------------+
|                           CLIENT (Frontend)                             |
|  React 19 (SPA) + Vite 8 + Tailwind CSS v4 + React Router DOM v7       |
|  - Responsive Form with Dual-Tier City Search (178 cities + Nominatim)  |
|  - Interactive Leaflet Maps + OpenStreetMap Tiles                       |
|  - Recharts Visualizations + Lucide React Icons                         |
+------------------------------------+------------------------------------+
                                     |  HTTP REST Requests (fetch JSON)
                                     v
+-------------------------------------------------------------------------+
|                           SERVER (Backend)                              |
|  Node.js (v22+) + Express 4 Server (Port 5001)                          |
|  - CORS & JSON Body Parsing Middleware                                  |
|  - Custom Salted Scrypt Auth + HMAC-SHA256 JWT Tokens                   |
|  - Centralized Route Handlers (/api/trips, /api/auth, /api/weather...)  |
|  - Gemini AI Engine (gemini-1.5-flash) with Curated Fallback Logic     |
+-------------------+-----------------+-------------------+---------------+
                    |                 |                   |
                    v                 v                   v
            +---------------+ +---------------+ +------------------+
            | Open-Meteo API| | Nominatim OSM | | Built-in SQLite  |
            | (Weather,     | | (Global       | | DatabaseSync     |
            |  7-day, Free) | |  Geocoding)   | | (7 Tables, WAL)  |
            +---------------+ +---------------+ +------------------+
```

---

## 4. End-to-End User Journeys

### Journey A: Creating a New Trip as a Guest or Authenticated User
1. **Landing Page (`/`)**: The user views the hero section, curated trips, and feature cards. Clicking **"Create Trip"** or **"Start Planning"** navigates to `/generate-trip`.
2. **Form Input (`/generate-trip`)**:
   - The form is strictly blank by default (no hardcoded cities or pre-selected values).
   - The user searches their **Departure City** (e.g., *Chandigarh, India*) and **Destination City** (e.g., *Athens, Greece*).
   - As the user types in the dropdown, the system matches locally across 178 cities in `< 1ms`, or queries OpenStreetMap Nominatim after 320ms debouncing.
   - The user enters budget (e.g., `1800`), duration (e.g., `5` days), dates, and selects travel styles (e.g., *Culture*, *City Exploration*).
3. **Trip Generation & Persistence**:
   - The frontend sends a `POST /api/trips/generate` request.
   - Express queries the Gemini AI service while fetching destination imagery and geocodes concurrently via `Promise.all`.
   - The backend runs an atomic SQLite transaction inserting the trip, days, activities, budget breakdown, and highlights.
4. **Trip Details Dashboard (`/trip-details?id=...`)**:
   - The user is redirected to the generated trip view.
   - Left column displays the day-by-day itinerary with timings, activity tags, costs, and AI tips.
   - Right column presents weather widgets, the interactive Leaflet map, budget pie/bar charts, and the AI concierge chat button.

### Journey B: User Authentication & Saved Trips Dashboard
1. **Sign Up / Login (`/signup`, `/login`)**:
   - Passwords are encrypted server-side using salted `crypto.scryptSync(password, salt, 64)`.
   - The backend issues a signed HMAC-SHA256 JWT token.
   - User identity and token are stored in browser `localStorage`.
2. **Personal Dashboard (`/dashboard`)**:
   - The frontend queries `GET /api/trips?userId=<id>`.
   - Displays all historical trips created by this user with cover photos, duration, and budget.
   - Clicking any card opens that trip's full details.

---

## 5. Viva Pitches (Memorize These!)

### 30-Second Elevator Pitch
> *"TripWise AI is an intelligent travel planning web application built with React 19, Vite, Express, and Node.js SQLite. It solves vacation planning fatigue by taking a user's destination, budget, duration, and style preferences, and generating a realistic, day-by-day itinerary powered by Google Gemini AI. The application coordinates live weather forecasts via Open-Meteo, interactive Leaflet maps, visual budget charts, and persistent storage across 7 relational database tables, complete with an offline fallback engine that guarantees reliable operation even without internet or API keys."*

### 1-Minute Project Overview
> *"Good morning/afternoon. My project is TripWise AI, a full-stack automated travel planning application. Traditional vacation planning is tedious because users have to cross-reference travel guides, weather sites, map services, and budget spreadsheets across dozens of tabs. 
> 
> TripWise AI unifies this workflow. On the frontend, built with React 19 and Tailwind CSS, we created an intuitive form featuring a dual-tier city search: an instant 178-city catalog combined with a debounced OpenStreetMap Nominatim API for worldwide coverage. 
> 
> When the user submits the form, our Node.js and Express backend contacts Google's Gemini generative AI model with strict prompt engineering to produce structured, non-repeating daily itineraries. The backend simultaneously fetches live weather from Open-Meteo and authentic imagery. Everything is stored in an embedded SQLite database using Node's native DatabaseSync with full ACID transactions. Even if the Gemini API key is absent or exhausted, our custom curated fallback engine ensures the user still receives an authentic, realistic travel itinerary."*

### 3-Minute Comprehensive Technical Viva Speech
> *"Respected examiners, I would like to present TripWise AI, an AI-powered travel itinerary and trip management platform.
>
> **Problem Statement & Motivation:**
> Travelers spend an average of 10 to 20 hours planning vacations because data is fragmented. Most existing solutions either offer generic static lists or hallucinate impossible schedules. My objective was to build a cohesive full-stack web application that combines generative AI reasoning with real-world geospatial and meteorological data.
>
> **Architecture & Tech Stack:**
> The frontend is developed with React 19 and Vite 8, utilizing React Router DOM v7 for declarative routing, Tailwind CSS v4 for modern responsive styling, React-Leaflet for interactive OpenStreetMap rendering, and Recharts for budget data visualization.
>
> The backend is built with Node.js v22 and Express 4. Instead of adding heavy third-party ORMs or external database dependencies, I utilized Node's native `node:sqlite` module via `DatabaseSync`. The schema is fully normalized into 7 relational tables: `users`, `trips`, `itinerary_days`, `activities`, `budget_breakdown`, `trip_highlights`, and `saved_places`, with foreign keys, cascade deletes, and WAL (Write-Ahead Logging) mode enabled for concurrency.
>
> **Key Innovations & Engineering Challenges:**
> 1. **Dual-Tier Geocoding & City Search:** We integrated a local dataset of 178 global and Indian destinations that responds in under 1 millisecond. If a user types a lesser-known city, an asynchronous 320-millisecond debounced request queries OpenStreetMap Nominatim to resolve coordinates safely.
> 2. **Resilient AI Pipeline:** We integrated `@google/generative-ai` with a multi-model fallback cascade: `gemini-1.5-flash` followed by `gemini-2.0-flash` and `gemini-1.5-pro`. To ensure robust operations during evaluations or offline demos, we engineered a deterministic fallback engine with authentic schedules for major hubs and dynamic procedural scheduling for any custom city.
> 3. **Security & Cryptography:** User authentication is built from the ground up using Node's native `node:crypto`. Passwords use cryptographic salts and `scryptSync` key derivation, compared via `crypto.timingSafeEqual` to eliminate timing attacks. Authentication tokens use a stateless HMAC-SHA256 signed structure.
>
> In conclusion, TripWise AI demonstrates how generative AI can be securely and reliably married with relational databases and external open-source APIs to solve a practical real-world problem."*
