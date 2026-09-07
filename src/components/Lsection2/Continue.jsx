import { useNavigate } from "react-router-dom";

const Continue = ({ handleLogin }) => {
    const navigate = useNavigate();

    const handleSocialLogin = (provider) => {
        localStorage.setItem(
            "tripwise_user",
            JSON.stringify({
                email: `demo_${provider.toLowerCase()}@tripwise.ai`,
                name: `${provider} Traveler`,
                loggedInAt: new Date().toISOString(),
            })
        );
        navigate("/dashboard");
    };

    return (
        <div className="mt-6">
            <button
                type="button"
                onClick={handleLogin}
                className="w-full py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-blue-500 via-blue-600 to-violet-500 hover:scale-105 transition duration-300 cursor-pointer"
            >
                Log In
            </button>

            <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-200"></div>

                <span className="px-4 text-gray-500 text-sm">
                    Or continue with
                </span>

                <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => handleSocialLogin("Google")}
                    className="bg-white border border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer text-sm font-medium"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    Google
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialLogin("GitHub")}
                    className="bg-white border border-gray-200 rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer text-sm font-medium"
                >
                    <img
                        src="https://github.githubassets.com/favicons/favicon.svg"
                        alt="GitHub"
                        className="w-5 h-5"
                    />
                    GitHub
                </button>
            </div>

            <p className="text-center mt-8 text-gray-500 text-sm">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-indigo-600 font-semibold hover:underline cursor-pointer ml-1"
                >
                    Sign up for free
                </button>
            </p>
        </div>
    );
};

export default Continue;