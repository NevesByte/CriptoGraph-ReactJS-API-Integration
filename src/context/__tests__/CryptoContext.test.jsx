import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import { CryptoContext, CryptoProvider } from "../CryptoContext";

function Consumer() {
  const {
    selectedCrypto,
    selectedPeriod,
    setSelectedPeriod,
    cryptoHistory,
    loadingHistory,
  } = useContext(CryptoContext);

  return (
    <div>
      <p data-testid="selected-id">{selectedCrypto?.id || "none"}</p>
      <p data-testid="selected-period">{selectedPeriod}</p>
      <p data-testid="history-size">{cryptoHistory.length}</p>
      <p data-testid="history-loading">{loadingHistory ? "yes" : "no"}</p>
      <button type="button" onClick={() => setSelectedPeriod("30")}>
        30d
      </button>
      <button type="button" onClick={() => setSelectedPeriod("7")}>
        7d
      </button>
    </div>
  );
}

describe("CryptoContext", () => {
  it("deve usar cache em memoria para historico ja consultado", async () => {
    const user = userEvent.setup();

    const marketsPayload = [
      {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "btc",
      },
    ];

    const history7 = { prices: [[111111, 100], [222222, 110]] };
    const history30 = { prices: [[111111, 90], [222222, 95], [333333, 105]] };

    global.fetch = vi.fn(async (url) => {
      if (url.includes("/coins/markets")) {
        return { ok: true, json: async () => marketsPayload };
      }

      if (url.includes("days=7")) {
        return { ok: true, json: async () => history7 };
      }

      if (url.includes("days=30")) {
        return { ok: true, json: async () => history30 };
      }

      throw new Error("URL nao mockada no teste");
    });

    render(
      <CryptoProvider>
        <Consumer />
      </CryptoProvider>
    );

    await waitFor(() => expect(screen.getByTestId("selected-id")).toHaveTextContent("bitcoin"));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));

    await user.click(screen.getByRole("button", { name: "30d" }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));

    await user.click(screen.getByRole("button", { name: "7d" }));
    await waitFor(() => expect(screen.getByTestId("history-size")).toHaveTextContent("2"));
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
