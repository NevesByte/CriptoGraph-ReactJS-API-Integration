import { useContext } from "react";
import CardCrypto from "../CardCrypto/CardCrypto";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/OptionCrypto.css";

function OptionCrypto() {
  const {
    searchTerm,
    setSearchTerm,
  } = useContext(CryptoContext);

  return (
    <section id="containerOptions">
      {/* Input de busca */}
      <input
        type="text"
        placeholder="Buscar criptomoeda..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
        id="searchCryptoInput"
      />

      {/* Cards */}
      <div id="containerCards">
        <CardCrypto />
      </div>
    </section>
  );
}

export default OptionCrypto;