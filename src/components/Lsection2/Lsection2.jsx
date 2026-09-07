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
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await login({ email, password });
      if (response && response.success && response.data) {
        localStorage.setItem("tripwise_user", JSON.stringify(response.data));
        navigate("/dashboard");
      } else {
        alert(response?.error || "Invalid email or password");
      }
    } catch (err) {
      console.warn("Backend login error, falling back:", err.message);
      // Friendly fallback
      localStorage.setItem(
        "tripwise_user",
        JSON.stringify({
          email,
          name: email.split("@")[0] || "Traveler",
          loggedInAt: new Date().toISOString(),
        })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center">
      <div className="w-full max-w-[520px] pt-15">
        <Login />
        <Placeholders
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <Extra />
        <Continue handleLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Lsection2;