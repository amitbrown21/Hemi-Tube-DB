import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

function UserMenu({ currentUser, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleMyChannel = () => {
    navigate(`/channel/${currentUser._id}`);
    setIsOpen(false);
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
          <button onClick={handleMyChannel} className="dropdown-item">
            My Channel
          </button>
          <button onClick={onLogout} className="dropdown-item">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
