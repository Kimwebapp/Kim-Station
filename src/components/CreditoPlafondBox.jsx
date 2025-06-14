import React, { useEffect, useState } from "react";
import React, { useState, useEffect } from "react";
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../stripe';
import StripeRicaricaModal from './StripeRicaricaModal';

export default function CreditoPlafondBox() {
  const [credito, setCredito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [importo, setImporto] = useState(null);
  const [msgPagamento, setMsgPagamento] = useState("");
  const [pagamentoInCorso, setPagamentoInCorso] = useState(false);

  // Funzione per aggiornare il credito dopo la ricarica
  const fetchCredito = () => {
    setLoading(true);
    setErrore(false);
    const token = window.localStorage.getItem("token");
    if (!token) {
      setErrore(true);
      setLoading(false);
      return;
    }
    fetch("/api/credito-plafond", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
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
  };

  useEffect(() => {
    if (window.localStorage.getItem("agenteNome")) return;
    fetchCredito();
  }, []);

  // Handler per la ricarica simulata (POST /api/ricarica-plafond)
  const handleRicarica = async () => {
    setPagamentoInCorso(true);
    setMsgPagamento("");
    try {
      const token = window.localStorage.getItem("token");
      if (!token) throw new Error("Token mancante");
      // Simulazione chiamata POST (in reale: invio a Stripe, qui solo demo)
      const res = await fetch("/api/ricarica-plafond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: importo }),
      });
      if (!res.ok) throw new Error("Errore HTTP: " + res.status);
      const data = await res.json();
      if (data.success || data.status === 'ok') {
        setMsgPagamento("Pagamento riuscito! Credito aggiornato.");
        fetchCredito();
        setTimeout(() => {
          setShowModal(false);
          setMsgPagamento("");
          setImporto(null);
        }, 1500);
      } else {
        throw new Error(data.error || "Pagamento non completato");
      }
    } catch (e) {
      setMsgPagamento("Errore: " + (e.message || e));
    } finally {
      setPagamentoInCorso(false);
    }
  };

  if (window.localStorage.getItem("agenteNome")) return null;

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
      <button
        type="button"
        style={{marginLeft:16,padding:'6px 18px',borderRadius:8,background:'#2563eb',color:'#fff',fontWeight:600,border:'none',cursor:'pointer',boxShadow:'0 2px 8px #2563eb22'}}
        onClick={() => setShowModal(true)}
      >
        Ricarica
      </button>
      {showModal && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.35)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:10,padding:32,minWidth:340,minHeight:220,boxShadow:'0 2px 24px rgba(30,77,219,0.09)',position:'relative'}}>
            <h2 style={{marginTop:0,fontSize:'1.3em',color:'#2b7cff'}}>Ricarica credito plafond</h2>
            <div style={{display:'flex',gap:10,marginBottom:18}}>
              {[50,100,200].map(val => (
                <button key={val} type="button" onClick={()=>setImporto(val)} style={{background:importo===val?'#2b7cff':'#e5eaff',color:importo===val?'#fff':'#1851d8',fontWeight:600,border:'none',borderRadius:8,padding:'8px 18px',cursor:'pointer'}}>{val} €</button>
              ))}
            </div>
            {importo && (
              <Elements stripe={stripePromise}>
                <StripeRicaricaModal
                  importo={importo}
                  onClose={()=>{setShowModal(false);setMsgPagamento('');setImporto(null);}}
                  onSuccess={()=>{fetchCredito();}}
                  onError={()=>{}}
                  pagamentoInCorso={pagamentoInCorso}
                  setPagamentoInCorso={setPagamentoInCorso}
                />
              </Elements>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
