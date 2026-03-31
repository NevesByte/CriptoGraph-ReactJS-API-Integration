import { render, screen } from "@testing-library/react";
import { CryptoContext } from "../../../context/CryptoContext";
import Graph from "../Graph";

describe("Graph", () => {
  it("deve exibir metricas de risco e periodo", () => {
    render(
      <CryptoContext.Provider
        value={{
          selectedCrypto: { id: "bitcoin", name: "Bitcoin", symbol: "btc" },
          selectedPeriod: "7",
          loadingHistory: false,
          historyByCoin: {
            bitcoin: [
              [111111, 100],
              [222222, 120],
              [333333, 110],
              [444444, 130],
            ],
          },
          compareCryptoIds: [],
          cryptoList: [{ id: "bitcoin", symbol: "btc", name: "Bitcoin" }],
        }}
      >
        <Graph />
      </CryptoContext.Provider>
    );

    expect(screen.getByText(/Periodo: 7d/i)).toBeInTheDocument();
    expect(screen.getByText(/Volatilidade/i)).toBeInTheDocument();
    expect(screen.getByText(/Max Drawdown/i)).toBeInTheDocument();
  });
});
