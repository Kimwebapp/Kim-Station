import React, { useState } from "react";
import { handleAuthError } from "../auth";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripeRicaricaModal({ importo, onClose, onSuccess, onError, pagamentoInCorso, setPagamentoInCorso }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPagamentoInCorso(true);
    setMsg("");
    try {
      // 1. Crea PaymentIntent dal backend
      const token = window.localStorage.getItem("token");
      const res = await fetch("/api/ricarica-plafond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: importo }),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || "Errore creazione PaymentIntent");
      // 2. Conferma pagamento con Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (result.error) {
        setMsg(result.error.message);
        setPagamentoInCorso(false);
        onError && onError(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        setMsg("Pagamento riuscito! Credito aggiornato.");
        setPagamentoInCorso(false);
        onSuccess && onSuccess();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMsg("Pagamento non riuscito");
        setPagamentoInCorso(false);
        onError && onError("Pagamento non riuscito");
      }
    } catch (e) {
      setMsg("Errore: " + (e.message || e));
      setPagamentoInCorso(false);
      onError && onError(e.message || e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop:18}}>
      <div style={{marginBottom:16}}>
        <CardElement options={{hidePostalCode:true}}/>
      </div>
      <div style={{color:'#2b7cff',fontWeight:'bold',marginBottom:8}}>{msg}</div>
      <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
        <button type="button" onClick={onClose} style={{border:'none',background:'#eee',borderRadius:8,padding:'8px 18px',fontWeight:600,cursor:'pointer'}}>Annulla</button>
        <button type="submit" disabled={pagamentoInCorso} style={{border:'none',background:'#2563eb',color:'#fff',borderRadius:8,padding:'8px 18px',fontWeight:600,cursor:pagamentoInCorso?'not-allowed':'pointer'}}>{pagamentoInCorso?'Elaborazione...':'Procedi al pagamento'}</button>
      </div>
    </form>
  );
}
