import { useContext, useMemo } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/InfoCrypto.css";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function InfoCrypto() {
  const { selectedCrypto, cryptoHistory, alertTargets } = useContext(CryptoContext);

  const range = useMemo(() => {
    if (!cryptoHistory?.length) return null;
    const values = cryptoHistory.map(([, price]) => price);
    return {
      max: Math.max(...values),
      min: Math.min(...values),
    };
  }, [cryptoHistory]);

  if (!selectedCrypto) {
    return (
      <section id="InfoCrypto">
        <h1>InfoCrypto</h1>
        <p>Nenhuma criptomoeda selecionada</p>
      </section>
    );
  }

  const target = alertTargets[selectedCrypto.id];

  return (
    <section id="InfoCrypto" aria-label="Resumo da criptomoeda">
      <div className="headerInfo">
        <h1>
          {selectedCrypto.name} <span>({selectedCrypto.symbol.toUpperCase()})</span>
        </h1>
        <div className="price">{usd.format(selectedCrypto.current_price)}</div>
      </div>

      <div className="stats">
        <div className="statBox">
          <span>Market Cap</span>
          <span className="value">{usd.format(selectedCrypto.market_cap)}</span>
        </div>
        <div className="statBox">
          <span>Volume 24h</span>
          <span className="value">{usd.format(selectedCrypto.total_volume)}</span>
        </div>
        <div className="statBox">
          <span>Variacao 24h</span>
          <span
            className={`value ${
              selectedCrypto.price_change_percentage_24h > 0 ? "positive" : "negative"
            }`}
          >
            {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
        {range && (
          <>
            <div className="statBox">
              <span>Max no periodo</span>
              <span className="value">{usd.format(range.max)}</span>
            </div>
            <div className="statBox">
              <span>Min no periodo</span>
              <span className="value">{usd.format(range.min)}</span>
            </div>
          </>
        )}
        {target && (
          <div className="statBox">
            <span>Alerta definido</span>
            <span className="value">{usd.format(target)}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default InfoCrypto;
