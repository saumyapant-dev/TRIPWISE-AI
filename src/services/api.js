/**
 * TripWise AI - Centralized Backend API Client
 *
 * Directs all external and AI operations to our secure Node/Express backend with SQLite persistence.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`[API Client] Error on ${endpoint}:`, err.message);
    throw err;
  }
}

/**
 * Generate itinerary with Gemini via backend and persist to SQLite
 */
export async function generateTrip(params) {
  return request("/trips/generate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/**
 * Get all saved trips from SQLite database
 */
export async function getTrips(userId = null) {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return request(`/trips${query}`);
}

/**
 * Get single trip by ID with all joined days, activities, budget, and highlights
 */
export async function getTripById(id) {
  return request(`/trips/${id}`);
}

/**
 * Save trip record to database
 */
export async function saveTrip(tripData) {
  return request("/trips", {
    method: "POST",
    body: JSON.stringify(tripData),
  });
}

/**
 * Update / Edit an existing trip in SQLite database
 */
export async function updateTrip(id, tripUpdates) {
  return request(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(tripUpdates),
  });
}

/**
 * Delete trip by ID from SQLite database
 */
export async function deleteTrip(id) {
  return request(`/trips/${id}`, {
    method: "DELETE",
  });
}

/**
 * User signup
 */
export async function signup(userData) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

/**
 * User login
 */
export async function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/**
 * Get weather forecast for destination
 */
export async function getWeather(destination, lat, lon) {
  const params = new URLSearchParams();
  if (destination) params.set("destination", destination);
  if (lat) params.set("lat", lat);
  if (lon) params.set("lon", lon);

  return request(`/weather?${params.toString()}`);
}

/**
 * Get curated places (attractions / restaurants) via Google Places API on backend
 */
export async function getCuratedPlaces(destination, type = "tourist_attraction") {
  const params = new URLSearchParams({
    destination,
    type,
  });

  return request(`/places/curated?${params.toString()}`);
}

/**
 * Get nearby points of interest
 */
export async function getNearbyPlaces(destination) {
  const params = new URLSearchParams({
    destination,
  });

  return request(`/places/nearby?${params.toString()}`);
}

/**
 * Geocode query to coordinates safely through backend
 */
export async function getGeocode(query) {
  const params = new URLSearchParams({
    query,
  });

  return request(`/places/geocode?${params.toString()}`);
}

/**
 * Chat with AI travel concierge
 */
export async function chatWithAI({ destination, tripContext, question }) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({ destination, tripContext, question }),
  });
}

/**
 * Save / Bookmark a place to a trip
 */
export async function savePlace(placeData) {
  return request("/places/saved", {
    method: "POST",
    body: JSON.stringify(placeData),
  });
}

/**
 * Get bookmarked places for a trip
 */
export async function getSavedPlaces(tripId, userId) {
  const params = new URLSearchParams();
  if (tripId) params.set("tripId", tripId);
  if (userId) params.set("userId", userId);
  return request(`/places/saved?${params.toString()}`);
}

/**
 * Remove a bookmarked place
 */
export async function deleteSavedPlace(id) {
  return request(`/places/saved/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fetch dynamic destination hero image from backend service
 */
export async function getDestinationImage(destination) {
  const params = new URLSearchParams({ destination });
  return request(`/places/destination-image?${params.toString()}`);
}
