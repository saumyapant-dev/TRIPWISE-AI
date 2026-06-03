const Part2 = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 mt-15 text-center">

            <div className="max-w-xs mx-auto">
                <h1 className="text-6xl font-bold text-blue-200">
                    01
                </h1>

                <h3 className="text-2xl font-semibold mt-4">
                    Share Your Preferences
                </h3>

                <p className="text-gray-500 mt-4 leading-relaxed">
                    Tell us about your budget, travel dates,
                    interests, and style.
                </p>
            </div>

            <div className="max-w-xs mx-auto">
                <h1 className="text-6xl font-bold text-blue-200">
                    02
                </h1>

                <h3 className="text-2xl font-semibold mt-4">
                    AI Creates Your Itinerary
                </h3>

                <p className="text-gray-500 mt-4 leading-relaxed">
                    Our AI analyzes thousands of destinations
                    to craft your perfect trip.
                </p>
            </div>

            <div className="max-w-xs mx-auto">
                <h1 className="text-6xl font-bold text-blue-200">
                    03
                </h1>

                <h3 className="text-2xl font-semibold mt-4">
                    Explore & Customize
                </h3>

                <p className="text-gray-500 mt-4 leading-relaxed">
                    Review your itinerary and make adjustments
                    with our AI assistant.
                </p>
            </div>

        </div>
    );
};

export default Part2;