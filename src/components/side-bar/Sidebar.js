// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

// Helper function to create icon placeholders
const Icon = ({ name }) => <span className="icon">{name}</span>;

function Sidebar({ isDarkMode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    document.body.classList.toggle('sidebar-collapsed', !isExpanded);
  };

  const sections = [
    {
      title: 'Main',
      items: [
        { icon: <Icon name="🏠" />, text: 'Home', to: '/' },
        { icon: <Icon name="🔥" />, text: 'Trending', to: '/trending' },
        { icon: <Icon name="✉️" />, text: 'Subscriptions', to: '/subscriptions' },
        { icon: <Icon name="📚" />, text: 'Library', to: '/library' },
      ],
    },
    {
      title: 'Subscriptions',
      items: [
        { icon: <Icon name="👤" />, text: 'NatureWizard', to: '/channel/naturewizard' },
        { icon: <Icon name="👤" />, text: 'QuickBites', to: '/channel/quickbites' },
        { icon: <Icon name="👤" />, text: 'StarGazer', to: '/channel/stargazer' },
        { icon: <Icon name="👤" />, text: 'LaughterQueen', to: '/channel/laughterqueen' },
      ],
    },
    {
      title: 'Categories',
      items: [
        { icon: <Icon name="🎬" />, text: 'Comedy', to: '/category/comedy' },
        { icon: <Icon name="🌅" />, text: 'Nature', to: '/category/nature' },
        { icon: <Icon name="🍔" />, text: 'Food', to: '/category/food' },
        { icon: <Icon name="✨" />, text: 'Animation', to: '/category/animation' },
      ],
    },
  ];

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isDarkMode ? 'dark-mode' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isExpanded ? '◀' : '▶'}
      </button>

      {sections.map((section, index) => (
        <div key={index} className="sidebar-section">
          {isExpanded && <h3>{section.title}</h3>}
          <ul>
            {section.items.map((item, idx) => (
              <li key={idx}>
                <Link to={item.to}>
                  {item.icon}
                  {isExpanded && <span>{item.text}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;