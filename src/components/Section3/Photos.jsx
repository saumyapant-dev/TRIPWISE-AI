import { useNavigate } from "react-router-dom";

const destinations = [
  {
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
    city: "Tokyo, Japan",
    trips: "2,847 trips",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80",
    city: "Paris, France",
    trips: "3,421 trips",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80",
    city: "Bali, Indonesia",
    trips: "1,932 trips",
  },
  {
    image:
      "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1200&auto=format&fit=crop&q=80",
    city: "New York, USA",
    trips: "4,156 trips",
  },
];

const Photos = () => {
  const navigate = useNavigate();

  return (
    <section id="destinations" className="scroll-mt-32">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
      {destinations.map((place, index) => (
        <div
          key={index}
          onClick={() => navigate(`/generate-trip?destination=${encodeURIComponent(place.city.split(',')[0])}`)}
          className="relative overflow-hidden rounded-3xl group cursor-pointer shadow-md hover:shadow-xl transition"
        >
          <img
            src={place.image}
            alt={place.city}
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80";
            }}
            className="h-72 w-full object-cover transition duration-300 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-bold">{place.city}</h3>
            <p className="text-sm">{place.trips}</p>
          </div>
        </div>
      ))}
    </div>
    </section>
  );
};

export default Photos;