import React, { useState } from "react";
import { useCarrello } from "../context/CarrelloContext";
// Assicurati di avere @stripe/stripe-js e @stripe/react-stripe-js installati
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ onSuccess, onError }) {
  const { carrello, svuotaCarrello } = useCarrello();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totale = carrello.reduce((acc, p) => acc + (p.prezzo * (p.quantita || 1)), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Chiamata API backend per creare PaymentIntent
      const token = window.localStorage.getItem("token");
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round(totale * 100), // in centesimi
          currency: "eur",
          description: "Pagamento carrello prodotti",
          items: carrello,
        }),
      });
      if (handleAuthError(response)) return; // Use handleAuthError
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Errore creazione PaymentIntent");
      const clientSecret = data.clientSecret;
      // Conferma pagamento con Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      if (result.error) {
        setError(result.error.message);
        if (onError) onError(result.error);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          svuotaCarrello();
          if (onSuccess) onSuccess();
        }
      }
    } catch (err) {
      setError(err.message || "Errore pagamento");
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth:400,margin:'0 auto'}}>
      <CardElement options={{hidePostalCode:true}}/>
      <button type="submit" className="btn btn-success mt-3" disabled={!stripe || loading}>
        {loading ? "Elaborazione..." : `Paga ${totale.toLocaleString("it-IT", { minimumFractionDigits: 2 })} €`}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
}

export default function StripeCarrelloModal({ open, onClose, onSuccess }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.4)',zIndex:1000}}>
      <div className="modal-dialog" style={{maxWidth:500,margin:'60px auto',background:'#fff',borderRadius:8,padding:24,position:'relative'}}>
        <button className="btn btn-sm btn-secondary" onClick={onClose} style={{position:'absolute',top:8,right:8}}>Chiudi</button>
        <h4>Pagamento carrello</h4>
        <Elements stripe={stripePromise}>
          <CheckoutForm onSuccess={onSuccess} onError={onClose}/>
        </Elements>
      </div>
    </div>
  );
}
