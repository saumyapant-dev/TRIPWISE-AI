import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useState, useEffect } from "react";

// This component recenters the map whenever the destination changes
function ChangeMapCenter({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 11);
  }, [center, map]);

  return null;
}

function InteractiveMap({ destination }) {
  const [center, setCenter] = useState([35.6762, 139.6503]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
        );

        const data = await response.json();

        if (data.length > 0) {
          setCenter([
            parseFloat(data[0].lat),
            parseFloat(data[0].lon),
          ]);
        }
      } catch (error) {
        console.error("Location not found", error);
      }
    };

    if (destination) {
      fetchCoordinates();
    }
  }, [destination]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden max-w-3xl shadow-sm">

      {/* Header */}

      <div className="p-4">
        <h2 className="text-lg font-bold">
          {destination} Interactive Map
        </h2>
      </div>

      {/* Map */}

      <div className="pb-6">
        <div className="overflow-hidden">

          <MapContainer
            center={center}
            zoom={11}
            style={{
              height: "350px",
              width: "100%",
            }}
          >

            <ChangeMapCenter center={center} />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={center}>
              <Popup>
                {destination}
              </Popup>
            </Marker>

          </MapContainer>

        </div>
      </div>

    </div>
  );
}

export default InteractiveMap;