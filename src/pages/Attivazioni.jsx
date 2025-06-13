import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Attivazioni() {
  const navigate = useNavigate();
  const [operatori, setOperatori] = useState([]);
  const [operatore, setOperatore] = useState("");
  const [tipologie, setTipologie] = useState([]);
  const [tipologia, setTipologia] = useState("");
  const [tipologieLoading, setTipologieLoading] = useState(false);
  const [tipologieError, setTipologieError] = useState("");
  const [offerte, setOfferte] = useState([]);
  const [offerta, setOfferta] = useState("");
  const [formDinamico, setFormDinamico] = useState(null);
  // SKY logic
  const [skyType, setSkyType] = useState("");


  // Redirect se manca il token
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Carica operatori all'avvio
  useEffect(() => {
    fetch("/api/operatori", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setOperatori(Array.isArray(data) ? data : []))
      .catch(() => setOperatori([]));
  }, []);

  // Carica tipologie quando cambia operatore
  useEffect(() => {
    if (!operatore) return;
    setTipologie([]);
    setTipologia("");
    setOfferte([]);
    setOfferta("");
    setFormDinamico(null);
    setTipologieLoading(true);
    setTipologieError("");
    fetch(`/api/tipologie?operatore=${encodeURIComponent(operatore)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Errore fetch tipologie: ' + res.status);
        return res.json();
      })
      .then(data => {
        setTipologie(Array.isArray(data) ? data : []);
        setTipologieLoading(false);
      })
      .catch(err => {
        setTipologie([]);
        setTipologieLoading(false);
        setTipologieError("Errore nel caricamento tipologie");
      });
  }, [operatore]);

  // Carica offerte quando cambia tipologia o skyType
  useEffect(() => {
    // Operatore SKY: fetch solo se sia skyType che tipologia sono scelti
    if (operatore.toUpperCase().includes("SKY")) {
      if (!skyType || !tipologia) return;
      setOfferte([]);
      setOfferta("");
      setFormDinamico(null);
      fetch(`/api/offerte?operatore=${encodeURIComponent(skyType)}&tipologia=${encodeURIComponent(tipologia)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then(res => res.json())
        .then(data => setOfferte(Array.isArray(data) ? data : []))
        .catch(() => setOfferte([]));
      return;
    }
    // Altri operatori
    if (!operatore || !tipologia) return;
    setOfferte([]);
    setOfferta("");
    setFormDinamico(null);
    fetch(`/api/offerte?operatore=${encodeURIComponent(operatore)}&tipologia=${encodeURIComponent(tipologia)}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then(data => setOfferte(Array.isArray(data) ? data : []))
      .catch(() => setOfferte([]));
  }, [operatore, tipologia, skyType]);

  // Carica form dinamico quando cambia offerta
  useEffect(() => {
    if (!offerta) return;
    setFormDinamico(<div style={{padding:20}}>Form dinamico per l'offerta: <b>{offerta}</b> (TODO)</div>);
  }, [offerta]);

  // Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("dealerName");
    localStorage.removeItem("agenteNome");
    navigate("/login");
  }

  return (
    <div className="main-container">
      <div className="container">
        <div className="dashboard-wrapper">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-logo"><img src="/Logo/logo_white_def.png" alt="kim" /></div>
            <nav className="sidebar-menu">
              <ul>
                <li><Link to="/"> <span className="icon"><img src="/Icons/Dashboard.png" alt="Dashboard" /></span>Home</Link></li>
                <li className="active"><Link to="/attivazioni"><span className="icon"><img src="/Icons/AttivazioniDef.png" alt="" /></span>Attivazioni</Link></li>
                <li><Link to="/prodotti"><span className="icon"><img src="/Icons/Prodotti.png" alt="" /></span>Prodotti</Link></li>
                <li><Link to="/reportistica"><span className="icon"><img src="/Icons/Ricariche.png" alt="" /></span>Reportistica</Link></li>
                <li><Link to="/assistenza"><span className="icon"><img src="/Icons/Storico.png" alt="" /></span>Assistenza</Link></li>
                <li><Link to="/documentazione"><span className="icon"><img src="/Icons/Documentazione.png" alt="" /></span>Documentazione</Link></li>
                <li><button type="button" className="sidebar-link" style={{background:'none',border:0,padding:0,width:'100%',textAlign:'left'}}><span className="icon"><img src="/Icons/ChatBot.png" alt="" /></span>ChatBot</button></li>
              </ul>
            </nav>
            <div className="sidebar-bottom">
              <button id="logout-btn" className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </aside>

          {/* Main content */}
          <main className="main-content">
            <div className="welcome-container">
              <div className="welcome-content">
                <h1 className="welcome">Attivazioni</h1>
              </div>
            </div>
            <div className="dashboard-grid">
              <section className="card card-large attiva-card new-card">
                <div className="card-header">
                  <div className="card-title"><span style={{ color: '#1e4ddb', fontSize: '2.8em', lineHeight: '0.1', marginRight: '8px' }}>•</span>Attivazione Step by Step</div>
                </div>
                <div className="form-container">
                  <div className="form-group">
  <label htmlFor="operatore-menu" className="form-label">1. Scegli operatore</label>
  <select id="operatore-menu" className="form-select" value={operatore} onChange={e => { setOperatore(e.target.value); setSkyType(""); }}>
    <option value="">-- Scegli operatore --</option>
    {operatori.map(op => (
      <option key={op.id || op.value || op} value={op.id || op.value || op}>{op.nome || op.label || op}</option>
    ))}
  </select>
</div>
{/* SKY: sottoselezione */}
{operatore.toUpperCase().includes("SKY") && (
  <div className="form-group" style={{ marginTop: 15 }}>
    <label htmlFor="sky-type" style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Tipo SKY</label>
    <select id="sky-type" className="form-select" value={skyType} onChange={e => setSkyType(e.target.value)}>
      <option value="">-- Seleziona tipo SKY --</option>
      <option value="3">SKY TV</option>
      <option value="8">Sky Mobile</option>
      <option value="12">Sky Business</option>
      <option value="14">SKY BAR</option>
    </select>
  </div>
)}
                  <div id="step-tipologia" className="form-group" style={{display: operatore ? 'block' : 'none'}}>
  <label htmlFor="tipologia-menu" className="form-label">2. Scegli tipologia</label>
  {tipologieLoading ? (
    <div style={{padding:'8px 0'}}>Caricamento tipologie...</div>
  ) : tipologieError ? (
    <div style={{color:'red', padding:'8px 0'}}>{tipologieError}</div>
  ) : (
    <select id="tipologia-menu" className="form-select" value={tipologia} onChange={e => setTipologia(e.target.value)} disabled={tipologieLoading || tipologie.length === 0}>
      <option value="">{tipologie.length === 0 ? "Nessuna tipologia disponibile" : "-- Scegli tipologia --"}</option>
      {tipologie.map(t => {
        if (typeof t === "string") {
          if (t.toUpperCase() === "RESIDENZIALE") return <option key="RES" value="RES">Residenziale</option>;
          if (t.toUpperCase() === "BUSINESS") return <option key="BUS" value="BUS">Business</option>;
          return <option key={t} value={t}>{t}</option>;
        }
        return <option key={t.id || t.value || t} value={t.id || t.value || t}>{t.nome || t.label || t}</option>;
      })}
    </select>
  )}
</div>
                  <div id="step-offerta" className="form-group" style={{display: offerte.length > 0 ? 'block' : 'none'}}>
  <label htmlFor="offerta-menu" className="form-label">3. Scegli offerta</label>
  <select id="offerta-menu" className="form-select" value={offerta} onChange={e => setOfferta(e.target.value)}>
    <option value="">-- Scegli offerta --</option>
    {offerte.map(o => (
      <option key={o.id || o.value || o} value={o.id || o.value || o}>{o.nome || o.label || o}</option>
    ))}
  </select>
</div>
                  <div id="form-dinamico" className="form-dynamic">
                    {formDinamico}
                  </div>
                </div>
                {/* Tabella attivazioni (placeholder, da popolare lato backend se serve) */}
                <div className="table-responsive">
                  <table className="new-table" id="tabella-attivazioni" style={{display: 'none'}}>
                    <thead>
                      <tr>
                        <th>Offerta</th>
                        <th>Tipo</th>
                        <th>Segmento</th>
                        <th>Operatore</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Dati attivazioni qui se necessario */}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
