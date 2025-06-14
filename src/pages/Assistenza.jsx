import React, { useState, useEffect } from "react";
import "../styles/main.css";
import api from "../api";
// If you have a DynamicForm component, import it. Otherwise, use a placeholder.
// import DynamicForm from "../components/DynamicForm";

export default function Assistenza() {
  const [prodotti, setProdotti] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/assistenza")
      .then((data) => {
        if (mounted) {
          setProdotti(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Errore nel caricamento prodotti assistenza");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="dashboard-grid">
      <section className="card card-large attiva-card new-card">
        <div className="card-header">
          <div className="card-title">
            <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>
              •
            </span>
            Prodotti Assistenza
          </div>
        </div>
        <div className="form-container">
          <div id="assistenza-grid-wrapper">
            <div id="assistenza-grid" className="offerte-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
              {loading ? (
                <p>Caricamento prodotti assistenza...</p>
              ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : prodotti.length === 0 ? (
                <p>Nessun prodotto assistenza trovato.</p>
              ) : (
                prodotti.map((product) => (
                  <div
                    key={product.id}
                    className={`card${selected && selected.id === product.id ? " selezionata" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelected(product)}
                  >
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div id="form-dinamico-assistenza" style={{ display: selected ? "block" : "none", marginTop: "2rem" }}>
            {selected ? (
              // Replace this with <DynamicForm offerta={selected} onClose={() => setSelected(null)} />
              <div className="card">
                <h2>Richiesta assistenza per: {selected.name}</h2>
                <p>Qui andrà il form dinamico di assistenza.</p>
                <button onClick={() => setSelected(null)}>Chiudi</button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
