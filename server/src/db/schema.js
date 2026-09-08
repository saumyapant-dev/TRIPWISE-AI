import { db } from "./database.js";

export function initSchema() {
  db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Trips Table
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      city TEXT NOT NULL,
      destination TEXT NOT NULL,
      country TEXT,
      coordinates TEXT,
      budget REAL NOT NULL,
      duration INTEGER NOT NULL,
      from_date TEXT,
      to_date TEXT,
      travel_style TEXT NOT NULL,
      preferences TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- Itinerary Days Table
    CREATE TABLE IF NOT EXISTS itinerary_days (
      id TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL,
      day_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    -- Activities Table
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      day_id TEXT NOT NULL,
      trip_id TEXT NOT NULL,
      time TEXT,
      title TEXT NOT NULL,
      type TEXT,
      location TEXT,
      description TEXT,
      duration TEXT,
      cost TEXT,
      rating REAL,
      booking_required INTEGER DEFAULT 0,
      best_time TEXT,
      additional_details TEXT,
      ai_recommendation TEXT,
      FOREIGN KEY (day_id) REFERENCES itinerary_days(id) ON DELETE CASCADE,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    -- Budget Breakdown Table
    CREATE TABLE IF NOT EXISTS budget_breakdown (
      id TEXT PRIMARY KEY,
      trip_id TEXT UNIQUE NOT NULL,
      flights REAL DEFAULT 0,
      hotels REAL DEFAULT 0,
      food REAL DEFAULT 0,
      transport REAL DEFAULT 0,
      activities REAL DEFAULT 0,
      shopping REAL DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    -- Trip Highlights Table
    CREATE TABLE IF NOT EXISTS trip_highlights (
      id TEXT PRIMARY KEY,
      trip_id TEXT UNIQUE NOT NULL,
      flight TEXT,
      hotel TEXT,
      top_rated TEXT,
      activities_count INTEGER DEFAULT 0,
      restaurants_count INTEGER DEFAULT 0,
      nearby_places TEXT, -- Stored as JSON array string
      travel_tips TEXT, -- Stored as JSON array string
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    -- Saved Places Table
    CREATE TABLE IF NOT EXISTS saved_places (
      id TEXT PRIMARY KEY,
      trip_id TEXT,
      user_id TEXT,
      name TEXT NOT NULL,
      category TEXT,
      rating REAL,
      address TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Indexes for high-performance joins & filtering
    CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
    CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
    CREATE INDEX IF NOT EXISTS idx_activities_day_id ON activities(day_id);
    CREATE INDEX IF NOT EXISTS idx_activities_trip_id ON activities(trip_id);
    CREATE INDEX IF NOT EXISTS idx_saved_places_trip_id ON saved_places(trip_id);
    CREATE INDEX IF NOT EXISTS idx_saved_places_user_id ON saved_places(user_id);
  `);

  // Migration check for existing DB files
  try {
    db.exec("ALTER TABLE trip_highlights ADD COLUMN travel_tips TEXT;");
  } catch {
    // Column already exists
  }

  try {
    db.exec("ALTER TABLE trips ADD COLUMN country TEXT;");
  } catch {
    // Column already exists
  }

  try {
    db.exec("ALTER TABLE trips ADD COLUMN coordinates TEXT;");
  } catch {
    // Column already exists
  }

  console.log("[DB] Schema initialized successfully: 7 relational tables created.");
}
