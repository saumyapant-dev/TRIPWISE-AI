import express from "express";
import { fetchCuratedPlaces, fetchNearbyPlaces } from "../services/placesService.js";
import { geocodeDestination } from "../services/weatherService.js";
import { fetchDestinationImage } from "../services/unsplashService.js";
import { DESTINATIONS_DATA, searchLocalDestinations } from "../data/destinations.js";

const router = express.Router();
const citySearchCache = new Map();

/**
 * GET /api/places/search-cities
 * Query params: ?q=Chandigarh&country=India
 * Searches cities globally using OpenStreetMap Nominatim with local instant fallback
 */
router.get("/search-cities", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const country = (req.query.country || "").trim();

    if (!q && (!country || country.toLowerCase() === "all")) {
      return res.json({
        success: true,
        source: "local",
        data: DESTINATIONS_DATA.slice(0, 30),
      });
    }

    const cacheKey = `${q.toLowerCase()}__${country.toLowerCase()}`;
    if (citySearchCache.has(cacheKey)) {
      return res.json({
        success: true,
        source: "cache",
        data: citySearchCache.get(cacheKey),
      });
    }

    // 1. Get local matching results first
    const localMatches = searchLocalDestinations(q, country);

    // 2. Fetch external Nominatim global cities if query is at least 2 chars
    let externalResults = [];
    if (q.length >= 2) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2800);

        let searchStr = q;
        if (country && country.toLowerCase() !== "all") {
          searchStr += `, ${country}`;
        }

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(
            searchStr
          )}`,
          {
            headers: {
              "User-Agent": "TripWiseAI/1.0 (city-search-service)",
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const rawData = await response.json();
          if (Array.isArray(rawData)) {
            externalResults = rawData
              .filter((item) => {
                const lat = parseFloat(item.lat);
                const lon = parseFloat(item.lon);
                return !isNaN(lat) && !isNaN(lon);
              })
              .map((item) => {
                const addr = item.address || {};
                const cityName =
                  addr.city ||
                  addr.town ||
                  addr.municipality ||
                  addr.village ||
                  item.name ||
                  item.display_name.split(",")[0];

                const regionName =
                  addr.state ||
                  addr.province ||
                  addr.state_district ||
                  addr.county ||
                  addr.region ||
                  "";

                const countryName = addr.country || "";

                return {
                  id: `ext_${item.osm_id || Math.random().toString(36).substring(7)}`,
                  city: cityName,
                  region: regionName,
                  country: countryName,
                  coordinates: {
                    lat: parseFloat(item.lat),
                    lon: parseFloat(item.lon),
                  },
                  popular: false,
                };
              });
          }
        }
      } catch {
        // Fallback gracefully to local matches if remote fails/times out
      }
    }

    // 3. Merge & Deduplicate (Local matches prioritized)
    const combined = [...localMatches];
    const seen = new Set(
      localMatches.map((d) => `${d.city.toLowerCase()}_${d.country.toLowerCase()}`)
    );

    for (const ext of externalResults) {
      const key = `${ext.city.toLowerCase()}_${ext.country.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(ext);
      }
    }

    // Cache the merged results
    citySearchCache.set(cacheKey, combined.slice(0, 25));

    return res.json({
      success: true,
      source: externalResults.length > 0 ? "live_merged" : "local_fallback",
      count: combined.length,
      data: combined.slice(0, 25),
    });
  } catch {
    const fallback = searchLocalDestinations(req.query.q || "", req.query.country || "");
    return res.json({
      success: true,
      source: "fallback_error",
      count: fallback.length,
      data: fallback.slice(0, 25),
    });
  }
});

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
