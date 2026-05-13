import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/header.css";

function Header() {
  const { cryptoList } = useContext(CryptoContext);

  // Pega algumas moedas
  const tickerCoins = cryptoList.slice(0, 10);

  return (
    <header className="headerWrap">
      {/* Título */}
      <section className="header">
        <h1>CriptoGraph</h1>
      </section>

      {/* Barra de moedas */}
      <section className="tickerBar">
        <div className="tickerTrack">
          {tickerCoins.map((coin) => (
            <article
              className="tickerItem"
              key={coin.id}
            >
              {/* Nome */}
              <span className="tickerName">
                {coin.symbol.toUpperCase()}
              </span>

              {/* Variação */}
              <span className="tickerVar">
                {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </article>
          ))}
        </div>
      </section>
    </header>
  );
}

export default Header;