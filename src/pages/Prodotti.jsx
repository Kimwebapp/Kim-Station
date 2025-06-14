import React, { useState, useEffect } from "react";
import "../styles/main.css";
import api from "../api";

export default function Prodotti() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get("/prodotti")
      .then((data) => {
        if (mounted) {
          setProducts(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Errore nel caricamento prodotti");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const filteredProducts = filter
    ? products.filter((p) => p.type === filter)
    : products;

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div className="catalogo-container" style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 3 }}>
        <div className="filtri">
          <div className="form-group">
            <label htmlFor="segmento-menu" className="form-label" style={{ fontSize: "1.2rem" }}>
              Tipo prodotto:
            </label>
            <select
              id="segmento-menu"
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tutti i prodotti</option>
              <option value="SIM">SIM</option>
              <option value="FIN">Smartphone</option>
            </select>
          </div>
        </div>
        <div className="prodotti-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          {loading ? (
            <p>Caricamento prodotti...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : filteredProducts.length === 0 ? (
            <p>Nessun prodotto trovato.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="card">
                <h3>{product.name}</h3>
                <p>Tipo: {product.type}</p>
                <button onClick={() => addToCart(product)}>Aggiungi al carrello</button>
              </div>
            ))
          )}
        </div>
      </div>
      <aside id="carrello-box" style={{ flex: 1, background: "#f5f5f5", padding: "1rem", borderRadius: "8px", minWidth: "260px" }}>
        <h2>Carrello</h2>
        <div id="carrello-contenuto">
          {cart.length === 0 ? (
            <p>Il carrello è vuoto.</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{item.name}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "1rem" }}>Rimuovi</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
