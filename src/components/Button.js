import React from "react";

function Button({ type = "button", className, children, onClick, disabled = false }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
