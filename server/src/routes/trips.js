import express from "express";
import { generateItinerary } from "../services/geminiService.js";
import { fetchDestinationImage } from "../services/unsplashService.js";
import { tripsRepo } from "../db/repositories.js";

const router = express.Router();

/**
 * POST /api/trips/generate
 * Generates an itinerary using Gemini, fetches cover image, and saves to SQLite.
 */
router.post("/generate", async (req, res, next) => {
  try {
    const {
      city,
      destination,
      budget,
      duration,
      fromDate,
      toDate,
      travelStyle,
      preferences,
      userId,
    } = req.body;

    // Validation
    if (!city || !budget || !duration || !travelStyle) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: city, budget, duration, and travelStyle are mandatory.",
      });
    }

    const parsedBudget = Number(budget);
    const parsedDuration = Number(duration);

    if (isNaN(parsedBudget) || parsedBudget <= 0) {
      return res.status(400).json({
        success: false,
        error: "Budget must be a positive number.",
      });
    }

    if (isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 30) {
      return res.status(400).json({
        success: false,
        error: "Duration must be between 1 and 30 days.",
      });
    }

    const targetDestination = (destination && destination.trim()) || `${travelStyle} Getaway`;

    console.log(
      `[API] Generating trip from ${city} to ${targetDestination} (${parsedDuration} days, $${parsedBudget})`
    );

    // Parallel calls: Itinerary generation & Unsplash image
    const [tripData, imageUrl] = await Promise.all([
      generateItinerary({
        city,
        destination: targetDestination,
        budget: parsedBudget,
        duration: parsedDuration,
        travelStyle,
        preferences,
      }),
      fetchDestinationImage(targetDestination),
    ]);

    const tripRecord = {
      userId: userId || null,
      city,
      destination: targetDestination,
      budget: parsedBudget,
      duration: parsedDuration,
      fromDate: fromDate || "",
      toDate: toDate || "",
      travelStyle,
      preferences: preferences || "",
      imageUrl,
      tripData,
    };

    // Save directly to SQLite relational database
    const saved = tripsRepo.saveTrip(tripRecord);

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/trips
 * Retrieves all saved trips from the SQLite database.
 */
router.get("/", (req, res, next) => {
  try {
    const { userId } = req.query;
    const trips = tripsRepo.getAllTrips(userId || null);
    return res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/trips/:id
 * Retrieves a single trip by ID from the SQLite database with full joined itinerary days,
 * activities, budget breakdown, and highlights.
 */
router.get("/:id", (req, res, next) => {
  try {
    const trip = tripsRepo.getTripById(req.params.id);
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: "Trip not found in database.",
      });
    }

    return res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/trips
 * Manually saves or duplicates a trip object into the SQLite database.
 */
router.post("/", (req, res, next) => {
  try {
    const tripData = req.body;
    if (!tripData || !tripData.destination) {
      return res.status(400).json({
        success: false,
        error: "Invalid trip payload.",
      });
    }

    const saved = tripsRepo.saveTrip(tripData);
    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/trips/:id
 * Updates an existing trip (budget, destination, dates, travel style, preferences, etc.)
 */
router.put("/:id", (req, res, next) => {
  try {
    const tripId = req.params.id;
    const updates = req.body;

    const updated = tripsRepo.updateTrip(tripId, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: "Trip not found or could not be updated.",
      });
    }

    return res.json({
      success: true,
      message: "Trip updated successfully.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/trips/:id
 * Deletes a trip by ID from the SQLite database. Foreign keys cascade deletes to all child days and activities.
 */
router.delete("/:id", (req, res, next) => {
  try {
    const success = tripsRepo.deleteTrip(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Trip not found or could not be deleted.",
      });
    }

    return res.json({
      success: true,
      message: "Trip successfully deleted from database.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
