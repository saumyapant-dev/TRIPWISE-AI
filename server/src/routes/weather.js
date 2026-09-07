import express from "express";
import { fetchWeather } from "../services/weatherService.js";

const router = express.Router();

/**
 * GET /api/weather
 * Query: ?destination=Tokyo&lat=35.67&lon=139.65
 */
router.get("/", async (req, res, next) => {
  try {
    const { destination, lat, lon } = req.query;

    if (!destination && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'destination' or ('lat' and 'lon') is required.",
      });
    }

    const weather = await fetchWeather(
      destination,
      lat ? parseFloat(lat) : null,
      lon ? parseFloat(lon) : null
    );

    return res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
