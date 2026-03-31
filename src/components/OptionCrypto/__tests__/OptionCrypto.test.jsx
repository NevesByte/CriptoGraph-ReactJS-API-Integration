import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CryptoContext } from "../../../context/CryptoContext";
import OptionCrypto from "../OptionCrypto";

vi.mock("../../CardCrypto/CardCrypto", () => ({
  default: () => <div>Cards</div>,
}));

describe("OptionCrypto", () => {
  it("deve atualizar busca e periodo selecionado", async () => {
    const user = userEvent.setup();
    const setSearchTerm = vi.fn();
    const setSelectedPeriod = vi.fn();

    render(
      <CryptoContext.Provider
        value={{
          searchTerm: "",
          setSearchTerm,
          selectedPeriod: "7",
          setSelectedPeriod,
        }}
      >
        <OptionCrypto />
      </CryptoContext.Provider>
    );

    await user.type(screen.getByLabelText("Buscar criptomoeda"), "bit");
    expect(setSearchTerm).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "30d" }));
    expect(setSelectedPeriod).toHaveBeenCalledWith("30");
  });
});
