import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "trips.json");

// Ensure data file exists
function readTripsFromFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]), "utf-8");
      return [];
    }
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error("Error reading trips store:", error);
    return [];
  }
}

function writeTripsToFile(trips) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(trips, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing trips store:", error);
  }
}

export const tripsStore = {
  getAll() {
    return readTripsFromFile();
  },

  getById(id) {
    const trips = readTripsFromFile();
    return trips.find((t) => t.id === id) || null;
  },

  save(tripData) {
    const trips = readTripsFromFile();
    const id = tripData.id || `trip_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newTrip = {
      ...tripData,
      id,
      createdAt: tripData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = trips.findIndex((t) => t.id === id);
    if (existingIndex >= 0) {
      trips[existingIndex] = newTrip;
    } else {
      trips.unshift(newTrip);
    }

    writeTripsToFile(trips);
    return newTrip;
  },

  delete(id) {
    const trips = readTripsFromFile();
    const filtered = trips.filter((t) => t.id !== id);
    writeTripsToFile(filtered);
    return filtered.length !== trips.length;
  },
};
