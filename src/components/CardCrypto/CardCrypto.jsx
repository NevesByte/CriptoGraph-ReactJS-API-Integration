import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/cardCrypto.css";

function CardCrypto() {
  const { cryptoList, setSelectedCrypto, selectedCrypto } = useContext(CryptoContext);

  if (!cryptoList || cryptoList.length === 0) {
    return <p>Carregando criptos...</p>;
  }

  return (
    <div className="cardsWrapper">
      {cryptoList.map((crypto) => (
        <div
          key={crypto.id}
          className={`cardContainer ${
            selectedCrypto?.id === crypto.id ? "activeCard" : ""
          }`}
          onClick={() => setSelectedCrypto(crypto)}
        >
          <section className="infoContainer">
            <div className="nome">{crypto.name}</div>
            <div
              className="variacao"
              style={{
                color:
                  crypto.price_change_percentage_24h > 0
                    ? "limegreen"
                    : "crimson",
              }}
            >
              <strong>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </strong>
            </div>
          </section>

          <button className="infoBtn">
            <span className="material-symbols-outlined">double_arrow</span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default CardCrypto;
