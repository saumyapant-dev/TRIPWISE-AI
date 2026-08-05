import { useState, useEffect } from "react";

import {
  Eye,
  Landmark,
  Trees,
  Send,
  ChevronRight,
} from "lucide-react";



function NearbyPoints({ destination }) {
  const [places, setPlaces] = useState([]);

  const getIcon = (category) => {
    const type = category?.toLowerCase() || "";

    if (
      type.includes("museum") ||
      type.includes("gallery") ||
      type.includes("viewpoint")
    )
      return Eye;

    if (
      type.includes("temple") ||
      type.includes("shrine") ||
      type.includes("church")
    )
      return Landmark;

    if (
      type.includes("park") ||
      type.includes("garden") ||
      type.includes("forest")
    )
      return Trees;

    return Send;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(1);
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {

        // Get coordinates
        const locationResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${destination}`
        );

        const locationData = await locationResponse.json();

        if (!locationData.length) return;

        const lat = locationData[0].lat;
        const lon = locationData[0].lon;

        // Overpass API
        const overpassQuery = `
      [out:json];
      (
        node(around:5000,${lat},${lon})["tourism"="attraction"];
        node(around:5000,${lat},${lon})["tourism"="museum"];
        node(around:5000,${lat},${lon})["leisure"="park"];
        node(around:5000,${lat},${lon})["historic"];
      );
      out body;
      `;

        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: overpassQuery,
          }
        );

        const data = await response.json();

        const formatted = data.elements
          .filter((item) => item.tags?.name)
          .slice(0, 6)
          .map((item) => ({
            name: item.tags.name,
            type:
              item.tags.tourism ||
              item.tags.leisure ||
              item.tags.historic ||
              "Attraction",

            distance:
              calculateDistance(
                Number(lat),
                Number(lon),
                Number(item.lat),
                Number(item.lon)
              ) + " km",
          }));

        setPlaces(formatted);

      } catch (err) {
        console.log(err);
      }
    };

    if (destination) {
      fetchPlaces();
    }

  }, [destination]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200 px-6 py-4 max-w-3xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">
        Nearby Points of Interest
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {places.map((place, index) => {
          const Icon = getIcon(place.type);

          return (
            <div
              key={index}
              className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between hover:bg-gray-150 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <Icon size={16} />
                </div>

                <div>
                  <h3 className="font-semibold text-sm">
                    {place.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {place.type} · {place.distance}
                  </p>
                </div>
              </div>

              <ChevronRight
                size={18}
                className="text-gray-400"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NearbyPoints;