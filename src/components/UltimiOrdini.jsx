import React, { useEffect, useState } from "react";

// Mappa stato numerico/testuale → testo e classe CSS
const statiNumerici = {
  1: "ELABORAZIONE",
  2: "ELABORATO",
  3: "SPEDITO",
  4: "CONSEGNATO",
  5: "ANNULLATO",
  10: "IN ATTESA PAGAMENTO",
};
const classiStato = {
  "DA_ELABORARE_AGENTE": "warning",
  "IN_ATTESA_PAGAMENTO": "danger",
  "IN ATTESA PAGAMENTO": "danger",
  "ELABORATO": "success",
  "SPEDITO": "info",
  "CONSEGNATO": "success",
  "ANNULLATO": "danger",
  "IN_ATTESA": "warning",
  "ELABORAZIONE": "info",
  "PAGATO CON CC": "info",
  "CONFERMATO": "secondary",
  "SCONOSCIUTO": "secondary",
};
function formattaStatoOrdine(stato) {
  const statoTestuale =
    typeof stato === "number"
      ? statiNumerici[stato] || "SCONOSCIUTO"
      : stato || "SCONOSCIUTO";
  const classe = classiStato[statoTestuale] || "secondary";
  const testoStato = statoTestuale.replace(/_/g, " ");
  return <span className={`status-badge ${classe}`}>{testoStato}</span>;
}

export default function UltimiOrdini() {
  const [ordini, setOrdini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    async function caricaOrdini() {
      setLoading(true);
      setErrore(null);
      try {
        const token = window.localStorage.getItem("token");
        if (!token) throw new Error("Token di autenticazione mancante");
        const response = await fetch("/api/ultimi-ordini", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        const data = await response.json();
        let ordini = [];
        if (Array.isArray(data)) {
          ordini = data;
        } else if (Array.isArray(data.ordini)) {
          ordini = data.ordini;
        } else if (Array.isArray(data.Ordini)) {
          ordini = data.Ordini;
        }
        setOrdini(ordini);
      } catch (err) {
        setErrore(err.message || "Errore caricamento ordini");
        setOrdini([]);
      } finally {
        setLoading(false);
      }
    }
    caricaOrdini();
  }, []);

  return (
    <div className="ultimi-ordini-card">
      <h3>Ultimi 5 Ordini</h3>
      <div style={{overflowX:'auto'}}>
      <table className="table table-sm table-bordered">
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
            <tr><td colSpan={5} className="text-center text-muted"><i>Caricamento in corso...</i></td></tr>
          ) : errore ? (
            <tr><td colSpan={5} className="text-center text-danger">{errore}</td></tr>
          ) : ordini.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-muted"><i>Nessun ordine trovato</i></td></tr>
          ) : (
            ordini.map((ordine, idx) => (
              <tr key={ordine.IDOrdineProdotto || idx}>
                <td>{ordine.Data}</td>
                <td>{ordine.Prodotto}</td>
                <td>{ordine.Tipo}</td>
                <td>{typeof ordine.Importo === "number" ? ordine.Importo.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €" : ordine.Importo}</td>
                <td>{formattaStatoOrdine(ordine.Stato)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}
