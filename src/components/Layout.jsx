import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/main.css";

const sidebarLinks = [
  { to: "/", label: "Home", icon: "/Logo/logo_white_def.png", iconAlt: "Dashboard" },
  { to: "/attivazioni", label: "Attivazioni", icon: "/Icons/AttivazioniDef.png" },
  { to: "/prodotti", label: "Prodotti", icon: "/Icons/Prodotti.png" },
  { to: "/ricariche", label: "Reportistica", icon: "/Icons/Ricariche.png" },
  { to: "/assistenza", label: "Assistenza", icon: "/Icons/Storico.png" },
  { to: "/documentazione", label: "Documentazione", icon: "/Icons/Documentazione.png" },
  { to: "#", label: "ChatBot", icon: "/Icons/ChatBot.png", onClick: () => window.openChatbox && window.openChatbox() }
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="main-container">
      <div className="container">
        <div className="dashboard-wrapper">
          <aside className="sidebar">
            <div className="sidebar-logo">
              <img src="/Logo/logo_white_def.png" alt="kim" />
            </div>
            <nav className="sidebar-menu">
              <ul>
                {sidebarLinks.map((link, idx) => (
                  <li key={link.to} className={location.pathname === link.to ? "active" : ""}>
                    {link.to === "#" ? (
                      <a href="#" onClick={link.onClick}>
                        <span className="icon">
                          <img src={link.icon} alt={link.iconAlt || "icon"} />
                        </span>
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.to} tabIndex={0}>
                        <span className="icon">
                          <img src={link.icon} alt={link.iconAlt || "icon"} />
                        </span>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sidebar-bottom">
              <button id="logout-btn" className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </aside>
          <main className="main-content">{children}</main>
        </div>
      </div>
    </div>
  );
}
