import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/main.css";
import "../styles/login-kim.css";

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
    <div className="login-kim-bg">
      <div className="login-kim-container">
        <div className="login-kim-logo">
          <img src="/Logo/logo_white_def.png" alt="Kim Smart Digital" style={{ height: 54, marginBottom: 8 }} />
        </div>
        <div className="login-kim-title">Accedi al tuo account</div>
        <form className="login-kim-form" onSubmit={handleSubmit} autoComplete="on">
          <div className="login-kim-input-group">
            <span className="login-kim-input-icon">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path fill="#b3c6e0" d="M2 6.5A3.5 3.5 0 0 1 5.5 3h13A3.5 3.5 0 0 1 22 6.5v11a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 2 17.5v-11Zm1.5 0A2 2 0 0 1 5.5 4.5h13a2 2 0 0 1 2 2v.38l-9 7.2-9-7.2V6.5Zm0 2.13V17.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V8.63l-8.37 6.7a1 1 0 0 1-1.26 0L3.5 8.63Z"/></svg>
            </span>
            <input
              className="login-kim-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
              placeholder="amministrazione@kimweb.it"
              autoComplete="username"
            />
          </div>
          <div className="login-kim-input-group">
            <span className="login-kim-input-icon">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="11" r="2.5" stroke="#b3c6e0" strokeWidth="1.5"/><rect x="6" y="15" width="12" height="4" rx="2" stroke="#b3c6e0" strokeWidth="1.5"/><rect x="4" y="7" width="16" height="10" rx="5" stroke="#b3c6e0" strokeWidth="1.5"/></svg>
            </span>
            <input
              className="login-kim-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <div className="login-kim-checkbox-row">
            <input
              className="login-kim-checkbox"
              type="checkbox"
              id="rememberMe"
              style={{ marginRight: 4 }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '1rem', color: '#1e4ddb', userSelect: 'none' }}>Ricordami</label>
          </div>
          {error && <div className="login-error" style={{ color: '#e00', marginBottom: 8 }}>{error}</div>}
          <button className="login-kim-btn" type="submit" disabled={loading}>
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
} 
