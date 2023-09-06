import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css"; // Importa il file CSS per lo stile

export const Nav = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        <button
          className={`mobile-menu-button ${isMobileMenuOpen ? "open" : ""}`}
          onClick={handleMobileMenuToggle}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
      <ul className={`nav-list ${isMobileMenuOpen ? "open" : ""}`}>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Tutti i viaggi
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/newTravel" className="nav-link">
            Nuovo viaggio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/page2" className="nav-link">
            Page 2
          </Link>
        </li>
      </ul>
    </nav>
  );
};
