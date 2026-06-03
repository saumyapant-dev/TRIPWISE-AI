import { Mail, Lock } from "lucide-react";

const Placeholders = ({
  email,
  setEmail,
  password,
  setPassword,
}) => {
  return (
    <div className="mt-8 space-y-5">
      <div>
        <label className="block mb-3 text-base font-semibold">
          Email address
        </label>

        <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-3">
          <Mail size={22} className="text-gray-400" />

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ml-4 flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block mb-3 text-base font-semibold">
          Password
        </label>

        <div className="flex items-center border border-gray-200 rounded-2xl px-5 py-3">
          <Lock size={22} className="text-gray-400" />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ml-4 flex-1 outline-none text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Placeholders;