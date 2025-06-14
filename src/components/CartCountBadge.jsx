import React from "react";
import { useCarrello } from "../context/CarrelloContext";

export default function CartCountBadge({ className = "cart-count-badge" }) {
  const { totaleArticoli } = useCarrello();
  if (totaleArticoli === 0) return null;
  return (
    <span className={className} style={{background:'#1851d8',color:'#fff',borderRadius:'50%',padding:'2px 8px',fontSize:13,marginLeft:6,minWidth:22,display:'inline-block',textAlign:'center'}}>
      {totaleArticoli}
    </span>
  );
}
