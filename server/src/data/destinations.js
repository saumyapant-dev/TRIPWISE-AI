/**
 * Comprehensive Global Destinations Dataset (Backend)
 * Synchronized with frontend dataset: 178 cities across 56 countries
 */

export const DESTINATIONS_DATA = [
  // ==========================================
  // INDIA (Major, Medium-Sized & Hill Stations)
  // ==========================================
  { id: "chandigarh-in", city: "Chandigarh", region: "Punjab / Haryana", country: "India", coordinates: { lat: 30.7333, lon: 76.7794 }, popular: true },
  { id: "gwalior-in", city: "Gwalior", region: "Madhya Pradesh", country: "India", coordinates: { lat: 26.2183, lon: 78.1828 }, popular: true },
  { id: "bhopal-in", city: "Bhopal", region: "Madhya Pradesh", country: "India", coordinates: { lat: 23.2599, lon: 77.4126 }, popular: true },
  { id: "indore-in", city: "Indore", region: "Madhya Pradesh", country: "India", coordinates: { lat: 22.7196, lon: 75.8577 }, popular: true },
  { id: "lucknow-in", city: "Lucknow", region: "Uttar Pradesh", country: "India", coordinates: { lat: 26.8467, lon: 80.9462 }, popular: true },
  { id: "kanpur-in", city: "Kanpur", region: "Uttar Pradesh", country: "India", coordinates: { lat: 26.4499, lon: 80.3319 }, popular: false },
  { id: "amritsar-in", city: "Amritsar", region: "Punjab", country: "India", coordinates: { lat: 31.634, lon: 74.8723 }, popular: true },
  { id: "udaipur-in", city: "Udaipur", region: "Rajasthan", country: "India", coordinates: { lat: 24.5854, lon: 73.7125 }, popular: true },
  { id: "jodhpur-in", city: "Jodhpur", region: "Rajasthan", country: "India", coordinates: { lat: 26.2389, lon: 73.0243 }, popular: true },
  { id: "jaipur-in", city: "Jaipur", region: "Rajasthan", country: "India", coordinates: { lat: 26.9124, lon: 75.7873 }, popular: true },
  { id: "varanasi-in", city: "Varanasi", region: "Uttar Pradesh", country: "India", coordinates: { lat: 25.3176, lon: 82.9739 }, popular: true },
  { id: "hyderabad-in", city: "Hyderabad", region: "Telangana", country: "India", coordinates: { lat: 17.385, lon: 78.4867 }, popular: true },
  { id: "bengaluru-in", city: "Bengaluru", region: "Karnataka", country: "India", coordinates: { lat: 12.9716, lon: 77.5946 }, popular: true },
  { id: "mysuru-in", city: "Mysuru", region: "Karnataka", country: "India", coordinates: { lat: 12.2958, lon: 76.6394 }, popular: true },
  { id: "chennai-in", city: "Chennai", region: "Tamil Nadu", country: "India", coordinates: { lat: 13.0827, lon: 80.2707 }, popular: true },
  { id: "ooty-in", city: "Ooty", region: "Tamil Nadu", country: "India", coordinates: { lat: 11.4102, lon: 76.695 }, popular: true },
  { id: "kolkata-in", city: "Kolkata", region: "West Bengal", country: "India", coordinates: { lat: 22.5726, lon: 88.3639 }, popular: true },
  { id: "darjeeling-in", city: "Darjeeling", region: "West Bengal", country: "India", coordinates: { lat: 27.041, lon: 88.2663 }, popular: true },
  { id: "pune-in", city: "Pune", region: "Maharashtra", country: "India", coordinates: { lat: 18.5204, lon: 73.8567 }, popular: true },
  { id: "mumbai-in", city: "Mumbai", region: "Maharashtra", country: "India", coordinates: { lat: 19.076, lon: 72.8777 }, popular: true },
  { id: "nagpur-in", city: "Nagpur", region: "Maharashtra", country: "India", coordinates: { lat: 21.1458, lon: 79.0882 }, popular: false },
  { id: "ahmedabad-in", city: "Ahmedabad", region: "Gujarat", country: "India", coordinates: { lat: 23.0225, lon: 72.5714 }, popular: true },
  { id: "surat-in", city: "Surat", region: "Gujarat", country: "India", coordinates: { lat: 21.1702, lon: 72.8311 }, popular: false },
  { id: "vadodara-in", city: "Vadodara", region: "Gujarat", country: "India", coordinates: { lat: 22.3072, lon: 73.1812 }, popular: false },
  { id: "rishikesh-in", city: "Rishikesh", region: "Uttarakhand", country: "India", coordinates: { lat: 30.0869, lon: 78.2676 }, popular: true },
  { id: "haridwar-in", city: "Haridwar", region: "Uttarakhand", country: "India", coordinates: { lat: 29.9457, lon: 78.1642 }, popular: false },
  { id: "dehradun-in", city: "Dehradun", region: "Uttarakhand", country: "India", coordinates: { lat: 30.3165, lon: 78.0322 }, popular: false },
  { id: "dharamshala-in", city: "Dharamshala", region: "Himachal Pradesh", country: "India", coordinates: { lat: 32.219, lon: 76.3234 }, popular: true },
  { id: "manali-in", city: "Manali", region: "Himachal Pradesh", country: "India", coordinates: { lat: 32.2432, lon: 77.1892 }, popular: true },
  { id: "shimla-in", city: "Shimla", region: "Himachal Pradesh", country: "India", coordinates: { lat: 31.1048, lon: 77.1734 }, popular: true },
  { id: "delhi-in", city: "Delhi", region: "National Capital Region", country: "India", coordinates: { lat: 28.6139, lon: 77.209 }, popular: true },
  { id: "new-delhi-in", city: "New Delhi", region: "National Capital Region", country: "India", coordinates: { lat: 28.6139, lon: 77.209 }, popular: true },
  { id: "agra-in", city: "Agra", region: "Uttar Pradesh", country: "India", coordinates: { lat: 27.1767, lon: 78.0081 }, popular: true },
  { id: "kochi-in", city: "Kochi", region: "Kerala", country: "India", coordinates: { lat: 9.9312, lon: 76.2673 }, popular: true },
  { id: "munnar-in", city: "Munnar", region: "Kerala", country: "India", coordinates: { lat: 10.0889, lon: 77.0595 }, popular: true },
  { id: "alappuzha-in", city: "Alappuzha", region: "Kerala", country: "India", coordinates: { lat: 9.4981, lon: 76.3388 }, popular: true },
  { id: "varkala-in", city: "Varkala", region: "Kerala", country: "India", coordinates: { lat: 8.7379, lon: 76.7163 }, popular: false },
  { id: "kerala-in", city: "Kerala", region: "South India", country: "India", coordinates: { lat: 9.9312, lon: 76.2673 }, popular: true },
  { id: "goa-in", city: "Goa", region: "Western Coast", country: "India", coordinates: { lat: 15.2993, lon: 74.124 }, popular: true },
  { id: "srinagar-in", city: "Srinagar", region: "Jammu and Kashmir", country: "India", coordinates: { lat: 34.0837, lon: 74.7973 }, popular: true },
  { id: "gulmarg-in", city: "Gulmarg", region: "Jammu and Kashmir", country: "India", coordinates: { lat: 34.0484, lon: 74.3805 }, popular: true },
  { id: "leh-in", city: "Leh", region: "Ladakh", country: "India", coordinates: { lat: 34.1526, lon: 77.5771 }, popular: true },
  { id: "guwahati-in", city: "Guwahati", region: "Assam", country: "India", coordinates: { lat: 26.1445, lon: 91.7362 }, popular: true },
  { id: "shillong-in", city: "Shillong", region: "Meghalaya", country: "India", coordinates: { lat: 25.5788, lon: 91.8933 }, popular: true },
  { id: "gangtok-in", city: "Gangtok", region: "Sikkim", country: "India", coordinates: { lat: 27.3389, lon: 88.6065 }, popular: true },
  { id: "patna-in", city: "Patna", region: "Bihar", country: "India", coordinates: { lat: 25.5941, lon: 85.1376 }, popular: false },
  { id: "bhubaneswar-in", city: "Bhubaneswar", region: "Odisha", country: "India", coordinates: { lat: 20.2961, lon: 85.8245 }, popular: false },
  { id: "visakhapatnam-in", city: "Visakhapatnam", region: "Andhra Pradesh", country: "India", coordinates: { lat: 17.6868, lon: 83.2185 }, popular: false },
  { id: "coimbatore-in", city: "Coimbatore", region: "Tamil Nadu", country: "India", coordinates: { lat: 11.0168, lon: 76.9558 }, popular: false },
  { id: "madurai-in", city: "Madurai", region: "Tamil Nadu", country: "India", coordinates: { lat: 9.9252, lon: 78.1198 }, popular: false },

  // ==========================================
  // GREECE
  // ==========================================
  { id: "athens-gr", city: "Athens", region: "Attica", country: "Greece", coordinates: { lat: 37.9838, lon: 23.7275 }, popular: true },
  { id: "santorini-gr", city: "Santorini", region: "South Aegean", country: "Greece", coordinates: { lat: 36.3932, lon: 25.4615 }, popular: true },
  { id: "mykonos-gr", city: "Mykonos", region: "South Aegean", country: "Greece", coordinates: { lat: 37.4467, lon: 25.3289 }, popular: true },
  { id: "thessaloniki-gr", city: "Thessaloniki", region: "Central Macedonia", country: "Greece", coordinates: { lat: 40.6401, lon: 22.9444 }, popular: false },
  { id: "heraklion-gr", city: "Heraklion", region: "Crete", country: "Greece", coordinates: { lat: 35.3387, lon: 25.1442 }, popular: true },
  { id: "rhodes-gr", city: "Rhodes", region: "Dodecanese", country: "Greece", coordinates: { lat: 36.4349, lon: 28.2175 }, popular: false },
  { id: "corfu-gr", city: "Corfu", region: "Ionian Islands", country: "Greece", coordinates: { lat: 39.6243, lon: 19.9217 }, popular: false },
  { id: "chania-gr", city: "Chania", region: "Crete", country: "Greece", coordinates: { lat: 35.5138, lon: 24.018 }, popular: false },

  // ==========================================
  // AFRICA
  // ==========================================
  { id: "nairobi-ke", city: "Nairobi", region: "Nairobi County", country: "Kenya", coordinates: { lat: -1.2921, lon: 36.8219 }, popular: true },
  { id: "mombasa-ke", city: "Mombasa", region: "Coast Province", country: "Kenya", coordinates: { lat: -4.0435, lon: 39.6682 }, popular: false },
  { id: "cairo-eg", city: "Cairo", region: "Cairo Governorate", country: "Egypt", coordinates: { lat: 30.0444, lon: 31.2357 }, popular: true },
  { id: "alexandria-eg", city: "Alexandria", region: "Alexandria Governorate", country: "Egypt", coordinates: { lat: 31.2001, lon: 29.9187 }, popular: false },
  { id: "cape-town-za", city: "Cape Town", region: "Western Cape", country: "South Africa", coordinates: { lat: -33.9249, lon: 18.4241 }, popular: true },
  { id: "johannesburg-za", city: "Johannesburg", region: "Gauteng", country: "South Africa", coordinates: { lat: -26.2041, lon: 28.0473 }, popular: true },
  { id: "marrakech-ma", city: "Marrakech", region: "Marrakech-Safi", country: "Morocco", coordinates: { lat: 31.6295, lon: -7.9811 }, popular: true },
  { id: "casablanca-ma", city: "Casablanca", region: "Casablanca-Settat", country: "Morocco", coordinates: { lat: 33.5731, lon: -7.5898 }, popular: false },
  { id: "zanzibar-tz", city: "Zanzibar City", region: "Unguja", country: "Tanzania", coordinates: { lat: -6.1659, lon: 39.2026 }, popular: true },
  { id: "kigali-rw", city: "Kigali", region: "Kigali Province", country: "Rwanda", coordinates: { lat: -1.9706, lon: 30.1044 }, popular: false },
  { id: "lagos-ng", city: "Lagos", region: "Lagos State", country: "Nigeria", coordinates: { lat: 6.5244, lon: 3.3792 }, popular: true },
  { id: "addis-ababa-et", city: "Addis Ababa", region: "Shewa", country: "Ethiopia", coordinates: { lat: 9.032, lon: 38.748 }, popular: false },
  { id: "accra-gh", city: "Accra", region: "Greater Accra", country: "Ghana", coordinates: { lat: 5.6037, lon: -0.187 }, popular: false },

  // ==========================================
  // EAST & SOUTHEAST ASIA
  // ==========================================
  { id: "tokyo-jp", city: "Tokyo", region: "Kanto", country: "Japan", coordinates: { lat: 35.6762, lon: 139.6503 }, popular: true },
  { id: "kyoto-jp", city: "Kyoto", region: "Kansai", country: "Japan", coordinates: { lat: 35.0116, lon: 135.7681 }, popular: true },
  { id: "osaka-jp", city: "Osaka", region: "Kansai", country: "Japan", coordinates: { lat: 34.6937, lon: 135.5023 }, popular: true },
  { id: "sapporo-jp", city: "Sapporo", region: "Hokkaido", country: "Japan", coordinates: { lat: 43.0618, lon: 141.3545 }, popular: false },
  { id: "hiroshima-jp", city: "Hiroshima", region: "Chugoku", country: "Japan", coordinates: { lat: 34.3853, lon: 132.4553 }, popular: false },
  { id: "fukuoka-jp", city: "Fukuoka", region: "Kyushu", country: "Japan", coordinates: { lat: 33.5904, lon: 130.4017 }, popular: false },

  { id: "seoul-kr", city: "Seoul", region: "Seoul Capital Area", country: "South Korea", coordinates: { lat: 37.5665, lon: 126.978 }, popular: true },
  { id: "busan-kr", city: "Busan", region: "Yeongnam", country: "South Korea", coordinates: { lat: 35.1796, lon: 129.0756 }, popular: true },
  { id: "jeju-kr", city: "Jeju Island", region: "Jeju Province", country: "South Korea", coordinates: { lat: 33.4996, lon: 126.5312 }, popular: true },
  { id: "incheon-kr", city: "Incheon", region: "Sudogwon", country: "South Korea", coordinates: { lat: 37.4563, lon: 126.7052 }, popular: false },

  { id: "bangkok-th", city: "Bangkok", region: "Central Thailand", country: "Thailand", coordinates: { lat: 13.7563, lon: 100.5018 }, popular: true },
  { id: "phuket-th", city: "Phuket", region: "Southern Thailand", country: "Thailand", coordinates: { lat: 7.8804, lon: 98.3923 }, popular: true },
  { id: "chiang-mai-th", city: "Chiang Mai", region: "Northern Thailand", country: "Thailand", coordinates: { lat: 18.7883, lon: 98.9853 }, popular: true },
  { id: "krabi-th", city: "Krabi", region: "Southern Thailand", country: "Thailand", coordinates: { lat: 8.0863, lon: 98.9063 }, popular: false },

  { id: "singapore-sg", city: "Singapore", region: "Central Region", country: "Singapore", coordinates: { lat: 1.3521, lon: 103.8198 }, popular: true },

  { id: "bali-id", city: "Bali", region: "Lesser Sunda Islands", country: "Indonesia", coordinates: { lat: -8.4095, lon: 115.1889 }, popular: true },
  { id: "ubud-id", city: "Ubud", region: "Bali", country: "Indonesia", coordinates: { lat: -8.5069, lon: 115.2625 }, popular: true },
  { id: "jakarta-id", city: "Jakarta", region: "Java", country: "Indonesia", coordinates: { lat: -6.2088, lon: 106.8456 }, popular: false },

  { id: "kuala-lumpur-my", city: "Kuala Lumpur", region: "Federal Territory", country: "Malaysia", coordinates: { lat: 3.139, lon: 101.6869 }, popular: true },
  { id: "penang-my", city: "Penang", region: "George Town", country: "Malaysia", coordinates: { lat: 5.4164, lon: 100.3327 }, popular: false },

  { id: "hanoi-vn", city: "Hanoi", region: "Red River Delta", country: "Vietnam", coordinates: { lat: 21.0285, lon: 105.8542 }, popular: true },
  { id: "ho-chi-minh-vn", city: "Ho Chi Minh City", region: "Southeast", country: "Vietnam", coordinates: { lat: 10.8231, lon: 106.6297 }, popular: true },
  { id: "da-nang-vn", city: "Da Nang", region: "South Central Coast", country: "Vietnam", coordinates: { lat: 16.0544, lon: 108.2022 }, popular: false },

  { id: "hong-kong-hk", city: "Hong Kong", region: "Kowloon / HK Island", country: "Hong Kong", coordinates: { lat: 22.3193, lon: 114.1694 }, popular: true },
  { id: "taipei-tw", city: "Taipei", region: "Northern Taiwan", country: "Taiwan", coordinates: { lat: 25.033, lon: 121.5654 }, popular: true },
  { id: "beijing-cn", city: "Beijing", region: "Hebei Border", country: "China", coordinates: { lat: 39.9042, lon: 116.4074 }, popular: true },
  { id: "shanghai-cn", city: "Shanghai", region: "East China", country: "China", coordinates: { lat: 31.2304, lon: 121.4737 }, popular: true },

  // ==========================================
  // MIDDLE EAST & CENTRAL ASIA
  // ==========================================
  { id: "dubai-ae", city: "Dubai", region: "Emirate of Dubai", country: "United Arab Emirates", coordinates: { lat: 25.2048, lon: 55.2708 }, popular: true },
  { id: "abu-dhabi-ae", city: "Abu Dhabi", region: "Emirate of Abu Dhabi", country: "United Arab Emirates", coordinates: { lat: 24.4539, lon: 54.3773 }, popular: true },
  { id: "doha-qa", city: "Doha", region: "Ad-Dawhah", country: "Qatar", coordinates: { lat: 25.2854, lon: 51.531 }, popular: true },
  { id: "riyadh-sa", city: "Riyadh", region: "Riyadh Province", country: "Saudi Arabia", coordinates: { lat: 24.7136, lon: 46.6753 }, popular: false },
  { id: "muscat-om", city: "Muscat", region: "Muscat Governorate", country: "Oman", coordinates: { lat: 23.588, lon: 58.3829 }, popular: false },
  { id: "istanbul-tr", city: "Istanbul", region: "Marmara", country: "Turkey", coordinates: { lat: 41.0082, lon: 28.9784 }, popular: true },
  { id: "cappadocia-tr", city: "Cappadocia", region: "Central Anatolia", country: "Turkey", coordinates: { lat: 38.6431, lon: 34.8289 }, popular: true },
  { id: "kathmandu-np", city: "Kathmandu", region: "Bagmati", country: "Nepal", coordinates: { lat: 27.7172, lon: 85.324 }, popular: true },
  { id: "colombo-lk", city: "Colombo", region: "Western Province", country: "Sri Lanka", coordinates: { lat: 6.9271, lon: 79.8612 }, popular: false },
  { id: "male-mv", city: "Malé", region: "Kaafu Atoll", country: "Maldives", coordinates: { lat: 4.1755, lon: 73.5093 }, popular: true },

  // ==========================================
  // EUROPE
  // ==========================================
  { id: "paris-fr", city: "Paris", region: "Île-de-France", country: "France", coordinates: { lat: 48.8566, lon: 2.3522 }, popular: true },
  { id: "nice-fr", city: "Nice", region: "Provence-Alpes-Côte d'Azur", country: "France", coordinates: { lat: 43.7102, lon: 7.262 }, popular: true },
  { id: "lyon-fr", city: "Lyon", region: "Auvergne-Rhône-Alpes", country: "France", coordinates: { lat: 45.764, lon: 4.8357 }, popular: false },
  { id: "marseille-fr", city: "Marseille", region: "Provence", country: "France", coordinates: { lat: 43.2965, lon: 5.3698 }, popular: false },
  { id: "bordeaux-fr", city: "Bordeaux", region: "Nouvelle-Aquitaine", country: "France", coordinates: { lat: 44.8378, lon: -0.5792 }, popular: false },

  { id: "london-uk", city: "London", region: "Greater London", country: "United Kingdom", coordinates: { lat: 51.5074, lon: -0.1278 }, popular: true },
  { id: "edinburgh-uk", city: "Edinburgh", region: "Scotland", country: "United Kingdom", coordinates: { lat: 55.9533, lon: -3.1883 }, popular: true },
  { id: "manchester-uk", city: "Manchester", region: "North West England", country: "United Kingdom", coordinates: { lat: 53.4808, lon: -2.2426 }, popular: false },
  { id: "oxford-uk", city: "Oxford", region: "Oxfordshire", country: "United Kingdom", coordinates: { lat: 51.752, lon: -1.2577 }, popular: false },

  { id: "rome-it", city: "Rome", region: "Lazio", country: "Italy", coordinates: { lat: 41.9028, lon: 12.4964 }, popular: true },
  { id: "florence-it", city: "Florence", region: "Tuscany", country: "Italy", coordinates: { lat: 43.7696, lon: 11.2558 }, popular: true },
  { id: "venice-it", city: "Venice", region: "Veneto", country: "Italy", coordinates: { lat: 45.4408, lon: 12.3155 }, popular: true },
  { id: "milan-it", city: "Milan", region: "Lombardy", country: "Italy", coordinates: { lat: 45.4642, lon: 9.19 }, popular: true },
  { id: "naples-it", city: "Naples", region: "Campania", country: "Italy", coordinates: { lat: 40.8518, lon: 14.2681 }, popular: false },

  { id: "barcelona-es", city: "Barcelona", region: "Catalonia", country: "Spain", coordinates: { lat: 41.3851, lon: 2.1734 }, popular: true },
  { id: "madrid-es", city: "Madrid", region: "Community of Madrid", country: "Spain", coordinates: { lat: 40.4168, lon: -3.7038 }, popular: true },
  { id: "seville-es", city: "Seville", region: "Andalusia", country: "Spain", coordinates: { lat: 37.3891, lon: -5.9845 }, popular: false },
  { id: "valencia-es", city: "Valencia", region: "Valencian Community", country: "Spain", coordinates: { lat: 39.4699, lon: -0.3763 }, popular: false },

  { id: "berlin-de", city: "Berlin", region: "Berlin State", country: "Germany", coordinates: { lat: 52.52, lon: 13.405 }, popular: true },
  { id: "munich-de", city: "Munich", region: "Bavaria", country: "Germany", coordinates: { lat: 48.1351, lon: 11.582 }, popular: true },
  { id: "frankfurt-de", city: "Frankfurt", region: "Hesse", country: "Germany", coordinates: { lat: 50.1109, lon: 8.6821 }, popular: false },

  { id: "amsterdam-nl", city: "Amsterdam", region: "North Holland", country: "Netherlands", coordinates: { lat: 52.3676, lon: 4.9041 }, popular: true },
  { id: "rotterdam-nl", city: "Rotterdam", region: "South Holland", country: "Netherlands", coordinates: { lat: 51.9244, lon: 4.4777 }, popular: false },

  { id: "zurich-ch", city: "Zurich", region: "Canton of Zurich", country: "Switzerland", coordinates: { lat: 47.3769, lon: 8.5417 }, popular: true },
  { id: "geneva-ch", city: "Geneva", region: "Canton of Geneva", country: "Switzerland", coordinates: { lat: 46.2044, lon: 6.1432 }, popular: true },
  { id: "lucerne-ch", city: "Lucerne", region: "Canton of Lucerne", country: "Switzerland", coordinates: { lat: 47.0502, lon: 8.3093 }, popular: true },
  { id: "interlaken-ch", city: "Interlaken", region: "Bernese Oberland", country: "Switzerland", coordinates: { lat: 46.6863, lon: 7.8632 }, popular: true },

  { id: "vienna-at", city: "Vienna", region: "Vienna State", country: "Austria", coordinates: { lat: 48.2082, lon: 16.3738 }, popular: true },
  { id: "salzburg-at", city: "Salzburg", region: "Salzburg State", country: "Austria", coordinates: { lat: 47.8095, lon: 13.055 }, popular: false },

  { id: "prague-cz", city: "Prague", region: "Bohemia", country: "Czech Republic", coordinates: { lat: 50.0755, lon: 14.4378 }, popular: true },
  { id: "budapest-hu", city: "Budapest", region: "Central Hungary", country: "Hungary", coordinates: { lat: 47.4979, lon: 19.0402 }, popular: true },
  { id: "lisbon-pt", city: "Lisbon", region: "Lisbon District", country: "Portugal", coordinates: { lat: 38.7223, lon: -9.1393 }, popular: true },
  { id: "porto-pt", city: "Porto", region: "Norte", country: "Portugal", coordinates: { lat: 41.1579, lon: -8.6291 }, popular: false },
  { id: "dublin-ie", city: "Dublin", region: "Leinster", country: "Ireland", coordinates: { lat: 53.3498, lon: -6.2603 }, popular: true },
  { id: "brussels-be", city: "Brussels", region: "Brussels-Capital", country: "Belgium", coordinates: { lat: 50.8503, lon: 4.3517 }, popular: false },
  { id: "copenhagen-dk", city: "Copenhagen", region: "Capital Region", country: "Denmark", coordinates: { lat: 55.6761, lon: 12.5683 }, popular: true },
  { id: "stockholm-se", city: "Stockholm", region: "Stockholm County", country: "Sweden", coordinates: { lat: 59.3293, lon: 18.0686 }, popular: true },
  { id: "oslo-no", city: "Oslo", region: "Eastern Norway", country: "Norway", coordinates: { lat: 59.9139, lon: 10.7522 }, popular: false },
  { id: "reykjavik-is", city: "Reykjavik", region: "Capital Region", country: "Iceland", coordinates: { lat: 64.1466, lon: -21.9426 }, popular: true },

  // ==========================================
  // NORTH AMERICA
  // ==========================================
  { id: "new-york-us", city: "New York", region: "New York", country: "United States", coordinates: { lat: 40.7128, lon: -74.006 }, popular: true },
  { id: "san-francisco-us", city: "San Francisco", region: "California", country: "United States", coordinates: { lat: 37.7749, lon: -122.4194 }, popular: true },
  { id: "los-angeles-us", city: "Los Angeles", region: "California", country: "United States", coordinates: { lat: 34.0522, lon: -118.2437 }, popular: true },
  { id: "chicago-us", city: "Chicago", region: "Illinois", country: "United States", coordinates: { lat: 41.8781, lon: -87.6298 }, popular: true },
  { id: "miami-us", city: "Miami", region: "Florida", country: "United States", coordinates: { lat: 25.7617, lon: -80.1918 }, popular: true },
  { id: "las-vegas-us", city: "Las Vegas", region: "Nevada", country: "United States", coordinates: { lat: 36.1699, lon: -115.1398 }, popular: true },
  { id: "seattle-us", city: "Seattle", region: "Washington", country: "United States", coordinates: { lat: 47.6062, lon: -122.3321 }, popular: false },
  { id: "boston-us", city: "Boston", region: "Massachusetts", country: "United States", coordinates: { lat: 42.3601, lon: -71.0589 }, popular: false },
  { id: "washington-us", city: "Washington D.C.", region: "District of Columbia", country: "United States", coordinates: { lat: 38.9072, lon: -77.0369 }, popular: false },
  { id: "honolulu-us", city: "Honolulu", region: "Hawaii", country: "United States", coordinates: { lat: 21.3069, lon: -157.8583 }, popular: true },

  { id: "toronto-ca", city: "Toronto", region: "Ontario", country: "Canada", coordinates: { lat: 43.6532, lon: -79.3832 }, popular: true },
  { id: "vancouver-ca", city: "Vancouver", region: "British Columbia", country: "Canada", coordinates: { lat: 49.2827, lon: -123.1207 }, popular: true },
  { id: "montreal-ca", city: "Montreal", region: "Quebec", country: "Canada", coordinates: { lat: 45.5017, lon: -73.5673 }, popular: true },
  { id: "calgary-ca", city: "Calgary", region: "Alberta", country: "Canada", coordinates: { lat: 51.0447, lon: -114.0719 }, popular: false },

  { id: "mexico-city-mx", city: "Mexico City", region: "Federal District", country: "Mexico", coordinates: { lat: 19.4326, lon: -99.1332 }, popular: true },
  { id: "cancun-mx", city: "Cancun", region: "Quintana Roo", country: "Mexico", coordinates: { lat: 21.1619, lon: -86.8515 }, popular: true },
  { id: "oaxaca-mx", city: "Oaxaca", region: "Oaxaca State", country: "Mexico", coordinates: { lat: 17.0732, lon: -96.7266 }, popular: false },

  // ==========================================
  // SOUTH AMERICA
  // ==========================================
  { id: "buenos-aires-ar", city: "Buenos Aires", region: "Autonomous City", country: "Argentina", coordinates: { lat: -34.6037, lon: -58.3816 }, popular: true },
  { id: "rio-de-janeiro-br", city: "Rio de Janeiro", region: "State of Rio", country: "Brazil", coordinates: { lat: -22.9068, lon: -43.1729 }, popular: true },
  { id: "sao-paulo-br", city: "São Paulo", region: "State of São Paulo", country: "Brazil", coordinates: { lat: -23.5505, lon: -46.6333 }, popular: false },
  { id: "lima-pe", city: "Lima", region: "Lima Province", country: "Peru", coordinates: { lat: -12.0464, lon: -77.0428 }, popular: true },
  { id: "cusco-pe", city: "Cusco", region: "Cusco Region", country: "Peru", coordinates: { lat: -13.5319, lon: -71.9675 }, popular: true },
  { id: "santiago-cl", city: "Santiago", region: "Santiago Metropolitan", country: "Chile", coordinates: { lat: -33.4489, lon: -70.6693 }, popular: false },
  { id: "bogota-co", city: "Bogotá", region: "Capital District", country: "Colombia", coordinates: { lat: 4.711, lon: -74.0721 }, popular: false },

  // ==========================================
  // AUSTRALIA & OCEANIA
  // ==========================================
  { id: "sydney-au", city: "Sydney", region: "New South Wales", country: "Australia", coordinates: { lat: -33.8688, lon: 151.2093 }, popular: true },
  { id: "melbourne-au", city: "Melbourne", region: "Victoria", country: "Australia", coordinates: { lat: -37.8136, lon: 144.9631 }, popular: true },
  { id: "brisbane-au", city: "Brisbane", region: "Queensland", country: "Australia", coordinates: { lat: -27.4698, lon: 153.0251 }, popular: false },
  { id: "perth-au", city: "Perth", region: "Western Australia", country: "Australia", coordinates: { lat: -31.9505, lon: 115.8605 }, popular: false },
  { id: "cairns-au", city: "Cairns", region: "Queensland", country: "Australia", coordinates: { lat: -16.9186, lon: 145.7781 }, popular: true },
  { id: "auckland-nz", city: "Auckland", region: "North Island", country: "New Zealand", coordinates: { lat: -36.8485, lon: 174.7633 }, popular: true },
  { id: "queenstown-nz", city: "Queenstown", region: "South Island", country: "New Zealand", coordinates: { lat: -45.0312, lon: 168.6626 }, popular: true },
];

/**
 * List of sorted, distinct countries represented in the database.
 */

export function searchLocalDestinations(query = "", country = "") {
  if (!query && !country) return DESTINATIONS_DATA;
  const q = (query || "").trim().toLowerCase();
  const cTarget = (country || "").trim().toLowerCase();

  return DESTINATIONS_DATA.filter((d) => {
    if (cTarget && cTarget !== "all" && d.country.toLowerCase() !== cTarget) {
      return false;
    }
    if (!q) return true;
    return (
      d.city.toLowerCase().includes(q) ||
      (d.region && d.region.toLowerCase().includes(q)) ||
      d.country.toLowerCase().includes(q)
    );
  });
}

export function findDestination(city, country = "") {
  if (!city) return null;
  const c = city.trim().toLowerCase();
  return DESTINATIONS_DATA.find((d) => d.city.toLowerCase() === c) || null;
}
