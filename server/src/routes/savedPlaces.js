import express from "express";
import { savedPlacesRepo } from "../db/repositories.js";

const router = express.Router();

/**
 * GET /api/places/saved
 */
router.get("/", (req, res, next) => {
  try {
    const { tripId, userId } = req.query;
    const places = savedPlacesRepo.getSavedPlaces(tripId, userId);
    return res.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/places/saved
 */
router.post("/", (req, res, next) => {
  try {
    const { tripId, userId, name, category, rating, address, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Place 'name' is required.",
      });
    }

    const saved = savedPlacesRepo.savePlace({
      tripId,
      userId,
      name,
      category,
      rating,
      address,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/places/saved/:id
 */
router.delete("/:id", (req, res, next) => {
  try {
    const success = savedPlacesRepo.deleteSavedPlace(req.params.id);
    if (!success) {
      return res.status(404).json({
        success: false,
        error: "Saved place not found.",
      });
    }

    return res.json({
      success: true,
      message: "Place removed from saved places.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
