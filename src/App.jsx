import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GenerateTrip from "./pages/GenerateTrip";
import TripDetails from "./pages/TripDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/generate-trip" element={<GenerateTrip />} />
        <Route path="/trip-details" element={<TripDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;