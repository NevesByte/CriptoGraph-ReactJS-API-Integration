import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/header.css";

function Header() {
  const { theme, toggleTheme, triggeredAlerts, cryptoList } = useContext(CryptoContext);
  const tickerCoins = (cryptoList || []).slice(0, 12);

  return (
    <header role="banner" className="headerWrap">
      <section className="header">
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
      </section>

      {tickerCoins.length > 0 && (
        <section className="tickerBar" aria-label="Ticker de mercado em tempo real">
          <div className="tickerTrack">
            {[...tickerCoins, ...tickerCoins].map((coin, index) => (
              <article className="tickerItem" key={`${coin.id}-${index}`}>
                <span className="tickerName">{coin.symbol.toUpperCase()}</span>
                <span
                  className={`tickerVar ${
                    coin.price_change_percentage_24h >= 0 ? "tickerUp" : "tickerDown"
                  }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </article>
            ))}
          </div>
        </section>
      )}
    </header>
  );
}

export default Header;
