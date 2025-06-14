import React, { useEffect, useState } from "react";

export default function CreditoPlafondBox() {
  const [credito, setCredito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("agenteNome")) return;
    setLoading(true);
    setErrore(false);
    const token = localStorage.getItem("token");
    if (!token) {
      setCredito(null);
      setLoading(false);
      return;
    }
    fetch("/api/credito-plafond", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        if (typeof data.credito === "number") {
          setCredito(data.credito);
        } else {
          setCredito(0);
        }
        setLoading(false);
      })
      .catch(() => {
        setErrore(true);
        setLoading(false);
      });
  }, []);

  if (localStorage.getItem("agenteNome")) return null;

  let display = "...";
  if (loading) display = "...";
  else if (errore) display = "Errore";
  else if (typeof credito === "number")
    display = credito.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
  else display = "0.00 €";

  return (
    <div id="box-credito-plafond" style={{display:'flex',alignItems:'center',gap:12}}>
      <span style={{fontWeight:600, color:'#1851d8'}}>CREDITO PLAFOND: </span>
      <span id="credito-plafond-valore" style={{fontWeight:600}}>{display}</span>
    </div>
  );
}
