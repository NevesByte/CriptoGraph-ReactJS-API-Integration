import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/InfoCrypto.css";

function InfoCrypto() {
  const { selectedCrypto } = useContext(CryptoContext);

  if (!selectedCrypto) {
    return (
      <section id="InfoCrypto">
        <h1>Informações</h1>
        <p>Selecione uma criptomoeda</p>
      </section>
    );
  }

  return (
    <section id="InfoCrypto">
      {/* Nome */}
      <h1>
        {selectedCrypto.name}
      </h1>

      {/* Símbolo */}
      <p>
        {selectedCrypto.symbol.toUpperCase()}
      </p>

      {/* Preço */}
      <p>
        Preço: $
        {selectedCrypto.current_price.toLocaleString()}
      </p>

      {/* Market Cap */}
      <p>
        Market Cap: $
        {selectedCrypto.market_cap.toLocaleString()}
      </p>

      {/* Variação */}
      <p>
        Variação 24h:
        {" "}
        {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
      </p>
    </section>
  );
}

export default InfoCrypto;