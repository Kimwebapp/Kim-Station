import "./Home.css"; // assicurati che gli stili siano aggiornati secondo il nuovo markup
import React, { useEffect, useRef } from "react";
import { handleAuthError } from "../auth";
import UltimeAttivazioni from "../components/UltimeAttivazioni";
import CreditoPlafondBox from "../components/CreditoPlafondBox";
import { useNavigate } from "react-router-dom";

// COMPONENTE OBIETTIVI
function ObiettiviCard() {
  const [operatori, setOperatori] = React.useState([]);
  const [operatore, setOperatore] = React.useState("");
  const [obiettivi, setObiettivi] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let ignore = false;
    async function fetchObiettivi() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token mancante");
        const response = await fetch("/api/obiettivi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
        const data = await response.json();
        const obiettiviData = Array.isArray(data.obiettivi) ? data.obiettivi : [];
        if (ignore) return;
        // Unique, non-empty operators
        const uniqueOperatori = [...new Set(obiettiviData.map(op => op.operatore).filter(Boolean))];
        setOperatori(uniqueOperatori);
        if (uniqueOperatori.length > 0) {
          setOperatore(uniqueOperatori[0]);
          const found = obiettiviData.find(op => op.operatore === uniqueOperatori[0]);
          setObiettivi(found ? found.categorie : []);
        }
      } catch (err) {
        if (!ignore) setError(err.message || "Errore sconosciuto");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchObiettivi();
    return () => { ignore = true; };
  }, []);

  React.useEffect(() => {
    if (!operatore) return;
    async function filtraObiettivi() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token mancante");
        const response = await fetch("/api/obiettivi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
        const data = await response.json();
        const obiettiviData = Array.isArray(data.obiettivi) ? data.obiettivi : [];
        const operatoreTrovato = obiettiviData.find(op => op.operatore === operatore);
        setObiettivi(operatoreTrovato ? operatoreTrovato.categorie : []);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
        setObiettivi([]);
      } finally {
        setLoading(false);
      }
    }
    filtraObiettivi();
  }, [operatore]);

  if (localStorage.getItem("agenteNome")) return null; // Nasconde la card agli agenti

  return (
    <section className="obiettivi-card-inner">
      <div className="obiettivi-header-row" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 10 }}>
        <div className="operatore-select-wrapper">
          <select
            value={operatore}
            onChange={e => setOperatore(e.target.value)}
            style={{ minWidth: 120 }}
          >
            {operatori.map((op, idx) => (
              <option key={idx} value={op}>{op}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="obiettivo-loading">
          <div className="spinner"></div>
          <p>Caricamento obiettivi...</p>
        </div>
      ) : error ? (
        <div className="obiettivo-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Riprova</button>
        </div>
      ) : obiettivi.length === 0 ? (
        <div className="nessun-risultato">
          <p>Nessun obiettivo disponibile</p>
        </div>
      ) : (
        <div className="obiettivi-container">
          {obiettivi.map((obiettivo, idx) => {
            const progresso = obiettivo.target > 0
              ? Math.min(Math.round((obiettivo.attuale / obiettivo.target) * 100), 100)
              : 0;
            const mancano = obiettivo.mancano > 0
              ? `Mancano ${obiettivo.mancano}`
              : "Obiettivo raggiunto!";
            return (
              <div className={`obiettivo-card ${progresso >= 100 ? "obiettivo-completato" : ""}`} key={idx}>
                <div className="obiettivo-header">
                  <h3>{obiettivo.nome}</h3>
                  <span>{obiettivo.attuale} / {obiettivo.target}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progresso}%` }}></div>
                </div>
                <div className="obiettivo-footer">
                  <span>{mancano}</span>
                  <span>{progresso}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// COMPONENTE ORDINI
function OrdiniCard() {
  const [ordini, setOrdini] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  useEffect(() => {
    async function fetchOrdini() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/ultimi-ordini", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        const ordiniArr = Array.isArray(data) ? data : (data.ordini || data.Ordini || []);
        setOrdini(ordiniArr);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
        setOrdini([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrdini();
  }, []);

  function formattaStatoOrdine(stato) {
    const statiNumerici = {
      0: "IN_ATTESA",
      1: "ELABORAZIONE",
      2: "ELABORATO",
      3: "SPEDITO",
      4: "CONSEGNATO",
      5: "ANNULLATO",
      10: "IN ATTESA PAGAMENTO",
    };
    const statoTestuale = typeof stato === "number"
      ? (statiNumerici[stato] || "SCONOSCIUTO")
      : (stato || "SCONOSCIUTO");
    const classiStato = {
      DA_ELABORARE_AGENTE: "warning",
      IN_ATTESA_PAGAMENTO: "danger",
      "IN ATTESA PAGAMENTO": "danger",
      ELABORATO: "success",
      SPEDITO: "info",
      CONSEGNATO: "success",
      ANNULLATO: "danger",
      IN_ATTESA: "warning",
      ELABORAZIONE: "info",
      "PAGATO CON CC": "info",
      CONFERMATO: "secondary",
      SCONOSCIUTO: "secondary",
    };
    const classe = classiStato[statoTestuale] || "secondary";
    const testoStato = String(statoTestuale).replace(/_/g, " ");
    return <span className={`status-badge ${classe}`}>{testoStato}</span>;
  }

  return (
    <section className="card card-large ordini-card new-card">
      <div className="card-header">
        <div className="card-title">Ultimi 5 Ordini</div>
      </div>
      <div className="table-container new-table-container">
        <table className="new-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Prodotto</th>
              <th>Tipo</th>
              <th>Importo</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}>Caricamento...</td></tr>
            ) : error ? (
              <tr><td colSpan={5}>Errore: {error}</td></tr>
            ) : ordini.length === 0 ? (
              <tr><td colSpan={5}>Nessun ordine trovato</td></tr>
            ) : (
              ordini.map((ordine, idx) => (
                <tr key={idx}>
                  <td>{ordine.Data ?? "-"}</td>
                  <td>{ordine.Prodotto ?? "-"}</td>
                  <td>{ordine.Tipo ?? "-"}</td>
                  <td>{ordine.Importo ? `€${parseFloat(ordine.Importo).toFixed(2)}` : "-"}</td>
                  <td>{formattaStatoOrdine(ordine.Stato)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// PUOI INSERIRE QUI ANCHE ObiettiviCard E AndamentoMensileCard COME FATTO SOPRA (per brevità omessi)

// COMPONENTE PRINCIPALE HOME
function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <div className="dashboard-header">
        <div className="welcome-container">
          <div className="welcome-content">
            <h1 className="welcome">Benvenuto,</h1>
            <div className="welcome-name" id="welcome-title">
              <span style={{ color: '#2563eb', fontWeight: 700 }}>
                {localStorage.getItem("dealerName") || localStorage.getItem("agenteNome") || "Utente"}
              </span>
            </div>
          </div>
          <div className="credito-container">
            <CreditoPlafondBox />
          </div>
        </div>
      </div>
      <div className="dashboard-grid new-dashboard-grid dashboard-grid-2x2">
        <div className="dashboard-grid-item attivazioni-cell">
          <div className="card card-large attivazioni-card new-card">
            <div className="card-header">
              <span className="card-dot" style={{ background: '#2563eb' }}></span>
              <div className="card-title">Ultime 5 Attivazioni</div>
            </div>
            <UltimeAttivazioni />
          </div>
        </div>
        <div className="dashboard-grid-item ordini-cell">
          <div className="card card-large ordini-card new-card">
            <div className="card-header">
              <span className="card-dot" style={{ background: '#2563eb' }}></span>
              <div className="card-title">Ultimi 5 Ordini</div>
            </div>
            <OrdiniCard />
          </div>
        </div>
        <div className="dashboard-grid-item obiettivi-cell">
          <div className="card card-large obiettivi-card new-card">
            <div className="card-header">
              <span className="card-dot" style={{ background: '#2563eb' }}></span>
              <div className="card-title">Obiettivi</div>
            </div>
            <ObiettiviCard />
          </div>
        </div>
        <div className="dashboard-grid-item andamento-cell">
          <div className="card card-large andamento-card new-card">
            <div className="card-header">
              <span className="card-dot" style={{ background: '#2563eb' }}></span>
              <div className="card-title">Andamento Mensile</div>
            </div>
            <AndamentoMensileCard />
          </div>
        </div>
      </div>
    </>
  );
}



function AndamentoMensileCard() {
  const chartRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const chartInstance = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let ignore = false;

    async function fetchAndamento() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token mancante");
        const response = await fetch("/api/andamento", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (handleAuthError(response)) return;
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
        const data = await response.json();

        if (ignore) return;

        const labels = data.map(item => item.ANNO_MESE);
        const iliad = data.map(item => item.ILIAD || 0);
        const kena = data.map(item => item.KENA || 0);
        const oneMobile = data.map(item => item["1MOBILE"] || 0);
        const weedoo = data.map(item => item.WEEDOO || 0);

        const Chart = (await import("chart.js/auto")).default;

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        if (!chartRef.current) return; // canvas non ancora montato
        const ctx = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              { label: "ILIAD", data: iliad, borderColor: "#4e73df", backgroundColor: "rgba(78, 115, 223, 0.05)", fill: true, tension: 0.3 },
              { label: "KENA", data: kena, borderColor: "#1cc88a", backgroundColor: "rgba(28, 200, 138, 0.05)", fill: true, tension: 0.3 },
              { label: "1MOBILE", data: oneMobile, borderColor: "#f6c23e", backgroundColor: "rgba(246, 194, 62, 0.05)", fill: true, tension: 0.3 },
              { label: "WEEDOO", data: weedoo, borderColor: "#e74a3b", backgroundColor: "rgba(231, 74, 59, 0.05)", fill: true, tension: 0.3 }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: true, position: "top" },
              title: { display: false }
            },
            scales: {
              x: { title: { display: true, text: "Mese" } },
              y: { title: { display: true, text: "Attivazioni" }, beginAtZero: true }
            }
          }
        });


      } catch (err) {
        setError(err.message || "Errore nel caricamento del grafico");
      } finally {
        setLoading(false);
      }
    }

    fetchAndamento();

    return () => {
      ignore = true;
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, []);

  return (
    <section className="card card-large andamento-card new-card">
      <div className="card-header">
        <div className="card-title">Andamento Mensile</div>
      </div>
      <div className="chart-container" style={{ minHeight: 350 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="spinner"></div>
            <p>Caricamento grafico in corso...</p>
          </div>
        ) : error ? (
          <div style={{ color: "red", padding: 30 }}>
            Errore: {error}
          </div>
        ) : (
          <canvas ref={chartRef} height="300"></canvas>
        )}
      </div>
    </section>
  );
}

export default Home;
