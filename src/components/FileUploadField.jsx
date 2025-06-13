import React, { useRef } from "react";

export default function FileUploadField({ label, value, onChange, onRemove }) {
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  }
  function handleDragOver(e) {
    e.preventDefault();
  }
  function handleRemove(e) {
    e.preventDefault();
    onRemove();
  }
  return (
    <div className="form-group">
      <label>{label}</label>
      <div
        className="file-upload-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        tabIndex={0}
        aria-label="Trascina qui un file o clicca per selezionare"
        onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          border: '2px dashed #aaa',
          borderRadius: 8,
          padding: 16,
          textAlign: 'center',
          background: '#fafbfc',
          cursor: 'pointer',
          outline: 'none',
          marginBottom: 10
        }}
      >
        {value ? (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <span style={{marginBottom:8}}>{value.name}</span>
            <button className="btn btn-sm btn-danger" onClick={handleRemove} style={{marginTop: 8}}>Rimuovi</button>
          </div>
        ) : (
          <span style={{color:'#666'}}>Trascina qui un file o clicca per selezionare</span>
        )}
        <input
          ref={inputRef}
          type="file"
          style={{display:'none'}}
          onChange={e => onChange(e.target.files[0])}
        />
      </div>
    </div>
  );
}
