import { useContext, useState } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/cardCrypto.css";

function CardCrypto() {
  const {
    filteredCryptoList,
    setSelectedCrypto,
    selectedCrypto,
    searchTerm,
    toggleFavorite,
    isFavorite,
    compareCryptoIds,
    toggleCompareCrypto,
    alertTargets,
    setAlertTarget,
    removeAlertTarget,
  } = useContext(CryptoContext);

  const [priceInputs, setPriceInputs] = useState({});

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
      {filteredCryptoList.map((crypto) => {
        const isCompared = compareCryptoIds.includes(crypto.id);
        const alertValue =
          priceInputs[crypto.id] ??
          (alertTargets[crypto.id] ? String(alertTargets[crypto.id]) : "");

        return (
          <article
            key={crypto.id}
            className={`cardContainer ${selectedCrypto?.id === crypto.id ? "activeCard" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedCrypto(crypto.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelectedCrypto(crypto.id);
              }
            }}
            aria-label={`Selecionar ${crypto.name}`}
          >
            <section className="infoContainer">
              <div className="cardTopRow">
                <div className="nome">{crypto.name}</div>
                <button
                  type="button"
                  className={`favoriteBtn ${isFavorite(crypto.id) ? "favoriteActive" : ""}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(crypto.id);
                  }}
                  aria-label={`Favoritar ${crypto.name}`}
                >
                  {isFavorite(crypto.id) ? "★" : "☆"}
                </button>
              </div>

              <div className="symbol">{crypto.symbol.toUpperCase()}</div>

              <div className="priceTag">${crypto.current_price.toLocaleString()}</div>
              <div
                className="variacao"
                style={{
                  color:
                    crypto.price_change_percentage_24h > 0
                      ? "var(--success)"
                      : "var(--danger)",
                }}
              >
                <strong>{crypto.price_change_percentage_24h.toFixed(2)}%</strong>
              </div>

              <label className="compareToggle">
                <input
                  type="checkbox"
                  checked={isCompared}
                  onChange={(event) => {
                    event.stopPropagation();
                    toggleCompareCrypto(crypto.id);
                  }}
                />
                Comparar
              </label>

              <div className="alertRow" onClick={(event) => event.stopPropagation()}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={alertValue}
                  placeholder="Alvo $"
                  onChange={(event) =>
                    setPriceInputs((current) => ({
                      ...current,
                      [crypto.id]: event.target.value,
                    }))
                  }
                  aria-label={`Alvo de preco para ${crypto.name}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!alertValue) return;
                    setAlertTarget(crypto.id, alertValue);
                  }}
                >
                  Salvar
                </button>
                {alertTargets[crypto.id] && (
                  <button type="button" onClick={() => removeAlertTarget(crypto.id)}>
                    Remover
                  </button>
                )}
              </div>
            </section>
          </article>
        );
      })}
    </div>
  );
}

export default CardCrypto;
