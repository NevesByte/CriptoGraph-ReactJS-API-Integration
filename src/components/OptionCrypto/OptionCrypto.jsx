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
  const { searchTerm, setSearchTerm, selectedPeriod, setSelectedPeriod } =
    useContext(CryptoContext);

  const scrollLeft = () => {
    if (carrosselRef.current) {
      const distance = window.innerWidth <= 500 ? 200 : 300;
      carrosselRef.current.scrollBy({
        left: -distance,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carrosselRef.current) {
      const distance = window.innerWidth <= 500 ? 230 : 300;
      carrosselRef.current.scrollBy({
        left: distance,
        behavior: "smooth",
      });
    }
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
      </section>

      <section id="containerCarrosslCards">
        <button className="btnSlides" onClick={scrollLeft}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div id="carrosselCards" ref={carrosselRef}>
          <CardCrypto />
        </div>
        <button className="btnSlides" onClick={scrollRight}>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>
    </>
  );
}

export default OptionCrypto;
