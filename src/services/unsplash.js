export const getDestinationImage = async (city) => {
  console.log("Unsplash Key:", import.meta.env.VITE_UNSPLASH_ACCESS_KEY);
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${city}&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY
          }`,
      },
    }
  );

  const data = await response.json();

  return data.results[0]?.urls?.regular;
};