import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

const OPERATORI = [
  { value: "all", label: "Tutti gli Operatori" },
  { value: "FASTWEB", label: "FASTWEB" },
  { value: "SKY TV", label: "SKY TV" },
  { value: "RABONA", label: "RABONA" },
  { value: "ILIAD", label: "ILIAD" },
  { value: "KENA MOBILE", label: "KENA MOBILE" },
  { value: "UNO MOBILE", label: "UNO MOBILE" },
  { value: "SKY MOBILE", label: "SKY MOBILE" },
  { value: "FASTWEB ENERGIA", label: "FASTWEB ENERGIA" },
  { value: "ASSISTENZA", label: "ASSISTENZA" },
  { value: "PRODOTTI", label: "PRODOTTI" },
  { value: "SKY BUSINESS", label: "SKY BUSINESS" },
  { value: "WEEDOO", label: "WEEDOO" },
];

const Home = () => {
  // Redirect a login se manca il token
  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  function formattaStatoAttivazione(stato) {
    const classiStato = {
      ATTIVATO: "success",
      "IN ATTESA": "warning",
      ERRORE: "danger",
      "IN LAVORAZIONE": "info",
      PENDENTE: "pending",
      ANNULLATO: "danger",
      COMPLETATO: "success",
      DA_ATTIVARE: "warning",
      "DA ELABORARE": "warning",
      "DA ELABORARE AGENTE": "warning",
      ATTESA_INTEGRAZIONE: "info",
      INTEGRATO: "success",
    };
    const classe = classiStato[String(stato).toUpperCase()] || "secondary";
    return <span className={`status-badge ${classe}`}>{String(stato).replace(/_/g, " ")}</span>;
  }

  return (
    <div className="main-container">
      <div className="container">
        <div className="dashboard-wrapper">
          {/* Sidebar ... (come prima) */}
          <aside className="sidebar">
            <div className="sidebar-logo">
              <img src="/Logo/logo_white_def.png" alt="kim" />
            </div>
            <nav className="sidebar-menu">
              <ul>
                <li className="active">
                  <Link to="/">
                    <span className="icon">
                      <img src="/Icons/Dashboard.png" alt="Dashboard" />
                    </span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/attivazioni">
                    <span className="icon">
                      <img src="/Icons/AttivazioniDef.png" alt="" />
                    </span>
                    Attivazioni
                  </Link>
                </li>
                <li>
                  <Link to="/prodotti">
                    <span className="icon">
                      <img src="/Icons/Prodotti.png" alt="" />
                    </span>
                    Prodotti
                  </Link>
                </li>
                <li>
                  <Link to="/reportistica">
                    <span className="icon">
                      <img src="/Icons/Ricariche.png" alt="" />
                    </span>
                    Reportistica
                  </Link>
                </li>
                <li>
                  <Link to="/assistenza">
                    <span className="icon">
                      <img src="/Icons/Storico.png" alt="" />
                    </span>
                    Assistenza
                  </Link>
                </li>
                <li>
                  <Link to="/documentazione">
                    <span className="icon">
                      <img src="/Icons/Documentazione.png" alt="" />
                    </span>
                    Documentazione
                  </Link>
                </li>
                <li>
                  <button type="button" className="sidebar-link" style={{background: 'none', border: 0, padding: 0, width: '100%', textAlign: 'left'}} onClick={() => { /* openChatbox(); */ }}>
                    <span className="icon">
                      <img src="/Icons/ChatBot.png" alt="" />
                    </span>
                    ChatBot
                  </button>
                </li>
              </ul>
            </nav>
            <div className="sidebar-bottom">
              <button className="login-link" onClick={() => window.location.href = "/Account/Reset"}>Password dimenticata?</button>
            </div>
          </aside>

          {/* Main content ... */}
          <main className="main-content">
            <div className="welcome-container">
              <div className="welcome-content">
                <h1 className="welcome">Benvenuto,</h1>
                <div className="welcome-name" id="welcome-title"></div>
              </div>
              <div className="credito-section" id="box-credito-plafond">
                <span className="credito-label">
                  CREDITO PLAFOND: <span id="credito-plafond-valore">...</span>
                </span>
                <button id="btn-ricarica-plafond" className="btn-ricarica" disabled>Inizializzazione...</button>
              </div>
            </div>

            {/* Dashboard grid */}
            <div className="dashboard-grid new-dashboard-grid">
              {/* Attivazioni Card */}
              <section className="card card-large attivazioni-card new-card">
                <div className="card-header">
                  <div className="card-title">
                    <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>
                      •
                    </span>
                    Ultime 5 Attivazioni
                  </div>
                  {!isAgente && (
                    <div className="operatore-select-wrapper">
                      <select
                        id="operatore-select"
                        value={operatore}
                        onChange={e => setOperatore(e.target.value)}
                      >
                        {OPERATORI.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="table-container new-table-container">
                  <table className="new-table" id="tabella-attivazioni">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>{isAgente ? "POINT" : "Titolo"}</th>
                        <th>{isAgente ? "Operatore" : "Tipo"}</th>
                        <th>{isAgente ? "Segmento" : "Segmento"}</th>
                        <th>{isAgente ? "Tipo" : "Stato"}</th>
                      </tr>
                    </thead>
                    <tbody id="corpo-tabella">
                      {loading ? (
                        <tr>
                          <td colSpan={5}>Caricamento...</td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan={5}>Errore: {error}</td>
                        </tr>
                      ) : attivazioni.length === 0 ? (
                        <tr>
                          <td colSpan={5}>Nessun dato trovato</td>
                        </tr>
                      ) : (
                        attivazioni.map((attiv, idx) => (
                          <tr key={idx}>
                            <td>{attiv.Data || "-"}</td>
                            <td>{isAgente ? attiv.POINT || "-" : attiv.Titolo || "-"}</td>
                            <td>{isAgente ? attiv.Operatore || "-" : attiv.Tipo || "-"}</td>
                            <td>{attiv.Segmento || "-"}</td>
                            <td>{isAgente ? (attiv.Tipo || "-") : formattaStatoAttivazione(attiv.Stato || "-")}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Ordini Card */}
              <OrdiniCard />

              {/* Obiettivi Card */}
              <ObiettiviCard />

              {/* Andamento Mensile Card */}
              <AndamentoMensileCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE ORDINI ---
function OrdiniCard() {
  const [ordini, setOrdini] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchOrdini() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/ultimi-ordini", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        let ordiniArr = [];
        if (Array.isArray(data)) ordiniArr = data;
        else if (Array.isArray(data.ordini)) ordiniArr = data.ordini;
        else if (Array.isArray(data.Ordini)) ordiniArr = data.Ordini;
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
        <div className="card-title">
          <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>•</span>
          Ultimi 5 Ordini
        </div>
      </div>
      <div className="table-container new-table-container">
        <table className="new-table" id="tabella-ordini">
          <thead>
            <tr>
              <th>Data</th>
              <th>Prodotto</th>
              <th>Tipo</th>
              <th>Importo</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody id="corpo-tabella-ordini">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  <i>Caricamento in corso...</i>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center text-danger">
                  <i className="fas fa-exclamation-triangle"></i>
                  Errore: {error}
                </td>
              </tr>
            ) : ordini.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <i>Nessun ordine recente trovato</i>
                </td>
              </tr>
            ) : (
              ordini.map((ordine, idx) => {
                const dataOrdine = ordine.Data ?? ordine.data ?? ordine.data_ordine ?? "-";
                const prodotto = ordine.Prodotto ?? ordine.prodotto ?? ordine.nome_prodotto ?? ordine.descrizione ?? "-";
                const tipo = ordine.Tipo ?? ordine.tipo ?? ordine.categoria ?? ordine.tipo_prodotto ?? "-";
                const importo = ordine.Importo ?? ordine.importo ?? ordine.prezzo ?? 0;
                const stato = ordine.Stato ?? ordine.stato ?? ordine.stato_ordine ?? "SCONOSCIUTO";
                return (
                  <tr key={idx}>
                    <td>{dataOrdine}</td>
                    <td>{prodotto}</td>
                    <td>{tipo}</td>
                    <td>{importo !== 0 ? `€${parseFloat(importo).toFixed(2)}` : "-"}</td>
                    <td>{formattaStatoOrdine(stato)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// --- COMPONENTE OBIETTIVI ---
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
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/obiettivi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Errore HTTP: " + response.status);
        const data = await response.json();
        const obiettiviData = Array.isArray(data.obiettivi) ? data.obiettivi : [];
        if (ignore) return;
        setOperatori(obiettiviData.map(op => op.operatore));
        if (obiettiviData.length > 0) {
          setOperatore(obiettiviData[0].operatore);
          setObiettivi(obiettiviData[0].categorie);
        } else {
          setOperatore("");
          setObiettivi([]);
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
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/obiettivi", {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  function renderObiettivi() {
    if (loading) {
      return (
        <div className="obiettivo-loading">
          <div className="spinner"></div>
          <p>Caricamento obiettivi in corso...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="obiettivo-error">
          <p>Impossibile caricare gli obiettivi. Riprova più tardi.</p>
          <button className="btn-retry" onClick={() => window.location.reload()}>Riprova</button>
        </div>
      );
    }
    if (!obiettivi || obiettivi.length === 0) {
      return (
        <div className="nessun-risultato">
          <p>Nessun obiettivo disponibile per la selezione corrente</p>
        </div>
      );
    }
    return (
      <div className="obiettivi-container">
        {obiettivi.map((obiettivo, idx) => {
          const progresso = obiettivo.target > 0 
            ? Math.min(Math.round((obiettivo.attuale / obiettivo.target) * 100), 100)
            : 0;
          const mancano = obiettivo.mancano > 0 
            ? `Mancano ${obiettivo.mancano}` 
            : 'Obiettivo raggiunto!';
          const progressClass = progresso >= 100 ? 'obiettivo-completato' : '';
          return (
            <div className={`obiettivo-card ${progressClass}`} key={idx}>
              <div className="obiettivo-header">
                <h3>{obiettivo.nome}</h3>
                <span className="obiettivo-stato">{obiettivo.attuale} / {obiettivo.target}</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{width: progresso + '%'}}></div>
              </div>
              <div className="obiettivo-footer">
                <span>{mancano}</span>
                <span>{progresso}%</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Non mostrare la card se agente (come legacy)
  if (localStorage.getItem("agenteNome")) return null;

  return (
    <section className="card new-card" id="test-card">
      <div className="card-header">
        <div className="card-title">
          <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>•</span>
          Obiettivi
        </div>
        <div className="operatore-select-wrapper">
          <select
            id="obiettivi-operatore-select"
            value={operatore}
            onChange={e => setOperatore(e.target.value)}
          >
            {operatori.map((op, idx) => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
        </div>
      </div>
      {renderObiettivi()}
    </section>
  );
}

// --- COMPONENTE ANDAMENTO MENSILE ---
function AndamentoMensileCard() {
  const chartRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [chartInstance, setChartInstance] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    async function fetchAndamento() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/andamento", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        if (ignore) return;
        const labels = data.map(item => item.ANNO_MESE);
        const iliad = data.map(item => item.ILIAD || 0);
        const kena = data.map(item => item.KENA || 0);
        const oneMobile = data.map(item => item["1MOBILE"] || 0);
        const weedoo = data.map(item => item.WEEDOO || 0);
        // Import dinamico Chart.js (evita problemi SSR)
        const Chart = (await import("chart.js/auto")).default;
        if (chartInstance) {
          chartInstance.destroy();
        }
        if (!chartRef.current) throw new Error("Canvas non trovato");
        const ctx = chartRef.current.getContext("2d");
        const newChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "ILIAD",
                data: iliad,
                borderColor: "#4e73df",
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                tension: 0.3,
                fill: true,
              },
              {
                label: "KENA",
                data: kena,
                borderColor: "#1cc88a",
                backgroundColor: "rgba(28, 200, 138, 0.05)",
                tension: 0.3,
                fill: true,
              },
              {
                label: "1MOBILE",
                data: oneMobile,
                borderColor: "#f6c23e",
                backgroundColor: "rgba(246, 194, 62, 0.05)",
                tension: 0.3,
                fill: true,
              },
              {
                label: "WEEDOO",
                data: weedoo,
                borderColor: "#e74a3b",
                backgroundColor: "rgba(231, 74, 59, 0.05)",
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              title: {
                display: false,
              },
            },
            scales: {
              x: { title: { display: true, text: "Mese" } },
              y: { title: { display: true, text: "Attivazioni" }, beginAtZero: true },
            },
          },
        });
        setChartInstance(newChart);
      } catch (err) {
        setError(err.message || "Errore sconosciuto");
      } finally {
        setLoading(false);
      }
    }
    fetchAndamento();
    return () => {
      ignore = true;
      if (chartInstance) chartInstance.destroy();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <section className="card card-large andamento-card new-card">
      <div className="card-header">
        <div className="card-title">
          <span style={{ color: "#1e4ddb", fontSize: "2.8em", lineHeight: 0.1, marginRight: 8 }}>•</span>
          Andamento Mensile
        </div>
      </div>
      <div className="chart-container" id="trendChartContainer" style={{ minHeight: 350 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="spinner"></div>
            <p>Caricamento grafico in corso...</p>
          </div>
        ) : error ? (
          <div style={{ color: "red", padding: 30 }}>
            Errore nel caricamento del grafico: {error}
          </div>
        ) : (
          <canvas ref={chartRef} id="operatorTrendChart" height="300"></canvas>
        )}
      </div>
    </section>
  );
}

export default Home;
