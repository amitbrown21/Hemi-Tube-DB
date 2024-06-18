import React from "react";

function InputField({ label, type = "text", name, value, onChange, placeholder, required = false }) {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
        id={name}
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}

export default InputField;
