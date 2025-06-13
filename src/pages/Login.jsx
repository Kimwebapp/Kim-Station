import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/main.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error("Credenziali non valide");
      const data = await response.json();
      if (!data.token) throw new Error("Token non ricevuto");
      localStorage.setItem("token", data.token);
      if (data.dealerName) localStorage.setItem("dealerName", data.dealerName);
      if (data.agenteNome) localStorage.setItem("agenteNome", data.agenteNome);
      navigate("/");
    } catch (err) {
      setError(err.message || "Errore di login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">
          <img src="/Logo/logo_white_def.png" alt="Kimweb" height={60} />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Accedi al portale</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
              placeholder="Email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
        <div className="login-footer">
          <Link to="/Account/Reset" className="login-link">Password dimenticata?</Link>
        </div>
      </div>
    </div>
  );
}
