import { render, screen } from "@testing-library/react";
import { CryptoContext } from "../../../context/CryptoContext";
import InfoCrypto from "../InfoCrypto";

describe("InfoCrypto", () => {
  it("deve renderizar dados da moeda selecionada", () => {
    render(
      <CryptoContext.Provider
        value={{
          selectedCrypto: {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            current_price: 70000,
            market_cap: 1000000,
            total_volume: 500000,
            price_change_percentage_24h: 2.5,
          },
          cryptoHistory: [
            [111111, 68000],
            [222222, 71000],
          ],
          alertTargets: { bitcoin: 72000 },
        }}
      >
        <InfoCrypto />
      </CryptoContext.Provider>
    );

    expect(screen.getByText(/Bitcoin/i)).toBeInTheDocument();
    expect(screen.getByText(/Market Cap/i)).toBeInTheDocument();
    expect(screen.getByText(/Alerta definido/i)).toBeInTheDocument();
  });
});
