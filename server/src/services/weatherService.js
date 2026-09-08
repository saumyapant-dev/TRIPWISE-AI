const geocodeCache = new Map();

// Built-in fallback coordinates for popular world destinations & regions
const KNOWN_COORDINATES = {
  seoul: { lat: 37.5665, lon: 126.978, displayName: "Seoul, South Korea", isRegion: false },
  "south korea": { lat: 37.5665, lon: 126.978, displayName: "Seoul, South Korea", isRegion: false },
  busan: { lat: 35.1796, lon: 129.0756, displayName: "Busan, South Korea", isRegion: false },
  kerala: { lat: 9.9312, lon: 76.2673, displayName: "Kerala, India", isRegion: true },
  chandigarh: { lat: 30.7333, lon: 76.7794, displayName: "Chandigarh, India", isRegion: false },
  gwalior: { lat: 26.2183, lon: 78.1828, displayName: "Gwalior, Madhya Pradesh, India", isRegion: false },
  bhopal: { lat: 23.2599, lon: 77.4126, displayName: "Bhopal, Madhya Pradesh, India", isRegion: false },
  indore: { lat: 22.7196, lon: 75.8577, displayName: "Indore, Madhya Pradesh, India", isRegion: false },
  lucknow: { lat: 26.8467, lon: 80.9462, displayName: "Lucknow, Uttar Pradesh, India", isRegion: false },
  kanpur: { lat: 26.4499, lon: 80.3319, displayName: "Kanpur, Uttar Pradesh, India", isRegion: false },
  amritsar: { lat: 31.634, lon: 74.8723, displayName: "Amritsar, Punjab, India", isRegion: false },
  udaipur: { lat: 24.5854, lon: 73.7125, displayName: "Udaipur, Rajasthan, India", isRegion: false },
  jodhpur: { lat: 26.2389, lon: 73.0243, displayName: "Jodhpur, Rajasthan, India", isRegion: false },
  varanasi: { lat: 25.3176, lon: 82.9739, displayName: "Varanasi, Uttar Pradesh, India", isRegion: false },
  hyderabad: { lat: 17.385, lon: 78.4867, displayName: "Hyderabad, Telangana, India", isRegion: false },
  bengaluru: { lat: 12.9716, lon: 77.5946, displayName: "Bengaluru, Karnataka, India", isRegion: false },
  bangalore: { lat: 12.9716, lon: 77.5946, displayName: "Bengaluru, Karnataka, India", isRegion: false },
  mysuru: { lat: 12.2958, lon: 76.6394, displayName: "Mysuru, Karnataka, India", isRegion: false },
  chennai: { lat: 13.0827, lon: 80.2707, displayName: "Chennai, Tamil Nadu, India", isRegion: false },
  ooty: { lat: 11.4102, lon: 76.695, displayName: "Ooty, Tamil Nadu, India", isRegion: false },
  kolkata: { lat: 22.5726, lon: 88.3639, displayName: "Kolkata, West Bengal, India", isRegion: false },
  darjeeling: { lat: 27.041, lon: 88.2663, displayName: "Darjeeling, West Bengal, India", isRegion: false },
  pune: { lat: 18.5204, lon: 73.8567, displayName: "Pune, Maharashtra, India", isRegion: false },
  ahmedabad: { lat: 23.0225, lon: 72.5714, displayName: "Ahmedabad, Gujarat, India", isRegion: false },
  surat: { lat: 21.1702, lon: 72.8311, displayName: "Surat, Gujarat, India", isRegion: false },
  rishikesh: { lat: 30.0869, lon: 78.2676, displayName: "Rishikesh, Uttarakhand, India", isRegion: false },
  dharamshala: { lat: 32.219, lon: 76.3234, displayName: "Dharamshala, Himachal Pradesh, India", isRegion: false },
  manali: { lat: 32.2432, lon: 77.1892, displayName: "Manali, Himachal Pradesh, India", isRegion: false },
  shimla: { lat: 31.1048, lon: 77.1734, displayName: "Shimla, Himachal Pradesh, India", isRegion: false },
  athens: { lat: 37.9838, lon: 23.7275, displayName: "Athens, Greece", isRegion: false },
  nairobi: { lat: -1.2921, lon: 36.8219, displayName: "Nairobi, Kenya", isRegion: false },
  kochi: { lat: 9.9312, lon: 76.2673, displayName: "Kochi, Kerala, India", isRegion: false },
  alleppey: { lat: 9.4981, lon: 76.3388, displayName: "Alleppey, Kerala, India", isRegion: false },
  alappuzha: { lat: 9.4981, lon: 76.3388, displayName: "Alappuzha, Kerala, India", isRegion: false },
  munnar: { lat: 10.0889, lon: 77.0595, displayName: "Munnar, Kerala, India", isRegion: false },
  varkala: { lat: 8.7379, lon: 76.7163, displayName: "Varkala, Kerala, India", isRegion: false },
  kashmir: { lat: 34.0837, lon: 74.7973, displayName: "Srinagar, Kashmir, India", isRegion: true },
  srinagar: { lat: 34.0837, lon: 74.7973, displayName: "Srinagar, Kashmir, India", isRegion: false },
  gulmarg: { lat: 34.0484, lon: 74.3805, displayName: "Gulmarg, Kashmir, India", isRegion: false },
  pahalgam: { lat: 34.0206, lon: 75.3267, displayName: "Pahalgam, Kashmir, India", isRegion: false },
  assam: { lat: 26.2006, lon: 92.9376, displayName: "Assam, India", isRegion: true },
  guwahati: { lat: 26.1445, lon: 91.7362, displayName: "Guwahati, Assam, India", isRegion: false },
  kaziranga: { lat: 26.5775, lon: 93.1711, displayName: "Kaziranga, Assam, India", isRegion: false },
  kyoto: { lat: 35.0116, lon: 135.7681, displayName: "Kyoto, Japan", isRegion: false },
  tokyo: { lat: 35.6762, lon: 139.6503, displayName: "Tokyo, Japan", isRegion: false },
  osaka: { lat: 34.6937, lon: 135.5023, displayName: "Osaka, Japan", isRegion: false },
  japan: { lat: 35.6762, lon: 139.6503, displayName: "Tokyo, Japan", isRegion: false },
  paris: { lat: 48.8566, lon: 2.3522, displayName: "Paris, France", isRegion: false },
  france: { lat: 48.8566, lon: 2.3522, displayName: "Paris, France", isRegion: false },
  london: { lat: 51.5074, lon: -0.1278, displayName: "London, UK", isRegion: false },
  "united kingdom": { lat: 51.5074, lon: -0.1278, displayName: "London, UK", isRegion: false },
  "new york": { lat: 40.7128, lon: -74.006, displayName: "New York, USA", isRegion: false },
  rome: { lat: 41.9028, lon: 12.4964, displayName: "Rome, Italy", isRegion: false },
  italy: { lat: 41.9028, lon: 12.4964, displayName: "Rome, Italy", isRegion: false },
  barcelona: { lat: 41.3851, lon: 2.1734, displayName: "Barcelona, Spain", isRegion: false },
  spain: { lat: 41.3851, lon: 2.1734, displayName: "Barcelona, Spain", isRegion: false },
  bali: { lat: -8.4095, lon: 115.1889, displayName: "Bali, Indonesia", isRegion: true },
  indonesia: { lat: -8.4095, lon: 115.1889, displayName: "Bali, Indonesia", isRegion: true },
  california: { lat: 36.7783, lon: -119.4179, displayName: "California, USA", isRegion: true },
  "san francisco": { lat: 37.7749, lon: -122.4194, displayName: "San Francisco, USA", isRegion: false },
  "los angeles": { lat: 34.0522, lon: -118.2437, displayName: "Los Angeles, USA", isRegion: false },
  florida: { lat: 27.6648, lon: -81.5158, displayName: "Florida, USA", isRegion: true },
  miami: { lat: 25.7617, lon: -80.1918, displayName: "Miami, Florida, USA", isRegion: false },
  hawaii: { lat: 19.8968, lon: -155.5828, displayName: "Hawaii, USA", isRegion: true },
  tuscany: { lat: 43.7711, lon: 11.2486, displayName: "Tuscany, Italy", isRegion: true },
  florence: { lat: 43.7696, lon: 11.2558, displayName: "Florence, Italy", isRegion: false },
  rajasthan: { lat: 27.0238, lon: 74.2179, displayName: "Rajasthan, India", isRegion: true },
  jaipur: { lat: 26.9124, lon: 75.7873, displayName: "Jaipur, Rajasthan, India", isRegion: false },
  goa: { lat: 15.2993, lon: 74.124, displayName: "Goa, India", isRegion: true },
  delhi: { lat: 28.6139, lon: 77.209, displayName: "New Delhi, India", isRegion: false },
  mumbai: { lat: 19.076, lon: 72.8777, displayName: "Mumbai, India", isRegion: false },
  amsterdam: { lat: 52.3676, lon: 4.9041, displayName: "Amsterdam, Netherlands", isRegion: false },
  netherlands: { lat: 52.3676, lon: 4.9041, displayName: "Amsterdam, Netherlands", isRegion: false },
  dubai: { lat: 25.2048, lon: 55.2708, displayName: "Dubai, UAE", isRegion: false },
  singapore: { lat: 1.3521, lon: 103.8198, displayName: "Singapore", isRegion: false },
  bangkok: { lat: 13.7563, lon: 100.5018, displayName: "Bangkok, Thailand", isRegion: false },
  thailand: { lat: 13.7563, lon: 100.5018, displayName: "Bangkok, Thailand", isRegion: false },
  sydney: { lat: -33.8688, lon: 151.2093, displayName: "Sydney, Australia", isRegion: false },
  australia: { lat: -33.8688, lon: 151.2093, displayName: "Sydney, Australia", isRegion: false },
  switzerland: { lat: 46.8182, lon: 8.2275, displayName: "Switzerland", isRegion: true },
  zurich: { lat: 47.3769, lon: 8.5417, displayName: "Zurich, Switzerland", isRegion: false },
  berlin: { lat: 52.52, lon: 13.405, displayName: "Berlin, Germany", isRegion: false },
  germany: { lat: 52.52, lon: 13.405, displayName: "Berlin, Germany", isRegion: false },
  toronto: { lat: 43.6532, lon: -79.3832, displayName: "Toronto, Canada", isRegion: false },
  vancouver: { lat: 49.2827, lon: -123.1207, displayName: "Vancouver, Canada", isRegion: false },
  canada: { lat: 43.6532, lon: -79.3832, displayName: "Toronto, Canada", isRegion: false },
  greece: { lat: 37.9838, lon: 23.7275, displayName: "Athens, Greece", isRegion: false },
  santorini: { lat: 36.3932, lon: 25.4615, displayName: "Santorini, Greece", isRegion: true },
  cairo: { lat: 30.0444, lon: 31.2357, displayName: "Cairo, Egypt", isRegion: false },
  egypt: { lat: 30.0444, lon: 31.2357, displayName: "Cairo, Egypt", isRegion: false },
};

export async function geocodeDestination(destination) {
  if (!destination || typeof destination !== "string") return null;

  const normalized = destination.trim().toLowerCase();
  if (geocodeCache.has(normalized)) {
    return geocodeCache.get(normalized);
  }

  // Check known coordinates first for instant, accurate resolution (exact or fuzzy)
  if (KNOWN_COORDINATES[normalized]) {
    const known = KNOWN_COORDINATES[normalized];
    geocodeCache.set(normalized, known);
    return known;
  }

  for (const [key, known] of Object.entries(KNOWN_COORDINATES)) {
    if (normalized.includes(key) || (key.includes(normalized) && normalized.length >= 4)) {
      geocodeCache.set(normalized, known);
      return known;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(destination)}`,
      {
        headers: {
          "User-Agent": "TripWiseAI/1.0 (travel-planner)",
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const topResult = data[0];
        const lat = parseFloat(topResult.lat);
        const lon = parseFloat(topResult.lon);

        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          const type = topResult.type || "";
          const addressType = topResult.addresstype || "";
          const isRegion =
            addressType === "state" ||
            addressType === "province" ||
            addressType === "region" ||
            addressType === "country" ||
            type === "administrative" ||
            type === "state" ||
            type === "region";

          const result = {
            lat,
            lon,
            displayName: topResult.display_name,
            type: topResult.type,
            addressType: topResult.addresstype,
            isRegion,
          };

          geocodeCache.set(normalized, result);
          return result;
        }
      }
    }
  } catch (err) {
    console.warn(`[Geocode] External lookup failed for "${destination}":`, err.message);
  }

  // Fuzzy match against known coordinates if available
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      geocodeCache.set(normalized, coords);
      return coords;
    }
  }

  return null;
}

export async function fetchWeather(destination, inputLat, inputLon) {
  let lat = inputLat;
  let lon = inputLon;

  if (!lat || !lon) {
    const coords = await geocodeDestination(destination);
    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
    } else {
      // Default to Tokyo coordinates if unable to geocode
      lat = 35.6762;
      lon = 139.6503;
    }
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`;
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const weatherData = await response.json();

    if (weatherData.error || !weatherData.current || !weatherData.daily) {
      throw new Error("Invalid weather data from provider");
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedForecast = weatherData.daily.time.map((dateStr, index) => ({
      date: dateStr,
      day: days[new Date(dateStr).getDay()],
      high: Math.round(weatherData.daily.temperature_2m_max[index]),
      low: Math.round(weatherData.daily.temperature_2m_min[index]),
      weatherCode: weatherData.daily.weather_code[index],
      precipitation: weatherData.daily.precipitation_probability_max[index] || 0,
    }));

    return {
      destination: destination || "Selected City",
      coordinates: { lat, lon },
      current: weatherData.current,
      forecast: formattedForecast,
    };
  } catch (error) {
    console.warn("Weather fetch error, providing sensible mock:", error.message);
    return getFallbackWeather(destination, lat, lon);
  }
}

function getFallbackWeather(destination, lat, lon) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  return {
    destination: destination || "Selected City",
    coordinates: { lat: lat || 35.6762, lon: lon || 139.6503 },
    current: {
      temperature_2m: 24,
      apparent_temperature: 25,
      relative_humidity_2m: 60,
      wind_speed_10m: 12,
      weather_code: 1, // Mainly Clear
      uv_index: 5,
    },
    forecast: Array.from({ length: 7 }).map((_, i) => ({
      day: days[(todayIndex + i) % 7],
      high: 26 - (i % 3),
      low: 18 - (i % 2),
      weatherCode: i === 2 ? 61 : 1,
      precipitation: i === 2 ? 65 : 10,
    })),
  };
}
