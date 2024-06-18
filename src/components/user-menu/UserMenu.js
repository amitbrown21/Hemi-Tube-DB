import React, { useState } from "react";
import "./UserMenu.css";

function UserMenu({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-menu">
      <button className="icon-button" onClick={toggleMenu}>
        <img src={currentUser?.profilePicture || "assets/img/user_icon.ico"} alt="User" className="user-icon" />
      </button>
      {isOpen && (
        <div className="user-dropdown-menu">
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
