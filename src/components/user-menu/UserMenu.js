import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserMenu.css";

function UserMenu({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-menu">
      <button className="icon-button" onClick={toggleMenu}>
        <img 
          src={currentUser?.profilePicture || "assets/img/user_icon.ico"} 
          alt="User" 
          className="user-icon" 
        />
      </button>
      {isOpen && (
        <div className="user-dropdown-menu">
          <Link 
            to={`/channel/${currentUser._id}`} 
            className="dropdown-item"
            onClick={() => setIsOpen(false)}
          >
            My Channel
          </Link>
          <button onClick={onLogout} className="dropdown-item">Logout</button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;