import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/main.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const email = query.get("email") || "";
  const token = query.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("Inserisci la nuova password in entrambi i campi.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/password-reset-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword })
      });
      if (!response.ok) throw new Error("Errore nel reset della password");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Errore di rete");
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
          <h2>Reimposta password</h2>
          <div className="input-group">
            <label>Nuova password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              placeholder="Nuova password"
            />
          </div>
          <div className="input-group">
            <label>Conferma password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Conferma password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          {success ? (
            <div className="login-success">Password aggiornata! Reindirizzamento...</div>
          ) : (
            <button className="btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Salvataggio..." : "Salva nuova password"}
            </button>
          )}
        </form>
        <div className="login-footer">
          <a href="/login" className="login-link">Torna al login</a>
        </div>
      </div>
    </div>
  );
}
