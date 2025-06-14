import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/main.css";
import OffertaCard from "../components/OffertaCard";
import DynamicForm from "../components/DynamicForm";
import "../styles/offerte.css";
import api from "../api";

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
  // SKY logic
  const [skyType, setSkyType] = useState("");

  // Dynamic form template state
  const [template, setTemplate] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState("");

  // Fetch template when offer is selected
  useEffect(() => {
    if (!offerta) {
      setTemplate(null);
      setTemplateLoading(false);
      setTemplateError("");
      return;
    }
    const selected = offerte.find(o => (o.id || o.value || o.ID || o) === offerta);
    if (!selected) return;
    setTemplate(null);
    setTemplateLoading(true);
    setTemplateError("");
    api.get(`/templates/${selected.id || selected.value || selected.ID || selected}`)
      .then(data => {
        setTemplate(data);
        setTemplateLoading(false);
      })
      .catch(err => {
        setTemplate(null);
        setTemplateError("Errore nel caricamento del template: " + (err?.message || ''));
        setTemplateLoading(false);
      });
  }, [offerta, offerte]);

  // Backend integration for dynamic form submission
  const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);
  const [formSubmissionError, setFormSubmissionError] = useState("");
  const [formSubmissionSuccess, setFormSubmissionSuccess] = useState(false);

  async function handleFormSubmit(formData) {
    setFormSubmissionLoading(true);
    setFormSubmissionError("");
    setFormSubmissionSuccess(false);
    try {
      await api.post("/attivazioni", {
        ...formData,
        offerta: offerta,
        operatore,
        tipologia,
        skyType,
      });
      setFormSubmissionSuccess(true);
      setOfferta("");
      setTemplate(null);
      setTemplateLoading(false);
      setTemplateError("");
    } catch (err) {
      setFormSubmissionError(err.message || "Errore invio dati.");
    } finally {
      setFormSubmissionLoading(false);
    }
  }

  // Redirect se manca il token
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Carica operatori all'avvio
  useEffect(() => {
    // setOperatoriLoading rimossatrue);
    // setOperatoriError rimossa"");
    api.get("/operatori")
      .then(data => {
        setOperatori(Array.isArray(data) ? data : []);
        // setOperatoriLoading rimossafalse);
      })
      .catch(err => {
        setOperatori([]);
        // setOperatoriError rimossa"Errore nel caricamento operatori: " + (err?.message || ''));
        // setOperatoriLoading rimossafalse);
      });
  }, []);

  // Carica tipologie quando cambia operatore
  useEffect(() => {
    if (!operatore || (operatore.toUpperCase().includes('SKY') && !skyType)) return;
    setTipologie([]);
    setTipologia("");
    setOfferte([]);
    setOfferta("");

    setTipologieLoading(true);
    setTipologieError("");
    const paramOperatore = operatore.toUpperCase().includes('SKY') ? skyType : operatore;
    api.get(`/tipologie?operatore=${encodeURIComponent(paramOperatore)}`)
      .then(data => {
        setTipologie(Array.isArray(data) ? data : []);
        setTipologieLoading(false);
      })
      .catch(err => {
        setTipologie([]);
        setTipologieLoading(false);
        setTipologieError("Errore nel caricamento tipologie: " + (err?.message || ''));
      });
  }, [operatore, skyType]);

  // Carica offerte quando cambia tipologia o skyType
  useEffect(() => {
    function getOperatoreId(val) {
      if (!val) return '';
      const found = operatori.find(op => (op.id || op.value || op) === val || op.nome === val || op.label === val);
      if (found && found.id) return found.id;
      if (found && found.value && !isNaN(found.value)) return found.value;
      if (!isNaN(val)) return val;
      return val;
    }
    // SKY logic
    if (operatore && operatore.toUpperCase().includes("SKY")) {
      if (!skyType || !tipologia) return;
      setOfferte([]);
      setOfferta("");
      // setOfferteLoading rimossatrue);
      // setOfferteError rimossa"");
      api.get(`/offerte?operatore=${encodeURIComponent(skyType)}&tipologia=${encodeURIComponent(tipologia)}&from=attivazioni`)
        .then(data => {
          setOfferte(Array.isArray(data) ? data : []);
          // setOfferteLoading rimossafalse);
        })
        .catch(err => {
          setOfferte([]);
          // setOfferteError rimossa"Errore nel caricamento offerte: " + (err?.message || ''));
          // setOfferteLoading rimossafalse);
        });
      return;
    }
    // Altri operatori
    if (!operatore || !tipologia) return;
    setOfferte([]);
    setOfferta("");
    // setOfferteLoading rimossatrue);
    // setOfferteError rimossa"");
    const operatoreId = getOperatoreId(operatore);
    api.get(`/offerte?operatore=${encodeURIComponent(operatoreId)}&tipologia=${encodeURIComponent(tipologia)}&from=attivazioni`)
      .then(data => {
        setOfferte(Array.isArray(data) ? data : []);
        // setOfferteLoading rimossafalse);
      })
      .catch(err => {
        setOfferte([]);
        // setOfferteError rimossa"Errore nel caricamento offerte: " + (err?.message || ''));
        // setOfferteLoading rimossafalse);
      });
  }, [operatore, tipologia, skyType, operatori]);



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
    {operatori.map(op => {
      const id = op.id || op.value || op;
      const label = op.nome || op.label || op.Nome || op.Label || op;
      return <option key={id} value={id}>{label}</option>;
    })} 
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
        // fallback robusto
        const id = t.id || t.value || t.ID || t;
        const label = t.nome || t.label || t.Nome || t.Label || t;
        return <option key={id} value={id}>{label}</option>;
      })} 
    </select>
  )}
</div>
                  <div id="step-offerta" className="form-group" style={{display: (tipologia && ((operatore.toUpperCase().includes('SKY') && skyType) || !operatore.toUpperCase().includes('SKY'))) ? 'block' : 'none'}}>
  <label className="form-label">3. Scegli offerta</label>
  {offerte.length === 0 ? (
    <div style={{padding:'8px 0', color:'#888'}}>Nessuna offerta disponibile</div>
  ) : (
    offerta && offerta !== "" ? (
            <>
              {formSubmissionSuccess && (
                <div style={{background:'#d4edda',color:'#155724',padding:'12px',borderRadius:'6px',marginBottom:'12px'}}>Attivazione inviata con successo!</div>
              )}
              {formSubmissionError && (
                <div style={{background:'#f8d7da',color:'#721c24',padding:'12px',borderRadius:'6px',marginBottom:'12px'}}>{formSubmissionError}</div>
              )}
              {formSubmissionLoading && (
                <div style={{padding:'8px 0'}}>Invio dati in corso...</div>
              )}
              {templateLoading ? (
                <div style={{padding:'8px 0'}}>Caricamento form dinamico...</div>
              ) : templateError ? (
                <div style={{color:'red', padding:'8px 0'}}>{templateError}</div>
              ) : template ? (
                <DynamicForm
                  offerta={offerte.find(o => (o.id || o.value || o.ID || o) === offerta)}
                  template={template}
                  templateLoading={formSubmissionLoading}
                  onSubmit={handleFormSubmit}
                  onClose={() => {
                    setOfferta("");
                    setTemplate(null);
                    setTemplateLoading(false);
                    setTemplateError("");
                  }}
                />
              ) : null}
            </>
          ) : (
      <div className="offerte-grid">
        {offerte.map(o => (
          <OffertaCard
            key={o.id || o.value || o.ID || o}
            offerta={o}
            selected={false}
            onSelect={() => {
              setOfferta(o.id || o.value || o.ID || o);
            }}
          />
        ))}
      </div>
    )
  )}
</div>
                  {/* Il vecchio placeholder formDinamico non serve più, DynamicForm è gestito sopra */}
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
