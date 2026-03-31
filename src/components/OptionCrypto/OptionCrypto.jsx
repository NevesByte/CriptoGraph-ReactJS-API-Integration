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

  const scrollLeft = () => {
    if (!carrosselRef.current) return;
    const distance = window.innerWidth <= 500 ? 200 : 300;
    carrosselRef.current.scrollBy({ left: -distance, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!carrosselRef.current) return;
    const distance = window.innerWidth <= 500 ? 230 : 300;
    carrosselRef.current.scrollBy({ left: distance, behavior: "smooth" });
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

        <label className="favoriteToggle" htmlFor="watchlist-toggle">
          <input
            id="watchlist-toggle"
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={(event) => setShowFavoritesOnly(event.target.checked)}
          />
          Somente favoritos
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
