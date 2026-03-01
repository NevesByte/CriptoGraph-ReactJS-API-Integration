import { createContext, useState, useEffect } from "react";

export const CryptoContext = createContext();

export function CryptoProvider({ children }) {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoHistory, setCryptoHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCryptoList() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        const data = await res.json();
        setCryptoList(data);
        setSelectedCrypto(data[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCryptoList();
  }, []);

  useEffect(() => {
    if (!selectedCrypto) return;

    async function fetchCryptoHistory() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=usd&days=7`
        );
        const data = await res.json();
        setCryptoHistory(data.prices || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoHistory();
  }, [selectedCrypto]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoList,
        selectedCrypto,
        setSelectedCrypto,
        cryptoHistory,
        loading,
        error,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}
