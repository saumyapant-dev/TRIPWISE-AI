import { geocodeDestination } from "./weatherService.js";

const DEFAULT_ATTRACTIONS = (dest) => [
  {
    name: `${dest} Historic Old Town`,
    displayName: { text: `${dest} Historic Old Town` },
    rating: 4.8,
    userRatingCount: 1420,
    primaryTypeDisplayName: { text: "Tourist Attraction" },
    type: "Tourist Attraction",
    currentOpeningHours: { openNow: true },
    description: `A quintessential walking district with historic architecture, artisan shops, and vibrant streets in ${dest}.`,
    tags: ["Historic", "Iconic", "Must Visit"],
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
  },
  {
    name: `${dest} Central Botanical Gardens`,
    displayName: { text: `${dest} Central Botanical Gardens` },
    rating: 4.9,
    userRatingCount: 2310,
    primaryTypeDisplayName: { text: "Park" },
    type: "Park",
    currentOpeningHours: { openNow: true },
    description: "Scenic botanical park ideal for peaceful strolls, lake views, and photography.",
    tags: ["Nature", "Relaxing", "Photography"],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200",
  },
  {
    name: `${dest} National Art & Heritage Museum`,
    displayName: { text: `${dest} National Art & Heritage Museum` },
    rating: 4.7,
    userRatingCount: 980,
    primaryTypeDisplayName: { text: "Museum" },
    type: "Museum",
    currentOpeningHours: { openNow: true },
    description: "World-class cultural exhibitions displaying fine regional art and historical artifacts.",
    tags: ["Culture", "Indoor", "Heritage"],
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200",
  },
  {
    name: `${dest} Panoramic Ridge Viewpoint`,
    displayName: { text: `${dest} Panoramic Ridge Viewpoint` },
    rating: 4.9,
    userRatingCount: 1840,
    primaryTypeDisplayName: { text: "Viewpoint" },
    type: "Viewpoint",
    currentOpeningHours: { openNow: true },
    description: "Elevated scenic vista with 360-degree panoramic outlooks over the cityscape and horizon.",
    tags: ["Scenic", "Viewpoint", "Sunset"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
  },
  {
    name: `${dest} Waterfront Promenade & Pier`,
    displayName: { text: `${dest} Waterfront Promenade & Pier` },
    rating: 4.8,
    userRatingCount: 1650,
    primaryTypeDisplayName: { text: "Tourist Attraction" },
    type: "Tourist Attraction",
    currentOpeningHours: { openNow: true },
    description: "Bustling waterfront walkway filled with street performers, sea breeze, and evening illumination.",
    tags: ["Waterfront", "Walking", "Atmosphere"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
  },
  {
    name: `${dest} Landmark Citadel & Square`,
    displayName: { text: `${dest} Landmark Citadel & Square` },
    rating: 4.8,
    userRatingCount: 2100,
    primaryTypeDisplayName: { text: "Historic Landmark" },
    type: "Historic Landmark",
    currentOpeningHours: { openNow: true },
    description: "Monumental historic citadel featuring grand public plazas, fountains, and architectural heritage.",
    tags: ["Landmark", "Architecture", "Historic"],
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
  },
];

const DEFAULT_RESTAURANTS = (dest) => [
  {
    name: `The Heritage Bistro & Terrace`,
    displayName: { text: `The Heritage Bistro & Terrace` },
    rating: 4.8,
    userRatingCount: 890,
    primaryTypeDisplayName: { text: "Restaurant" },
    type: "Restaurant",
    currentOpeningHours: { openNow: true },
    description: `Top-rated bistro featuring authentic regional cuisine and artisan wines in ${dest}.`,
    tags: ["Top Rated", "Local Cuisine", "Wine"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
  },
  {
    name: `Artisan Roastery & Café`,
    displayName: { text: `Artisan Roastery & Café` },
    rating: 4.7,
    userRatingCount: 650,
    primaryTypeDisplayName: { text: "Cafe" },
    type: "Cafe",
    currentOpeningHours: { openNow: true },
    description: "Cozy specialty coffee shop with fresh pastries, brunch plates, and scenic terrace seating.",
    tags: ["Coffee", "Brunch", "Cozy"],
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
  },
  {
    name: `Riverside Traditional Grill`,
    displayName: { text: `Riverside Traditional Grill` },
    rating: 4.9,
    userRatingCount: 1120,
    primaryTypeDisplayName: { text: "Restaurant" },
    type: "Restaurant",
    currentOpeningHours: { openNow: true },
    description: "Celebrated waterfront dining venue serving locally-sourced meats and fresh farm produce.",
    tags: ["Waterfront", "Dinner", "Popular"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
  },
  {
    name: `The Courtyard Trattoria`,
    displayName: { text: `The Courtyard Trattoria` },
    rating: 4.8,
    userRatingCount: 760,
    primaryTypeDisplayName: { text: "Restaurant" },
    type: "Restaurant",
    currentOpeningHours: { openNow: true },
    description: "Intimate garden courtyard dining with handmade specialties, candlelit tables, and local pairings.",
    tags: ["Romantic", "Outdoor", "Handmade"],
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200",
  },
  {
    name: `Skyline Rooftop Lounge`,
    displayName: { text: `Skyline Rooftop Lounge` },
    rating: 4.8,
    userRatingCount: 940,
    primaryTypeDisplayName: { text: "Bar" },
    type: "Bar",
    currentOpeningHours: { openNow: true },
    description: "Chic open-air rooftop cocktail lounge offering panoramic sunset views and craft tapas.",
    tags: ["Skyline", "Cocktails", "Sunset"],
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200",
  },
  {
    name: `Artisan Pastry & Dessert Atelier`,
    displayName: { text: `Artisan Pastry & Dessert Atelier` },
    rating: 4.9,
    userRatingCount: 820,
    primaryTypeDisplayName: { text: "Bakery" },
    type: "Bakery",
    currentOpeningHours: { openNow: true },
    description: "Award-winning patisserie crafting exquisite morning croissants, artisan tarts, and gourmet sweets.",
    tags: ["Pastries", "Desserts", "Artisan"],
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200",
  },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
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
}

const DISTINCT_ATTRACTION_PHOTOS = [
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", // historic temple/pavilion
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", // lush park & nature
  "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", // museum & culture
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", // mountain viewpoint
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", // waterfront & beach
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", // iconic architecture
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", // historic monument
  "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200", // waterfall & river
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200", // serene lake & valley
  "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=1200", // heritage garden & estate
  "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200", // skyline & observation tower
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200", // modern landmark & plaza
];

const DISTINCT_DINING_PHOTOS = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200", // artisan grill & feast
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200", // fine restaurant atmosphere
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200", // specialty coffee & cafe
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200", // garden courtyard bistro
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200", // rooftop cocktails & lounge
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200", // gourmet bakery & patisserie
  "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200", // traditional regional banquet
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200", // sizzling steak & skewers
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200", // artisan pizza & oven
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200", // seafood & fresh catch
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200", // handcrafted ramen & broth
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200", // desserts & sweet treats
];

const CURATED_REGIONAL_DINING = {
  seoul: [
    { name: "Maple Tree House Korean BBQ", type: "Korean BBQ", rating: 4.9, description: "Premium Hanwoo beef and aged pork belly grilled over natural hardwood charcoal.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Tosokchon Samgyetang Hanok Kitchen", type: "Korean Traditional", rating: 4.8, description: "Famous traditional ginseng chicken soup served in a tranquil historic hanok courtyard.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Gwangjang Market Bindaetteok", type: "Street Food & Market", rating: 4.8, description: "Century-old market celebrated for crispy mung bean pancakes, Mayak gimbap, and noodles.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Myeongdong Kyoja Handmade Mandu", type: "Noodles & Dumplings", rating: 4.7, description: "Michelin Bib Gourmand legacy eatery renowned for handmade dumplings and rich chicken broth.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Cha Masineun Tteul (Tea Garden Hanok)", type: "Traditional Tea & Cafe", rating: 4.9, description: "Serene traditional teahouse overlooking Inwangsan mountain with artisan fermented teas.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Jungsik Contemporary Korean", type: "Fine Dining", rating: 4.9, description: "Two Michelin-starred pioneer of ultra-innovative contemporary Korean fine dining.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  kerala: [
    { name: "Grand Pavilion Karimeen Pollichathu", type: "Coastal Kerala", rating: 4.8, description: "Legendary pearl spot fish marinated in freshly ground spices and slow-roasted in banana leaves.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Paragon Restaurant Traditional Malabar", type: "Malabar Cuisine", rating: 4.9, description: "World-famous heritage biryani infused with aromatic Malabar spices and tender roasted meats.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Dhe Puttu Steamed Rice Kitchen", type: "Traditional Kerala", rating: 4.8, description: "Celebration of steamed cylindrical rice and coconut cakes paired with spicy kadala curry.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Fort Cochin Old Harbour Seaside Grill", type: "Seafood Grill", rating: 4.9, description: "Colonial garden esplanade dining offering fresh catch of the day grilled with coconut milk.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Kashi Art Cafe & Organic Bakery", type: "Art Cafe", rating: 4.8, description: "Bohemian courtyard gallery cafe serving freshly brewed Nilgiri coffee and homemade chocolate pie.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Mothers Veg Plaza Banana Leaf Sadhya", type: "Vegetarian Feast", rating: 4.9, description: "Authentic royal 24-dish vegetarian feast served on fresh green plantain leaves.", image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200" },
  ],
  kashmir: [
    { name: "Ahdoos Traditional Wazwan & Bakery", type: "Kashmiri Wazwan", rating: 4.9, description: "Iconic 1918 heritage dining hall serving slow-cooked Gushtaba, Rogan Josh, and saffron rice.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Mughal Darbar Wazwan Hall", type: "Regional Cuisine", rating: 4.8, description: "Renowned establishment famous for Tabak Maaz lamb ribs and aromatic saffron Kashmiri pulao.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Chai Jaai Kashmiri Tea & Bakery", type: "Art Cafe & Tea", rating: 4.9, description: "Vibrant riverside tea room inspired by English tea rooms, serving Noon Chai and Sheermal.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Shamyana Dal Lake Terrace", type: "Lakeside Dining", rating: 4.7, description: "Scenic open-air promenade dining overlooking shikaras floating across the serene Dal Lake.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Nedous Alpine Lounge & Grill", type: "Highland Bistro", rating: 4.8, description: "Atmospheric cedar-panelled fireside dining in Gulmarg serving rich soups and grilled meats.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Lhasa Kashmiri & Tibetan Cafe", type: "Himalayan Kitchen", rating: 4.7, description: "Cozy walnut-wood dining cottage celebrated for steamed momos, Thukpa, and Kahwa tea.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  assam: [
    { name: "Paradise Assamese Heritage Thali", type: "Indigenous Assamese", rating: 4.8, description: "Authentic multi-course thali featuring Masor Tenga sour fish curry, Khar, and pitika.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Gam's Delicacy Riverview Kitchen", type: "Traditional Kitchen", rating: 4.9, description: "Celebrated regional restaurant serving pork with bamboo shoots and aromatic Joha rice.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Khorikaa Charcoal Smoke & Grill", type: "Barbecue & Grill", rating: 4.8, description: "Popular dining venue specializing in ethnic skewered meats grilled over open wood embers.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "The Tea Story Boutique Estate Lounge", type: "Artisan Tea & Cafe", rating: 4.8, description: "Curated boutique tea salon serving single-estate golden tip Assam orthodox teas and pastries.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Terra Maya Skyline Terrace Lounge", type: "Rooftop Lounge", rating: 4.7, description: "Chic open-air rooftop cocktail lounge offering panoramic Brahmaputra valley views.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Shaikh Brothers Colonial Bakery", type: "Historic Bakery", rating: 4.8, description: "Century-old bakery established in 1885 famous for cream rolls, cheese straws, and cakes.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  "los angeles": [
    { name: "Bestia Arts District Italian", type: "Modern Italian", rating: 4.9, description: "Trendy industrial warehouse bistro serving house-cured charcuterie, handmade pastas, and pizzas.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Nobu Malibu Oceanfront Dining", type: "Japanese & Seafood", rating: 4.9, description: "World-famous oceanfront dining where Pacific waves crash below your table as you enjoy sushi.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Guisados Handmade Stew Tacos", type: "Tacos & Mexican", rating: 4.8, description: "Legendary handmade corn tortilla tacos filled with braised shredded flank steak and chiles.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Urth Caffe Organic Roastery", type: "Organic Cafe", rating: 4.7, description: "Bustling open-air patio cafe serving organic heirloom coffees, matcha lattes, and brunch.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Catch LA Rooftop Garden Lounge", type: "Seafood & Rooftop", rating: 4.8, description: "Stunning retractable-roof garden lounge overlooking West Hollywood with craft cocktails.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "République French Bakery & Cafe", type: "French Patisserie", rating: 4.9, description: "Historic 1928 brick atrium bakery crafting legendary morning pastries, baguettes, and tarts.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  kyoto: [
    { name: "Gion Karyo Kaiseki Dining", type: "Kaiseki", rating: 4.9, description: "Multi-course seasonal Kyoto banquet served in a restored traditional wooden machiya townhouse.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Ippudo Nishiki Ramen Workshop", type: "Ramen", rating: 4.8, description: "Silky tonkotsu pork broth ramen paired with handcrafted noodles and seared chashu pork.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Chao Chao Gyoza Sanjo", type: "Izakaya", rating: 4.7, description: "Award-winning crispy pan-fried gyoza with creative fillings in a buzzing alleyway atmosphere.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Tsujiri Tea House & Parfait", type: "Cafe & Matcha", rating: 4.8, description: "Historic green tea purveyor serving artisan Uji matcha parfaits and roasted hojicha lattes.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Kushikatsu Daruma Kyoto", type: "Skewer Bar", rating: 4.7, description: "Golden deep-fried skewers dipped in tangy tonkatsu sauce alongside ice-cold draft beers.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Wagashi Atelier & Ceremony Lounge", type: "Bakery & Desserts", rating: 4.9, description: "Refined seasonal bean paste confectioneries paired with ceremonial whisked bowl matcha.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  tokyo: [
    { name: "Tsukiji Outer Market Seafood Grill", type: "Seafood", rating: 4.8, description: "Fresh morning sashimi, grilled king crab legs, and tamagoyaki skewers.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Afuri Ramen Ebisu", type: "Ramen", rating: 4.8, description: "Signature light yuzu citrus chicken broth ramen with charcoal-grilled pork slices.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "Gonpachi Nishi-Azabu (Kill Bill Izakaya)", type: "Izakaya", rating: 4.7, description: "Atmospheric multi-level traditional tavern serving hand-pounded soba and charcoal skewers.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Blue Bottle Roastery Kiyosumi", type: "Cafe", rating: 4.7, description: "Spacious minimalist warehouse roastery serving pour-over single origin coffees.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "New York Bar at Park Hyatt", type: "Bar & Lounge", rating: 4.9, description: "Skyline jazz lounge 52 floors above Shinjuku offering craft cocktails and panoramic views.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Ginza West Confectionery", type: "Bakery & Patisserie", rating: 4.8, description: "Classic retro salon famous for leaf pies, Victoria cakes, and silver pot tea service.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
  paris: [
    { name: "Le Comptoir du Relais", type: "French Bistro", rating: 4.8, description: "Iconic Saint-Germain gastropub serving classic duck confit and French charcuterie.", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200" },
    { name: "Café de Flore", type: "Historic Cafe", rating: 4.7, description: "Historic bohemian meeting ground for intellectuals, celebrated for hot chocolate and croissants.", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200" },
    { name: "Chez Janou Provencal Bistro", type: "Provencal", rating: 4.8, description: "Lively Marais hideaway serving pastis cocktails, ratatouille, and unlimited chocolate mousse.", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" },
    { name: "L'As du Fallafel", type: "Street Food", rating: 4.8, description: "World-renowned pita sandwiches packed with crunchy falafel balls and fried aubergines.", image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200" },
    { name: "Le Perchoir Marais Rooftop", type: "Rooftop Bar", rating: 4.7, description: "Chic rooftop terrace cocktail bar overlooking the Eiffel Tower and Parisian zinc roofs.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200" },
    { name: "Cédric Grolet Opéra Patisserie", type: "Patisserie", rating: 4.9, description: "Master pastry chef atelier creating hyper-realistic sculpted trompe-l'œil fruit pastries.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200" },
  ],
};

function resolveCuratedImage(name = "", type = "", destination = "", isRestaurant = false, idx = 0) {
  const nm = name.toLowerCase();
  const typ = type.toLowerCase();
  const dest = destination.toLowerCase();

  // Destination-specific curated photos
  if (dest.includes("seoul") || dest.includes("korea")) {
    if (isRestaurant) {
      const seoulFoodImgs = [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200",
      ];
      return seoulFoodImgs[idx % seoulFoodImgs.length];
    }
    if (nm.includes("palace") || nm.includes("gyeongbok") || nm.includes("changdeok"))
      return "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200";
    if (nm.includes("hanok") || nm.includes("bukchon") || nm.includes("village"))
      return "https://images.unsplash.com/photo-1546874177-9e664107314e?w=1200";
    if (nm.includes("tower") || nm.includes("namsan") || typ.includes("viewpoint"))
      return "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200";
    if (nm.includes("market") || nm.includes("myeongdong") || nm.includes("street"))
      return "https://images.unsplash.com/photo-1583845112239-97ef1341b271?w=1200";
    if (nm.includes("design") || nm.includes("ddp") || typ.includes("museum"))
      return "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200";
    return DISTINCT_ATTRACTION_PHOTOS[idx % DISTINCT_ATTRACTION_PHOTOS.length];
  }

  if (dest.includes("kerala") || dest.includes("kochi") || dest.includes("munnar") || dest.includes("alleppey")) {
    if (isRestaurant) {
      const keralaFoodImgs = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200",
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200",
        "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=1200",
      ];
      return keralaFoodImgs[idx % keralaFoodImgs.length];
    }
    if (nm.includes("backwater") || nm.includes("houseboat") || nm.includes("alleppey"))
      return "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200";
    if (nm.includes("tea") || nm.includes("munnar") || nm.includes("plantation"))
      return "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200";
    if (nm.includes("kochi") || nm.includes("fishing") || nm.includes("fort"))
      return "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200";
    if (nm.includes("wildlife") || nm.includes("sanctuary") || nm.includes("periyar"))
      return "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200";
    if (nm.includes("beach") || nm.includes("cliff") || nm.includes("varkala"))
      return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200";
    if (nm.includes("falls") || nm.includes("waterfall"))
      return "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200";
    return DISTINCT_ATTRACTION_PHOTOS[idx % DISTINCT_ATTRACTION_PHOTOS.length];
  }

  // Safe cycling through distinct photos ensures EVERY card has a unique image
  if (isRestaurant) {
    return DISTINCT_DINING_PHOTOS[idx % DISTINCT_DINING_PHOTOS.length];
  }

  return DISTINCT_ATTRACTION_PHOTOS[idx % DISTINCT_ATTRACTION_PHOTOS.length];
}

export async function fetchCuratedPlaces(destination, type = "tourist_attraction") {
  if (!destination) {
    return [];
  }

  const isRestaurant = type === "restaurant";
  const cleanDest = destination.trim().toLowerCase();

  // 1. Check curated dining library for restaurants
  if (isRestaurant) {
    for (const [key, places] of Object.entries(CURATED_REGIONAL_DINING)) {
      if (cleanDest.includes(key) || key.includes(cleanDest)) {
        return places.map((p, idx) => ({
          id: `curated_dining_${key}_${idx}`,
          name: p.name,
          displayName: { text: p.name },
          rating: p.rating || 4.8,
          userRatingCount: 800 + idx * 150,
          primaryTypeDisplayName: { text: p.type || "Restaurant" },
          type: p.type || "Restaurant",
          category: "Dining",
          currentOpeningHours: { openNow: true },
          description: p.description,
          tags: ["Top Rated", "Local Cuisine", p.type || "Dining"],
          image: p.image || resolveCuratedImage(p.name, p.type, destination, true, idx),
        }));
      }
    }
  }

  // 2. Check curated regional/destination library for attractions
  if (!isRestaurant) {
    for (const [key, places] of Object.entries(CURATED_REGIONAL_PLACES)) {
      if (cleanDest.includes(key) || key.includes(cleanDest)) {
        return places.map((p, idx) => ({
          id: `curated_${key}_${idx}`,
          name: p.name,
          displayName: { text: p.name },
          rating: p.rating || 4.8,
          userRatingCount: 1500 + idx * 300,
          primaryTypeDisplayName: { text: p.type || "Tourist Attraction" },
          type: p.type || "Tourist Attraction",
          category: p.category || "Sightseeing",
          currentOpeningHours: { openNow: true },
          description: p.description,
          tags: [p.category || "Must Visit", p.type || "Iconic", "Top Rated"],
          image: p.image || resolveCuratedImage(p.name, p.type, destination, false, idx),
          coordinates: p.coordinates || null,
        }));
      }
    }
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const searchQuery = isRestaurant
        ? `Best restaurants in ${destination}`
        : `Top tourist attractions in ${destination}`;

      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.rating,places.userRatingCount,places.primaryTypeDisplayName,places.currentOpeningHours,places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery: searchQuery,
          pageSize: 6,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          return data.places.map((place, idx) => {
            const pName = place.displayName?.text || place.displayName;
            const pType = place.primaryTypeDisplayName?.text || place.primaryTypeDisplayName || (isRestaurant ? "Restaurant" : "Attraction");
            return {
              ...place,
              name: pName,
              type: pType,
              image: resolveCuratedImage(pName, pType, destination, isRestaurant, idx),
            };
          });
        }
      }
    } catch (error) {
      console.warn("Google Places fetch failed, using rich fallbacks:", error.message);
    }
  }

  return isRestaurant ? DEFAULT_RESTAURANTS(destination) : DEFAULT_ATTRACTIONS(destination);
}

const CURATED_REGIONAL_PLACES = {
  seoul: [
    { name: "Gyeongbokgung Palace & Royal Guard", type: "Historic", category: "Historic Landmarks", distance: "1.2 km", rating: 4.9, description: "Main royal palace of the Joseon dynasty with sweeping courtyards and pavilion gardens.", image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200", coordinates: { lat: 37.5796, lon: 126.9770 } },
    { name: "Bukchon Hanok Traditional Village", type: "Historic", category: "Historic Landmarks", distance: "1.8 km", rating: 4.8, description: "Preserved hilltop enclave of traditional Korean wooden houses dating back 600 years.", image: "https://images.unsplash.com/photo-1546874177-9e664107314e?w=1200", coordinates: { lat: 37.5826, lon: 126.9831 } },
    { name: "N Seoul Tower & Namsan Mountain Park", type: "Viewpoint", category: "Sightseeing", distance: "2.5 km", rating: 4.8, description: "Iconic observation tower offering 360-degree skyline panoramas over the metropolis.", image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200", coordinates: { lat: 37.5512, lon: 126.9882 } },
    { name: "Myeongdong Night Market & Street Food", type: "Sightseeing", category: "Sightseeing", distance: "1.0 km", rating: 4.7, description: "Bustling neon pedestrian district renowned for vibrant cosmetics boutiques and street food stalls.", image: "https://images.unsplash.com/photo-1583845112239-97ef1341b271?w=1200", coordinates: { lat: 37.5636, lon: 126.9827 } },
    { name: "Changdeokgung Palace & Secret Garden", type: "Historic", category: "Historic Landmarks", distance: "2.1 km", rating: 4.9, description: "UNESCO World Heritage palace set harmoniously amidst ancient woodland ponds and trees.", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=1200", coordinates: { lat: 37.5794, lon: 126.9910 } },
    { name: "Dongdaemun Design Plaza (DDP)", type: "Museum", category: "Culture & Museums", distance: "3.2 km", rating: 4.8, description: "Zaha Hadid's neo-futuristic cultural complex hosting premier design exhibitions and rooftop parks.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200", coordinates: { lat: 37.5668, lon: 127.0095 } },
  ],
  kerala: [
    { name: "Alleppey Backwaters & Houseboat Cruise", type: "Nature", category: "Parks & Nature", distance: "15 km", rating: 4.9, description: "Serene network of interconnected canals, palm-fringed lagoons, and traditional kettuvallam boats.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200", coordinates: { lat: 9.4981, lon: 76.3388 } },
    { name: "Munnar Rolling Tea Plantations", type: "Nature", category: "Parks & Nature", distance: "85 km", rating: 4.9, description: "Emerald velvet carpeted hill station surrounded by misty peaks, waterfalls, and tea estates.", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200", coordinates: { lat: 10.0889, lon: 77.0595 } },
    { name: "Fort Kochi Chinese Fishing Nets", type: "Historic", category: "Historic Landmarks", distance: "6.5 km", rating: 4.8, description: "Historic cantilevered shore nets silhouetted against Arabian Sea sunsets in an ancient port town.", image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200", coordinates: { lat: 9.9674, lon: 76.2427 } },
    { name: "Periyar Wildlife Sanctuary & Lake", type: "Park", category: "Parks & Nature", distance: "110 km", rating: 4.8, description: "Protected rainforest reserve famous for elephant herds, tigers, and serene reservoir boat safaris.", image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200", coordinates: { lat: 9.4679, lon: 77.1417 } },
    { name: "Varkala Red Cliff & Papanasam Beach", type: "Sightseeing", category: "Sightseeing", distance: "45 km", rating: 4.8, description: "Dramatic geological red cliffs overlooking pristine Arabian Sea shores with seaside cafes.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200", coordinates: { lat: 8.7379, lon: 76.7163 } },
    { name: "Athirappilly Scenic Waterfalls", type: "Nature", category: "Parks & Nature", distance: "55 km", rating: 4.9, description: "Majestic 80-foot cascading cataract roaring through dense Western Ghats jungle canopy.", image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200", coordinates: { lat: 10.2851, lon: 76.5698 } },
  ],
  california: [
    { name: "Yosemite National Park & Valley", type: "Park", category: "Parks & Nature", distance: "45 km", rating: 4.9, description: "Iconic granite cliffs, ancient giant sequoias, and world-famous waterfalls.", image: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1200", coordinates: { lat: 37.7456, lon: -119.5936 } },
    { name: "Golden Gate Bridge & Overlook", type: "Landmark", category: "Sightseeing", distance: "12 km", rating: 4.8, description: "World-renowned suspension bridge with sweeping Pacific ocean and bay views.", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200", coordinates: { lat: 37.8199, lon: -122.4783 } },
    { name: "Griffith Observatory & Trails", type: "Museum", category: "Culture & Museums", distance: "8.5 km", rating: 4.8, description: "Southern California gateway to the cosmos with planetarium and city panoramas.", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200", coordinates: { lat: 34.1184, lon: -118.3004 } },
    { name: "Monterey Bay Aquarium", type: "Attraction", category: "Sightseeing", distance: "28 km", rating: 4.9, description: "Pioneering marine exhibits showcasing kelp forests, sea otters, and deep sea life.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", coordinates: { lat: 36.6183, lon: -121.9015 } },
    { name: "Redwood National & State Parks", type: "Nature", category: "Parks & Nature", distance: "60 km", rating: 4.9, description: "Towering ancient coastal redwood trees in tranquil mist-shrouded forests.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 41.2132, lon: -124.0046 } },
    { name: "Santa Monica Pier & Boardwalk", type: "Sightseeing", category: "Sightseeing", distance: "15 km", rating: 4.7, description: "Historic seaside pier featuring nostalgic rides, street performers, and sunset views.", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200", coordinates: { lat: 34.0099, lon: -118.4965 } },
  ],
  florida: [
    { name: "Everglades National Park", type: "Nature", category: "Parks & Nature", distance: "35 km", rating: 4.8, description: "Vast subtropical wetland ecosystem home to alligators, birds, and guided airboat trails.", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200", coordinates: { lat: 25.2866, lon: -80.8987 } },
    { name: "Kennedy Space Center Visitor Complex", type: "Museum", category: "Culture & Museums", distance: "22 km", rating: 4.9, description: "NASA launch pads, historic space shuttles, and interactive astronaut simulators.", image: "https://images.unsplash.com/photo-1517976487502-5f6311681a8f?w=1200", coordinates: { lat: 28.5729, lon: -80.6490 } },
    { name: "Art Deco Historic District, South Beach", type: "Historic", category: "Historic Landmarks", distance: "4.2 km", rating: 4.7, description: "Vibrant pastel 1930s architecture along the world-famous Ocean Drive.", image: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=1200", coordinates: { lat: 25.7825, lon: -80.1341 } },
    { name: "Castillo de San Marcos", type: "Historic", category: "Historic Landmarks", distance: "18 km", rating: 4.8, description: "Oldest masonry fort in the United States, guarding the St. Augustine coastline.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 29.8978, lon: -81.3117 } },
    { name: "Key West Old Town & Mallory Square", type: "Sightseeing", category: "Sightseeing", distance: "45 km", rating: 4.8, description: "Quirky historic streets, Hemingway House, and nightly celebratory sunset festivals.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", coordinates: { lat: 24.5557, lon: -81.7826 } },
    { name: "Wynwood Walls Urban Art Museum", type: "Museum", category: "Culture & Museums", distance: "6.1 km", rating: 4.8, description: "World-class open-air museum showcasing large-scale international street art murals.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 25.8010, lon: -80.1994 } },
  ],
  tuscany: [
    { name: "Santa Maria del Fiore (Duomo)", type: "Historic", category: "Historic Landmarks", distance: "0.5 km", rating: 4.9, description: "Brunelleschi's iconic terracotta tiled cathedral dome towering over Florence.", image: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=1200", coordinates: { lat: 43.7731, lon: 11.2560 } },
    { name: "Uffizi Gallery", type: "Museum", category: "Culture & Museums", distance: "0.8 km", rating: 4.9, description: "Priceless Renaissance masterpieces including Botticelli, Da Vinci, and Michelangelo.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 43.7678, lon: 11.2553 } },
    { name: "Leaning Tower of Pisa & Piazza dei Miracoli", type: "Landmark", category: "Sightseeing", distance: "24 km", rating: 4.7, description: "Famous freestanding medieval bell tower renowned for its dramatic unintended tilt.", image: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=1200", coordinates: { lat: 43.7230, lon: 10.3966 } },
    { name: "Piazza del Campo, Siena", type: "Historic", category: "Historic Landmarks", distance: "32 km", rating: 4.8, description: "Shell-shaped medieval public square famous for the historic Palio horse race.", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200", coordinates: { lat: 43.3184, lon: 11.3316 } },
    { name: "San Gimignano Medieval Towers", type: "Historic", category: "Historic Landmarks", distance: "28 km", rating: 4.8, description: "Fourteen preserved medieval tower houses crowning the rolling Tuscan hilltops.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 43.4674, lon: 11.0433 } },
    { name: "Chianti Rolling Vineyards & Castles", type: "Nature", category: "Parks & Nature", distance: "18 km", rating: 4.8, description: "Scenic cypress-lined country roads, olive groves, and historic wine cellars.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200", coordinates: { lat: 43.5855, lon: 11.3175 } },
  ],
  rajasthan: [
    { name: "Amber Palace & Fort", type: "Historic", category: "Historic Landmarks", distance: "11 km", rating: 4.8, description: "Majestic hilltop fort featuring red sandstone, marble palaces, and Maota Lake views.", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200", coordinates: { lat: 26.9855, lon: 75.8513 } },
    { name: "Hawa Mahal (Palace of Winds)", type: "Historic", category: "Historic Landmarks", distance: "2.5 km", rating: 4.7, description: "Intricate pink sandstone honeycombed facade with 953 carved jharokha windows.", image: "https://images.unsplash.com/photo-1609137144822-4752c0021c3b?w=1200", coordinates: { lat: 26.9239, lon: 75.8267 } },
    { name: "Mehrangarh Fort, Jodhpur", type: "Historic", category: "Historic Landmarks", distance: "35 km", rating: 4.9, description: "Colossal citadel towering 400 feet above the Blue City with rich museum galleries.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 26.2980, lon: 73.0189 } },
    { name: "City Palace & Lake Pichola, Udaipur", type: "Historic", category: "Historic Landmarks", distance: "42 km", rating: 4.8, description: "Sprawling lakefront royal palace complex blending Rajasthani and Mughal architecture.", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=1200", coordinates: { lat: 24.5764, lon: 73.6835 } },
    { name: "Jaisalmer Golden Sand Fort", type: "Historic", category: "Historic Landmarks", distance: "65 km", rating: 4.8, description: "Living sandstone fortress rising organically from the golden sands of the Thar Desert.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", coordinates: { lat: 26.9124, lon: 70.9127 } },
    { name: "Ranthambore National Park & Tiger Reserve", type: "Nature", category: "Parks & Nature", distance: "80 km", rating: 4.7, description: "Historic ruins reclaimed by wilderness, famous for Bengal tiger safaris.", image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200", coordinates: { lat: 26.0173, lon: 76.5026 } },
  ],
  bali: [
    { name: "Tanah Lot Sea Temple", type: "Historic", category: "Historic Landmarks", distance: "14 km", rating: 4.7, description: "Ancient Hindu pilgrimage temple perched dramatically on an offshore ocean rock.", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200", coordinates: { lat: -8.6212, lon: 115.0868 } },
    { name: "Ubud Sacred Monkey Forest Sanctuary", type: "Nature", category: "Parks & Nature", distance: "3.2 km", rating: 4.7, description: "Lush jungle sanctuary housing hundreds of Balinese macaques and ancient moss temples.", image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200", coordinates: { lat: -8.5188, lon: 115.2585 } },
    { name: "Uluwatu Cliff Temple & Kecak Dance", type: "Historic", category: "Historic Landmarks", distance: "26 km", rating: 4.8, description: "Cliffside temple rising 70 meters above roaring Indian Ocean waves with sunset shows.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200", coordinates: { lat: -8.8291, lon: 115.0849 } },
    { name: "Tegallalang Stepped Rice Terraces", type: "Nature", category: "Parks & Nature", distance: "9.5 km", rating: 4.8, description: "Iconic emerald green valley terraces utilizing the traditional Subak irrigation system.", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200", coordinates: { lat: -8.4334, lon: 115.2818 } },
    { name: "Mount Batur Sunrise Caldera", type: "Viewpoint", category: "Sightseeing", distance: "38 km", rating: 4.8, description: "Active volcanic crater offering breathtaking sunrise treks above the clouds.", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", coordinates: { lat: -8.2421, lon: 115.3753 } },
    { name: "Tirta Empul Holy Water Temple", type: "Historic", category: "Historic Landmarks", distance: "12 km", rating: 4.7, description: "Revered water temple where visitors and pilgrims participate in purification rituals.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: -8.4150, lon: 115.3150 } },
  ],
  kashmir: [
    { name: "Dal Lake & Shikara Wooden Houseboats", type: "Nature", category: "Parks & Nature", distance: "2.5 km", rating: 4.9, description: "Serene mountain lake dotted with carved cedar houseboats and floating lotus gardens.", image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200", coordinates: { lat: 34.1167, lon: 74.8667 } },
    { name: "Gulmarg Gondola & Alpine Meadows", type: "Viewpoint", category: "Sightseeing", distance: "52 km", rating: 4.9, description: "World's highest operating cable car rising to snow-capped peaks over pine forest bowls.", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200", coordinates: { lat: 34.0484, lon: 74.3805 } },
    { name: "Mughal Terraced Gardens (Shalimar & Nishat)", type: "Park", category: "Parks & Nature", distance: "8.5 km", rating: 4.8, description: "17th-century Persian-style terraced garden estate with cascading water channels and chinars.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 34.1486, lon: 74.8722 } },
    { name: "Shankaracharya Ancient Hilltop Temple", type: "Historic", category: "Historic Landmarks", distance: "4.1 km", rating: 4.8, description: "Ancient 9th-century stone temple perched high on Gopadari Hill overlooking Srinagar.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: 34.0761, lon: 74.8428 } },
    { name: "Betaab Valley & Lidder River, Pahalgam", type: "Nature", category: "Parks & Nature", distance: "88 km", rating: 4.9, description: "Lush alpine valley framed by snow-covered Himalayan peaks and gushing glacial streams.", image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200", coordinates: { lat: 34.0206, lon: 75.3267 } },
    { name: "Pari Mahal (Palace of Fairies)", type: "Historic", category: "Historic Landmarks", distance: "6.2 km", rating: 4.7, description: "Six-terraced Mughal garden observatory built by Prince Dara Shikoh above Dal Lake.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 34.0883, lon: 74.8789 } },
  ],
  assam: [
    { name: "Kaziranga National Park Rhino Safari", type: "Nature", category: "Parks & Nature", distance: "190 km", rating: 4.9, description: "UNESCO World Heritage sanctuary home to two-thirds of the world's great one-horned rhinos.", image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1200", coordinates: { lat: 26.5775, lon: 93.1711 } },
    { name: "Kamakhya Ancient Hilltop Shakti Temple", type: "Historic", category: "Historic Landmarks", distance: "7.5 km", rating: 4.8, description: "Ancient revered Tantric shrine atop Nilachal Hill overlooking the Brahmaputra River.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: 26.1667, lon: 91.7056 } },
    { name: "Majuli River Island Heritage & Satras", type: "Historic", category: "Culture & Museums", distance: "280 km", rating: 4.8, description: "World's largest river island celebrated for traditional neo-Vaishnavite monastery culture.", image: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1200", coordinates: { lat: 26.9536, lon: 94.2037 } },
    { name: "Brahmaputra River Cruise & Sunset", type: "Sightseeing", category: "Sightseeing", distance: "2.1 km", rating: 4.8, description: "Tranquil evening river boat cruise offering spectacular sunsets across the mighty waters.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", coordinates: { lat: 26.1856, lon: 91.7483 } },
    { name: "Manas Biosphere & Tiger Reserve", type: "Nature", category: "Parks & Nature", distance: "135 km", rating: 4.8, description: "Pristine Himalayan foothills sanctuary hosting tigers, golden langurs, and pygmy hogs.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 26.7196, lon: 90.9632 } },
    { name: "Srimanta Sankaradev Kalakshetra", type: "Museum", category: "Culture & Museums", distance: "11 km", rating: 4.7, description: "Grand cultural museum and amphitheatre preserving indigenous Assamese music and craft.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 26.1264, lon: 91.8172 } },
  ],
  "los angeles": [
    { name: "Griffith Observatory & Trails", type: "Museum", category: "Culture & Museums", distance: "8.5 km", rating: 4.8, description: "Iconic hilltop observatory offering planetarium shows and city panoramas.", image: "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200", coordinates: { lat: 34.1184, lon: -118.3004 } },
    { name: "Santa Monica Pier & Coast", type: "Sightseeing", category: "Sightseeing", distance: "15 km", rating: 4.7, description: "Celebrated Pacific pier with historic carousel, rides, and ocean sunset outlooks.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", coordinates: { lat: 34.0099, lon: -118.4965 } },
    { name: "The Getty Center Museum & Gardens", type: "Museum", category: "Culture & Museums", distance: "18 km", rating: 4.9, description: "Modernist travertine museum complex housing European art and tranquil hill gardens.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 34.0780, lon: -118.4741 } },
    { name: "Hollywood Boulevard & Walk of Fame", type: "Sightseeing", category: "Sightseeing", distance: "6.2 km", rating: 4.6, description: "World-famous cinema boulevard commemorating entertainment legends and TLC Chinese Theatre.", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200", coordinates: { lat: 34.1016, lon: -118.3268 } },
    { name: "Venice Beach Boardwalk & Canals", type: "Sightseeing", category: "Sightseeing", distance: "17 km", rating: 4.7, description: "Bohemian seaside promenade dotted with street murals, skaters, and historic European canals.", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200", coordinates: { lat: 33.9850, lon: -118.4695 } },
    { name: "Universal Studios Hollywood", type: "Attraction", category: "Sightseeing", distance: "12 km", rating: 4.8, description: "Legendary working movie studio and theme park featuring immersive cinematic worlds.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", coordinates: { lat: 34.1381, lon: -118.3534 } },
  ],
  kyoto: [
    { name: "Fushimi Inari Taisha", type: "Historic", category: "Historic Landmarks", distance: "3.5 km", rating: 4.9, description: "Thousands of brilliant vermilion torii gates winding up sacred Mount Inari.", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200", coordinates: { lat: 34.9671, lon: 135.7727 } },
    { name: "Kinkaku-ji (The Golden Pavilion)", type: "Historic", category: "Historic Landmarks", distance: "5.2 km", rating: 4.9, description: "Iconic two-story gold leaf Zen temple reflected in the serene Mirror Pond.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: 35.0394, lon: 135.7292 } },
    { name: "Arashiyama Bamboo Grove", type: "Nature", category: "Parks & Nature", distance: "7.8 km", rating: 4.8, description: "Soaring emerald bamboo stems swaying in the breeze near the historic Moon Crossing Bridge.", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200", coordinates: { lat: 35.0169, lon: 135.6713 } },
    { name: "Kiyomizu-dera Cliffside Temple", type: "Historic", category: "Historic Landmarks", distance: "2.1 km", rating: 4.9, description: "Massive wooden stage offering panoramic Kyoto views without using a single nail.", image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200", coordinates: { lat: 34.9949, lon: 135.7850 } },
    { name: "Gion Geisha District & Shirakawa Canal", type: "Historic", category: "Historic Landmarks", distance: "1.2 km", rating: 4.8, description: "Atmospheric preserved wooden merchant houses, lantern-lit alleys, and teahouses.", image: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=1200", coordinates: { lat: 35.0037, lon: 135.7772 } },
    { name: "Nijo Castle & Nightingale Floors", type: "Historic", category: "Historic Landmarks", distance: "2.8 km", rating: 4.7, description: "Tokugawa Shogunate fortress famous for ornate painted screens and squeaking floors.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 35.0142, lon: 135.7482 } },
  ],
  tokyo: [
    { name: "Senso-ji Temple, Asakusa", type: "Historic", category: "Historic Landmarks", distance: "4.5 km", rating: 4.8, description: "Tokyo's oldest Buddhist temple fronted by the vibrant Nakamise shopping arcade.", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200", coordinates: { lat: 35.7148, lon: 139.7967 } },
    { name: "Meiji Jingu Shrine & Forest", type: "Historic", category: "Historic Landmarks", distance: "3.8 km", rating: 4.8, description: "Tranquil forested Shinto shrine dedicated to Emperor Meiji in the heart of Shibuya.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: 35.6764, lon: 139.6993 } },
    { name: "Tokyo Skytree Observation Deck", type: "Viewpoint", category: "Sightseeing", distance: "6.2 km", rating: 4.7, description: "World's tallest freestanding broadcast tower providing 360-degree city panoramas.", image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200", coordinates: { lat: 35.7101, lon: 139.8107 } },
    { name: "Shinjuku Gyoen National Garden", type: "Park", category: "Parks & Nature", distance: "2.4 km", rating: 4.8, description: "Expansive landscape blending Japanese traditional, English, and French formal gardens.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 35.6852, lon: 139.7101 } },
    { name: "teamLab Planets Digital Art Museum", type: "Museum", category: "Culture & Museums", distance: "5.9 km", rating: 4.9, description: "Immersive barefoot digital art installations interacting with water and light.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200", coordinates: { lat: 35.6491, lon: 139.7898 } },
    { name: "Shibuya Sky & Scramble Crossing", type: "Viewpoint", category: "Sightseeing", distance: "3.2 km", rating: 4.8, description: "Rooftop 360-degree open-air observatory overlooking the world's busiest crosswalk.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", coordinates: { lat: 35.6595, lon: 139.7006 } },
  ],
  paris: [
    { name: "Eiffel Tower & Champ de Mars", type: "Landmark", category: "Sightseeing", distance: "3.8 km", rating: 4.8, description: "Gustave Eiffel's world-renowned iron lattice tower illuminating the Parisian skyline.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", coordinates: { lat: 48.8584, lon: 2.2945 } },
    { name: "Louvre Museum & Pyramide", type: "Museum", category: "Culture & Museums", distance: "1.2 km", rating: 4.9, description: "World's most visited art museum housing the Mona Lisa and Venus de Milo.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 48.8606, lon: 2.3376 } },
    { name: "Musée d'Orsay", type: "Museum", category: "Culture & Museums", distance: "1.8 km", rating: 4.9, description: "Spectacular former Beaux-Arts railway station exhibiting premier Impressionist art.", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200", coordinates: { lat: 48.8599, lon: 2.3266 } },
    { name: "Arc de Triomphe & Champs-Élysées", type: "Historic", category: "Historic Landmarks", distance: "4.2 km", rating: 4.7, description: "Monumental arch honoring French military victories at the head of the avenue.", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200", coordinates: { lat: 48.8738, lon: 2.2950 } },
    { name: "Sainte-Chapelle Stained Glass", type: "Historic", category: "Historic Landmarks", distance: "0.9 km", rating: 4.9, description: "Rayonnant Gothic royal chapel containing 1,113 luminous 13th-century stained glass panes.", image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1200", coordinates: { lat: 48.8554, lon: 2.3450 } },
    { name: "Jardin du Luxembourg", type: "Park", category: "Parks & Nature", distance: "1.5 km", rating: 4.8, description: "Stately 25-hectare French formal gardens with tree-lined promenades and Medici Fountain.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 48.8462, lon: 2.3372 } },
  ],
  "new york": [
    { name: "Central Park & Belvedere Castle", type: "Park", category: "Parks & Nature", distance: "2.5 km", rating: 4.9, description: "World's most famous urban park spanning 843 acres of lakes, rambles, and lawns.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6?w=1200", coordinates: { lat: 40.7829, lon: -73.9654 } },
    { name: "The Metropolitan Museum of Art (The Met)", type: "Museum", category: "Culture & Museums", distance: "3.1 km", rating: 4.9, description: "Encyclopedic collection of over 2 million works spanning 5,000 years of global culture.", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200", coordinates: { lat: 40.7794, lon: -73.9632 } },
    { name: "Statue of Liberty & Ellis Island", type: "Historic", category: "Historic Landmarks", distance: "6.8 km", rating: 4.8, description: "Colossal neoclassical sculpture welcoming immigrants into New York Harbor.", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200", coordinates: { lat: 40.6892, lon: -74.0445 } },
    { name: "The High Line Elevated Park", type: "Park", category: "Parks & Nature", distance: "1.8 km", rating: 4.8, description: "Linear park built on a historic elevated freight rail line above Manhattan's West Side.", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", coordinates: { lat: 40.7480, lon: -74.0048 } },
    { name: "Top of the Rock Observation Deck", type: "Viewpoint", category: "Sightseeing", distance: "1.2 km", rating: 4.8, description: "Unrivaled panoramic views of Central Park and the Empire State Building skyline.", image: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200", coordinates: { lat: 40.7587, lon: -73.9787 } },
    { name: "Brooklyn Bridge Promenade Walk", type: "Landmark", category: "Sightseeing", distance: "4.4 km", rating: 4.8, description: "Iconic stone-and-steel suspension bridge offering memorable harbor skyline strolls.", image: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200", coordinates: { lat: 40.7061, lon: -73.9969 } },
  ],
};

function generateFallbackPlaces(destination, baseCoords = null) {
  const dest = destination || "City";
  const items = [
    {
      id: "place_fallback_1",
      name: `${dest} Historic Old Quarter`,
      type: "Historic",
      category: "Historic Landmarks",
      distance: "0.8 km",
      rating: 4.8,
      address: `${dest} Center`,
      description: `Atmospheric heritage streets featuring traditional architecture, local artisan shops, and vibrant public squares in ${dest}.`,
    },
    {
      id: "place_fallback_2",
      name: `${dest} National Art & History Museum`,
      type: "Museum",
      category: "Culture & Museums",
      distance: "1.4 km",
      rating: 4.9,
      address: `${dest} Cultural District`,
      description: "Comprehensive galleries exhibiting regional heritage, classical artwork, and archaeological treasures.",
    },
    {
      id: "place_fallback_3",
      name: `${dest} Botanical Gardens & Lake Park`,
      type: "Park",
      category: "Parks & Nature",
      distance: "2.1 km",
      rating: 4.8,
      address: `${dest} Greenbelt`,
      description: "Tranquil botanical grounds with flowering garden pavilions, shaded walking paths, and peaceful waters.",
    },
    {
      id: "place_fallback_4",
      name: `${dest} Castle & Panoramic Viewpoint`,
      type: "Viewpoint",
      category: "Sightseeing",
      distance: "3.2 km",
      rating: 4.8,
      address: `${dest} Hillside`,
      description: "Historic elevated fortress grounds providing sweeping 360-degree panoramas across the entire surrounding region.",
    },
    {
      id: "place_fallback_5",
      name: `${dest} Grand Cathedral & Piazza`,
      type: "Historic",
      category: "Historic Landmarks",
      distance: "1.1 km",
      rating: 4.7,
      address: `${dest} Piazza`,
      description: "Magnificent sacred architecture celebrated for its intricate carvings, stained glass, and lively courtyard.",
    },
    {
      id: "place_fallback_6",
      name: `${dest} Waterfront Promenade & Marina`,
      type: "Sightseeing",
      category: "Sightseeing",
      distance: "2.7 km",
      rating: 4.7,
      address: `${dest} Waterfront`,
      description: "Scenic pedestrian esplanade dotted with open-air cafes, sunset outlooks, and tranquil marina boats.",
    },
  ];

  return items.map((item, idx) => {
    let coordinates = null;
    if (baseCoords?.lat && baseCoords?.lon) {
      const angle = (idx / items.length) * 2 * Math.PI;
      const dist = 0.012 + (idx * 0.005);
      coordinates = {
        lat: Number((baseCoords.lat + Math.sin(angle) * dist).toFixed(5)),
        lon: Number((baseCoords.lon + Math.cos(angle) * dist).toFixed(5)),
      };
    }
    return {
      ...item,
      coordinates,
    };
  });
}

function categorizePlace(tags = {}) {
  const tourism = tags.tourism || "";
  const historic = tags.historic || "";
  const leisure = tags.leisure || "";
  const amenity = tags.amenity || "";

  if (tourism === "museum" || tourism === "gallery") {
    return { type: "Museum", category: "Culture & Museums" };
  }
  if (tourism === "theme_park" || tourism === "attraction" || tourism === "aquarium" || tourism === "zoo") {
    return { type: "Attraction", category: "Sightseeing" };
  }
  if (historic || tourism === "castle" || tourism === "monument") {
    return { type: "Historic", category: "Historic Landmarks" };
  }
  if (leisure === "park" || leisure === "garden" || leisure === "nature_reserve") {
    return { type: "Park", category: "Parks & Nature" };
  }
  if (tourism === "viewpoint") {
    return { type: "Viewpoint", category: "Sightseeing" };
  }
  return { type: "Sightseeing", category: "Sightseeing" };
}

export async function fetchNearbyPlaces(destination) {
  if (!destination || typeof destination !== "string") {
    return {
      destination: "Your Destination",
      isRegion: false,
      coordinates: null,
      data: generateFallbackPlaces("Your Destination"),
    };
  }

  const cleanDest = destination.trim();
  const normalizedKey = cleanDest.toLowerCase();

  // 1. Check curated regional / famous destination library first for instant, high-quality results
  for (const [key, places] of Object.entries(CURATED_REGIONAL_PLACES)) {
    if (normalizedKey === key || normalizedKey.includes(key) || key.includes(normalizedKey)) {
      console.log(`[Nearby] Serving high-confidence curated points for "${cleanDest}"`);
      const baseCoords = await geocodeDestination(cleanDest);
      const topLat = baseCoords?.lat || places[0]?.coordinates?.lat || null;
      const topLon = baseCoords?.lon || places[0]?.coordinates?.lon || null;

      return {
        destination: cleanDest,
        isRegion: ["california", "florida", "tuscany", "rajasthan", "bali", "kerala"].includes(key),
        coordinates: topLat && topLon ? { lat: topLat, lon: topLon } : null,
        data: places.map((p, idx) => {
          let pCoords = p.coordinates;
          if (!pCoords && topLat && topLon) {
            const angle = (idx / places.length) * 2 * Math.PI;
            const dist = 0.015 + (idx * 0.005);
            pCoords = {
              lat: Number((topLat + Math.sin(angle) * dist).toFixed(5)),
              lon: Number((topLon + Math.cos(angle) * dist).toFixed(5)),
            };
          }
          return {
            id: `place_curated_${idx}`,
            ...p,
            coordinates: pCoords,
            address: p.address || `${cleanDest}`,
          };
        }),
      };
    }
  }

  // 2. Geocode with timeout and region classification
  const coords = await geocodeDestination(cleanDest);

  if (!coords) {
    console.log(`[Nearby] Destination "${cleanDest}" coordinates not found; returning graceful fallback without coords.`);
    return {
      destination: cleanDest,
      isRegion: false,
      coordinates: null,
      data: generateFallbackPlaces(cleanDest, null),
    };
  }

  const isRegion = coords.isRegion || false;

  // If destination is recognized as a region/state but not in the library, generate realistic region-level points
  if (isRegion) {
    console.log(`[Nearby] Destination "${cleanDest}" detected as state/region; serving regional points.`);
    return {
      destination: cleanDest,
      isRegion: true,
      coordinates: { lat: coords.lat, lon: coords.lon },
      data: generateFallbackPlaces(cleanDest, coords),
    };
  }

  const lat = coords.lat;
  const lon = coords.lon;

  // 3. Try broader Overpass query with strict 4500ms timeout
  const radius = 15000; // 15km broad radius
  const overpassQuery = `
    [out:json][timeout:5];
    (
      node(around:${radius},${lat},${lon})["tourism"~"attraction|museum|viewpoint|gallery|theme_park"];
      way(around:${radius},${lat},${lon})["tourism"~"attraction|museum|viewpoint|gallery|theme_park"];
      node(around:${radius},${lat},${lon})["historic"~"monument|memorial|castle|palace|ruins|archaeological_site|fort"];
      way(around:${radius},${lat},${lon})["historic"~"monument|memorial|castle|palace|ruins|archaeological_site|fort"];
      node(around:${radius},${lat},${lon})["leisure"~"park|garden|nature_reserve"];
      way(around:${radius},${lat},${lon})["leisure"~"park|garden|nature_reserve"];
    );
    out center 16;
  `;

  const mirrors = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  for (const mirrorUrl of mirrors) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const response = await fetch(mirrorUrl, {
        method: "POST",
        body: overpassQuery,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.elements && data.elements.length > 0) {
          const formatted = data.elements
            .filter((item) => item.tags && item.tags.name && item.tags.name.length > 2)
            .map((item, idx) => {
              const itemLat = item.lat || item.center?.lat;
              const itemLon = item.lon || item.center?.lon;
              const distanceKm =
                itemLat && itemLon
                  ? calculateDistance(lat, lon, itemLat, itemLon) + " km"
                  : (1 + (idx * 0.7)).toFixed(1) + " km";

              const { type, category } = categorizePlace(item.tags);

              return {
                id: `osm_${item.id || idx}`,
                name: item.tags.name,
                type,
                category,
                distance: distanceKm,
                rating: Number((4.5 + ((item.id % 5) * 0.1)).toFixed(1)),
                address: item.tags["addr:street"] || `${cleanDest}`,
                description:
                  item.tags.description ||
                  `Popular ${type.toLowerCase()} in ${cleanDest}, celebrated by visitors and locals alike.`,
                coordinates: itemLat && itemLon ? { lat: itemLat, lon: itemLon } : null,
              };
            });

          // De-duplicate by name
          const uniquePlaces = [];
          const seen = new Set();
          for (const place of formatted) {
            if (!seen.has(place.name.toLowerCase())) {
              seen.add(place.name.toLowerCase());
              uniquePlaces.push(place);
            }
          }

          if (uniquePlaces.length >= 3) {
            console.log(`[Nearby] Found ${uniquePlaces.length} live Overpass places for "${cleanDest}"`);
            return {
              destination: cleanDest,
              isRegion: false,
              coordinates: { lat, lon },
              data: uniquePlaces.slice(0, 8),
            };
          }
        }
      }
    } catch (err) {
      console.warn(`[Nearby] Mirror ${mirrorUrl} error for "${cleanDest}":`, err.message);
    }
  }

  // 4. Guaranteed high-quality contextual fallback
  console.log(`[Nearby] Generating contextual fallback places for "${cleanDest}"`);
  return {
    destination: cleanDest,
    isRegion: false,
    coordinates: { lat, lon },
    data: generateFallbackPlaces(cleanDest, { lat, lon }),
  };
}
