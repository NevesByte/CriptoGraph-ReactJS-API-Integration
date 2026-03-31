import { useContext, useRef } from "react";
import CardCrypto from "../CardCrypto/CardCrypto";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/OptionCrypto.css";

const PERIOD_OPTIONS = [
  { label: "24h", value: "1" },
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "1y", value: "365" },
];

function OptionCrypto() {
  const carrosselRef = useRef(null);
  const {
    searchTerm,
    setSearchTerm,
    selectedPeriod,
    setSelectedPeriod,
    page,
    setPage,
    perPage,
    setPerPage,
    hasNextPage,
    hasPreviousPage,
    showFavoritesOnly,
    setShowFavoritesOnly,
  } = useContext(CryptoContext);

  const getCardStep = () => {
    if (!carrosselRef.current) return 280;
    const firstCard = carrosselRef.current.querySelector(".cardContainer");
    if (!firstCard) return 280;
    const styles = window.getComputedStyle(carrosselRef.current);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollLeft = () => {
    if (!carrosselRef.current) return;
    const step = getCardStep();
    const target = Math.max(0, carrosselRef.current.scrollLeft - step);
    carrosselRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!carrosselRef.current) return;
    const step = getCardStep();
    const target = carrosselRef.current.scrollLeft + step;
    carrosselRef.current.scrollTo({ left: target, behavior: "smooth" });
  };

  return (
    <>
      <section id="cryptoFilters">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar por nome ou simbolo..."
          aria-label="Buscar criptomoeda"
          id="searchCryptoInput"
        />

        <div id="periodFilters" role="group" aria-label="Selecionar periodo">
          {PERIOD_OPTIONS.map((period) => (
            <button
              key={period.value}
              className={`periodButton ${
                selectedPeriod === period.value ? "activePeriod" : ""
              }`}
              onClick={() => setSelectedPeriod(period.value)}
              type="button"
            >
              {period.label}
            </button>
          ))}
        </div>

        <label
          className="favoriteToggle"
          htmlFor="watchlist-toggle"
          aria-label={showFavoritesOnly ? "Exibindo favoritos" : "Exibir apenas favoritos"}
          title={showFavoritesOnly ? "Exibindo favoritos" : "Exibir apenas favoritos"}
        >
          <input
            id="watchlist-toggle"
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          <span className="favoriteToggleStar" aria-hidden="true">
            {showFavoritesOnly ? "★" : "☆"}
          </span>
        </label>
      </section>

      <section id="marketPagination" aria-label="Paginacao de mercado">
        <div className="pageControls">
          <button type="button" onClick={() => setPage((old) => old - 1)} disabled={!hasPreviousPage}>
            Pagina anterior
          </button>
          <span>Pagina {page}</span>
          <button type="button" onClick={() => setPage((old) => old + 1)} disabled={!hasNextPage}>
            Proxima pagina
          </button>
        </div>

        <label htmlFor="perPageSelect" className="perPageLabel">
          Itens por pagina
          <select
            id="perPageSelect"
            value={perPage}
            onChange={(event) => {
              setPerPage(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </section>

      <section id="containerCarrosslCards">
        <button className="btnSlides" onClick={scrollLeft} aria-label="Rolar para esquerda">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div id="carrosselCards" ref={carrosselRef}>
          <CardCrypto />
        </div>
        <button className="btnSlides" onClick={scrollRight} aria-label="Rolar para direita">
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>
    </>
  );
}

export default OptionCrypto;
