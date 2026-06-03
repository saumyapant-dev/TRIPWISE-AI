const QuickActions = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-5">
        Quick Actions
      </h3>

      <div className="space-y-3">
        <button
          className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 transition"
        >
          Save to My Trips
        </button>

        <button
          className="w-full py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Customize Trip
        </button>

        <button
          className="w-full py-3 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Share with Friends
        </button>
      </div>
    </div>
  );
};

export default QuickActions;