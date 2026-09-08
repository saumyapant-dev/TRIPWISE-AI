import { db } from "./database.js";
import crypto from "node:crypto";
import { generateFallbackItinerary } from "../services/geminiService.js";

function generateId(prefix = "id") {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

function insertDaysAndActivities(tripId, destination, days) {
  const insertDayStmt = db.prepare(`
    INSERT INTO itinerary_days (id, trip_id, day_number, title)
    VALUES (?, ?, ?, ?)
  `);

  const insertActStmt = db.prepare(`
    INSERT INTO activities (
      id, day_id, trip_id, time, title, type, location, description,
      duration, cost, rating, booking_required, best_time, additional_details, ai_recommendation
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const dayId = generateId("day");
    const dayNumber = day.day || i + 1;
    const dayTitle = day.title || `Day ${dayNumber}`;

    insertDayStmt.run(dayId, tripId, dayNumber, dayTitle);

    const activities = Array.isArray(day.activities) ? day.activities : [];
    for (const act of activities) {
      const actId = generateId("act");
      insertActStmt.run(
        actId,
        dayId,
        tripId,
        act.time || "09:00 AM",
        act.title || "Activity",
        act.type || "Sightseeing",
        act.location || destination,
        act.description || "",
        act.duration || "2 Hours",
        act.cost || act.estimatedCost || "$20",
        Number(act.rating) || 4.8,
        act.bookingRequired ? 1 : 0,
        act.bestTime || "Morning",
        act.additionalDetails || act.notes || "",
        act.aiRecommendation || ""
      );
    }
  }
}

export const tripsRepo = {
  saveTrip(tripRecord) {
    const tripId = tripRecord.id || generateId("trip");
    const userId = tripRecord.userId || tripRecord.user_id || null;
    const city = tripRecord.city || "Origin";
    const destination = tripRecord.destination || "Destination";
    const budget = Number(tripRecord.budget) || 2000;
    const duration = Number(tripRecord.duration) || 7;
    const fromDate = tripRecord.fromDate || tripRecord.from_date || "";
    const toDate = tripRecord.toDate || tripRecord.to_date || "";
    const country = tripRecord.country || "";
    let coordinatesStr = "";
    if (tripRecord.coordinates) {
      coordinatesStr =
        typeof tripRecord.coordinates === "string"
          ? tripRecord.coordinates
          : JSON.stringify(tripRecord.coordinates);
    }

    let preferencesStr = "";
    let travelStyle = tripRecord.travelStyle || tripRecord.travel_style || "";
    if (Array.isArray(tripRecord.preferences)) {
      preferencesStr = JSON.stringify(tripRecord.preferences);
      if (!travelStyle) {
        travelStyle = tripRecord.preferences.join(", ");
      }
    } else if (typeof tripRecord.preferences === "string") {
      preferencesStr = tripRecord.preferences;
      if (!travelStyle) travelStyle = preferencesStr;
    }
    if (!travelStyle) travelStyle = "Culture, City Exploration";

    const imageUrl =
      tripRecord.imageUrl ||
      tripRecord.image_url ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=700&fit=crop";

    let tripData = tripRecord.tripData;
    if (typeof tripData === "string") {
      try {
        tripData = JSON.parse(tripData.replace(/```json/g, "").replace(/```/g, "").trim());
      } catch {
        tripData = {};
      }
    }
    tripData = tripData || {};

    const budgetBreakdown = tripData.budgetBreakdown || {
      flights: Math.round(budget * 0.35),
      hotels: Math.round(budget * 0.3),
      food: Math.round(budget * 0.15),
      transport: Math.round(budget * 0.08),
      activities: Math.round(budget * 0.08),
      shopping: Math.round(budget * 0.04),
    };

    const tripHighlights = tripData.tripHighlights || {
      flight: `Flight to ${destination}`,
      hotel: `Boutique Hotel in ${destination}`,
      topRated: `${destination} City Center`,
      activities: duration * 4,
      restaurants: duration * 2,
      nearbyPlaces: [`${destination} Old Town`, `${destination} Waterfront`],
    };

    const days = Array.isArray(tripData.days) ? tripData.days : [];

    // Begin atomic transaction
    db.exec("BEGIN TRANSACTION;");
    try {
      // 1. Delete if exists (for upsert or overwrite)
      db.prepare("DELETE FROM trips WHERE id = ?").run(tripId);

      // 2. Insert into trips
      const insertTripStmt = db.prepare(`
        INSERT INTO trips (
          id, user_id, city, destination, country, coordinates, budget, duration,
          from_date, to_date, travel_style, preferences, image_url,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);
      insertTripStmt.run(
        tripId,
        userId,
        city,
        destination,
        country,
        coordinatesStr,
        budget,
        duration,
        fromDate,
        toDate,
        travelStyle,
        preferencesStr,
        imageUrl
      );

      // 3. Insert budget breakdown
      const insertBudgetStmt = db.prepare(`
        INSERT INTO budget_breakdown (
          id, trip_id, flights, hotels, food, transport, activities, shopping
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertBudgetStmt.run(
        generateId("bb"),
        tripId,
        Number(budgetBreakdown.flights) || 0,
        Number(budgetBreakdown.hotels) || 0,
        Number(budgetBreakdown.food) || 0,
        Number(budgetBreakdown.transport) || 0,
        Number(budgetBreakdown.activities) || 0,
        Number(budgetBreakdown.shopping) || 0
      );

      // 4. Insert trip highlights & travel tips
      const travelTipsToSave =
        (Array.isArray(tripData.travelTips) && tripData.travelTips.length > 0)
          ? tripData.travelTips
          : (Array.isArray(tripHighlights.travelTips) && tripHighlights.travelTips.length > 0)
          ? tripHighlights.travelTips
          : [];
      const insertHighlightsStmt = db.prepare(`
        INSERT INTO trip_highlights (
          id, trip_id, flight, hotel, top_rated, activities_count, restaurants_count, nearby_places, travel_tips
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertHighlightsStmt.run(
        generateId("th"),
        tripId,
        tripHighlights.flight || "",
        tripHighlights.hotel || "",
        tripHighlights.topRated || tripHighlights.top_rated || "",
        Number(tripHighlights.activities) || Number(tripHighlights.activities_count) || 0,
        Number(tripHighlights.restaurants) || Number(tripHighlights.restaurants_count) || 0,
        JSON.stringify(tripHighlights.nearbyPlaces || tripHighlights.nearby_places || []),
        JSON.stringify(travelTipsToSave)
      );

      // 5. Insert days and activities
      const insertDayStmt = db.prepare(`
        INSERT INTO itinerary_days (id, trip_id, day_number, title)
        VALUES (?, ?, ?, ?)
      `);

      const insertActStmt = db.prepare(`
        INSERT INTO activities (
          id, day_id, trip_id, time, title, type, location, description,
          duration, cost, rating, booking_required, best_time, additional_details, ai_recommendation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (let i = 0; i < days.length; i++) {
        const day = days[i];
        const dayId = generateId("day");
        const dayNumber = day.day || i + 1;
        const dayTitle = day.title || `Day ${dayNumber}`;

        insertDayStmt.run(dayId, tripId, dayNumber, dayTitle);

        const activities = Array.isArray(day.activities) ? day.activities : [];
        for (const act of activities) {
          const actId = generateId("act");
          insertActStmt.run(
            actId,
            dayId,
            tripId,
            act.time || "09:00 AM",
            act.title || "Activity",
            act.type || "Sightseeing",
            act.location || destination,
            act.description || "",
            act.duration || "2 Hours",
            act.cost || act.estimatedCost || "$20",
            Number(act.rating) || 4.8,
            act.bookingRequired ? 1 : 0,
            act.bestTime || "Morning",
            act.additionalDetails || act.notes || "",
            act.aiRecommendation || ""
          );
        }
      }

      db.exec("COMMIT;");
      console.log(`[DB] Trip ${tripId} saved successfully.`);
      return this.getTripById(tripId);
    } catch (err) {
      db.exec("ROLLBACK;");
      console.error("[DB] Transaction failed while saving trip:", err);
      throw err;
    }
  },

  getTripById(tripId) {
    const tripRow = db.prepare("SELECT * FROM trips WHERE id = ?").get(tripId);
    if (!tripRow) return null;

    // Budget breakdown
    const budgetRow = db.prepare("SELECT * FROM budget_breakdown WHERE trip_id = ?").get(tripId);
    const budgetBreakdown = budgetRow
      ? {
          flights: budgetRow.flights,
          hotels: budgetRow.hotels,
          food: budgetRow.food,
          transport: budgetRow.transport,
          activities: budgetRow.activities,
          shopping: budgetRow.shopping,
        }
      : { flights: 0, hotels: 0, food: 0, transport: 0, activities: 0, shopping: 0 };

    // Trip highlights
    const highlightsRow = db.prepare("SELECT * FROM trip_highlights WHERE trip_id = ?").get(tripId);
    let nearbyPlaces = [];
    if (highlightsRow?.nearby_places) {
      try {
        nearbyPlaces = JSON.parse(highlightsRow.nearby_places);
      } catch {
        nearbyPlaces = [];
      }
    }
    let parsedTravelTips = [];
    if (highlightsRow?.travel_tips) {
      try {
        parsedTravelTips = JSON.parse(highlightsRow.travel_tips);
      } catch {
        parsedTravelTips = [];
      }
    }
    const tripHighlights = highlightsRow
      ? {
          flight: highlightsRow.flight,
          hotel: highlightsRow.hotel,
          topRated: highlightsRow.top_rated,
          activities: highlightsRow.activities_count,
          restaurants: highlightsRow.restaurants_count,
          nearbyPlaces,
          travelTips: Array.isArray(parsedTravelTips) ? parsedTravelTips : [],
        }
      : { flight: "", hotel: "", topRated: "", activities: 0, restaurants: 0, nearbyPlaces: [], travelTips: [] };

    // Days & Activities
    const dayRows = db.prepare("SELECT * FROM itinerary_days WHERE trip_id = ? ORDER BY day_number ASC").all(tripId);
    const days = dayRows.map((day) => {
      const actRows = db.prepare("SELECT * FROM activities WHERE day_id = ? ORDER BY rowid ASC").all(day.id);
      return {
        id: day.id,
        day: day.day_number,
        title: day.title,
        activities: actRows.map((act) => ({
          id: act.id,
          time: act.time,
          title: act.title,
          type: act.type,
          location: act.location,
          description: act.description,
          duration: act.duration,
          cost: act.cost,
          rating: act.rating,
          bookingRequired: Boolean(act.booking_required),
          bestTime: act.best_time,
          additionalDetails: act.additional_details,
          aiRecommendation: act.ai_recommendation,
        })),
      };
    });

    // Daily spending calculation
    const dailySpending = days.map((d) => ({
      day: `Day ${d.day}`,
      amount: Math.round(tripRow.budget / (days.length || 1)),
    }));

    // Saved places
    const savedPlaces = db.prepare("SELECT * FROM saved_places WHERE trip_id = ? ORDER BY created_at DESC").all(tripId);

    // Parse coordinates
    let parsedCoordinates = null;
    if (tripRow.coordinates) {
      try {
        parsedCoordinates = JSON.parse(tripRow.coordinates);
      } catch {
        parsedCoordinates = null;
      }
    }

    // Parse preferences as array
    let parsedPreferences = [];
    if (tripRow.preferences) {
      const trimmed = String(tripRow.preferences).trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          parsedPreferences = JSON.parse(trimmed);
        } catch {
          parsedPreferences = [trimmed];
        }
      } else if (trimmed.includes(",")) {
        parsedPreferences = trimmed.split(",").map((p) => p.trim()).filter(Boolean);
      } else if (trimmed.length > 0) {
        parsedPreferences = [trimmed];
      }
    } else if (tripRow.travel_style) {
      parsedPreferences = String(tripRow.travel_style).split(",").map((p) => p.trim()).filter(Boolean);
    }
    if (!Array.isArray(parsedPreferences) || parsedPreferences.length === 0) {
      parsedPreferences = ["Culture", "City Exploration"];
    }

    // Formatted assembled trip structure
    return {
      id: tripRow.id,
      userId: tripRow.user_id,
      city: tripRow.city,
      destination: tripRow.destination,
      country: tripRow.country || "",
      coordinates: parsedCoordinates,
      budget: tripRow.budget,
      duration: tripRow.duration,
      fromDate: tripRow.from_date,
      toDate: tripRow.to_date,
      travelStyle: tripRow.travel_style || parsedPreferences.join(", "),
      preferences: parsedPreferences,
      imageUrl: tripRow.image_url,
      createdAt: tripRow.created_at,
      updatedAt: tripRow.updated_at,
      savedAt: tripRow.created_at,
      savedPlaces,
      tripData: {
        budgetBreakdown,
        tripHighlights,
        dailySpending,
        travelTips: (() => {
          if (highlightsRow?.travel_tips) {
            try {
              const parsed = JSON.parse(highlightsRow.travel_tips);
              if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch {
              // fallback
            }
          }
          return [
            {
              category: "Timing",
              title: "Beat the Crowds",
              description: `Visit top attractions in ${tripRow.destination} before 10:00 AM or late in the afternoon for fewer crowds.`,
            },
            {
              category: "Food",
              title: "Taste Local Dishes",
              description: `Experience authentic street food, artisan eateries, and regional specialties in ${tripRow.destination}.`,
            },
            {
              category: "Transport",
              title: "City Transit Passes",
              description: `Pick up a multi-day local transit pass to save money navigating ${tripRow.destination}.`,
            },
            {
              category: "Photography",
              title: "Golden Hour Panoramas",
              description: `Check out scenic viewpoints during sunset for breathtaking photography across ${tripRow.destination}.`,
            },
          ];
        })(),
        days,
      },
    };
  },

  getAllTrips(userId = null) {
    let tripRows;
    if (userId) {
      tripRows = db.prepare("SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    } else {
      tripRows = db.prepare("SELECT * FROM trips ORDER BY created_at DESC").all();
    }

    return tripRows.map((t) => this.getTripById(t.id)).filter(Boolean);
  },

  updateTrip(tripId, updates) {
    const existing = db.prepare("SELECT * FROM trips WHERE id = ?").get(tripId);
    if (!existing) return null;

    const city = updates.city !== undefined ? updates.city : existing.city;
    const destination = updates.destination !== undefined ? updates.destination : existing.destination;
    const budget = updates.budget !== undefined ? Number(updates.budget) : existing.budget;
    const duration = updates.duration !== undefined ? Number(updates.duration) : existing.duration;
    const fromDate = updates.fromDate !== undefined ? updates.fromDate : existing.from_date;
    const toDate = updates.toDate !== undefined ? updates.toDate : existing.to_date;
    const country = updates.country !== undefined ? updates.country : (existing.country || "");
    let coordinates = existing.coordinates;
    if (updates.coordinates !== undefined) {
      coordinates =
        typeof updates.coordinates === "string"
          ? updates.coordinates
          : JSON.stringify(updates.coordinates);
    }

    let preferences = existing.preferences;
    let travelStyle = updates.travelStyle !== undefined ? updates.travelStyle : existing.travel_style;
    if (updates.preferences !== undefined) {
      if (Array.isArray(updates.preferences)) {
        preferences = JSON.stringify(updates.preferences);
        if (!updates.travelStyle) {
          travelStyle = updates.preferences.join(", ");
        }
      } else {
        preferences = updates.preferences;
      }
    }
    const imageUrl = updates.imageUrl !== undefined ? updates.imageUrl : existing.image_url;

    db.prepare(`
      UPDATE trips SET
        city = ?,
        destination = ?,
        country = ?,
        coordinates = ?,
        budget = ?,
        duration = ?,
        from_date = ?,
        to_date = ?,
        travel_style = ?,
        preferences = ?,
        image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(city, destination, country, coordinates, budget, duration, fromDate, toDate, travelStyle, preferences, imageUrl, tripId);

    // If budget breakdown was supplied, update it, or recalculate if budget changed
    if (updates.budgetBreakdown) {
      db.prepare(`
        UPDATE budget_breakdown SET
          flights = ?,
          hotels = ?,
          food = ?,
          transport = ?,
          activities = ?,
          shopping = ?
        WHERE trip_id = ?
      `).run(
        Number(updates.budgetBreakdown.flights) || 0,
        Number(updates.budgetBreakdown.hotels) || 0,
        Number(updates.budgetBreakdown.food) || 0,
        Number(updates.budgetBreakdown.transport) || 0,
        Number(updates.budgetBreakdown.activities) || 0,
        Number(updates.budgetBreakdown.shopping) || 0,
        tripId
      );
    } else if (budget !== existing.budget) {
      db.prepare(`
        UPDATE budget_breakdown SET
          flights = ?,
          hotels = ?,
          food = ?,
          transport = ?,
          activities = ?,
          shopping = ?
        WHERE trip_id = ?
      `).run(
        Math.round(budget * 0.35),
        Math.round(budget * 0.30),
        Math.round(budget * 0.15),
        Math.round(budget * 0.08),
        Math.round(budget * 0.07),
        Math.round(budget * 0.05),
        tripId
      );
    }

    // Check if days need adjusting
    const explicitDays = updates.days || updates.tripData?.days;
    const destinationChanged = destination.toLowerCase().trim() !== existing.destination.toLowerCase().trim();
    const durationChanged = duration !== existing.duration;

    if (Array.isArray(explicitDays) && explicitDays.length > 0) {
      db.prepare("DELETE FROM itinerary_days WHERE trip_id = ?").run(tripId);
      insertDaysAndActivities(tripId, destination, explicitDays);
    } else if (destinationChanged) {
      // Re-generate fresh days & activities for the new destination
      const generated = generateFallbackItinerary(destination, duration, budget, travelStyle);
      db.prepare("DELETE FROM itinerary_days WHERE trip_id = ?").run(tripId);
      insertDaysAndActivities(tripId, destination, generated.days);

      // Update highlights and tips for new destination
      db.prepare(`
        UPDATE trip_highlights SET
          activities_count = ?,
          nearby_places = ?,
          travel_tips = ?
        WHERE trip_id = ?
      `).run(
        generated.days.length * 4,
        JSON.stringify(generated.tripHighlights?.nearbyPlaces || []),
        JSON.stringify(generated.travelTips || []),
        tripId
      );
    } else if (durationChanged) {
      if (duration < existing.duration) {
        // Truncate days beyond new duration
        db.prepare("DELETE FROM itinerary_days WHERE trip_id = ? AND day_number > ?").run(tripId, duration);
      } else {
        // Generate additional days for extra duration
        const generated = generateFallbackItinerary(destination, duration, budget, travelStyle);
        const extraDays = generated.days.filter((d) => d.day > existing.duration);
        if (extraDays.length > 0) {
          insertDaysAndActivities(tripId, destination, extraDays);
        }
      }
    }

    console.log(`[DB] Trip ${tripId} updated with synced days/activities.`);
    return this.getTripById(tripId);
  },

  deleteTrip(tripId) {
    const result = db.prepare("DELETE FROM trips WHERE id = ?").run(tripId);
    return result.changes > 0;
  },
};

export const usersRepo = {
  createUser({ name, email, passwordHash }) {
    const userId = generateId("user");
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(userId, name, email.toLowerCase().trim(), passwordHash);
    return this.findUserById(userId);
  },

  findUserByEmail(email) {
    if (!email) return null;
    return db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim());
  },

  findUserById(id) {
    const row = db.prepare("SELECT id, name, email, created_at FROM users WHERE id = ?").get(id);
    return row || null;
  },
};

export const savedPlacesRepo = {
  savePlace({ tripId, userId, name, category, rating, address, imageUrl }) {
    const placeId = generateId("place");
    const stmt = db.prepare(`
      INSERT INTO saved_places (id, trip_id, user_id, name, category, rating, address, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      placeId,
      tripId || null,
      userId || null,
      name,
      category || "Attraction",
      rating ? Number(rating) : 4.8,
      address || "",
      imageUrl || ""
    );
    return db.prepare("SELECT * FROM saved_places WHERE id = ?").get(placeId);
  },

  getSavedPlaces(tripId, userId) {
    if (tripId) {
      return db.prepare("SELECT * FROM saved_places WHERE trip_id = ? ORDER BY created_at DESC").all(tripId);
    }
    if (userId) {
      return db.prepare("SELECT * FROM saved_places WHERE user_id = ? ORDER BY created_at DESC").all(userId);
    }
    return db.prepare("SELECT * FROM saved_places ORDER BY created_at DESC").all();
  },

  deleteSavedPlace(id) {
    const res = db.prepare("DELETE FROM saved_places WHERE id = ?").run(id);
    return res.changes > 0;
  },
};
