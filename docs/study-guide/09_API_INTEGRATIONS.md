# TripWise AI — External API Integrations Guide

This document provides a comprehensive technical analysis of every third-party API used in TripWise AI. It details request parameters, response structures, authentication mechanisms, and fallback safeguards.

---

## 1. External APIs Summary Table

| Service / API | Provider | Purpose | Authentication | Cost / Quota | Offline / Failure Safeguard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** | Google AI Studio | Generates structured multi-day travel itineraries and concierge chat | API Key (`GEMINI_API_KEY`) in `.env` | Generous free tier (15 RPM) | Multi-model cascade (`1.5-flash`, `2.0-flash`, `1.5-pro`) + Curated Fallback Engine |
| **Open-Meteo API** | Open-Meteo GmbH | 7-day meteorological weather forecast & current conditions | **None (No API key needed!)** | 100% Free & Open-Source (up to 10,000 calls/day) | `getFallbackWeather()` mock generator |
| **Nominatim API** | OpenStreetMap Foundation | Worldwide city geocoding & coordinate resolution | **None** (Requires custom `User-Agent` header) | Free (Max 1 req/sec policy) | In-memory `Map` cache + `KNOWN_COORDINATES` dictionary |
| **Wikipedia REST API** | Wikimedia Foundation | Dynamic destination cover photo retrieval | **None** (Requires custom `User-Agent` header) | 100% Free & Open | Curated `CITY_FALLBACKS` dictionary with Unsplash photos |
| **Unsplash API** *(Optional)* | Unsplash Inc. | High-resolution photography search | Client ID (`UNSPLASH_ACCESS_KEY`) | 50 reqs/hr (Free tier) | Automatically falls back to Wikipedia & curated photo bank |

---

## 2. Open-Meteo Weather API Integration

### Why Open-Meteo?
Most commercial weather providers (OpenWeatherMap, WeatherAPI) require paid subscriptions or credit-card registration. **Open-Meteo** is an open-source weather API providing global forecasts using high-resolution weather models (ECMWF, GFS, DWD ICON) without requiring any API keys.

### Implementation in `server/src/services/weatherService.js`:
```javascript
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone=auto`;

const response = await fetch(weatherUrl);
const weatherData = await response.json();
```

### Data Transformations:
Open-Meteo returns parallel arrays for daily metrics (e.g. `time: ["2026-09-08", ...], temperature_2m_max: [28.4, ...]`).
The service reshapes this into a clean array of day objects for the React frontend:
```javascript
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const formattedForecast = weatherData.daily.time.map((dateStr, index) => ({
  date: dateStr,
  day: days[new Date(dateStr).getDay()],
  high: Math.round(weatherData.daily.temperature_2m_max[index]),
  low: Math.round(weatherData.daily.temperature_2m_min[index]),
  weatherCode: weatherData.daily.weather_code[index],
  precipitation: weatherData.daily.precipitation_probability_max[index] || 0,
}));
```

### Understanding WMO Weather Codes:
The `weatherCode` integer maps to standard World Meteorological Organization weather types:
- `0`: Clear Sky ☀️
- `1, 2, 3`: Mainly Clear / Partly Cloudy ⛅
- `45, 48`: Fog 🌫️
- `51, 53, 55`: Drizzle 🌦️
- `61, 63, 65`: Rain 🌧️
- `71, 73, 75`: Snow ❄️
- `95, 96`: Thunderstorm ⛈️

---

## 3. OpenStreetMap Nominatim Geocoding API

### What is Geocoding?
Geocoding is the computational process of converting human-readable address names (e.g., *"Athens, Greece"*) into geographic coordinates (Latitude: `37.9838`, Longitude: `23.7275`).

### Implementation in `server/src/routes/places.js`:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 2800); // 2.8s strict timeout

const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(searchStr)}`,
  {
    headers: {
      "User-Agent": "TripWiseAI/1.0 (city-search-service)",
      Accept: "application/json",
    },
    signal: controller.signal,
  }
);
clearTimeout(timeoutId);
```

### Critical Implementation Details:
1. **User-Agent Requirement:** The OpenStreetMap Nominatim Acceptable Use Policy strictly forbids requests without a valid, descriptive `User-Agent`. Requests sent with generic curl/fetch headers receive an HTTP 403 Forbidden. TripWise AI supplies `"TripWiseAI/1.0"`.
2. **AbortController Timeout:** If Nominatim's public server experiences latency, the `AbortController` terminates the connection after 2.8 seconds, preventing the user's dropdown from freezing.
3. **In-Memory Caching:** Both `weatherService.js` and `places.js` store past search queries in an in-memory `Map` (`citySearchCache`). Repeated queries for *"Athens"* return in 0 milliseconds without querying Nominatim again.

---

## 4. Destination Cover Image Resolution Pipeline

Destination cover photos are dynamically resolved through a 5-tier fallback cascade in `server/src/services/unsplashService.js`:

```
                       Request: fetchDestinationImage("Kyoto")
                                         │
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  TIER 1: Unsplash API (if Access Key set)     │
                 │  - Checks process.env.UNSPLASH_ACCESS_KEY     │
                 └───────────────────────┬───────────────────────┘
                                         │ (If key absent or fails)
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  TIER 2: Wikipedia Summary REST API           │
                 │  - GET /api/rest_v1/page/summary/Kyoto        │
                 │  - Free, official authentic landmark photos   │
                 └───────────────────────┬───────────────────────┘
                                         │ (If no photo returned)
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  TIER 3: Wikipedia Query Search API           │
                 │  - Searches for "Tourism in Kyoto"            │
                 └───────────────────────┬───────────────────────┘
                                         │ (If search fails)
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  TIER 4: Curated High-Res Photo Dictionary    │
                 │  - Pre-selected photos for 50+ global hubs    │
                 └───────────────────────┬───────────────────────┘
                                         │ (If unknown custom city)
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │  TIER 5: Default Iconic Travel Cover Image    │
                 └───────────────────────────────────────────────┘
```

### Why Query Wikipedia Before Generic Stock Photos?
Wikipedia's REST API (`https://en.wikipedia.org/api/rest_v1/page/summary/`) provides authentic, copyright-cleared, high-resolution photographs directly representing the actual destination (not generic unrelated stock photos). It requires no API keys, has high availability, and supports virtually every city on Earth.
