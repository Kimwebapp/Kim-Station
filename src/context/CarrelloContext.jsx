import React, { createContext, useContext, useState, useEffect } from "react";

const CarrelloContext = createContext();

export function useCarrello() {
  return useContext(CarrelloContext);
}

export function CarrelloProvider({ children }) {
  const [carrello, setCarrello] = useState([]);

  // Carica carrello da localStorage all'avvio
  useEffect(() => {
    const stored = window.localStorage.getItem("carrello");
    if (stored) setCarrello(JSON.parse(stored));
  }, []);

  // Salva carrello su localStorage ad ogni modifica
  useEffect(() => {
    window.localStorage.setItem("carrello", JSON.stringify(carrello));
  }, [carrello]);

  function aggiungiAlCarrello(prodotto) {
    setCarrello(prev => {
      const idx = prev.findIndex(p => p.id === prodotto.id);
      if (idx !== -1) {
        // Se già presente, aumenta quantità
        const nuovo = [...prev];
        nuovo[idx].quantita = (nuovo[idx].quantita || 1) + 1;
        return nuovo;
      }
      return [...prev, { ...prodotto, quantita: 1 }];
    });
  }

  function aggiornaQuantita(id, modifica) {
    setCarrello(prev => {
      const nuovo = prev.map(p =>
        p.id === id ? { ...p, quantita: (p.quantita || 1) + modifica } : p
      ).filter(p => p.quantita > 0);
      return nuovo;
    });
  }

  function rimuoviDalCarrello(id) {
    setCarrello(prev => prev.filter(p => p.id !== id));
  }

  function svuotaCarrello() {
    setCarrello([]);
  }

  const totaleArticoli = carrello.reduce((acc, p) => acc + (p.quantita || 1), 0);

  return (
    <CarrelloContext.Provider value={{ carrello, aggiungiAlCarrello, aggiornaQuantita, rimuoviDalCarrello, svuotaCarrello, totaleArticoli }}>
      {children}
    </CarrelloContext.Provider>
  );
}
