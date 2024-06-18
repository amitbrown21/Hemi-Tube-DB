import React from "react";

function FileInputField({ label, accept, onChange, required = false }) {
  return (
    <div>
      <label>{label}</label>
      <input type="file" accept={accept} onChange={onChange} required={required} />
    </div>
  );
}

export default FileInputField;
