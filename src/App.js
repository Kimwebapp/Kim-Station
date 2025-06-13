import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Attivazioni from "./pages/Attivazioni";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
// import Assistenza from "./pages/Assistenza"; // Sblocca quando crei Assistenza.jsx
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/attivazioni" element={<Attivazioni />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Account/Reset" element={<ResetPassword />} />
        {/* <Route path="/assistenza" element={<Assistenza />} /> */}
        {/* Altre pagine qui */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
