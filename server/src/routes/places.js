import express from "express";
import { fetchCuratedPlaces, fetchNearbyPlaces } from "../services/placesService.js";
import { geocodeDestination } from "../services/weatherService.js";
import { fetchDestinationImage } from "../services/unsplashService.js";

const router = express.Router();

/**
 * GET /api/places/geocode
 * Query: ?query=Kyoto
 */
router.get("/geocode", async (req, res, next) => {
  try {
    const query = req.query.query || req.query.destination;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'query' or 'destination' is required.",
      });
    }

    const coords = await geocodeDestination(query);
    if (!coords) {
      return res.json({
        success: true,
        destinationNotFound: true,
        coordinates: null,
        displayName: query,
        isRegion: false,
      });
    }

    return res.json({
      success: true,
      destinationNotFound: false,
      coordinates: { lat: coords.lat, lon: coords.lon },
      displayName: coords.displayName,
      isRegion: Boolean(coords.isRegion),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/places/curated
 * Query: ?destination=Kyoto&type=tourist_attraction|restaurant
 */
router.get("/curated", async (req, res, next) => {
  try {
    const { destination, type = "tourist_attraction" } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'destination' is required.",
      });
    }

    const places = await fetchCuratedPlaces(destination, type);

    return res.json({
      success: true,
      data: places,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/places/nearby
 * Query: ?destination=Kyoto
 */
router.get("/nearby", async (req, res, next) => {
  try {
    const { destination } = req.query;

    if (!destination) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'destination' is required.",
      });
    }

    const result = await fetchNearbyPlaces(destination);
    const placesArray = Array.isArray(result) ? result : result.data;

    return res.json({
      success: true,
      destination: result.destination || destination,
      isRegion: Boolean(result.isRegion),
      coordinates: result.coordinates || null,
      data: placesArray,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/places/destination-image
 * Query: ?destination=Seoul
 */
router.get("/destination-image", async (req, res, next) => {
  try {
    const { destination } = req.query;
    const imageUrl = await fetchDestinationImage(destination || "Travel");
    return res.json({
      success: true,
      destination,
      imageUrl,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
