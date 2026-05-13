import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/cardCrypto.css";

function CardCrypto() {
  const {
    filteredCryptoList,
    selectedCrypto,
    setSelectedCrypto,
    searchTerm,
  } = useContext(CryptoContext);

  // Se não tiver criptomoedas
  if (filteredCryptoList.length === 0) {
    return (
      <p>
        {searchTerm
          ? "Nenhuma criptomoeda encontrada."
          : "Carregando criptomoedas..."}
      </p>
    );
  }

  return (
    <div className="cardsWrapper">
      {filteredCryptoList.map((crypto) => (
        <article
          key={crypto.id}
          className={`cardContainer ${
            selectedCrypto?.id === crypto.id
              ? "activeCard"
              : ""
          }`}
          onClick={() => setSelectedCrypto(crypto)}
        >
          <section className="infoContainer">
            {/* Nome */}
            <div className="nome">
              {crypto.name}
            </div>

            {/* Símbolo */}
            <div className="symbol">
              {crypto.symbol.toUpperCase()}
            </div>

            {/* Preço */}
            <div className="priceTag">
              ${crypto.current_price.toLocaleString()}
            </div>

            {/* Variação */}
            <div className="variacao">
              {crypto.price_change_percentage_24h
                ? crypto.price_change_percentage_24h.toFixed(2)
                : "0.00"}
              %
            </div>
          </section>
        </article>
      ))}
    </div>
  );
}

export default CardCrypto;