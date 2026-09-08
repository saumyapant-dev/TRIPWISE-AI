const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=800&fit=crop";

const imageCache = new Map();

const CITY_FALLBACKS = {
  seoul: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1600&h=800&fit=crop",
  korea: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1600&h=800&fit=crop",
  busan: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1600&h=800&fit=crop",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&h=800&fit=crop",
  alleppey: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&h=800&fit=crop",
  kochi: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1600&h=800&fit=crop",
  munnar: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1600&h=800&fit=crop",
  varkala: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&h=800&fit=crop",
  kashmir: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1600&h=800&fit=crop",
  srinagar: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1600&h=800&fit=crop",
  gulmarg: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&h=800&fit=crop",
  pahalgam: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1600&h=800&fit=crop",
  chandigarh: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=1600&h=800&fit=crop",
  gwalior: "https://images.unsplash.com/photo-1609137144822-094157155734?w=1600&h=800&fit=crop",
  bhopal: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?w=1600&h=800&fit=crop",
  indore: "https://images.unsplash.com/photo-1627894483216-2138af692e32?w=1600&h=800&fit=crop",
  lucknow: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=1600&h=800&fit=crop",
  kanpur: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1600&h=800&fit=crop",
  amritsar: "https://images.unsplash.com/photo-1588096344356-9a4f61f7480a?w=1600&h=800&fit=crop",
  udaipur: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1600&h=800&fit=crop",
  jodhpur: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1600&h=800&fit=crop",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1600&h=800&fit=crop",
  hyderabad: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1600&h=800&fit=crop",
  bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1600&h=800&fit=crop",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1600&h=800&fit=crop",
  mysuru: "https://images.unsplash.com/photo-1600100397608-f010f4439c29?w=1600&h=800&fit=crop",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&h=800&fit=crop",
  ooty: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1600&h=800&fit=crop",
  kolkata: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1600&h=800&fit=crop",
  darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&h=800&fit=crop",
  pune: "https://images.unsplash.com/photo-1579618218290-24a26f63a728?w=1600&h=800&fit=crop",
  ahmedabad: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1600&h=800&fit=crop",
  rishikesh: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&h=800&fit=crop",
  dharamshala: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&h=800&fit=crop",
  manali: "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1600&h=800&fit=crop",
  shimla: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1600&h=800&fit=crop",
  athens: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1600&h=800&fit=crop",
  nairobi: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1600&h=800&fit=crop",
  assam: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1600&h=800&fit=crop",
  guwahati: "https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1600&h=800&fit=crop",
  kaziranga: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=1600&h=800&fit=crop",
  "los angeles": "https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1600&h=800&fit=crop",
  california: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=800&fit=crop",
  "san francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600&h=800&fit=crop",
  "san diego": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=800&fit=crop",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=800&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&h=800&fit=crop",
  osaka: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=1600&h=800&fit=crop",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&h=800&fit=crop",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=800&fit=crop",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&h=800&fit=crop",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&h=800&fit=crop",
  indonesia: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&h=800&fit=crop",
  "new york": "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1600&h=800&fit=crop",
  manhattan: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1600&h=800&fit=crop",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&h=800&fit=crop",
  "united kingdom": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&h=800&fit=crop",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&h=800&fit=crop",
  italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&h=800&fit=crop",
  florence: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=1600&h=800&fit=crop",
  venice: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1600&h=800&fit=crop",
  tuscany: "https://images.unsplash.com/photo-1543429776-2782fc8e1acd?w=1600&h=800&fit=crop",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&h=800&fit=crop",
  spain: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1600&h=800&fit=crop",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&h=800&fit=crop",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&h=800&fit=crop",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&h=800&fit=crop",
  thailand: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&h=800&fit=crop",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&h=800&fit=crop",
  australia: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1600&h=800&fit=crop",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1600&h=800&fit=crop",
  zurich: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1600&h=800&fit=crop",
  iceland: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1600&h=800&fit=crop",
  hawaii: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=1600&h=800&fit=crop",
  amsterdam: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1600&h=800&fit=crop",
  netherlands: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1600&h=800&fit=crop",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&h=800&fit=crop",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&h=800&fit=crop",
  rajasthan: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&h=800&fit=crop",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&h=800&fit=crop",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1600&h=800&fit=crop",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&h=800&fit=crop",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1600&h=800&fit=crop",
  cairo: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600&h=800&fit=crop",
  egypt: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600&h=800&fit=crop",
  berlin: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&h=800&fit=crop",
  germany: "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1600&h=800&fit=crop",
  toronto: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1600&h=800&fit=crop",
  vancouver: "https://images.unsplash.com/photo-1559511260-66a65e0982d5?w=1600&h=800&fit=crop",
  canada: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1600&h=800&fit=crop",
};

export async function fetchDestinationImage(destination) {
  if (!destination || typeof destination !== "string") return DEFAULT_IMAGE;

  // Clean and sanitize destination name (strip words like "trip", "vacation", "getaway")
  const cleanDest = destination
    .trim()
    .replace(/\b(trip|vacation|tour|getaway|holiday|itinerary|journey)\b/gi, "")
    .trim() || destination.trim();
  const lower = cleanDest.toLowerCase();

  if (imageCache.has(lower)) {
    return imageCache.get(lower);
  }

  // 1. If an Unsplash API Key is configured in environment, query Unsplash first
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (accessKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cleanDest)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const photo = data.results?.[0]?.urls?.regular;
        if (photo) {
          imageCache.set(lower, photo);
          return photo;
        }
      }
    } catch (error) {
      console.warn("[ImageService] Unsplash fetch notice:", error.message);
    }
  }

  // 2. Check Wikipedia Summary & Search REST API (Zero API key required, authentic high-res images)
  try {
    const wikiController = new AbortController();
    const timeoutId = setTimeout(() => wikiController.abort(), 4000);

    const formattedTitle = encodeURIComponent(cleanDest.replace(/\s+/g, "_"));
    const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${formattedTitle}`, {
      headers: { "User-Agent": "TripWiseAI/1.0 (travel-planner)" },
      signal: wikiController.signal,
    });
    clearTimeout(timeoutId);

    if (summaryRes.ok) {
      const summaryData = await summaryRes.json();
      const rawImg = summaryData.originalimage?.source || summaryData.thumbnail?.source;
      if (rawImg && !rawImg.endsWith(".svg") && !rawImg.toLowerCase().includes("coat_of_arms")) {
        imageCache.set(lower, rawImg);
        return rawImg;
      }
    }
  } catch {
    // Continue to next stage
  }

  // 3. Check Wikipedia Query Search API if direct page had no photo
  try {
    const searchController = new AbortController();
    const timeoutId = setTimeout(() => searchController.abort(), 4000);

    const searchQuery = encodeURIComponent(`Tourism in ${cleanDest}`);
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=original|thumbnail&pithumbsize=1600&generator=search&gsrsearch=${searchQuery}&gsrlimit=2`;

    const searchRes = await fetch(searchUrl, {
      headers: { "User-Agent": "TripWiseAI/1.0 (travel-planner)" },
      signal: searchController.signal,
    });
    clearTimeout(timeoutId);

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const pages = Object.values(searchData.query?.pages || {});
      for (const page of pages) {
        const photo = page.original?.source || page.thumbnail?.source;
        if (photo && !photo.endsWith(".svg")) {
          imageCache.set(lower, photo);
          return photo;
        }
      }
    }
  } catch {
    // Continue to fallback dictionary
  }

  // 4. Check curated dictionary for known locations
  for (const [city, url] of Object.entries(CITY_FALLBACKS)) {
    if (lower === city || (lower.includes(city) && city.length >= 4) || (city.includes(lower) && lower.length >= 4)) {
      imageCache.set(lower, url);
      return url;
    }
  }

  // 5. High-quality default
  imageCache.set(lower, DEFAULT_IMAGE);
  return DEFAULT_IMAGE;
}

export function getFallback(dest) {
  const clean = (dest || "")
    .trim()
    .replace(/\b(trip|vacation|tour|getaway|holiday|itinerary|journey)\b/gi, "")
    .trim()
    .toLowerCase();

  for (const [city, url] of Object.entries(CITY_FALLBACKS)) {
    if (clean === city || (clean.includes(city) && city.length >= 4) || (city.includes(clean) && clean.length >= 4)) {
      return url;
    }
  }
  return DEFAULT_IMAGE;
}
