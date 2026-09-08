import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    "";
  if (!apiKey) {
    console.warn("No GEMINI_API_KEY or GOOGLE_API_KEY found in environment variables.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

// Destination-specific multi-day itineraries with 100% authentic, distinct activities
const CURATED_DESTINATION_ITINERARIES = {
  seoul: [
    {
      title: "Royal Palaces & Historic Bukchon Enclave",
      activities: [
        { time: "09:00 AM", title: "Gyeongbokgung Palace Royal Guard Ceremony", type: "Sightseeing", location: "Jongno-gu, Seoul", description: "Witness the colorful royal guard changing ceremony in the Joseon dynasty's primary throne palace.", duration: "2.5 Hours", cost: "$3", rating: 4.9, bookingRequired: false, bestTime: "Morning", additionalDetails: "Wearing a traditional Hanbok grants free admission to the palace grounds.", aiRecommendation: "Arrive by 09:30 AM to secure a prime front-row spot for the 10:00 AM guard ceremony." },
        { time: "12:30 PM", title: "Tosokchon Traditional Samgyetang", type: "Dining", location: "Jahadong, Seoul", description: "Feast on tender whole young chicken stuffed with Korean ginseng, glutinous rice, and chestnuts.", duration: "1.5 Hours", cost: "$16", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Vegetarian bibimbap available on request.", aiRecommendation: "Pair your soup with their house-fermented aged radish kimchi." },
        { time: "02:30 PM", title: "Bukchon Hanok Village Heritage Walk", type: "Sightseeing", location: "Bukchon, Seoul", description: "Stroll along preserved hilltop alleyways lined with 600-year-old traditional Korean wooden houses.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Bukchon is an active residential neighborhood; please keep voices quiet.", aiRecommendation: "The 5th & 6th Alley viewpoints frame tile rooftops against modern Seoul skyscrapers." },
        { time: "06:30 PM", title: "Insadong Artisan Tea & Ssamziegil", type: "Sightseeing", location: "Insadong-gil, Seoul", description: "Explore spiraling artisan craft galleries followed by fermented persimmon tea in a courtyard hanok.", duration: "2 Hours", cost: "$12", rating: 4.7, bookingRequired: false, bestTime: "Evening", additionalDetails: "Great area to purchase authentic Korean celadon ceramics and calligraphy brushes.", aiRecommendation: "Visit the rooftop sky garden of Ssamziegil for lantern views." },
      ],
    },
    {
      title: "Skyline Panoramas & Myeongdong Night Street",
      activities: [
        { time: "09:30 AM", title: "Changdeokgung Palace & Secret Huwon Garden", type: "Sightseeing", location: "Jongno-gu, Seoul", description: "Tour the UNESCO-listed royal palace and its private wooded garden with lily pavilions.", duration: "2.5 Hours", cost: "$8", rating: 4.9, bookingRequired: true, bestTime: "Morning", additionalDetails: "Secret Garden guided tour requires advance ticket reservation online.", aiRecommendation: "The Buyongji pond pavilion offers Korea's most famous Joseon garden view." },
        { time: "12:30 PM", title: "Myeongdong Kyoja Handmade Dumplings", type: "Dining", location: "Myeongdong, Seoul", description: "Michelin Bib Gourmand legacy eatery renowned for juicy steamed mandu and knife-cut noodle soup.", duration: "1 Hour", cost: "$11", rating: 4.7, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Free refill of broth and noodles provided upon request.", aiRecommendation: "Add a spoonful of their signature garlic chili kimchi into your noodle broth." },
        { time: "03:00 PM", title: "Namsan Cable Car & N Seoul Tower", type: "Sightseeing", location: "Namsan Mountain, Seoul", description: "Glide up Mount Namsan by cable car to the observation deck for 360-degree city views.", duration: "2.5 Hours", cost: "$14", rating: 4.8, bookingRequired: false, bestTime: "Late Afternoon", additionalDetails: "Love Locks terrace wraps around the base of the tower.", aiRecommendation: "Time your ascent for 45 minutes before sunset to watch the Seoul city lights turn on." },
        { time: "07:30 PM", title: "Myeongdong Night Market Food Crawl", type: "Dining", location: "Myeongdong Pedestrian Zone", description: "Sample grilled lobster tail with cheese, egg bread (gyeran-ppang), and strawberry mochi skewers.", duration: "2 Hours", cost: "$25", rating: 4.8, bookingRequired: false, bestTime: "Evening", additionalDetails: "Carry Korean Won cash or T-money card for small food carts.", aiRecommendation: "Try the torched beef sushi and twisted potato chips near the cathedral." },
      ],
    },
    {
      title: "Futuristic Design & Han River Sunset",
      activities: [
        { time: "10:00 AM", title: "Dongdaemun Design Plaza (DDP) Architecture", type: "Sightseeing", location: "Dongdaemun, Seoul", description: "Explore Zaha Hadid's silver neo-futuristic cultural complex and design museum halls.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Special design exhibitions inside require separate entry tickets.", aiRecommendation: "Walk the exterior curving rooftop ramps for dramatic architectural photography." },
        { time: "12:30 PM", title: "Gwangjang Market Bindaetteok & Mayak Gimbap", type: "Dining", location: "Jongno 4-ga, Seoul", description: "Sit at bustling wooden counters for sizzling mung bean pancakes and seaweed rice rolls.", duration: "1.5 Hours", cost: "$10", rating: 4.9, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Featured on Netflix Street Food; look for stall #24 Sunhee's Bindaetteok.", aiRecommendation: "Pair the crispy pancakes with chilled traditional makgeolli rice wine." },
        { time: "03:00 PM", title: "Seongsu-dong Industrial Cafe & Boutique District", type: "Sightseeing", location: "Seongdong-gu, Seoul", description: "Discover the 'Brooklyn of Seoul' where repurposed shoe factories house modern cafes and concept stores.", duration: "2.5 Hours", cost: "$15", rating: 4.7, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Walk through Seoul Forest park adjacent to the cafe enclave.", aiRecommendation: "Visit Cafe Onion Seongsu, an open-air industrial bakery housed in a 1970s factory." },
        { time: "07:00 PM", title: "Yeouido Han River Park Chimaek & Sunset", type: "Dining", location: "Yeouido, Han River", description: "Experience the beloved local ritual of crispy fried chicken and cold draft beer on the river lawns.", duration: "2.5 Hours", cost: "$22", rating: 4.9, bookingRequired: false, bestTime: "Evening", additionalDetails: "Rent a picnic mat at the park convenience stalls for $2.", aiRecommendation: "Rent a city bike (Ttareungyi) for a 30-minute ride along the water before dinner." },
      ],
    },
    {
      title: "Gangnam Glamour, Bongeunsa & COEX",
      activities: [
        { time: "09:30 AM", title: "Bongeunsa Ancient Buddhist Temple", type: "Sightseeing", location: "Gangnam-gu, Seoul", description: "Tranquil 8th-century temple featuring a giant 23-meter stone Maitreya Buddha amidst skyscrapers.", duration: "1.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Temple offers a dawn tea ceremony experience on selected mornings.", aiRecommendation: "The hillside path behind the stone Buddha offers a stunning contrast of ancient serenity and skyscrapers." },
        { time: "11:30 AM", title: "Starfield Library & COEX Underground Mall", type: "Sightseeing", location: "Samseong-dong, Gangnam", description: "Marvel at the monumental two-story 13-meter high bookshelves containing 50,000 volumes.", duration: "1.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Free admission and open seating throughout the atrium.", aiRecommendation: "Ride the central escalators for an iconic symmetrical photo." },
        { time: "01:30 PM", title: "Hanwoo Beef Barbecue Experience", type: "Dining", location: "Gangnam Station, Seoul", description: "Savor top-grade marbled Korean native beef grilled tableside over natural hardwood lump charcoal.", duration: "2 Hours", cost: "$55", rating: 4.9, bookingRequired: true, bestTime: "Lunch", additionalDetails: "Served with unlimited fresh perilla leaves, ssamjang dip, and steamed egg.", aiRecommendation: "Order cold buckwheat naengmyeon noodles to wrap with your grilled beef." },
        { time: "04:30 PM", title: "Apgujeong Rodeo & K-Star Road Walk", type: "Sightseeing", location: "Cheongdam-dong, Seoul", description: "Explore luxury fashion avenues and giant sculpted GangnamDoll bear statues of K-pop artists.", duration: "2 Hours", cost: "Free", rating: 4.6, bookingRequired: false, bestTime: "Late Afternoon", additionalDetails: "Visit nearby Dosan Park for trendy designer bakeries like Nudake.", aiRecommendation: "Drop into Tamburins flagship store for artistic fragrance installations." },
      ],
    },
    {
      title: "Youth Culture, Hongdae & Mangwon Market",
      activities: [
        { time: "10:00 AM", title: "Hongdae Indie Streets & Street Murals", type: "Sightseeing", location: "Mapo-gu, Seoul", description: "Walk vibrant university streets filled with student art murals, indie boutiques, and live buskers.", duration: "2 Hours", cost: "Free", rating: 4.7, bookingRequired: false, bestTime: "Morning", additionalDetails: "Weekends feature the Hongdae Free Market with local handmade crafts.", aiRecommendation: "Check out KT&G Sangsangmadang multi-floor design and cinema space." },
        { time: "12:30 PM", title: "Mangwon Neighborhood Market Lunch Crawl", type: "Dining", location: "Mangwon-dong, Seoul", description: "Sample sweet chili fried chicken bites (dakgangjeong), handmade croquettes, and hot knife noodles.", duration: "1.5 Hours", cost: "$12", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Authentic local market less crowded than downtown tourist markets.", aiRecommendation: "Try the fried chili pepper croquette at Mangwon Handmade Croquette." },
        { time: "02:30 PM", title: "Gyeongui Line Forest Park Walking Trail", type: "Sightseeing", location: "Yeonnam-dong, Seoul", description: "Stroll the picturesque urban greenway built over an abandoned century-old railroad track.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Known locally as 'Yeontral Park' lined with artisanal coffee shops.", aiRecommendation: "Pick up a pour-over drip coffee from Tailor Coffee along the park." },
        { time: "06:30 PM", title: "Korean Craft Beer & Chimaek in Yeonnam-dong", type: "Dining", location: "Yeonnam-dong, Mapo-gu", description: "Relax at a neighborhood microbrewery pairing local IPAs with golden garlic soy fried chicken.", duration: "2.5 Hours", cost: "$28", rating: 4.8, bookingRequired: false, bestTime: "Evening", additionalDetails: "Outdoor patio seating open on pleasant evenings.", aiRecommendation: "Sample Magpie Brewing Company's seasonal Korean wheat ale." },
      ],
    },
    {
      title: "National Heritage & Itaewon International Flavors",
      activities: [
        { time: "09:30 AM", title: "National Museum of Korea & Miru Pond", type: "Sightseeing", location: "Yongsan-gu, Seoul", description: "Discover Korea's greatest national treasures including the Ten-Story Marble Pagoda and Gold Crowns.", duration: "3 Hours", cost: "Free", rating: 4.9, bookingRequired: false, bestTime: "Morning", additionalDetails: "Permanent exhibition halls are completely free to the public.", aiRecommendation: "Walk through the reflection pavilion over Miru Pond outside the museum." },
        { time: "01:00 PM", title: "Itaewon International Fusion Bistro", type: "Dining", location: "Itaewon-dong, Seoul", description: "Dine at an award-winning fusion kitchen blending Korean ingredients with global gastronomy.", duration: "1.5 Hours", cost: "$24", rating: 4.7, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Halal, vegan, and gluten-free dining options abundant in this district.", aiRecommendation: "Try kimchi carnitas fries or gochujang pulled pork tacos." },
        { time: "03:00 PM", title: "Leeum Samsung Museum of Modern & Traditional Art", type: "Sightseeing", location: "Hannam-dong, Seoul", description: "Marvel at the private collection of traditional Joseon celadon and modern masters like Rothko.", duration: "2 Hours", cost: "$15", rating: 4.8, bookingRequired: true, bestTime: "Afternoon", additionalDetails: "Three buildings designed by Mario Botta, Jean Nouvel, and Rem Koolhaas.", aiRecommendation: "Book entry tickets online at least 7 days ahead." },
        { time: "06:30 PM", title: "Hannam-dong Wine Bar & Rooftop Views", type: "Dining", location: "Hannam-dong, Seoul", description: "Enjoy boutique natural wines and seasonal small plates overlooking the illuminated hillside.", duration: "2.5 Hours", cost: "$45", rating: 4.8, bookingRequired: true, bestTime: "Evening", additionalDetails: "Intimate seating with sweeping views of the Han River valley.", aiRecommendation: "Reserve an outdoor balcony table for twilight views." },
      ],
    },
    {
      title: "Lotte World Tower & Jamsil Lake Panoramas",
      activities: [
        { time: "09:30 AM", title: "Seoul Sky Observatory at Lotte World Tower", type: "Sightseeing", location: "Songpa-gu, Seoul", description: "Ascend 555 meters to the world's 6th tallest building with a glass-bottom sky deck at 478 meters.", duration: "2.5 Hours", cost: "$24", rating: 4.9, bookingRequired: true, bestTime: "Morning", additionalDetails: "Sky Shuttle double-deck elevator climbs at 10 meters per second.", aiRecommendation: "Step out onto the Sky Deck for a thrilling view straight down to the city below." },
        { time: "12:30 PM", title: "Jamsil Avenuel Gourmet Food Avenue", type: "Dining", location: "Lotte World Mall, Seoul", description: "Indulge in premium Japanese tonkatsu, handmade udon, or artisan Korean stews.", duration: "1.5 Hours", cost: "$22", rating: 4.7, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Extensive underground selection of award-winning regional restaurants.", aiRecommendation: "Try the aged black pork sirloin katsu with grated radish." },
        { time: "02:30 PM", title: "Seokchon Lake Cherry Tree Circuit Walk", type: "Sightseeing", location: "Jamsil-dong, Seoul", description: "Circumnavigate the peaceful 2.5-kilometer paved lakeside trail beneath willows and sculpture.", duration: "1.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Scenic lake divided into West and East basins with outdoor cafes.", aiRecommendation: "The West Lake bridge provides the best framed shot of the tower reflecting in the water." },
        { time: "06:30 PM", title: "Farewell Skyline Dining Overlooking the Han River", type: "Dining", location: "Apgujeong Riverside, Seoul", description: "Celebrate your Seoul journey with a multi-course royal tasting dinner and illuminated city horizons.", duration: "2.5 Hours", cost: "$65", rating: 4.9, bookingRequired: true, bestTime: "Evening", additionalDetails: "Smart casual dress recommended.", aiRecommendation: "Toast with premium Andong soju as the highway ribbon lights reflect across the river." },
      ],
    },
  ],
  busan: [
    {
      title: "Haeundae Coastal Splendor & Dongbaek Island",
      activities: [
        { time: "09:00 AM", title: "Haeundae White Sand Beach Promenade", type: "Sightseeing", location: "Haeundae-gu, Busan", description: "Breathe in ocean air along Korea's most iconic 1.5-kilometer curved urban beach.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Clean boardwalk suitable for comfortable walking or jogging.", aiRecommendation: "Morning lighting over the sea is peaceful before daytime crowds arrive." },
        { time: "11:30 AM", title: "Dongbaekseom Pine Coastal Trail & APEC House", type: "Sightseeing", location: "Dongbaek Island, Busan", description: "Walk wooden cliff paths through coastal pine groves leading to the historic Nurimaru APEC House.", duration: "1.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Check out the yellow mermaid statue perched on the shoreline boulders.", aiRecommendation: "The glass pavilion lookouts frame Gwangan Bridge across the bay." },
        { time: "01:30 PM", title: "Haeundae Traditional Market Seafood Lunch", type: "Dining", location: "Haeundae Market, Busan", description: "Enjoy freshly grilled hagfish (gomjangeo) tossed in spicy gochujang and seasonal seafood pancakes.", duration: "1.5 Hours", cost: "$20", rating: 4.7, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Tanks outside display live local catch; you can choose your seafood.", aiRecommendation: "Ask for stir-fried rice prepared in the remaining skillet sauce." },
        { time: "06:30 PM", title: "The Bay 101 Marine City Sunset & Beer", type: "Dining", location: "U-dong, Haeundae, Busan", description: "Dine on golden fish & chips by the yacht marina as glass skyscrapers reflect across the water.", duration: "2 Hours", cost: "$28", rating: 4.8, bookingRequired: false, bestTime: "Evening", additionalDetails: "Puddle reflection photos behind the parking deck are famous on social media.", aiRecommendation: "Grab an outdoor deck table 20 minutes before sunset." },
      ],
    },
    {
      title: "Gamcheon Culture Village & Jagalchi Harbor",
      activities: [
        { time: "09:30 AM", title: "Gamcheon Colorful Culture Village", type: "Sightseeing", location: "Saha-gu, Busan", description: "Navigate vibrant hillside alleyways lined with rainbow-painted cottages, murals, and sculpture.", duration: "2.5 Hours", cost: "Free", rating: 4.9, bookingRequired: false, bestTime: "Morning", additionalDetails: "Buy a stamp map at the entrance to collect postcards at hidden art points.", aiRecommendation: "Queue early for the iconic statue of The Little Prince overlooking the pastel town." },
        { time: "12:30 PM", title: "Jagalchi Live Fish Market Dining Hall", type: "Dining", location: "Nampo-dong, Busan", description: "Select live flounder, red sea bream, or king crab on the 1st floor; dine fresh on the 2nd floor.", duration: "1.5 Hours", cost: "$35", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Korea's largest seafood market operating continuously since 1889.", aiRecommendation: "Pair thinly sliced raw hoe fish with sesame leaves and wasabi soy." },
        { time: "02:30 PM", title: "BIFF Square & Ssiat Hotteok Stalls", type: "Sightseeing", location: "Jung-gu, Busan", description: "Walk the Busan International Film Festival handprint plaza and taste seed-stuffed hotteok griddles.", duration: "1.5 Hours", cost: "$5", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Celebrity directors and actors have handprints embedded in the pavement.", aiRecommendation: "The brown sugar and sunflower seed hotteok is served piping hot in a paper cup." },
        { time: "05:00 PM", title: "Busan Diamond Tower & Yongdusan Park", type: "Sightseeing", location: "Yongdusan, Busan", description: "Ascend 120 meters for panoramic sunset vistas across Busan harbor, docks, and bridges.", duration: "2 Hours", cost: "$9", rating: 4.7, bookingRequired: false, bestTime: "Sunset", additionalDetails: "Accessible via outdoor covered escalators from the Gwangbok-ro fashion street.", aiRecommendation: "The observation deck's interactive media art rooms provide fun evening photo ops." },
      ],
    },
    {
      title: "Seaside Temple & Songdo Marine Cable Car",
      activities: [
        { time: "09:00 AM", title: "Haedong Yonggungsa Cliffside Buddhist Temple", type: "Sightseeing", location: "Gijang-gun, Busan", description: "Visit Korea's most unique temple built dramatically on rocky coastal cliffs over crashing waves.", duration: "2.5 Hours", cost: "Free", rating: 4.9, bookingRequired: false, bestTime: "Morning", additionalDetails: "Cross the 108-step stone stairway symbolizing the release of worldly desires.", aiRecommendation: "Sunrise and early morning provide tranquil ocean spray and golden light on the pagoda." },
        { time: "12:30 PM", title: "Choryang Milmyeon Cold Wheat Noodles", type: "Dining", location: "Choryang-dong, Busan", description: "Cool down with Busan's historical wheat flour noodles served in icy beef and herb broth with dumplings.", duration: "1 Hour", cost: "$8", rating: 4.7, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Created by North Korean refugees during the Korean War using wheat flour rations.", aiRecommendation: "Use the table shears to cut the noodles once before stirring the chili sauce." },
        { time: "02:30 PM", title: "Songdo Marine Cable Car & Cloud Trails", type: "Sightseeing", location: "Songdo Beach, Busan", description: "Ride the crystal glass-bottom cable car 86 meters above ocean waves across Songdo Bay.", duration: "2 Hours", cost: "$17", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Stroll the Songdo Cloud Walk curved suspension footbridge over the sea.", aiRecommendation: "Opt for the 'Crystal Cruise' cabin with transparent glass floor." },
        { time: "06:30 PM", title: "Gwangalli Beach & Gwangan Bridge Light Show", type: "Dining", location: "Gwangalli Beach, Busan", description: "Dine at a beachside grill restaurant while the monumental suspension bridge illuminates the night sky.", duration: "2.5 Hours", cost: "$35", rating: 4.9, bookingRequired: false, bestTime: "Evening", additionalDetails: "Saturday nights feature a synchronized ocean drone light show over the bay.", aiRecommendation: "Get a second-floor terrace seat along the beach boulevard for unobstructed views." },
      ],
    },
    {
      title: "Taejongdae Cliffs & Yeongdo Coastal Enclave",
      activities: [
        { time: "09:30 AM", title: "Taejongdae Ocean Cliff Park & Lighthouse", type: "Sightseeing", location: "Yeongdo-gu, Busan", description: "Board the Danubi tram through coastal pine forests out to the 100-meter sheer sea cliff observatory.", duration: "3 Hours", cost: "$5", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "On clear days, Japan's Tsushima Island is visible across the Korea Strait.", aiRecommendation: "Climb down the boardwalk to the rocky sea shelf for dramatic wave photography." },
        { time: "01:00 PM", title: "Ssangdungi Dwaeji Gukbap (Pork Rice Soup)", type: "Dining", location: "Daeyeon-dong, Busan", description: "Indulge in Busan's soulful comfort food: rich boiled pork bone broth with tender sliced pork.", duration: "1 Hour", cost: "$9", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Season the milky broth with salted fermented shrimp (saeujeot) and garlic chives.", aiRecommendation: "Order the boiled pork slices (suyuk) plate alongside your soup." },
        { time: "02:30 PM", title: "Huinnyeoul Culture Village Coastal Walk", type: "Sightseeing", location: "Yeongdo Coastal Cliffs", description: "Wander the whitewashed cliffside village nicknamed the 'Santorini of Busan' above turquoise waves.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Filming location for famous Korean films including The Attorney and Nameless Gangster.", aiRecommendation: "Stop by the coastal tunnel entrance for a framed silhouette photo against the sea." },
        { time: "06:00 PM", title: "Yeongdo Waterfront Cafe & Roasted Seafood", type: "Dining", location: "Yeongdo Port, Busan", description: "Dine at seaside tented stalls (pojangmacha) serving grilled clams, abalone, and cold draft beer.", duration: "2 Hours", cost: "$30", rating: 4.7, bookingRequired: false, bestTime: "Evening", additionalDetails: "Listen to the ship horns and gentle lapping waves as dusk falls.", aiRecommendation: "Pair the grilled clams with butter and melted mozzarella." },
      ],
    },
    {
      title: "Beomeosa Mountain Temple & Geumjeongsan Fortress",
      activities: [
        { time: "09:00 AM", title: "Beomeosa Ancient Mountain Temple", type: "Sightseeing", location: "Geumjeong-gu, Busan", description: "Explore the 7th-century mountain sanctuary surrounded by wisteria woods on Mount Geumjeongsan.", duration: "2.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "One of the three major temples of southeastern Korea representing the Hwaeom sect.", aiRecommendation: "Walk through the One Pillar Gate (Jogamun) for serene forest acoustics." },
        { time: "12:30 PM", title: "Geumjeongsan Mountain Village Acorn Jelly & Duck", type: "Dining", location: "Sanseong Village, Busan", description: "Taste wood-grilled marinated duck and freshly pressed dotorimuk (acorn jelly) salad.", duration: "1.5 Hours", cost: "$22", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Pairs with Busan's designated regional heritage Makgeolli (Geumjeongsanseong Makgeolli).", aiRecommendation: "Try the pajeon green onion pancake crisp from the iron pan." },
        { time: "02:30 PM", title: "Geumjeongsanseong Mountain Fortress Wall Hike", type: "Sightseeing", location: "Mount Geumjeongsan", description: "Hike along sections of Korea's largest stone mountain fortress built in 1703.", duration: "2.5 Hours", cost: "Free", rating: 4.7, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Four grand gates protect the 17-kilometer defensive stone perimeter.", aiRecommendation: "The East Gate to North Gate ridge trail offers sweeping inland mountain panoramas." },
        { time: "06:30 PM", title: "Dongnae Hot Spring District & Pajeon Dinner", type: "Dining", location: "Dongnae-gu, Busan", description: "Relax with foot baths in Busan's oldest natural thermal spring district followed by Dongnae scallion pancakes.", duration: "2 Hours", cost: "$20", rating: 4.7, bookingRequired: false, bestTime: "Evening", additionalDetails: "Thermal water has been prized for healing minerals since the Silla Dynasty.", aiRecommendation: "Soak in the outdoor public foot bath before dinner." },
      ],
    },
    {
      title: "Oryukdo Skywalk & Igidae Ocean Cliff Trek",
      activities: [
        { time: "09:30 AM", title: "Oryukdo Glass Skywalk & Islets", type: "Sightseeing", location: "Nam-gu, Busan", description: "Step onto the horse-shoe glass deck protruding 35 meters above the crashing surf where East and South Seas meet.", duration: "2 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Morning", additionalDetails: "Shoe covers provided free at the skywalk entrance.", aiRecommendation: "Count the rocky islets: depending on the tide, 5 or 6 islands appear." },
        { time: "12:30 PM", title: "Gijang Snow Crab Market Feast", type: "Dining", location: "Gijang Market, Busan", description: "Select live Russian and Alaskan king crabs steamed fresh and cracked open with rich crab paste fried rice.", duration: "2 Hours", cost: "$50", rating: 4.9, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Famous seafood market renowned throughout Korea for crab pricing.", aiRecommendation: "Don't miss the crab shell rice mixed with sesame oil and seaweed." },
        { time: "03:00 PM", title: "Igidae Coastal Cliff Wooden Trail", type: "Sightseeing", location: "Igidae Park, Busan", description: "Follow 4 kilometers of wooden boardwalks hugging volcanic sea cliffs with views across to Gwangan Bridge.", duration: "2.5 Hours", cost: "Free", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Well-maintained trail with suspension bridges and scenic viewing platforms.", aiRecommendation: "Nongbawi Rock formation looks like a precariously stacked pedestal over the sea." },
        { time: "06:30 PM", title: "Centum City Skyline Dinner & Spa Land", type: "Dining", location: "Centum City, Haeundae", description: "Dine at the Guinness-certified world's largest department store, followed by 18 natural mineral bath saunas.", duration: "3 Hours", cost: "$35", rating: 4.9, bookingRequired: false, bestTime: "Evening", additionalDetails: "Spa Land features Roman steam rooms, yellow clay saunas, and ice rooms.", aiRecommendation: "Spa Land entry is discounted after 08:00 PM; a perfect conclusion to a long walking day." },
      ],
    },
    {
      title: "Dalmaji Hill & Cheongsapo Seaside Rails",
      activities: [
        { time: "09:30 AM", title: "Haeundae Blueline Park Beach Train", type: "Sightseeing", location: "Mipo Station, Haeundae", description: "Ride the retro coastal rail cart along the East Sea cliffside from Mipo to Songjeong Beach.", duration: "2 Hours", cost: "$12", rating: 4.8, bookingRequired: true, bestTime: "Morning", additionalDetails: "Sky Capsule colorful 2-person elevated pod carts run directly above the train tracks.", aiRecommendation: "Cheongsapo railway crossing is famous for resembling Kamakura seaside anime scenes." },
        { time: "12:30 PM", title: "Cheongsapo Twin Lighthouses & Grilled Clams", type: "Dining", location: "Cheongsapo Fishing Port", description: "Dine on charcoal-grilled fresh scallops and abalone inside rustic tented port restaurants between the red and white lighthouses.", duration: "1.5 Hours", cost: "$28", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Seafood cooked tableside over glowing hardwood briquettes.", aiRecommendation: "Melt butter and onion slices over the fresh scallops as they sizzle." },
        { time: "02:30 PM", title: "Dalmaji Hill Art Galleries & Forest Walk", type: "Sightseeing", location: "Dalmaji-gil, Haeundae", description: "Stroll the pine and cherry blossom hilltop promenade lined with boutique art ateliers and ocean view cafes.", duration: "2 Hours", cost: "Free", rating: 4.7, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Nicknamed the 'Montmartre of Busan' for its community of writers and painters.", aiRecommendation: "Stop by the outdoor pavilion Haewoljeong for serene blue horizon vistas." },
        { time: "06:30 PM", title: "Farewell Gwangan Bridge Sunset Feast", type: "Dining", location: "Millak Waterfront, Busan", description: "Conclude your Busan journey with a lavish sashimi boat and live seafood banquet illuminated by the bridge lights.", duration: "2.5 Hours", cost: "$55", rating: 4.9, bookingRequired: true, bestTime: "Evening", additionalDetails: "Millak Raw Fish Town contains hundreds of dedicated sashimi purveyors.", aiRecommendation: "Toast your trip with Busan's local Daesun Soju as the illuminated suspension bridge reflects over the waves." },
      ],
    },
  ],
  kerala: [
    {
      title: "Colonial Fort Kochi & Chinese Fishing Nets",
      activities: [
        { time: "08:30 AM", title: "Fort Kochi Chinese Cantilevered Fishing Nets", type: "Sightseeing", location: "Fort Kochi Beach", description: "Watch local fishermen operate ancient teak and bamboo shore nets dating back to Kublai Khan's court.", duration: "2 Hours", cost: "$2", rating: 4.8, bookingRequired: false, bestTime: "Early Morning", additionalDetails: "Fishermen will demonstrate lifting the heavy stones and nets.", aiRecommendation: "Visit at dawn for mist over the Arabian Sea and silhouette photography." },
        { time: "11:30 AM", title: "Mattancherry Palace (Dutch Palace) & Murals", type: "Sightseeing", location: "Mattancherry, Kochi", description: "Examine 16th-century royal Hindu murals depicting Ramayana scenes inside Portuguese-built palace halls.", duration: "1.5 Hours", cost: "$1", rating: 4.7, bookingRequired: false, bestTime: "Morning", additionalDetails: "Footwear must be removed before entering the palace gallery.", aiRecommendation: "Look closely at the brass coronet lamps and coronation robes." },
        { time: "01:30 PM", title: "Grand Pavilion Karimeen Pollichathu Lunch", type: "Dining", location: "Ernakulam, Kochi", description: "Savor marinated pearl spot fish wrapped in fragrant green banana leaves and slow-roasted on a tawa.", duration: "1.5 Hours", cost: "$15", rating: 4.9, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Served with steaming appams or red matta rice.", aiRecommendation: "Sip on fresh coconut water or spiced buttermilk (mor) alongside." },
        { time: "06:00 PM", title: "Kathakali Classical Dance Drama Center", type: "Sightseeing", location: "Fort Kochi, Kerala", description: "Witness the elaborate 90-minute facial makeup ritual followed by live percussion and dance storytelling.", duration: "2 Hours", cost: "$8", rating: 4.9, bookingRequired: true, bestTime: "Evening", additionalDetails: "Arrive at 05:00 PM to watch actors apply natural mineral paints to their faces.", aiRecommendation: "Performers explain eye gestures (mudras) before the dramatic performance begins." },
      ],
    },
    {
      title: "Misty Munnar Tea Plantations & Eravikulam",
      activities: [
        { time: "08:30 AM", title: "Eravikulam National Park & Nilgiri Tahr Safari", type: "Sightseeing", location: "Munnar, Idukki District", description: "Ride electric safari shuttles up to high alpine grasslands home to the endangered wild mountain goat.", duration: "3 Hours", cost: "$6", rating: 4.9, bookingRequired: true, bestTime: "Morning", additionalDetails: "Home of the famous Neelakurinji flower blooming once every 12 years.", aiRecommendation: "Spot Nilgiri Tahr grazing peacefully along the upper visitor trail." },
        { time: "12:30 PM", title: "Highland Spice & Traditional Malabar Lunch", type: "Dining", location: "Munnar Town", description: "Delight in aromatic Malabar chicken biryani infused with green cardamom, cloves, and ghee.", duration: "1.5 Hours", cost: "$12", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Pure vegetarian South Indian thalis also available.", aiRecommendation: "Finish your meal with hot spiced cardamom chai brewed with fresh hill milk." },
        { time: "02:30 PM", title: "KDHP Tea Museum & Factory Processing Tour", type: "Sightseeing", location: "Nullatanni Estate, Munnar", description: "Tour India's first tea museum to observe withering, rolling, fermenting, and leaf tasting.", duration: "2 Hours", cost: "$4", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Includes a demonstration of antique tea-roller machinery from 1905.", aiRecommendation: "Purchase freshly packed orthodox Black and Green leaf teas at estate prices." },
        { time: "05:00 PM", title: "Photo Point & Mattupetty Dam Reservoir", type: "Sightseeing", location: "Mattupetty, Munnar", description: "Stroll past manicured emerald tea gardens and peaceful storage lakes framed by Anamudi Peak.", duration: "2 Hours", cost: "Free", rating: 4.7, bookingRequired: false, bestTime: "Late Afternoon", additionalDetails: "Speedboat rides available on the reservoir.", aiRecommendation: "Golden hour mist cascades through the eucalyptus groves creating unforgettable scenery." },
      ],
    },
    {
      title: "Alleppey Backwaters & Houseboat Voyage",
      activities: [
        { time: "09:30 AM", title: "Traditional Kettuvallam Houseboat Embarkation", type: "Sightseeing", location: "Punnamada Jetty, Alleppey", description: "Board a traditional thatched-roof barge crafted from anjili wood and coir ropes without a single nail.", duration: "3.5 Hours", cost: "$60", rating: 4.9, bookingRequired: true, bestTime: "Morning", additionalDetails: "Private captain, navigator, and onboard chef accompany each cruise.", aiRecommendation: "Relax on front deck wicker loungers as water lilies drift past your boat." },
        { time: "01:30 PM", title: "Onboard Banana Leaf Karimeen & Rice Feast", type: "Dining", location: "Vembanad Backwaters", description: "Enjoy freshly caught river scampi, pearl spot fry, avial, sambar, and red matta rice cooked onboard.", duration: "1.5 Hours", cost: "Included", rating: 4.9, bookingRequired: true, bestTime: "Lunch", additionalDetails: "Prepared by the onboard private chef over gas fires in the stern kitchen.", aiRecommendation: "Ask the chef for sweet payasam pudding for dessert." },
        { time: "03:30 PM", title: "Kuttanad Canal Kayak & Village Discovery", type: "Sightseeing", location: "Kuttanad, Alleppey", description: "Paddle silent narrow tributary canals beneath coconut palms through rice paddies below sea level.", duration: "2 Hours", cost: "$15", rating: 4.8, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Kuttanad is one of few places in the world farming 4 to 10 feet below sea level.", aiRecommendation: "Greet smiling local children washing water buffaloes along village canal banks." },
        { time: "06:30 PM", title: "Alleppey Lighthouse & Pier Sunset Walk", type: "Sightseeing", location: "Alleppey Beach", description: "Walk the striped red-and-white 1862 lighthouse and the remains of the historic 150-year-old sea pier.", duration: "1.5 Hours", cost: "$1", rating: 4.7, bookingRequired: false, bestTime: "Sunset", additionalDetails: "Climb the spiral staircase for an unobstructed Arabian sea horizon.", aiRecommendation: "Sample hot banana fritters (pazham pori) from street vendors outside." },
      ],
    },
    {
      title: "Varkala Cliffside Coast & Ancient Shrines",
      activities: [
        { time: "09:00 AM", title: "Varkala Red Sandstone Cliff & Beach Promenade", type: "Sightseeing", location: "North Cliff, Varkala", description: "Walk the dramatic geological cliff edge overlooking turquoise Arabian Sea waves and palm groves.", duration: "2.5 Hours", cost: "Free", rating: 4.9, bookingRequired: false, bestTime: "Morning", additionalDetails: "Cliff trail is lined with bohemian cafes, Tibetan handicraft stalls, and yoga centers.", aiRecommendation: "Step down the cliff stairway to dip your feet into holy Papanasam beach waters." },
        { time: "12:30 PM", title: "Cliffside Seafood Tandoori & Fresh Juices", type: "Dining", location: "North Cliff Walkway", description: "Feast on king prawns, red snapper, and grilled calamari marinated in Kerala spices overlooking the waves.", duration: "1.5 Hours", cost: "$18", rating: 4.8, bookingRequired: false, bestTime: "Lunch", additionalDetails: "Great vegan and vegetarian smoothie bowl selections available.", aiRecommendation: "Order fresh papaya lime juice and garlic herb naan." },
        { time: "03:00 PM", title: "Janardhana Swamy 2,000-Year-Old Temple", type: "Sightseeing", location: "South Cliff, Varkala", description: "Pay homage at one of Kerala's oldest Vaishnavite temples with ancient Dutch bells and banyan trees.", duration: "1.5 Hours", cost: "Free", rating: 4.7, bookingRequired: false, bestTime: "Afternoon", additionalDetails: "Traditional dress code required for temple sanctum; photography restricted inside.", aiRecommendation: "Sit quietly under the sacred banyan tree near the temple tank." },
        { time: "06:00 PM", title: "Ayurvedic Herbal Oil Massage (Abhyanga)", type: "Sightseeing", location: "Varkala Wellness Center", description: "Rejuvenate tired muscles with synchronized warm medicated herbal oil full-body therapy.", duration: "1.5 Hours", cost: "$25", rating: 4.9, bookingRequired: true, bestTime: "Evening", additionalDetails: "Administered by certified Ayurvedic practitioners using traditional wooden tables.", aiRecommendation: "Follow with a traditional herbal steam bath (Swedana) for deep relaxation." },
      ],
    },
  ],
};

function generateGenericDayItinerary(destination, dayNumber, totalDays, travelStyle) {
  const genericDayProfiles = [
    {
      theme: "Arrival, Historic Center & Welcome Atmosphere",
      mornTitle: `Historic Heart & Heritage Walking Tour`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Old Town & Central Square`,
      mornDesc: `Begin your adventure by uncovering the foundational history, iconic cobblestones, and monuments of ${destination}.`,
      lunchTitle: `Traditional Welcome Lunch & Regional Specialties`,
      lunchType: "Dining",
      lunchLoc: `${destination} Central Quarter`,
      lunchDesc: `Savor the region's hallmark authentic dishes and warm hospitality in an atmospheric local tavern.`,
      aftTitle: `National Heritage Museum & Artifacts Gallery`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Cultural District`,
      aftDesc: `Explore curated collections, ancient treasures, and artistic milestones that shaped ${destination}.`,
      eveTitle: `Twilight Promenade & Authentic Welcome Dinner`,
      eveType: "Dining",
      eveLoc: `${destination} Historic Waterfront / Plaza`,
      eveDesc: `Unwind with seasonal delicacies, refreshing local beverages, and vibrant evening city lighting.`,
    },
    {
      theme: "Architecture, Iconic Landmarks & City Panoramas",
      mornTitle: `Grand Cathedral, Citadel or Palace Exploration`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Landmark Hill`,
      mornDesc: `Tour the monumental architectural symbol of ${destination}, admiring centuries of master masonry.`,
      lunchTitle: `Artisanal Bistro & Farm-to-Table Fare`,
      lunchType: "Dining",
      lunchLoc: `${destination} Market Quarter`,
      lunchDesc: `Indulge in freshly prepared seasonal dishes featuring locally sourced harvest ingredients.`,
      aftTitle: `Panoramic Sky Deck & Scenic Vista Viewpoint`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Highest Outlook Point`,
      aftDesc: `Take in sweeping 360-degree bird's-eye views over the rooftops, horizons, and geography of ${destination}.`,
      eveTitle: `Rooftop Terrace Cocktails & Sunset Dining`,
      eveType: "Dining",
      eveLoc: `${destination} Skyline Esplanade`,
      eveDesc: `Toast the setting sun as the city lights illuminate below while savoring gourmet regional small plates.`,
    },
    {
      theme: "Nature, Serene Botanical Gardens & Waterfront",
      mornTitle: `Botanical Sanctuary & Quiet Forest Paths`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Royal Botanical Park`,
      mornDesc: `Immerse yourself in lush flora, peaceful water features, and tranquil nature trails.`,
      lunchTitle: `Lakeside or Garden Pavilion Cafe`,
      lunchType: "Dining",
      lunchLoc: `${destination} Park Grounds`,
      lunchDesc: `Relax with light artisan sandwiches, crisp salads, and freshly brewed herbal infusions.`,
      aftTitle: `Waterfront Promenade or Scenic Boat Cruise`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Riverbank / Shoreline Pier`,
      aftDesc: `Glide past historic shorelines and scenic bridges while feeling the refreshing open water breeze.`,
      eveTitle: `Fresh Catch Seafood & Riverside Gastronomy`,
      eveType: "Dining",
      eveLoc: `${destination} Harbor District`,
      eveDesc: `Enjoy ocean-fresh seafood or signature grilled delicacies right alongside the gentle water.`,
    },
    {
      theme: "Local Neighborhoods, Street Flavors & Artisan Markets",
      mornTitle: `Historic Covered Food Market Tour`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Central Bazaar`,
      mornDesc: `Engage with bustling morning stallholders, colorful spice displays, and handcrafted goods.`,
      lunchTitle: `Street Food Feast & Specialty Delicacies`,
      lunchType: "Dining",
      lunchLoc: `${destination} Market Arcade`,
      lunchDesc: `Sample freshly grilled skewers, handmade pastries, and beloved street bites favored by residents.`,
      aftTitle: `Bohemian Arts Enclave & Independent Boutiques`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Creative Quarter`,
      aftDesc: `Stroll through colorful alleyways filled with contemporary murals, pottery workshops, and design lofts.`,
      eveTitle: `Intimate Courtyard Trattoria Dinner`,
      eveType: "Dining",
      eveLoc: `${destination} Hidden Alleys`,
      eveDesc: `Savor candlelit regional dining featuring handmade recipes passed down through generations.`,
    },
    {
      theme: "Hidden Gems, Quiet Cloisters & Scenic Bridges",
      mornTitle: `Hidden Courtyards & Historic Cloister Walk`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Old District North`,
      mornDesc: `Step away from crowds to discover centuries-old quiet archways, stone fountains, and hidden shrines.`,
      lunchTitle: `Historic Roastery & Pastry Atelier`,
      lunchType: "Dining",
      lunchLoc: `${destination} Old Library Quarter`,
      lunchDesc: `Recharge with single-origin specialty coffee, flaky gourmet tarts, and artisan lunch bowls.`,
      aftTitle: `Ancient Stone Bridge & River Walk`,
      aftType: "Sightseeing",
      aftLoc: `${destination} River Arches`,
      aftDesc: `Cross historic pedestrian bridges offering premier vantage points for landscape photography.`,
      eveTitle: `Traditional Music, Folklore & Regional Banquet`,
      eveType: "Dining",
      eveLoc: `${destination} Cultural Hall`,
      eveDesc: `Immerse in local performing traditions, folk instruments, and a convivial multi-course dinner.`,
    },
    {
      theme: "Highland Excursion, Scenic Ridges & Fresh Air",
      mornTitle: `Morning Mountain Ridge or Hilltop Sanctuary`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Upper Ridge`,
      mornDesc: `Breathe crisp mountain air and follow winding scenic paths with expansive valley outlooks.`,
      lunchTitle: `Highland Tavern & Hearty Stews`,
      lunchType: "Dining",
      lunchLoc: `${destination} Mountain Village`,
      lunchDesc: `Warm up with rich slow-cooked stews, freshly baked bread, and rustic cheeses.`,
      aftTitle: `Alpine Meadows & Natural Springs`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Valley Pass`,
      aftDesc: `Walk amidst wild meadows, bubbling fresh mineral springs, and peaceful wooded valleys.`,
      eveTitle: `Fireside Bistro & Vintage Local Wines`,
      eveType: "Dining",
      eveLoc: `${destination} Foothills Inn`,
      eveDesc: `Relax by a glowing fireplace with regional vintage wines and seasonal wood-fired delicacies.`,
    },
    {
      theme: "Grand Finale, Souvenir Walks & Farewell Views",
      mornTitle: `Morning Artisan Souvenir & Keepsake Quest`,
      mornType: "Sightseeing",
      mornLoc: `${destination} Crafts Guild`,
      mornDesc: `Pick up unique handmade keepsakes, local spices, textiles, or ceramics to remember your journey.`,
      lunchTitle: `Celebratory Farewell Lunch & Signature Tasting`,
      lunchType: "Dining",
      lunchLoc: `${destination} Grand Arcade`,
      lunchDesc: `Revisit your favorite regional flavors with a curated multi-course celebratory midday menu.`,
      aftTitle: `Final Panoramic Outlook & Reflection Walk`,
      aftType: "Sightseeing",
      aftLoc: `${destination} Bell Tower Terrace`,
      aftDesc: `Take in one last breathtaking panoramic overview of the cityscapes and monuments you've explored.`,
      eveTitle: `Grand Farewell Skyline Feast`,
      eveType: "Dining",
      eveLoc: `${destination} Premier Panoramic Restaurant`,
      eveDesc: `Conclude your trip in spectacular fashion with fine regional gastronomy and night city lights.`,
    },
  ];

  const profile = genericDayProfiles[(dayNumber - 1) % genericDayProfiles.length];

  return {
    day: dayNumber,
    title: profile.theme,
    activities: [
      {
        time: "09:00 AM",
        title: profile.mornTitle,
        type: profile.mornType,
        location: profile.mornLoc,
        description: profile.mornDesc,
        duration: "2.5 Hours",
        cost: "$15",
        rating: 4.8,
        bookingRequired: false,
        bestTime: "Morning",
        additionalDetails: "Wear comfortable walking shoes and carry a refillable water bottle.",
        aiRecommendation: "Arrive right as morning doors open for peaceful photography and quiet trails.",
      },
      {
        time: "12:30 PM",
        title: profile.lunchTitle,
        type: profile.lunchType,
        location: profile.lunchLoc,
        description: profile.lunchDesc,
        duration: "1.5 Hours",
        cost: "$25",
        rating: 4.7,
        bookingRequired: false,
        bestTime: "Lunch",
        additionalDetails: "Vegetarian and allergy accommodations readily provided.",
        aiRecommendation: "Ask for the daily seasonal chef recommendation.",
      },
      {
        time: "02:30 PM",
        title: profile.aftTitle,
        type: profile.aftType,
        location: profile.aftLoc,
        description: profile.aftDesc,
        duration: "2.5 Hours",
        cost: "$18",
        rating: 4.9,
        bookingRequired: false,
        bestTime: "Afternoon",
        additionalDetails: "Audio guides and map pamphlets available on site.",
        aiRecommendation: "Golden hour lighting creates exceptional conditions for outdoor photography.",
      },
      {
        time: "07:00 PM",
        title: profile.eveTitle,
        type: profile.eveType,
        location: profile.eveLoc,
        description: profile.eveDesc,
        duration: "2 Hours",
        cost: "$45",
        rating: 4.8,
        bookingRequired: true,
        bestTime: "Evening",
        additionalDetails: "Advance table booking recommended on weekends.",
        aiRecommendation: "Reserve a window or outdoor terrace table for memorable night ambiance.",
      },
    ],
  };
}

export function generateFallbackItinerary(destination, duration, budget, travelStyle, preferences = []) {
  const numDays = Math.min(Math.max(Number(duration) || 3, 1), 10);
  const totalBudget = Number(budget) || 1500;
  const cleanDest = (destination || "Your Destination").trim();
  const lowerDest = cleanDest.toLowerCase();
  const days = [];

  const prefList = Array.isArray(preferences)
    ? preferences.join(", ")
    : (preferences || travelStyle || "Culture, City Exploration");

  // Check if we have dedicated authentic multi-day curated days for this destination
  let curatedDays = null;
  for (const [key, list] of Object.entries(CURATED_DESTINATION_ITINERARIES)) {
    if (lowerDest === key || lowerDest.includes(key) || key.includes(lowerDest)) {
      curatedDays = list;
      break;
    }
  }

  for (let i = 1; i <= numDays; i++) {
    if (curatedDays && curatedDays[i - 1]) {
      const template = curatedDays[i - 1];
      days.push({
        day: i,
        title: template.title,
        activities: template.activities.map((a, aIdx) => ({
          id: `act_${i}_${aIdx + 1}`,
          ...a,
        })),
      });
    } else {
      const genDay = generateGenericDayItinerary(cleanDest, i, numDays, prefList);
      days.push({
        ...genDay,
        activities: genDay.activities.map((a, aIdx) => ({
          id: `act_${i}_${aIdx + 1}`,
          ...a,
        })),
      });
    }
  }

  return {
    budgetBreakdown: {
      flights: Math.round(totalBudget * 0.35),
      hotels: Math.round(totalBudget * 0.3),
      food: Math.round(totalBudget * 0.15),
      transport: Math.round(totalBudget * 0.08),
      activities: Math.round(totalBudget * 0.08),
      shopping: Math.round(totalBudget * 0.04),
    },
    tripHighlights: {
      flight: `Direct Flight to ${cleanDest}`,
      hotel: `Top-Rated Boutique Hotel in ${cleanDest}`,
      topRated: days[0]?.activities?.[0]?.title || `${cleanDest} Central Landmark`,
      activities: numDays * 4,
      restaurants: numDays * 2,
      nearbyPlaces: [
        `${cleanDest} Historic Quarter`,
        `${cleanDest} Waterfront Promenade`,
        `${cleanDest} Scenic Ridge`,
        `${cleanDest} Cultural District`,
      ],
    },
    dailySpending: days.map((d) => ({
      day: `Day ${d.day}`,
      amount: Math.round(totalBudget / numDays),
    })),
    travelTips: [
      {
        category: "Timing",
        title: "Beat the Crowds",
        description: `Visit premier attractions in ${cleanDest} before 09:30 AM or during late afternoon for shorter lines and serene views.`,
      },
      {
        category: "Food",
        title: "Try Local Specialties",
        description: `Explore neighborhood markets and street food stalls for the freshest and most authentic flavors in ${cleanDest}.`,
      },
      {
        category: "Transport",
        title: "Transit Passes",
        description: "Pick up a multi-day metro, bus, or tap card to save money navigating around the city.",
      },
      {
        category: "Photography",
        title: "Golden Hour Views",
        description: "Lookout points across the city offer breathtaking sunset panoramas for memorable travel photography.",
      },
    ],
    days,
  };
}

export async function generateItinerary({
  city,
  destination,
  country,
  coordinates,
  budget,
  duration,
  travelStyle,
  preferences,
}) {
  const genAI = getGenAI();
  const prefList = Array.isArray(preferences) && preferences.length > 0
    ? preferences.join(", ")
    : (preferences || travelStyle || "Culture, City Exploration");

  if (!genAI) {
    console.log("No Gemini API client available; returning high-quality fallback itinerary.");
    return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
  }

  const prompt = `
Starting City: ${city}
Destination: ${destination}${country ? `, ${country}` : ""}
Budget: ${budget} USD
Duration: ${duration} Days
Selected Travel Preferences: ${prefList}

You are an expert travel planner.
Create a realistic, exciting, and well-structured travel itinerary in valid JSON format.

CRITICAL MULTI-PREFERENCE & NON-REPETITION RULES:
- THE USER HAS CHOSEN MULTIPLE TRAVEL PREFERENCES: "${prefList}".
- EVERY DAY'S ITINERARY MUST HARMONIOUSLY REFLECT A BALANCED COMBINATION OF THESE SELECTED PREFERENCES:
  * For example, if "City Exploration", "Adventure", and "Cuisine" are chosen, incorporate active outdoor excursions or scenic viewpoints, authentic local culinary meals / food crawls, and historic city landmarks.
  * If "Culture", "Relaxation", and "Shopping" are chosen, blend tranquil scenic strolls, museums / historic heritage, and vibrant artisan boutiques.
- EACH AND EVERY DAY (Day 1, Day 2, Day 3, ...) MUST HAVE COMPLETELY DIFFERENT, UNIQUE ACTIVITIES.
- DO NOT repeat activity titles, locations, or descriptions across different days.
- Every single day must explore a different neighborhood, theme, or landmark of ${destination}.
- Return ONLY valid JSON without markdown wrapping or commentary.
- Use real, authentic attractions, hotels, restaurants, and sights in ${destination}.
- Match the itinerary to the user's budget and travel preferences.

STRUCTURE:
{
  "budgetBreakdown": {
    "flights": number,
    "hotels": number,
    "food": number,
    "transport": number,
    "activities": number,
    "shopping": number
  },
  "tripHighlights": {
    "flight": "Flight description",
    "hotel": "Hotel name",
    "topRated": "Top attraction name",
    "activities": number,
    "restaurants": number,
    "nearbyPlaces": ["Place 1", "Place 2", "Place 3"]
  },
  "dailySpending": [
    { "day": "Day 1", "amount": number }
  ],
  "travelTips": [
    {
      "category": "Timing" | "Food" | "Transport" | "Photography",
      "title": "Tip title",
      "description": "Tip description"
    }
  ],
  "days": [
    {
      "day": 1,
      "title": "Day 1 Theme Title",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Unique Activity Name",
          "type": "Sightseeing" | "Dining" | "Hotel" | "Transport" | "Activity",
          "location": "Specific Location Name",
          "description": "Short description (1-2 sentences)",
          "duration": "2 Hours",
          "cost": "$25",
          "rating": 4.8,
          "bookingRequired": false,
          "bestTime": "Morning",
          "additionalDetails": "Helpful notes",
          "aiRecommendation": "Pro travel tip"
        }
      ]
    }
  ]
}
`;

  const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  for (const modelName of candidateModels) {
    try {
      console.log(`Calling Gemini with model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0 && parsed.budgetBreakdown) {
        // Validate non-repetition across days
        const seenTitles = new Set();
        let hasDuplicates = false;

        for (const day of parsed.days) {
          if (!day.activities) continue;
          for (const act of day.activities) {
            if (seenTitles.has(act.title)) {
              hasDuplicates = true;
              break;
            }
            seenTitles.add(act.title);
          }
          if (hasDuplicates) break;
        }

        if (!hasDuplicates) {
          console.log(`Gemini successfully generated non-repeating itinerary using ${modelName}`);
          return parsed;
        } else {
          console.log(`Gemini generated repeating activities across days; falling back to curated non-repeating engine.`);
          return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
        }
      }
    } catch (err) {
      console.warn(`Gemini generation with ${modelName} failed:`, err.message);
    }
  }

  console.log("All Gemini attempts failed; generating realistic fallback itinerary.");
  return generateFallbackItinerary(destination, duration, budget, travelStyle, preferences);
}

export async function chatAboutTrip({ destination, tripContext, question }) {
  const genAI = getGenAI();

  if (!genAI) {
    return `For visiting ${destination}, remember to pack comfortable walking shoes, prepare local payment options (cards and some cash), and download offline map navigation before traveling. Let me know if you need specific advice!`;
  }

  const prompt = `
You are TripWise AI, a helpful, enthusiastic, and knowledgeable travel concierge.
Destination: ${destination}
${tripContext ? `Trip Context: ${tripContext.slice(0, 1000)}` : ""}

User question: "${question}"

Provide a concise, practical, and friendly answer (2 to 4 sentences or quick bullet points).
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    return text.trim();
  } catch (error) {
    console.warn("Chat generation failed:", error.message);
    return `Great question about ${destination}! Be sure to check seasonal operating hours for major landmarks, carry local currency for small vendors, and reserve popular dinner spots in advance.`;
  }
}
