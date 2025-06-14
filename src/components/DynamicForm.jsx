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

export default function DynamicForm({ offerta, template, templateLoading, templateError, onSubmit, onClose }) {
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
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
    setFormData({});
    setFieldErrors({});
    setSubmitError("");
  }, [template]);

  function handleChange(name, value) {
    setFormData(fd => ({ ...fd, [name]: value }));
    setFieldErrors(errors => ({ ...errors, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!template || !Array.isArray(template.campi)) return errors;
    for (const campo of template.campi) {
      const val = formData[campo.name];
      if (campo.required && (val === undefined || val === null || val === "" || (campo.type === "checkbox" && !val))) {
        errors[campo.name] = "Campo obbligatorio";
      }
      if (campo.type === "email" && val && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
        errors[campo.name] = "Email non valida";
      }
      if (campo.type === "number" && val !== undefined && val !== "" && isNaN(Number(val))) {
        errors[campo.name] = "Deve essere un numero";
      }
      if (campo.minLength && val && val.length < campo.minLength) {
        errors[campo.name] = `Minimo ${campo.minLength} caratteri`;
      }
      if (campo.maxLength && val && val.length > campo.maxLength) {
        errors[campo.name] = `Massimo ${campo.maxLength} caratteri`;
      }
      if (campo.pattern && val && !(new RegExp(campo.pattern).test(val))) {
        errors[campo.name] = "Formato non valido";
      }
    }
    return errors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    setSubmitError("");
    if (Object.keys(errors).length > 0) {
      setSubmitError("Per favore correggi i campi evidenziati.");
      return;
    }
    onSubmit(formData);
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

  if (templateLoading) return <div style={{padding:20}}>Caricamento form...</div>;
  if (templateError) return <div style={{color:'red',padding:20}}>{templateError}</div>;
  if (!template) return null;

  return (
    <>
      <form onSubmit={handleSubmit} style={{padding:20}} ref={formRef}>
        <h2>{template.titolo || template.title || "Form Attivazione"}</h2>
        {Array.isArray(template.campi) && template.campi.map(campo => (
          <div key={campo.name || campo.label} style={{marginBottom:8}}>
            <DynamicField
              campo={campo}
              value={formData[campo.name]}
              onChange={val => handleChange(campo.name, val)}
            />
            {fieldErrors[campo.name] && (
              <div style={{color:'red', fontSize:'0.95em', marginTop:2, marginLeft:4}}>{fieldErrors[campo.name]}</div>
            )}
          </div>
        ))}
        {submitError && (
          <div style={{color:'red', marginTop:8, marginBottom:8}}>{submitError}</div>
        )}
        
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
