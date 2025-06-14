import React from "react";
import { useCarrello } from "../context/CarrelloContext";

export default function CarrelloBox() {
  const { carrello, aggiornaQuantita, rimuoviDalCarrello, totaleArticoli } = useCarrello();
  const totale = carrello.reduce((acc, p) => acc + (p.prezzo * (p.quantita || 1)), 0);

  return (
    <div className="carrello-box">
      <h4>Carrello ({totaleArticoli} articoli)</h4>
      {carrello.length === 0 ? (
        <div className="text-muted">Il carrello è vuoto</div>
      ) : (
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Prodotto</th>
              <th>Quantità</th>
              <th>Prezzo</th>
              <th>Totale</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrello.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>
                  <button onClick={() => aggiornaQuantita(p.id, -1)} className="btn btn-sm btn-light">-</button>
                  <span style={{margin:'0 8px'}}>{p.quantita || 1}</span>
                  <button onClick={() => aggiornaQuantita(p.id, 1)} className="btn btn-sm btn-light">+</button>
                </td>
                <td>{p.prezzo.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
                <td>{(p.prezzo * (p.quantita || 1)).toLocaleString("it-IT", { minimumFractionDigits: 2 })} €</td>
                <td><button onClick={() => rimuoviDalCarrello(p.id)} className="btn btn-sm btn-danger">Rimuovi</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="carrello-totale" style={{marginTop:12,fontWeight:600}}>
        Totale: {totale.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €
      </div>
    </div>
  );
}
