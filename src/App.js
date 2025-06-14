import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Attivazioni from "./pages/Attivazioni";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Assistenza from "./pages/Assistenza";
import Prodotti from "./pages/Prodotti";
import Documentazione from "./pages/Documentazione";
// import Ricariche from "./pages/Ricariche"; // Da creare
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Account/Reset" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <Home />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/attivazioni"
          element={
            <RequireAuth>
              <Layout>
                <Attivazioni />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/assistenza"
          element={
            <RequireAuth>
              <Layout>
                <Assistenza />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/documentazione"
          element={
            <RequireAuth>
              <Layout>
                <Documentazione />
              </Layout>
            </RequireAuth>
          }
        />
        {/* Sblocca e implementa queste pagine quando pronte */}
        {/*
        <Route
          path="/assistenza"
          element={
            <RequireAuth>
              <Layout>
                <Assistenza />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/documentazione"
          element={
            <RequireAuth>
              <Layout>
                <Documentazione />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/ricariche"
          element={
            <RequireAuth>
              <Layout>
                <Ricariche />
              </Layout>
            </RequireAuth>
          }
        />
        */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
