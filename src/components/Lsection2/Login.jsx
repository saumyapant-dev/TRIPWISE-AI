import { Plane } from "lucide-react";

const Login = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-violet-500 p-3 rounded-full">
          <Plane size={20} className="text-white" />
        </div>

        <h1 className="text-2xl font-semibold">
          TripWise AI
        </h1>
      </div>

      <h2 className="text-[32px] font-bold text-black leading-tight">
        Log in to your account
      </h2>

      <p className="text-base text-gray-500 mt-2">
        Enter your credentials to continue
      </p>
    </div>
  );
};

export default Login;