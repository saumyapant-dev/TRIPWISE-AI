import React, { useState } from "react";
import Login from "./Login";
import Placeholders from "./Placeholders";
import Extra from "./Extra";
import Continue from "./Continue";

const Lsection2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    console.log({
      email,
      password,
    });
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