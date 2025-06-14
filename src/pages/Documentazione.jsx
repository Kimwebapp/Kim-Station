import React, { useState, useEffect } from "react";
import "../styles/main.css";
import api from "../api";

export default function Documentazione() {
  const [docs, setDocs] = useState([]);
  const [operatori, setOperatori] = useState([]);
  const [operatore, setOperatore] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/documentazione")
      .then((data) => {
        if (mounted) {
          setDocs(Array.isArray(data) ? data : []);
          // Extract unique operators from docs
          const ops = [...new Set((Array.isArray(data) ? data : []).map(f => f.Operatore))].sort();
          setOperatori(ops);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Errore nel caricamento documenti");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredDocs = operatore ? docs.filter(f => f.Operatore === operatore) : [];

  const handleChange = (e) => {
    setOperatore(e.target.value);
  };


  return (
    <div className="dashboard-grid">
      <section className="card card-large documentazione-card">
        <div className="card-header">
          <div className="card-title">
            <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>
              •
            </span>
            Documenti Operatori
          </div>
        </div>
        <div className="documentazione-container">
          <div className="form-group">
            <label htmlFor="operatore-docs" className="form-label">Seleziona Operatore</label>
            <select
              id="operatore-docs"
              className="form-select"
              value={operatore}
              onChange={handleChange}
              disabled={loading || !!error || operatori.length === 0}
            >
              <option value="">-- Scegli operatore --</option>
              {operatori.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <div id="docs-table-box" className="documenti-table" style={{ marginTop: "2rem" }}>
            {loading ? (
              <p>Caricamento documenti...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : operatore && filteredDocs.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Titolo</th>
                    <th>Scarica</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc, idx) => (
                    <tr key={doc.id || idx}>
                      <td>{doc.Titolo}</td>
                      <td><a href={doc.Link} target="_blank" rel="noopener noreferrer" download>Download</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : operatore ? (
              <p>Nessun documento disponibile per questo operatore.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
