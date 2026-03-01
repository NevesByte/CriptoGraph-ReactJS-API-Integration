import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/InfoCrypto.css";

function InfoCrypto() {
  const { selectedCrypto } = useContext(CryptoContext);

  if (!selectedCrypto) {
    return (
      <section id="InfoCrypto">
        <h1>InfoCrypto</h1>
        <p>Nenhuma criptomoeda selecionada</p>
      </section>
    );
  }

  return (
    <section id="InfoCrypto">
      <div className="headerInfo">
        <h1>
          {selectedCrypto.name} <span>({selectedCrypto.symbol.toUpperCase()})</span>
        </h1>
        <div className="price">
          ${selectedCrypto.current_price.toLocaleString()}
        </div>
      </div>

      <div className="stats">
        <div className="statBox">
          <span>Market Cap</span>
          <span className="value">${selectedCrypto.market_cap.toLocaleString()}</span>
        </div>
        <div className="statBox">
          <span>Volume 24h</span>
          <span className="value">${selectedCrypto.total_volume.toLocaleString()}</span>
        </div>
        <div className="statBox">
          <span>Variação 24h</span>
          <span
            className={`value ${
              selectedCrypto.price_change_percentage_24h > 0 ? "positive" : "negative"
            }`}
          >
            {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      </div>
      </section>
  );
}

export default InfoCrypto;
