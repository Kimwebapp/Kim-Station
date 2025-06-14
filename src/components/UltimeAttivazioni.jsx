import React, { useEffect, useState } from "react";

const OPERATORI = [
  { value: "all", label: "Tutti" },
  { value: "SKY", label: "SKY" },
  { value: "FASTWEB", label: "FASTWEB" },
  { value: "FASTWEB ENERGIA", label: "FASTWEB ENERGIA" },
  { value: "ILIAD", label: "ILIAD" },
  { value: "KENA MOBILE", label: "KENA MOBILE" },
  { value: "WEEDOO", label: "WEEDOO" },
  { value: "1MOBILE", label: "1MOBILE" },
];

function formattaStatoAttivazione(stato) {
  if (!stato) return <span className="status-badge secondary">-</span>;
  const classi = {
    "ATTIVATO": "success",
    "ANNULLATO": "danger",
    "DA_ELABORARE": "warning",
    "CONFERMATO": "info",
    "IN ATTESA FIRMA": "warning",
    "IN ATTESA PAGAMENTO": "danger",
    "IN ATTESA": "warning",
    "SPEDITO": "info",
    "SCONOSCIUTO": "secondary",
  };
  const key = stato.replace(/_/g, " ");
  return <span className={`status-badge ${classi[key] || "secondary"}`}>{key}</span>;
}

export default function UltimeAttivazioni() {
  const [attivazioni, setAttivazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const [operatore, setOperatore] = useState("all");
  const isAgente = Boolean(window.localStorage.getItem("agenteNome"));

  useEffect(() => {
    async function caricaAttivazioni() {
      setLoading(true);
      setErrore(null);
      try {
        const token = window.localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        const endpoint = isAgente
          ? "/api/agente/ultime-attivazioni"
          : "/api/ultime-attivazioni";
        const params = !isAgente && operatore && operatore !== "all" ? `?operatore=${encodeURIComponent(operatore)}` : "";
        const response = await fetch(endpoint + params, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        let attiv = [];
        if (Array.isArray(data)) {
          attiv = data;
        } else if (Array.isArray(data.attivazioni)) {
          attiv = data.attivazioni;
        } else if (Array.isArray(data.Attivazioni)) {
          attiv = data.Attivazioni;
        }
        setAttivazioni(attiv);
      } catch (err) {
        setErrore(err.message || "Errore caricamento attivazioni");
        setAttivazioni([]);
      } finally {
        setLoading(false);
      }
    }
    caricaAttivazioni();
    // eslint-disable-next-line
  }, [operatore, isAgente]);

  return (
    <div className="ultime-attivazioni-card">
      <h3>Ultime Attivazioni</h3>
      {!isAgente && (
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="operatore-select" style={{ marginRight: 8 }}>Operatore:</label>
          <select
            id="operatore-select"
            value={operatore}
            onChange={e => setOperatore(e.target.value)}
            style={{ minWidth: 120 }}
          >
            {OPERATORI.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>Data</th>
              {isAgente && <th>Point</th>}
              <th>Operatore</th>
              <th>Segmento</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody id="corpo-tabella">
            {loading ? (
              <tr><td colSpan={isAgente ? 5 : 4} className="text-center text-muted"><i>Caricamento in corso...</i></td></tr>
            ) : errore ? (
              <tr><td colSpan={isAgente ? 5 : 4} className="text-center text-danger">{errore}</td></tr>
            ) : attivazioni.length === 0 ? (
              <tr><td colSpan={isAgente ? 5 : 4} className="text-center text-muted"><i>Nessuna attivazione trovata</i></td></tr>
            ) : (
              attivazioni.map((attiv, idx) => (
                <tr key={attiv.IDAttivazione || idx}>
                  <td>{attiv.Data || "-"}</td>
                  {isAgente && <td>{attiv.POINT || "-"}</td>}
                  <td>{attiv.Operatore || "-"}</td>
                  <td>{attiv.Segmento || "-"}</td>
                  <td>{attiv.Tipo || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
