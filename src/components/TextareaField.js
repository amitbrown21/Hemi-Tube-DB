import React from "react";

function TextareaField({ label, name, value, onChange, placeholder, required = false, style }) {
  return (
    <div className="form-floating mb-3">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
        id={name}
        style={style}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default TextareaField;
