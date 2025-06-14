import React, { useState, useEffect, useRef } from "react";
import FileUploadField from "./FileUploadField";
const API_URL = process.env.REACT_APP_API_URL || "";

// Campo generico per input dinamici
function DynamicField({ campo, value, onChange }) {
  // Supporta tipi: text, select, file, checkbox, date, number
  if (campo.type === "select" && Array.isArray(campo.options)) {
    return (
      <div className="form-group">
        <label>{campo.label}</label>
        <select className="form-control" value={value || ""} onChange={e => onChange(e.target.value)}>
          <option value="">-- Seleziona --</option>
          {campo.options.map(opt => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      </div>
    );
  }
  if (campo.type === "file") {
    return (
      <FileUploadField label={campo.label} value={value} onChange={onChange} onRemove={() => onChange(null)} />
    );
  }
  if (campo.type === "checkbox") {
    return (
      <div className="form-group">
        <label><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} /> {campo.label}</label>
      </div>
    );
  }
  return (
    <div className="form-group">
      <label>{campo.label}</label>
      <input
        type={campo.type || "text"}
        className="form-control"
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={campo.placeholder || ""}
      />
    </div>
  );
}

function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.25)', zIndex:99, display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', borderRadius:10, padding:32, minWidth:320, boxShadow:'0 2px 20px #0002'}}>
        <h3>Sei sicuro di voler annullare?</h3>
        <p>I dati inseriti andranno persi.</p>
        <div style={{display:'flex', gap:12, marginTop:16, justifyContent:'flex-end'}}>
          <button className="btn btn-secondary" onClick={onCancel}>No</button>
          <button className="btn btn-danger" onClick={onConfirm}>Sì, annulla</button>
        </div>
      </div>
    </div>
  );
}

export default function DynamicForm({ offerta, onClose }) {
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const formRef = useRef();

  // ESC key annulla
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        if (Object.values(formData).some(x => x && x !== "")) {
          setShowConfirm(true);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [formData, onClose]);

  useEffect(() => {
    if (!offerta) return;
    setLoading(true);
    setError("");
    setFormData({});
    // Recupera il template: puoi cambiare endpoint se necessario
    const templateName = offerta.TemplateDatiOfferta || offerta.template || offerta.Template;
    const token = localStorage.getItem("token");
    console.log('[DEBUG][DynamicForm] Token:', token);
    console.log('[DEBUG][DynamicForm] Template name:', templateName);
    fetch(`${API_URL}/template-offerta/${encodeURIComponent(templateName)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        console.log('[DEBUG][DynamicForm] Fetch response:', res.status, res.statusText, res.headers);
        if (!res.ok) {
          let errorBody = '';
          try { errorBody = await res.text(); } catch {}
          console.error('[DEBUG][DynamicForm] Fetch error body:', errorBody);
          if (res.status === 401) {
            setError("Non autorizzato (401). Il token è mancante, scaduto o non valido. Effettua di nuovo il login.\n" + errorBody);
            setLoading(false);
            return;
          }
          setError("Errore fetch template: " + res.status + " " + res.statusText + "\n" + errorBody);
          setLoading(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setTemplate(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Errore caricamento template: " + (err?.message || ""));
        setLoading(false);
        console.error('[DEBUG][DynamicForm] Catch error:', err);
      });
  }, [offerta]);

  function handleChange(name, value) {
    setFormData(fd => ({ ...fd, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: submit logica
    alert("Form inviato! (TODO)");
  }

  function handleAnnulla(e) {
    e.preventDefault();
    if (Object.values(formData).some(x => x && x !== "")) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  }

  function handleConfirmCancel() {
    setShowConfirm(false);
    onClose();
  }

  if (loading) return <div style={{padding:20}}>Caricamento form...</div>;
  if (error) return <div style={{color:'red',padding:20}}>{error}</div>;
  if (!template) return null;

  return (
    <>
      <form onSubmit={handleSubmit} style={{padding:20}} ref={formRef}>
        <h2>{template.titolo || template.title || "Form Attivazione"}</h2>
        {Array.isArray(template.campi) && template.campi.map(campo => (
          <DynamicField
            key={campo.name || campo.label}
            campo={campo}
            value={formData[campo.name]}
            onChange={val => handleChange(campo.name, val)}
          />
        ))}
        <div style={{marginTop:20, display:'flex', gap:12}}>
          <button type="submit" className="btn btn-primary">Invia</button>
          <button type="button" className="btn btn-secondary" onClick={handleAnnulla}>Annulla</button>
        </div>
      </form>
      <ConfirmModal
        open={showConfirm}
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
