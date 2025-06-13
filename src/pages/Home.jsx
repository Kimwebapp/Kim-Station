import { useEffect, useState } from "react";
import './style.css'; // importa il CSS globale
// Se hai componenti React per i chart o Stripe, li integrerai dopo.

export default function Dashboard() {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [showStripeModal, setShowStripeModal] = useState(false);

  useEffect(() => {
    // Simula redirect se manca il token
    if (!localStorage.getItem('token')) {
      window.location.href = 'login.html';
    }

    // Popola welcome
    const agenteNome = localStorage.getItem('agenteNome');
    const dealerName = localStorage.getItem('dealerName');

    let ruoloPrincipale = '';
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.ruoli && Array.isArray(payload.ruoli) && payload.ruoli.length > 0) {
          ruoloPrincipale = ` (${payload.ruoli[0]})`;
        }
      } catch (e) {
        console.warn('Impossibile decodificare il token per estrarre il ruolo:', e);
      }
    }

    const nome = agenteNome || dealerName || '';
    setUserName(nome);
    setUserRole(ruoloPrincipale);

    // TODO: Nascondi card Obiettivi per agenti
    if (agenteNome) {
      const cardObiettivi = document.querySelector('.card-obiettivi, #card-obiettivi');
      if (cardObiettivi) cardObiettivi.style.display = 'none';
    }

  }, []);

  return (
    <>
      <div className="main-container">
        <div className="container">
          <div className="dashboard-wrapper">
            <aside className="sidebar">
              <div className="sidebar-logo">
                <img src="Logo/logo_white_def.png" alt="kim" />
              </div>
              <nav className="sidebar-menu">
                <ul>
                  <li className="active">
                    <a href="index.html">
                      <span className="icon"><img src="Icons/Dashboard.png" alt="Dashboard" /></span>Home
                    </a>
                  </li>
                  <li><a href="attivazioni.html"><span className="icon"><img src="Icons/AttivazioniDef.png" alt="" /></span>Attivazioni</a></li>
                  <li><a href="prodotti.html"><span className="icon"><img src="Icons/Prodotti.png" alt="" /></span>Prodotti</a></li>
                  <li><a href="ricariche.html"><span className="icon"><img src="Icons/Ricariche.png" alt="" /></span>Reportistica</a></li>
                  <li><a href="assistenza.html"><span className="icon"><img src="Icons/Storico.png" alt="" /></span>Assistenza</a></li>
                  <li><a href="documentazione.html"><span className="icon"><img src="Icons/Documentazione.png" alt="" /></span>Documentazione</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); openChatbox(); }}><span className="icon"><img src="Icons/ChatBot.png" alt="" /></span>ChatBot</a></li>
                </ul>
              </nav>
              <div className="sidebar-bottom">
                <button id="logout-btn" className="logout-btn">Logout</button>
              </div>
            </aside>

            <main className="main-content">
              <div className="welcome-container">
                <div className="welcome-content">
                  <h1 className="welcome">Benvenuto,</h1>
                  <div className="welcome-name">{userName} {userRole}</div>
                </div>
                <div className="credito-section" id="box-credito-plafond">
                  <span className="credito-label">CREDITO PLAFOND: <span id="credito-plafond-valore">...</span></span>
                  <button
                    id="btn-ricarica-plafond"
                    className="btn-ricarica"
                    onClick={() => setShowStripeModal(true)}
                  >
                    Inizializzazione...
                  </button>
                </div>
              </div>

              <div className="dashboard-grid new-dashboard-grid">
                {/* Card Attivazioni */}
                <section className="card card-large attivazioni-card new-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span style={{ color: '#1e4ddb', fontSize: '2.8em', lineHeight: '0.1', marginRight: '8px' }}>•</span>Ultime 5 Attivazioni
                    </div>
                    <div className="operatore-select-wrapper">
                      <select id="operatore-select">
                        <option value="all">Tutti gli Operatori</option>
                        <option value="FASTWEB">FASTWEB</option>
                        <option value="SKY TV">SKY TV</option>
                        <option value="RABONA">RABONA</option>
                        <option value="ILIAD">ILIAD</option>
                        <option value="KENA MOBILE">KENA MOBILE</option>
                        <option value="UNO MOBILE">UNO MOBILE</option>
                        <option value="SKY MOBILE">SKY MOBILE</option>
                        <option value="FASTWEB ENERGIA">FASTWEB ENERGIA</option>
                        <option value="ASSISTENZA">ASSISTENZA</option>
                        <option value="PRODOTTI">PRODOTTI</option>
                        <option value="SKY BUSINESS">SKY BUSINESS</option>
                        <option value="WEEDOO">WEEDOO</option>
                      </select>
                    </div>
                  </div>
                  <div className="table-container new-table-container">
                    <table className="new-table" id="tabella-attivazioni">
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Titolo</th>
                          <th>Tipo</th>
                          <th>Segmento</th>
                          <th>Stato</th>
                        </tr>
                      </thead>
                      <tbody id="corpo-tabella">
                        {/* I dati verranno caricati dinamicamente */}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Card Ordini */}
                <section className="card card-large ordini-card new-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span style={{ color: '#1e4ddb', fontSize: '2.8em', lineHeight: '0.1', marginRight: '8px' }}>•</span>Ultimi 5 Ordini
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
                        {/* I dati verranno caricati dinamicamente */}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Card Obiettivi */}
                <section className="card new-card" id="test-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span style={{ color: '#1e4ddb', fontSize: '2.8em', lineHeight: '0.1', marginRight: '8px' }}>•</span>Obiettivi
                    </div>
                    <div className="operatore-select-wrapper">
                      <select id="obiettivi-operatore-select">
                        <option value="FASTWEB TLC">FASTWEB TLC</option>
                        <option value="FASTWEB ENERGIA">FASTWEB ENERGIA</option>
                        <option value="Sky Mobile & WIFI">Sky Mobile & WIFI</option>
                        <option value="Sky TV">Sky TV</option>
                        <option value="WEEDOO">WEEDOO</option>
                      </select>
                    </div>
                  </div>
                  <div className="obiettivi-container">
                    {/* Gli obiettivi verranno caricati qui dinamicamente */}
                  </div>
                </section>

                {/* Card Andamento Mensile */}
                <section className="card card-large andamento-card new-card">
                  <div className="card-header">
                    <div className="card-title">
                      <span style={{ color: '#1e4ddb', fontSize: '2.8em', lineHeight: '0.1', marginRight: '8px' }}>•</span>Andamento Mensile
                    </div>
                  </div>
                  <div className="chart-container" id="trendChartContainer">
                    <canvas id="operatorTrendChart" height="300"></canvas>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* MODALE RICARICA PLAFOND */}
      {showStripeModal && (
        <div
          id="modal-ricarica-plafond"
          style={{
            display: 'flex',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            id="modal-ricarica-plafond-content"
            style={{
              background: '#fff',
              borderRadius: '10px',
              padding: '32px 28px 20px 28px',
              minWidth: '340px',
              minHeight: '220px',
              boxShadow: '0 2px 24px rgba(30,77,219,0.09)',
              position: 'relative',
            }}
          >
            <h2 style={{ marginTop: '0', fontSize: '1.3em', color: '#2b7cff' }}>Ricarica credito plafond</h2>
            {/* Qui poi integra Stripe Elements con componenti React */}
            <button
              id="btn-chiudi-modale-ricarica"
              className="btn-secondary"
              onClick={() => setShowStripeModal(false)}
            >
              Annulla
            </button>
          </div>
        </div>
      )}
    </>
  );
}