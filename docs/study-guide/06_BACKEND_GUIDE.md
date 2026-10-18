# TripWise AI — Backend Architecture & Express Guide

This document covers the backend architecture of TripWise AI. It explains Express.js 4, the middleware pipeline, request-response lifecycles, HTTP status codes, and provides a complete REST API reference table.

---

## 1. Backend Architecture Overview

TripWise AI's backend is a modular Node.js REST API service built with **Express 4.21.2** running on port `5001`.

```
                  Client HTTP Request (e.g. POST /api/trips/generate)
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             MIDDLEWARE PIPELINE (index.js)                        │
│  1. cors()                   -> Handles preflight OPTIONS & sets CORS headers     │
│  2. express.json()           -> Parses raw HTTP body into JavaScript req.body     │
│  3. Custom Request Logger    -> Logs timestamp, HTTP method, and URL path         │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                             ROUTING LAYER (/api/*)                                │
│  ├── /api/auth               -> auth.js (Signup, Login, Token verification)       │
│  ├── /api/trips              -> trips.js (Trip generation, CRUD operations)       │
│  ├── /api/weather            -> weather.js (Open-Meteo weather adapter)           │
│  ├── /api/places             -> places.js (City search, POIs, geocoding)          │
│  ├── /api/places/saved       -> savedPlaces.js (Place bookmarking)                │
│  └── /api/chat               -> chat.js (AI travel concierge chatbot)             │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                       SERVICE & DATA ACCESS LAYER                                 │
│  ├── geminiService.js        -> Multi-model LLM cascade + fallback engine         │
│  ├── weatherService.js       -> Open-Meteo & Nominatim clients                    │
│  ├── unsplashService.js      -> Wikipedia & Unsplash image resolvers              │
│  └── repositories.js         -> SQLite CRUD operations via node:sqlite            │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                                          ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                       RESPONSE OR GLOBAL ERROR HANDLER                            │
│  - Success: res.status(200/201).json({ success: true, data: ... })                │
│  - Failure: next(err) -> res.status(err.status || 500).json({ success: false })  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Express Middleware Pipeline Explained

### What is Middleware?
Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` middleware function in the application’s request-response cycle.

In `server/src/index.js`, middleware executes in the exact order declared:

### 1. `app.use(cors());`
- **What it does:** Enables Cross-Origin Resource Sharing.
- **Why it is necessary:** The frontend runs on `http://localhost:5173` (Vite) while the backend runs on `http://localhost:5001` (Express). Web browsers enforce the **Same-Origin Policy (SOP)** by default, blocking scripts on port 5173 from reading responses from port 5001. `cors()` injects headers like `Access-Control-Allow-Origin: *` to allow safe cross-origin communication.

### 2. `app.use(express.json());`
- **What it does:** Built-in body parser.
- **Why it is necessary:** When the client sends `POST /api/trips/generate` with a JSON payload, the HTTP request delivers the data as a raw data stream. `express.json()` reads the stream, parses the JSON string, and assigns the resulting JavaScript object to `req.body`. Without this, `req.body` would be `undefined`.

### 3. Request Logger
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // Hands control to the next middleware or route handler!
});
```
- Every incoming request outputs a clean log (e.g. `[2026-09-08T05:00:00.000Z] POST /api/trips/generate`). Calling `next()` is critical; omitting `next()` would leave the request hanging indefinitely.

### 4. Global Error Handling Middleware
```javascript
app.use((err, req, res, next) => {
  void next;
  console.error("Unhandled Error:", err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});
```
- Defined with **four parameters**: `(err, req, res, next)`.
- If any asynchronous route handler catches an exception and calls `next(error)`, Express bypasses all remaining route handlers and jumps straight to this error handler, returning a consistent JSON error structure.

---

## 3. HTTP Status Codes Used in TripWise AI

Examiners frequently ask candidates to explain which HTTP status codes their API returns and why:

| Status Code | Name | Where Used in TripWise AI | Reason |
| :--- | :--- | :--- | :--- |
| **200** | **OK** | `GET /api/trips`, `GET /api/weather`, `POST /api/auth/login` | Request succeeded and data is returned |
| **201** | **Created** | `POST /api/trips/generate`, `POST /api/auth/signup` | A new resource was successfully created in the SQLite database |
| **400** | **Bad Request** | Missing destination, negative budget, duration > 30 | Client failed to provide valid required parameters |
| **401** | **Unauthorized** | Wrong password on login, invalid or expired JWT token | Authentication credentials missing or invalid |
| **404** | **Not Found** | `GET /api/trips/:id` for non-existent ID, unknown route | The requested entity or API route does not exist |
| **409** | **Conflict** | `POST /api/auth/signup` with an already registered email | Attempting to create duplicate unique entity |
| **500** | **Internal Server Error** | Database disk failure, unhandled runtime exception | Server-side malfunction |

---

## 4. Complete REST API Reference Table

The following table documents every API endpoint available in the TripWise AI backend:

| Method | Endpoint Path | Query / Body Parameters | Response Structure | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | `{ status: "ok", service: "TripWise AI Backend", uptime, timestamp }` | `200` |
| `POST`| `/api/auth/signup` | Body: `{ name, email, password }` | `{ success: true, token, data: { id, name, email } }` | `201` / `400` / `409` |
| `POST`| `/api/auth/login` | Body: `{ email, password }` | `{ success: true, token, data: { id, name, email } }` | `200` / `400` / `401` |
| `GET` | `/api/auth/verify` | Header: `Authorization: Bearer <token>` | `{ success: true, data: { id, name, email } }` | `200` / `401` |
| `POST`| `/api/trips/generate` | Body: `{ city, destination, budget, duration, travelStyle, ... }` | `{ success: true, data: <full_joined_trip_record> }` | `201` / `400` / `500` |
| `GET` | `/api/trips` | Query: `?userId=<id>` (optional) | `{ success: true, count: N, data: [ ...trips ] }` | `200` |
| `GET` | `/api/trips/:id` | Route Param: `:id` | `{ success: true, data: <trip_with_days_and_activities> }` | `200` / `404` |
| `PUT` | `/api/trips/:id` | Route Param: `:id`, Body: `{ tripUpdates }` | `{ success: true, data: <updated_trip> }` | `200` / `404` |
| `DELETE`| `/api/trips/:id` | Route Param: `:id` | `{ success: true, message: "Trip deleted successfully." }` | `200` / `404` |
| `GET` | `/api/weather` | Query: `?destination=Paris&lat=48.85&lon=2.35` | `{ destination, coordinates, current: {...}, forecast: [7 days] }` | `200` |
| `GET` | `/api/places/search-cities` | Query: `?q=Athens&country=Greece` | `{ success: true, source: "local"|"remote", data: [ ...cities ] }` | `200` |
| `GET` | `/api/places/curated` | Query: `?destination=Kyoto&type=tourist_attraction` | `{ success: true, data: [ ...curatedAttractions ] }` | `200` |
| `GET` | `/api/places/nearby` | Query: `?destination=Kyoto` | `{ success: true, data: [ ...nearbyPOIs ] }` | `200` |
| `GET` | `/api/places/geocode` | Query: `?query=Kyoto` | `{ lat: 35.0116, lon: 135.7681, displayName: "Kyoto, Japan" }` | `200` / `404` |
| `GET` | `/api/places/destination-image` | Query: `?destination=Kyoto` | `{ success: true, imageUrl: "https://images.unsplash..." }` | `200` |
| `POST`| `/api/places/saved` | Body: `{ tripId, userId, name, category, rating, address, imageUrl }` | `{ success: true, data: <saved_place_record> }` | `201` |
| `GET` | `/api/places/saved` | Query: `?tripId=<id>&userId=<id>` | `{ success: true, data: [ ...bookmarkedPlaces ] }` | `200` |
| `DELETE`| `/api/places/saved/:id` | Route Param: `:id` | `{ success: true, message: "Place removed from saved." }` | `200` |
| `POST`| `/api/chat` | Body: `{ destination, tripContext, question }` | `{ success: true, answer: "concierge response text" }` | `200` |
