# TripWise AI — Database Architecture & SQLite Guide

This document details the database engine, relational schema, ACID transactions, performance indexing, and configuration pragma settings powering TripWise AI.

---

## 1. Database Technology: Native `node:sqlite`

TripWise AI uses Node.js's built-in **`node:sqlite`** module via the `DatabaseSync` class (available in Node.js v22.5.0+).

```javascript
import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync(dbPath);
```

### Why Native `node:sqlite` Over External Packages?
1. **Zero npm Dependencies:** Does not require third-party packages like `sqlite3` or `better-sqlite3`.
2. **Zero Native Build Failures:** Compiling native C/C++ bindings via `node-gyp` often fails on different operating systems (Windows Visual Studio Build Tools, macOS Xcode Command Line Tools, Linux python dependencies). Native `node:sqlite` works instantly across all platforms.
3. **Embedded & Serverless:** The database is stored in a single binary file on disk (`server/src/data/tripwise.db`). No database servers, background services, or network authentication ports are required.
4. **Synchronous Prepared Statements:** Prepared statements run in-process with nanosecond execution speed.

---

## 2. Essential SQLite PRAGMA Configurations

When the database initializes in `server/src/db/database.js`, two critical PRAGMA commands are executed:

### A. `PRAGMA foreign_keys = ON;`
- **What it does:** Enables foreign key constraint checking.
- **Why it matters:** In SQLite, foreign key enforcement is disabled by default for backwards compatibility. Enabling this ensures that:
  - Records cannot reference non-existent parent IDs.
  - Cascading deletes (`ON DELETE CASCADE`) work automatically. If a trip is deleted, all its days, activities, budget items, and highlights are purged instantly.

### B. `PRAGMA journal_mode = WAL;`
- **What it does:** Switches the database journaling mode to **Write-Ahead Logging (WAL)**.
- **How WAL Works:**
  - In traditional rollback journaling, when a write operation occurs, the entire database file is locked. Readers must wait until the write finishes.
  - In **WAL mode**, changes are appended to a separate log file (`tripwise.db-wal`). Readers can continue reading uncommitted snapshots from the main database file simultaneously!
- **Result:** Drastically higher concurrency and zero "Database is locked" errors.

---

## 3. The 7 Relational Tables & Schema Details

The schema is created in `server/src/db/schema.js`:

```
┌──────────────────┐          ┌───────────────────────┐
│      users       │          │         trips         │
├──────────────────┤          ├───────────────────────┤
│ id (PK)          │1       N │ id (PK)               │
│ name             ├──────────┤ user_id (FK)          │
│ email (UNIQUE)   │          │ destination           │
│ password_hash    │          │ coordinates (JSON)    │
│ created_at       │          │ budget, duration      │
└──────────────────┘          │ travel_style, image   │
                              └───────────┬───────────┘
                                          │
       ┌──────────────────┬───────────────┼───────────────┬──────────────────┐
       │ 1                │ 1             │ 1             │ 1                │ 1
       ▼ 1                ▼ 1             ▼ N             ▼ N                ▼ N
┌──────────────┐   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   ┌──────────────┐
│budget_break- │   │trip_high-    │  │itinerary_days│  │  activities  │   │ saved_places │
│down          │   │lights        │  ├──────────────┤  ├──────────────┤   ├──────────────┤
├──────────────┤   ├──────────────┤  │ id (PK)      │1 │ id (PK)      │   │ id (PK)      │
│ id (PK)      │   │ id (PK)      │  │ trip_id (FK) ├──┤ day_id (FK)  │   │ trip_id (FK) │
│ trip_id (FK) │   │ trip_id (FK) │  │ day_number   │N │ trip_id (FK) │   │ user_id (FK) │
│ flights      │   │ flight       │  │ title        │  │ time, title  │   │ name         │
│ hotels       │   │ hotel        │  └──────────────┘  │ type, cost   │   │ category     │
│ food         │   │ top_rated    │                    │ rating       │   │ rating       │
│ transport    │   │ nearby_places│                    │ booking_req  │   │ address      │
│ activities   │   │ travel_tips  │                    │ ai_recom     │   │ image_url    │
│ shopping     │   └──────────────┘                    └──────────────┘   └──────────────┘
└──────────────┘
```

---

### Table Field Descriptions

#### 1. `users`
- `id` (TEXT, PRIMARY KEY): Unique identifier (e.g. `usr_1741...`).
- `name` (TEXT NOT NULL): User's full display name.
- `email` (TEXT UNIQUE NOT NULL): Login email.
- `password_hash` (TEXT NOT NULL): Salted scrypt key (`<salt>:<derivedKey>`).
- `created_at` (DATETIME): Registration timestamp.

#### 2. `trips`
- `id` (TEXT, PRIMARY KEY): Trip identifier (e.g. `trip_1741...`).
- `user_id` (TEXT, FK -> `users(id)` ON DELETE SET NULL): Owner user ID. Allows trips to exist for guest users.
- `city` (TEXT NOT NULL): Origin city.
- `destination` (TEXT NOT NULL): Target destination.
- `country` (TEXT): Country name.
- `coordinates` (TEXT): JSON string of latitude and longitude (`{"lat":37.98,"lon":23.72}`).
- `budget` (REAL NOT NULL): Total trip budget in USD.
- `duration` (INTEGER NOT NULL): Duration in days.
- `from_date`, `to_date` (TEXT): Scheduled calendar travel dates.
- `travel_style` (TEXT NOT NULL): Selected style chips (e.g. *"Culture, Adventure"*).
- `preferences` (TEXT): Custom notes.
- `image_url` (TEXT): Destination cover photo URL.
- `created_at`, `updated_at` (DATETIME).

#### 3. `itinerary_days`
- `id` (TEXT, PRIMARY KEY): Day ID (`day_1741...`).
- `trip_id` (TEXT NOT NULL, FK -> `trips(id)` ON DELETE CASCADE).
- `day_number` (INTEGER NOT NULL): 1, 2, 3, etc.
- `title` (TEXT NOT NULL): Theme title (e.g. *"Historic Palaces & Bukchon Enclave"*).

#### 4. `activities`
- `id` (TEXT, PRIMARY KEY): Activity ID (`act_1741...`).
- `day_id` (TEXT NOT NULL, FK -> `itinerary_days(id)` ON DELETE CASCADE).
- `trip_id` (TEXT NOT NULL, FK -> `trips(id)` ON DELETE CASCADE).
- `time` (TEXT): Scheduled time (e.g. *"09:00 AM"*).
- `title` (TEXT NOT NULL): Landmark or activity name.
- `type` (TEXT): *"Sightseeing"*, *"Dining"*, *"Hotel"*, *"Transport"*.
- `location` (TEXT): Specific neighborhood or address.
- `description` (TEXT): 1-2 sentence overview.
- `duration` (TEXT): e.g. *"2.5 Hours"*.
- `cost` (TEXT): Estimated cost (e.g. *"$15"* or *"Free"*).
- `rating` (REAL): Visitor rating (e.g. `4.8`).
- `booking_required` (INTEGER): `1` if reservation required, `0` if walk-in.
- `best_time` (TEXT): *"Morning"*, *"Afternoon"*, *"Sunset"*, *"Evening"*.
- `additional_details` (TEXT): Practical tips (e.g. *"Free entry if wearing Hanbok"*).
- `ai_recommendation` (TEXT): Expert AI tip.

#### 5. `budget_breakdown`
- Stores exact dollar allocations for `flights`, `hotels`, `food`, `transport`, `activities`, and `shopping`. Linked 1-to-1 to `trips(id)` with a UNIQUE constraint.

#### 6. `trip_highlights`
- Stores summary tags (`flight`, `hotel`, `top_rated`, `activities_count`, `restaurants_count`) plus JSON strings for `nearby_places` and `travel_tips`.

#### 7. `saved_places`
- Stores user-bookmarked attractions and restaurants per trip.

---

## 4. B-Tree Indexes for Performance

To ensure millisecond response times when querying trips with hundreds of activities, `schema.js` defines indexes on all foreign key columns:

```sql
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_trip_id ON saved_places(trip_id);
CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);
```

Without indexes, SQLite would have to perform full table scans across all activities for every single day lookup. Indexes reduce lookups to logarithmic time complexity **O(log N)**.

---

## 5. ACID Transactions in Action

In `server/src/db/repositories.js`, saving a generated trip involves writing to **5 separate tables**. If an error occurred halfway through (e.g., the server lost power on Day 3's activities), the database would end up with orphaned, corrupted trip data.

To prevent this, `saveTrip()` wraps all operations in an **atomic ACID transaction**:

```javascript
// 1. Begin atomic transaction
db.exec("BEGIN TRANSACTION;");

try {
  // Clear existing records if updating/overwriting
  db.prepare("DELETE FROM trips WHERE id = ?").run(tripId);

  // Insert into trips
  insertTripStmt.run(...);

  // Insert budget breakdown
  insertBudgetStmt.run(...);

  // Insert highlights and travel tips
  insertHighlightsStmt.run(...);

  // Insert days and nested activities
  for (const day of days) {
    insertDayStmt.run(dayId, tripId, day.day, day.title);
    for (const act of day.activities) {
      insertActStmt.run(actId, dayId, tripId, ...);
    }
  }

  // 2. Commit transaction: all changes permanently written together!
  db.exec("COMMIT;");
  return this.getTripById(tripId);

} catch (err) {
  // 3. Rollback: if ANY step failed, revert everything!
  db.exec("ROLLBACK;");
  console.error("[DB] Transaction failed while saving trip:", err);
  throw err;
}
```

### Explaining ACID to Examiners:
- **Atomicity:** All-or-nothing. Either all 5 tables are updated, or none are.
- **Consistency:** Database transitions only between valid states conforming to schema constraints.
- **Isolation:** Concurrent reads see only fully committed trips, never partial states.
- **Durability:** Once committed, records survive server crashes because changes are safely persisted to disk.
