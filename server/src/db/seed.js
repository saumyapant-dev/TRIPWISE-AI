import { initSchema } from "./schema.js";
import { tripsRepo, usersRepo, savedPlacesRepo } from "./repositories.js";

export function runSeed() {
  console.log("[DB Seed] Starting database seeding...");
  initSchema();

  // 1. Seed Demo User
  let demoUser = usersRepo.findUserByEmail("demo@tripwise.ai");
  if (!demoUser) {
    demoUser = usersRepo.createUser({
      name: "Alex Traveler",
      email: "demo@tripwise.ai",
      passwordHash: "demo12345",
    });
    console.log("[DB Seed] Created demo user: demo@tripwise.ai");
  }

  // 2. Seed Kyoto Trip
  const kyotoId = "trip_seed_kyoto_odyssey";
  const kyotoTrip = tripsRepo.saveTrip({
    id: kyotoId,
    userId: demoUser.id,
    city: "San Francisco",
    destination: "Kyoto",
    budget: 2800,
    duration: 3,
    fromDate: "2026-10-10",
    toDate: "2026-10-13",
    travelStyle: "Culture",
    preferences: "Ancient shrines, matcha tea ceremonies, bamboo groves, serene zen gardens",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=700&fit=crop",
    tripData: {
      budgetBreakdown: {
        flights: 980,
        hotels: 850,
        food: 420,
        transport: 180,
        activities: 250,
        shopping: 120,
      },
      tripHighlights: {
        flight: "ANA Flight NH007 • SFO → KIX",
        hotel: "Ryokan Gion Sano Kyoto",
        topRated: "Fushimi Inari Taisha",
        activities: 12,
        restaurants: 6,
        nearbyPlaces: ["Arashiyama Bamboo Grove", "Gion Historic District", "Kinkaku-ji Golden Pavilion", "Nijo Castle"],
        travelTips: [
          { category: "Timing", title: "Early Morning Torii Walk", description: "Arrive at Fushimi Inari at 07:30 AM before tourist crowds gather." },
          { category: "Transport", title: "ICOCA Transit Card", description: "Buy an ICOCA card at Kyoto Station for seamless subway and city bus tapping." },
          { category: "Food", title: "Matcha Sweets in Uji", description: "Try authentic Uji green tea parfait and roasted hojicha in historic teahouses." },
          { category: "Photography", title: "Bamboo Grove Sunbeams", description: "Shoot through towering bamboo stalks in Arashiyama during early morning hours." },
        ],
      },
      days: [
        {
          day: 1,
          title: "Historic Shrines & Gion Evening",
          activities: [
            {
              time: "08:30 AM",
              title: "Walk the Thousand Torii at Fushimi Inari",
              type: "Sightseeing",
              location: "Fushimi Ward, Kyoto",
              description: "Hike through thousands of bright vermilion torii gates winding up sacred Mount Inari.",
              duration: "2.5 Hours",
              cost: "Free",
              rating: 4.9,
              bookingRequired: false,
              bestTime: "Early Morning",
              additionalDetails: "Arrive at sunrise for tranquility and uninterrupted photography.",
              aiRecommendation: "Wear sturdy footwear; the upper mountain path is steep but rewarding.",
            },
            {
              time: "12:30 PM",
              title: "Traditional Kaiseki Lunch in Gion",
              type: "Dining",
              location: "Gion District, Kyoto",
              description: "Delight in seasonal multi-course Japanese dining celebrating regional ingredients.",
              duration: "1.5 Hours",
              cost: "$45",
              rating: 4.8,
              bookingRequired: true,
              bestTime: "Afternoon",
              additionalDetails: "Vegetarian and pescatarian options available with advance request.",
              aiRecommendation: "Reserve 3 days ahead for courtyard garden views.",
            },
            {
              time: "03:00 PM",
              title: "Kiyomizu-dera Wooden Stage & City Overlook",
              type: "Sightseeing",
              location: "Higashiyama, Kyoto",
              description: "Marvel at panoramic Kyoto views from this cliffside UNESCO World Heritage wooden temple.",
              duration: "2 Hours",
              cost: "$4",
              rating: 4.9,
              bookingRequired: false,
              bestTime: "Late Afternoon",
              additionalDetails: "Drink from Otowa Waterfall fountains for health and longevity.",
              aiRecommendation: "Sunset lighting reflects magically across the hillside forest.",
            },
            {
              time: "07:30 PM",
              title: "Pontocho Alley Izakaya Dinner",
              type: "Dining",
              location: "Pontocho Alley, Kamogawa",
              description: "Atmospheric lantern-lit dining alongside the tranquil Kamogawa riverbanks.",
              duration: "2 Hours",
              cost: "$50",
              rating: 4.7,
              bookingRequired: false,
              bestTime: "Evening",
              additionalDetails: "Summer terraces (Kawayuka) provide riverside evening breeze.",
              aiRecommendation: "Try local Kyoto craft beer and charcoal-grilled yakitori skewers.",
            },
          ],
        },
        {
          day: 2,
          title: "Arashiyama Bamboo & Golden Pavilion",
          activities: [
            {
              time: "09:00 AM",
              title: "Arashiyama Bamboo Grove Walk",
              type: "Sightseeing",
              location: "Arashiyama, Western Kyoto",
              description: "Wander through the soaring green stalks of Kyoto's world-renowned bamboo forest.",
              duration: "2 Hours",
              cost: "Free",
              rating: 4.8,
              bookingRequired: false,
              bestTime: "Morning",
              additionalDetails: "Continue directly into Tenryu-ji temple garden behind the grove.",
              aiRecommendation: "Catch the rustling sound of the bamboo stalks in the morning wind.",
            },
            {
              time: "01:00 PM",
              title: "Matcha Tea Tasting & Soba Noodles",
              type: "Dining",
              location: "Saga-Toriimoto",
              description: "Taste freshly handmade buckwheat soba paired with ceremonial Uji matcha tea.",
              duration: "1 Hour",
              cost: "$22",
              rating: 4.7,
              bookingRequired: false,
              bestTime: "Afternoon",
              additionalDetails: "Charming traditional wooden townhouse setting.",
              aiRecommendation: "Order the matcha parfait for dessert.",
            },
            {
              time: "03:00 PM",
              title: "Kinkaku-ji (The Golden Pavilion)",
              type: "Sightseeing",
              location: "Kita Ward, Kyoto",
              description: "Witness the iconic gold-leaf covered Zen temple shimmering across Mirror Pond.",
              duration: "1.5 Hours",
              cost: "$5",
              rating: 4.9,
              bookingRequired: false,
              bestTime: "Afternoon",
              additionalDetails: "Follow designated one-way path through moss gardens.",
              aiRecommendation: "Best photography spot is from the shore across Kyoko-chi pond.",
            },
            {
              time: "07:00 PM",
              title: "Nishiki Market Culinary Tour",
              type: "Dining",
              location: "Nakagyo Ward, Kyoto",
              description: "Sample skewered wagyu, takoyaki, pickled vegetables, and mochi sweets.",
              duration: "2 Hours",
              cost: "$35",
              rating: 4.8,
              bookingRequired: false,
              bestTime: "Evening",
              additionalDetails: "Kyoto's 400-year-old food street known as 'Kyoto's Kitchen'.",
              aiRecommendation: "Carry cash for vendor stalls.",
            },
          ],
        },
        {
          day: 3,
          title: "Philosopher's Path & Zen Meditation",
          activities: [
            {
              time: "09:30 AM",
              title: "Philosopher's Path Canal Walk",
              type: "Sightseeing",
              location: "Sakyo Ward, Kyoto",
              description: "Scenic stone path following a cherry-tree lined canal between Ginkaku-ji and Nanzen-ji.",
              duration: "2 Hours",
              cost: "Free",
              rating: 4.7,
              bookingRequired: false,
              bestTime: "Morning",
              additionalDetails: "Stop by artisan pottery craft workshops along the route.",
              aiRecommendation: "Quiet morning hours offer pure meditative serenity.",
            },
            {
              time: "12:30 PM",
              title: "Shojin Ryori (Zen Buddhist Lunch)",
              type: "Dining",
              location: "Nanzen-ji Temple Grounds",
              description: "Authentic temple tofu and seasonal vegetarian gastronomy practiced by Zen monks.",
              duration: "1.5 Hours",
              cost: "$38",
              rating: 4.8,
              bookingRequired: true,
              bestTime: "Afternoon",
              additionalDetails: "Famous Yudofu (simmered tofu in kelp broth).",
              aiRecommendation: "Ask for a tatami table overlooking the Japanese rock garden.",
            },
            {
              time: "03:00 PM",
              title: "Nijo Castle Nightingales & Gardens",
              type: "Sightseeing",
              location: "Nijo Castle, Kyoto",
              description: "Explore the historic samurai shogun fortress with squeaking 'nightingale' alarm floors.",
              duration: "2 Hours",
              cost: "$10",
              rating: 4.8,
              bookingRequired: false,
              bestTime: "Afternoon",
              additionalDetails: "Audio guide available in multiple languages.",
              aiRecommendation: "Look closely at the gold leaf wall paintings inside Ninomaru Palace.",
            },
            {
              time: "07:30 PM",
              title: "Farewell Skyline Dinner overlooking Kyoto Tower",
              type: "Dining",
              location: "Shimogyo Ward, Kyoto",
              description: "Celebrate the conclusion of your trip with panoramic views and regional fusion cuisine.",
              duration: "2 Hours",
              cost: "$65",
              rating: 4.9,
              bookingRequired: true,
              bestTime: "Evening",
              additionalDetails: "Smart casual dress code.",
              aiRecommendation: "Toast with Kyoto plum wine as the city illuminates below.",
            },
          ],
        },
      ],
    },
  });

  // 3. Seed saved places for Kyoto
  savedPlacesRepo.savePlace({
    tripId: kyotoId,
    userId: demoUser.id,
    name: "Fushimi Inari Taisha",
    category: "Shrine",
    rating: 4.9,
    address: "68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200",
  });

  savedPlacesRepo.savePlace({
    tripId: kyotoId,
    userId: demoUser.id,
    name: "Gion Historic Quarter",
    category: "Historic District",
    rating: 4.8,
    address: "Higashiyama Ward, Kyoto",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200",
  });

  console.log("[DB Seed] Seeded 'Kyoto Cultural Odyssey' trip (ID: " + kyotoTrip.id + ")");
  console.log("[DB Seed] Seeding completed successfully!");
}

// Allow direct execution: node server/src/db/seed.js
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  runSeed();
}
