import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Placeholders from "./Placeholders";
import Extra from "./Extra";
import Continue from "./Continue";
import { login } from "../../services/api.js";

const Lsection2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      if (response && response.success && response.data) {
        localStorage.setItem("tripwise_user", JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        setError(response?.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Backend login error:", err.message);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center">
      <div className="w-full max-w-[520px] pt-15 px-4">
        <Login />

        {error && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <Placeholders
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <Extra />
        <Continue handleLogin={handleLogin} loading={loading} />
      </div>
    </div>
  );
};

export default Lsection2;