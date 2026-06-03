import { Plane } from "lucide-react";
const HeroText = () => {
    return (
        <div>
            <div className="w-17 h-17 bg-white/20 rounded-3xl flex items-center justify-center text-4xl mb-8">
                <Plane size={27} className="text-white" />
            </div>

            <h1 className="text-5xl font-bold mb-6">
                Welcome Back
            </h1>

            <p className="text-2xl leading-relaxed max-w-lg text-[1.135em]">
                Continue planning your dream adventures with AI-powered insights and personalized recommendations.
            </p>
        </div>
    );
};

export default HeroText;