# TripWise AI — System Flowcharts & Sequence Diagrams

This document visualizes the complete architectural flows of TripWise AI using Mermaid diagrams. Each diagram is accompanied by a step-by-step technical explanation.

---

## 1. Application Startup & Initialization Flow

```mermaid
flowchart TD
    subgraph Frontend_Startup["Frontend Startup (Vite Dev Server :5173)"]
        A1["Browser requests http://localhost:5173"] --> A2["index.html loaded with &lt;div id='root'&gt;"]
        A2 --> A3["src/main.jsx executes ReactDOM.createRoot()"]
        A3 --> A4["&lt;App /&gt; mounts inside &lt;BrowserRouter&gt;"]
        A4 --> A5["React Router DOM registers paths: /, /generate-trip, /trip-details, etc."]
        A5 --> A6["Initial route / renders &lt;Home /&gt; page"]
    end

    subgraph Backend_Startup["Backend Startup (Express Server :5001)"]
        B1["Terminal executes node src/index.js"] --> B2["dotenv loads .env variables into process.env"]
        B2 --> B3["db/database.js initializes new DatabaseSync('tripwise.db')"]
        B3 --> B4["Executes PRAGMA foreign_keys = ON & journal_mode = WAL"]
        B4 --> B5["db/schema.js executes initSchema(): creates 7 tables & indexes"]
        B5 --> B6["Registers middleware: cors(), express.json(), logger"]
        B6 --> B7["Mounts API routers: /api/auth, /api/trips, /api/weather, etc."]
        B7 --> B8["app.listen(5001) starts listening on port 5001"]
    end
```

### Explanation:
- **Frontend:** Vite serves ES modules directly to the browser. React mounts into the `#root` container, initializes routing, and renders the `<Home />` page.
- **Backend:** Express imports `node:sqlite`, connects to `tripwise.db`, enables Write-Ahead Logging (`WAL`), and verifies table schemas before listening on port 5001.

---

## 2. End-to-End Trip Generation Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveler
    participant Form as Form.jsx (React)
    participant API as api.js (Client)
    participant Server as Express (trips.js)
    participant Gemini as Gemini AI Service
    participant Unsplash as Image Service
    participant DB as SQLite (repositories.js)
    participant Details as TripDetails.jsx

    User->>Form: Enters origin, destination, budget, duration, styles
    User->>Form: Clicks "Generate Trip"
    Form->>Form: Executes validation (budget > 0, duration 1-30, styles >= 1)
    Form->>API: generateTrip(formData)
    API->>Server: POST /api/trips/generate
    
    par Parallel Operations
        Server->>Gemini: generateItinerary(destination, duration, budget, styles)
        Gemini-->>Server: Returns structured non-repeating JSON days
    and
        Server->>Unsplash: fetchDestinationImage(destination)
        Unsplash-->>Server: Returns high-res cover image URL
    end

    Server->>DB: tripsRepo.saveTrip(tripRecord)
    Note over DB: Atomic Transaction: BEGIN TRANSACTION<br/>Inserts into trips, days, activities, budget, highlights<br/>COMMIT TRANSACTION
    DB-->>Server: Returns saved trip object with ID (trip_1741...)
    Server-->>API: HTTP 201 Created { success: true, data: savedTrip }
    API-->>Form: Resolves promise with response
    Form->>Details: navigate('/trip-details?id=' + trip_1741...)
    Details->>User: Displays interactive itinerary, map, charts & weather
```

---

## 3. Dual-Tier City Search & Geocoding Flow

```mermaid
flowchart TD
    Start["User types in CityDropdown input"] --> CheckLen{"Query length &gt;= 2?"}
    
    CheckLen -- No --> LocalOnly["Filter in-memory 178 cities catalog only (&lt;1ms)"]
    LocalOnly --> Render["Render dropdown options"]

    CheckLen -- Yes --> DualSearch["Start Concurrent Dual-Tier Pipeline"]
    
    subgraph Tier1["Tier 1: Instant Local Search"]
        DualSearch --> T1["filterDestinations() searches 178 cities in RAM"]
        T1 --> T1Res["Immediate local matches (&lt;1ms)"]
    end
    
    subgraph Tier2["Tier 2: Debounced Remote Search"]
        DualSearch --> T2Wait["Wait 320ms debounce timer (clearTimeout on keystroke)"]
        T2Wait --> T2Fetch["GET /api/places/search-cities?q=..."]
        T2Fetch --> T2OSM["Backend queries OpenStreetMap Nominatim"]
        T2OSM --> T2Res["Returns parsed { city, region, country, coordinates }"]
    end

    T1Res --> Dedupe["Deduplication Engine (ES6 Map keyed by city_country)"]
    T2Res --> Dedupe
    Dedupe --> Render
    
    Render --> UserSelect["User clicks a city"]
    UserSelect --> UpdateForm["Form stores { city, country, coordinates: { lat, lon } }"]
```

---

## 4. User Authentication & Session Security Flow

```mermaid
sequenceDiagram
    actor User as User
    participant Page as Signup / Login Page
    participant Server as auth.js (Express)
    participant Crypto as node:crypto
    participant DB as SQLite (usersRepo)
    participant Storage as Browser localStorage

    alt User Registration (Signup)
        User->>Page: Enters Name, Email, Password (min 6 chars)
        Page->>Server: POST /api/auth/signup
        Server->>DB: findUserByEmail(email)
        alt Email already exists
            DB-->>Server: User record found
            Server-->>Page: HTTP 409 Conflict ("Email already registered")
        else Email is unique
            Server->>Crypto: crypto.randomBytes(16) -> Generate salt
            Server->>Crypto: crypto.scryptSync(password, salt, 64) -> Derived key
            Server->>DB: createUser({ name, email, passwordHash: salt:derivedKey })
            Server->>Crypto: generateToken({ id, email, name }) -> Signed HMAC-SHA256 JWT
            Server-->>Page: HTTP 201 Created { token, user }
            Page->>Storage: Store "tripwise_token" and "tripwise_user"
        end
    else User Login
        User->>Page: Enters Email, Password
        Page->>Server: POST /api/auth/login
        Server->>DB: findUserByEmail(email)
        alt User not found
            Server-->>Page: HTTP 401 Unauthorized
        else User found
            Server->>Crypto: Extract salt & key from stored password_hash
            Server->>Crypto: crypto.scryptSync(password, salt, 64)
            Server->>Crypto: crypto.timingSafeEqual(keyBuffer, derivedKey)
            alt Password matches
                Server->>Crypto: generateToken({ id, email, name })
                Server-->>Page: HTTP 200 OK { token, user }
                Page->>Storage: Store token & user session in localStorage
            else Password mismatch
                Server-->>Page: HTTP 401 Unauthorized ("Invalid credentials")
            end
        end
    end
```

---

## 5. Database Persistence & Foreign Key Cascade Flow

```mermaid
flowchart TD
    subgraph Transaction_Execution["Atomic Transaction (repositories.js)"]
        T1["BEGIN TRANSACTION"] --> T2["INSERT INTO trips (id, city, destination, budget...)"]
        T2 --> T3["INSERT INTO budget_breakdown (trip_id, flights, hotels...)"]
        T3 --> T4["INSERT INTO trip_highlights (trip_id, flight, hotel, tips...)"]
        T4 --> T5["Loop: INSERT INTO itinerary_days (id, trip_id, day_number...)"]
        T5 --> T6["Loop: INSERT INTO activities (id, day_id, trip_id, time, title...)"]
        T6 --> T7{"Any SQL or Constraint Error?"}
        T7 -- No --> T8["COMMIT TRANSACTION (All 5 tables persisted permanently)"]
        T7 -- Yes --> T9["ROLLBACK (All changes cleanly reverted, no partial records)"]
    end

    subgraph Cascade_Deletion["Cascading Deletion (ON DELETE CASCADE)"]
        D1["User or Admin calls: DELETE FROM trips WHERE id = 'trip_123'"] --> D2["SQLite detects PRAGMA foreign_keys = ON"]
        D2 --> D3["Deletes trip record from trips table"]
        D3 --> D4["Automatically purges matching rows in:"]
        D4 --> D4a["- budget_breakdown WHERE trip_id = 'trip_123'"]
        D4 --> D4b["- trip_highlights WHERE trip_id = 'trip_123'"]
        D4 --> D4c["- itinerary_days WHERE trip_id = 'trip_123'"]
        D4 --> D4d["- activities WHERE trip_id = 'trip_123'"]
        D4 --> D4e["- saved_places WHERE trip_id = 'trip_123'"]
    end
```
