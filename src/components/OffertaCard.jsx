import React from "react";
import "../styles/offerte.css";

export default function OffertaCard({ offerta, selected, onSelect }) {
  const id = offerta.id || offerta.value || offerta.ID || offerta;
  const titolo = offerta.nome || offerta.label || offerta.Nome || offerta.Label || offerta.Titolo || "";
  const descrizione = offerta.DescrizioneBreve || offerta.descrizioneBreve || offerta.descrizione || "";
  const crediti = offerta.Crediti || offerta.crediti || "";
  const logo = offerta.LogoLink || offerta.logo || "";

  return (
    <div className={`offerta-card${selected ? " selezionata" : ""}`} onClick={onSelect} tabIndex={0} aria-pressed={selected}>
      <div style={{minHeight:64, display:'flex', alignItems:'center', justifyContent:'center'}}>
        {logo ? (
          <img src={logo} alt={titolo} style={{maxHeight:48, maxWidth:'100%', marginBottom:16, objectFit:'contain'}} />
        ) : (
          <div style={{height:48, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, color:'#666'}}>Nessun logo</div>
        )}
      </div>
      <h3>{titolo}</h3>
      <p>{descrizione}</p>
      {crediti && <strong>{crediti} Crediti</strong>}
      <button className="attiva-offerta-btn" tabIndex={0} onClick={e => { e.stopPropagation(); onSelect(); }}>Attiva</button>
    </div>
  );
}
