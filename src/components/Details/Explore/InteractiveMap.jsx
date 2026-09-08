import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect, useMemo } from "react";
import { MapPin, Navigation, Compass, AlertCircle, Sparkles, ExternalLink, Star } from "lucide-react";
import { getGeocode, getNearbyPlaces } from "../../../services/api.js";

// Built-in coordinate lookup for instant, zero-delay map initialization
const QUICK_COORDS = {
  seoul: [37.5665, 126.978],
  "south korea": [37.5665, 126.978],
  kerala: [9.9312, 76.2673],
  chandigarh: [30.7333, 76.7794],
  gwalior: [26.2183, 78.1828],
  bhopal: [23.2599, 77.4126],
  indore: [22.7196, 75.8577],
  lucknow: [26.8467, 80.9462],
  kanpur: [26.4499, 80.3319],
  amritsar: [31.634, 74.8723],
  udaipur: [24.5854, 73.7125],
  jodhpur: [26.2389, 73.0243],
  varanasi: [25.3176, 82.9739],
  hyderabad: [17.385, 78.4867],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mysuru: [12.2958, 76.6394],
  chennai: [13.0827, 80.2707],
  ooty: [11.4102, 76.695],
  kolkata: [22.5726, 88.3639],
  darjeeling: [27.041, 88.2663],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  rishikesh: [30.0869, 78.2676],
  dharamshala: [32.219, 76.3234],
  manali: [32.2432, 77.1892],
  shimla: [31.1048, 77.1734],
  athens: [37.9838, 23.7275],
  nairobi: [-1.2921, 36.8219],
  kochi: [9.9312, 76.2673],
  cochin: [9.9312, 76.2673],
  alleppey: [9.4981, 76.3388],
  alappuzha: [9.4981, 76.3388],
  munnar: [10.0889, 77.0595],
  varkala: [8.7379, 76.7163],
  kashmir: [34.0837, 74.7973],
  srinagar: [34.0837, 74.7973],
  gulmarg: [34.0484, 74.3805],
  pahalgam: [34.0206, 75.3267],
  assam: [26.2006, 92.9376],
  guwahati: [26.1445, 91.7362],
  kaziranga: [26.5775, 93.1711],
  kyoto: [35.0116, 135.7681],
  tokyo: [35.6762, 139.6503],
  osaka: [34.6937, 135.5023],
  japan: [35.6762, 139.6503],
  paris: [48.8566, 2.3522],
  france: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  uk: [51.5074, -0.1278],
  "new york": [40.7128, -74.006],
  nyc: [40.7128, -74.006],
  rome: [41.9028, 12.4964],
  italy: [41.9028, 12.4964],
  barcelona: [41.3851, 2.1734],
  spain: [41.3851, 2.1734],
  bali: [-8.4095, 115.1889],
  indonesia: [-8.4095, 115.1889],
  california: [36.7783, -119.4179],
  "san francisco": [37.7749, -122.4194],
  "los angeles": [34.0522, -118.2437],
  dubai: [25.2048, 55.2708],
  singapore: [1.3521, 103.8198],
  bangkok: [13.7563, 100.5018],
  thailand: [13.7563, 100.5018],
  sydney: [-33.8688, 151.2093],
  australia: [-33.8688, 151.2093],
  jaipur: [26.9124, 75.7873],
  goa: [15.2993, 74.124],
  delhi: [28.6139, 77.209],
  mumbai: [19.076, 72.8777],
  switzerland: [46.8182, 8.2275],
  santorini: [36.3932, 25.4615],
  cairo: [30.0444, 31.2357],
};

function getQuickCoords(dest) {
  if (!dest || typeof dest !== "string") return null;
  const norm = dest.trim().toLowerCase();
  if (QUICK_COORDS[norm]) return QUICK_COORDS[norm];
  for (const [key, coords] of Object.entries(QUICK_COORDS)) {
    if (norm.includes(key) || key.includes(norm)) return coords;
  }
  return null;
}

// Custom Marker Icons created via L.divIcon to eliminate missing Vite asset 404s
const createDestinationIcon = (name) => {
  return L.divIcon({
    className: "destination-pin-wrapper",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="background: #0f172a; color: #ffffff; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid #ffffff; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
          <span>📍</span> <span>${name || "Destination"}</span>
        </div>
        <div style="width: 26px; height: 26px; background: #6366f1; border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99,102,241,0.5);">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 7px solid #6366f1; margin-top: -1px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

const createAttractionIcon = (index, category) => {
  const cat = (category || "").toLowerCase();
  let bg = "#ef4444"; // red default (Sightseeing)
  if (cat.includes("park") || cat.includes("nature")) bg = "#10b981"; // emerald
  else if (cat.includes("historic") || cat.includes("landmark")) bg = "#f59e0b"; // amber
  else if (cat.includes("museum") || cat.includes("culture")) bg = "#8b5cf6"; // purple

  return L.divIcon({
    className: "attraction-pin-wrapper",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); pointer-events: auto;">
        <div style="width: 26px; height: 26px; background: ${bg}; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; font-weight: 800; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
          ${index + 1}
        </div>
        <div style="width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid ${bg}; margin-top: -1px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Component that dynamically pans and centers the map whenever the center coordinates change
function ChangeMapCenter({ center, zoom = 12 }) {
  const map = useMap();

  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);

  return null;
}

function InteractiveMap({ destination, focusedCoords, initialCoords }) {
  const fastCoords = useMemo(() => getQuickCoords(destination), [destination]);
  const [serverCenter, setServerCenter] = useState(null);
  const [resolvedName, setResolvedName] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coordsUnavailable, setCoordsUnavailable] = useState(false);

  // Active center prefers explicitly focused coords, then initialCoords, then server geocode, then fast dictionary
  const center = (focusedCoords && Array.isArray(focusedCoords) && focusedCoords.length === 2)
    ? focusedCoords
    : (initialCoords && Array.isArray(initialCoords) && initialCoords.length === 2 && !isNaN(initialCoords[0]))
    ? initialCoords
    : (serverCenter || fastCoords || [20.5937, 78.9629]);

  useEffect(() => {
    let isMounted = true;

    const loadMapData = async () => {
      if (!destination) return;
      setLoading(true);

      try {
        // 1. Fetch Geocode
        const geoPromise = getGeocode(destination);
        // 2. Fetch Nearby Places
        const placesPromise = getNearbyPlaces(destination);

        const [geoRes, placesRes] = await Promise.allSettled([geoPromise, placesPromise]);

        if (!isMounted) return;

        // Handle geocoding response
        if (geoRes.status === "fulfilled" && geoRes.value?.success && geoRes.value?.coordinates) {
          const { lat, lon } = geoRes.value.coordinates;
          if (!isNaN(lat) && !isNaN(lon)) {
            setServerCenter([lat, lon]);
            setCoordsUnavailable(false);
            if (geoRes.value.displayName) {
              setResolvedName(geoRes.value.displayName.split(",")[0]);
            }
          }
        } else if (!fastCoords) {
          // If geocoding failed and we have no quick coords fallback
          setCoordsUnavailable(true);
        }

        // Handle nearby places response
        if (placesRes.status === "fulfilled" && placesRes.value?.success && Array.isArray(placesRes.value.data)) {
          const validPlaces = placesRes.value.data.filter(
            (p) => p.coordinates && !isNaN(p.coordinates.lat) && !isNaN(p.coordinates.lon)
          );
          setNearbyPlaces(validPlaces);
        } else {
          setNearbyPlaces([]);
        }
      } catch (err) {
        console.warn("[InteractiveMap] Notice:", err.message);
        if (!fastCoords) setCoordsUnavailable(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMapData();

    return () => {
      isMounted = false;
    };
  }, [destination, fastCoords]);

  // Graceful edge case: Coordinates genuinely unavailable
  if (coordsUnavailable && !center) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-3xl shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-base font-bold text-gray-900">Map Preview Unavailable</h3>
        <p className="text-sm text-gray-500 mt-1">
          Geographic coordinates could not be resolved for &ldquo;{destination}&rdquo;. Please verify the destination name.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden max-w-3xl shadow-sm">
      {/* Header */}
      <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Compass size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">
              {destination} Interactive Map
            </h2>
            <p className="text-xs text-gray-500">
              {nearbyPlaces.length > 0
                ? `Exploring ${nearbyPlaces.length} points of interest • OpenStreetMap`
                : "Interactive exploration map • OpenStreetMap"}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full animate-pulse">
            <Sparkles size={12} />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Map Body */}
      <div className="relative">
        <MapContainer
          key={`${center[0]}_${center[1]}_${destination}`}
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          style={{
            height: "380px",
            width: "100%",
          }}
        >
          <ChangeMapCenter center={center} zoom={focusedCoords ? 14 : 12} />

          {/* Modern CartoDB Voyager Tiles - Sleek, high-definition, 100% free, no API key required */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Destination Center Marker */}
          <Marker position={center} icon={createDestinationIcon(resolvedName || destination)}>
            <Popup className="destination-popup">
              <div className="p-1 max-w-[200px]">
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 mb-0.5">
                  <MapPin size={12} />
                  <span>Trip Destination</span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{resolvedName || destination}</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Lat: {center[0]?.toFixed(3)}, Lon: {center[1]?.toFixed(3)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Nearby Points of Interest Markers */}
          {nearbyPlaces.map((place, idx) => (
            <Marker
              key={place.id || `place_${idx}`}
              position={[place.coordinates.lat, place.coordinates.lon]}
              icon={createAttractionIcon(idx, place.category || place.type)}
            >
              <Popup className="place-popup">
                <div className="p-1 max-w-[220px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                      {place.type || place.category || "Attraction"}
                    </span>
                    {place.rating && (
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {place.rating}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">
                    {place.name}
                  </h4>
                  {place.distance && (
                    <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mb-1">
                      <Navigation size={10} />
                      {place.distance} away
                    </p>
                  )}
                  {place.description && (
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-snug">
                      {place.description}
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${place.name} ${destination}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    <span>Directions</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend Footer */}
      <div className="p-3 px-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
            <span className="font-medium text-gray-700">Destination</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Nature & Parks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Historic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Culture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            <span>Sightseeing</span>
          </div>
        </div>

        <span className="text-[11px] text-gray-400">Click markers for details</span>
      </div>
    </div>
  );
}

export default InteractiveMap;