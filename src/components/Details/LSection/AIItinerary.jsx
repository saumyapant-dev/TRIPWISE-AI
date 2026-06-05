const AIItinerary = ({ tripData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">
        AI Generated Itinerary
      </h2>

      <div className="whitespace-pre-wrap text-gray-700 leading-8">
        {tripData}
      </div>
    </div>
  );
};

export default AIItinerary;