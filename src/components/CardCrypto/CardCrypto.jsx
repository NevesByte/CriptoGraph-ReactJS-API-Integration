import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/cardCrypto.css";

function CardCrypto() {
  const { filteredCryptoList, setSelectedCrypto, selectedCrypto, searchTerm } =
    useContext(CryptoContext);

  if (!filteredCryptoList || filteredCryptoList.length === 0) {
    return (
      <p>
        {searchTerm
          ? "Nenhuma criptomoeda encontrada para essa busca."
          : "Carregando criptomoedas..."}
      </p>
    );
  }

  return (
    <div className="cardsWrapper">
      {filteredCryptoList.map((crypto) => (
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
