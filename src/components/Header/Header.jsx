import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/header.css";

function Header() {
  const { theme, toggleTheme, triggeredAlerts } = useContext(CryptoContext);

  return (
    <header className="header" role="banner">
      <h1>CriptoGraph</h1>
      <div className="headerActions">
        {triggeredAlerts.length > 0 && (
          <div className="alertPill" aria-live="polite">
            Alertas: {triggeredAlerts.length}
          </div>
        )}
        <button
          type="button"
          className="themeToggleBtn"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? "Tema claro" : "Tema escuro"}
        </button>
      </div>
    </header>
  );
}

export default Header;
