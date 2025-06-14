import React, { useEffect, useState } from "react";
import { useCarrello } from "../context/CarrelloContext";

// Questo componente mostra una griglia di prodotti e consente l'aggiunta al carrello
export default function ProdottiGrid({ segmento = null, dealerSelezionato = null }) {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);
  const { aggiungiAlCarrello } = useCarrello();

  useEffect(() => {
    async function fetchProdotti() {
      setLoading(true);
      setErrore(null);
      try {
        const token = window.localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        let url = "/api/prodotti";
        const params = [];
        if (segmento) params.push(`segmento=${encodeURIComponent(segmento)}`);
        if (dealerSelezionato) params.push(`dealer=${encodeURIComponent(dealerSelezionato)}`);
        if (params.length) url += `?${params.join("&")}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (handleAuthError(response)) return; // Use handleAuthError
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        setProdotti(Array.isArray(data) ? data : data.prodotti || []);
      } catch (err) {
        setErrore(err.message || "Errore caricamento prodotti");
        setProdotti([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProdotti();
    // eslint-disable-next-line
  }, [segmento, dealerSelezionato]);

  return (
    <div className="prodotti-grid">
      <h4>Prodotti disponibili</h4>
      {loading ? (
        <div className="text-muted">Caricamento in corso...</div>
      ) : errore ? (
        <div className="text-danger">{errore}</div>
      ) : prodotti.length === 0 ? (
        <div className="text-muted">Nessun prodotto trovato</div>
      ) : (
        <div style={{display:'flex',flexWrap:'wrap',gap:16}}>
          {prodotti.map(prodotto => (
            <div key={prodotto.id} className="prodotto-card" style={{border:'1px solid #eee',borderRadius:8,padding:12,minWidth:220,maxWidth:260}}>
              <div style={{fontWeight:600}}>{prodotto.nome}</div>
              <div style={{margin:'8px 0'}}>{prodotto.descrizione}</div>
              <div style={{fontWeight:600, color:'#1851d8'}}>{prodotto.prezzo.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</div>
              <button className="btn btn-primary btn-sm" style={{marginTop:8}} onClick={() => aggiungiAlCarrello(prodotto)}>Aggiungi al carrello</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
