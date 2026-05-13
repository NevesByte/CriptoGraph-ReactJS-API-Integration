import { createContext, useEffect, useState } from "react";

export const CryptoContext = createContext();

const API_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";

export function CryptoProvider({ children }) {

  const [cryptoList, setCryptoList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    async function fetchCryptos() {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        const data = await response.json();

        setCryptoList(data);

        if (data.length > 0) {
          setSelectedCrypto(data[0]);
        }
      } catch (err) {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    fetchCryptos();
  }, []);

  const filteredCryptoList = cryptoList.filter((coin) => {
    return (
      coin.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      coin.symbol
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  return (
    <CryptoContext.Provider
      value={{
        cryptoList,
        filteredCryptoList,

        searchTerm,
        setSearchTerm,

        loading,
        error,

        selectedCrypto,
        setSelectedCrypto,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}