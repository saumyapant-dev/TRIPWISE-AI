const Temp = () => {
  return (
    <div className="max-w-5xl mx-auto text-center ">
      
      <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm mb-6">
        🚀 AI-Powered Travel Planning
      </div>

      <h1 className="text-7xl font-bold leading-tight">
        Plan Your Dream Trip
        <br />
        With AI
      </h1>

      <p className="text-gray-500 text-xl max-w-3xl mx-auto mt-6">
        Create personalized travel itineraries in seconds. Our AI analyzes your
        preferences, budget, and travel style to craft the perfect adventure.
      </p>

      <div className="flex justify-center gap-6 mt-10">
        <a href="/generate-trip" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition">
          Generate My Trip
        </a>

        <a href="#help" className="bg-white border border-gray-200 px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition">
          See How It Works
        </a>
      </div>

    </div>
  );
};

export default Temp;