import Cards from "./Cards";
import { Star, MapPin, Calendar } from "lucide-react";

const QndA = () => {
    return (
        <section id="features" className="scroll-mt-32">
        <div className="text-center max-w-7xl mx-auto mt-40 px-6">

            <h2 className="text-5xl font-bold">
                Why Choose TripWise AI?
            </h2>

            <p className="text-gray-500 text-xl mt-6">
                Experience the future of travel planning with our intelligent platform
            </p>

            <div className="mt-12 mb-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Cards
                    imgSrc={Star}
                    title="AI-Powered Planning"
                    description="Our advanced AI creates personalized itineraries based on your preferences, budget, and travel style."
                />

                <Cards
                    imgSrc={MapPin}
                    title="Smart Recommendations"
                    description="Discover hidden gems and must-see attractions curated specifically for your interests."
                />

                <Cards
                    imgSrc={Calendar}
                    title="Flexible Itineraries"
                    description="Easily adjust your trip plans on the go with real-time suggestions and alternatives."
                />

            </div>

        </div>
        </section>
    );
};

export default QndA;