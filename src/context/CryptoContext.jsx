import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export const CryptoContext = createContext();
const DEFAULT_PERIOD = "7";

export function CryptoProvider({ children }) {
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [cryptoHistory, setCryptoHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_PERIOD);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const historyCache = useRef(new Map());
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const filteredCryptoList = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();
    if (!normalizedSearch) return cryptoList;

    return cryptoList.filter((crypto) => {
      const name = crypto.name?.toLowerCase() || "";
      const symbol = crypto.symbol?.toLowerCase() || "";
      return name.includes(normalizedSearch) || symbol.includes(normalizedSearch);
    });
  }, [cryptoList, debouncedSearchTerm]);

  const loading = loadingList || loadingHistory;

  useEffect(() => {
    async function fetchCryptoList() {
      try {
        setLoadingList(true);
        setError(null);
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );

        if (!res.ok) {
          throw new Error("Nao foi possivel carregar a lista de criptomoedas.");
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setCryptoList(list);
        setSelectedCrypto(list[0] || null);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingList(false);
      }
    }

    fetchCryptoList();
  }, []);

  useEffect(() => {
    if (!selectedCrypto) return;

    async function fetchCryptoHistory() {
      const cacheKey = `${selectedCrypto.id}-${selectedPeriod}`;
      if (historyCache.current.has(cacheKey)) {
        setCryptoHistory(historyCache.current.get(cacheKey));
        setLoadingHistory(false);
        return;
      }

      try {
        setLoadingHistory(true);
        setError(null);
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedCrypto.id}/market_chart?vs_currency=usd&days=${selectedPeriod}`
        );

        if (!res.ok) {
          throw new Error("Nao foi possivel carregar o historico da criptomoeda.");
        }

        const data = await res.json();
        const prices = data.prices || [];
        historyCache.current.set(cacheKey, prices);
        setCryptoHistory(prices);
      } catch (err) {
        setError(err);
      } finally {
        setLoadingHistory(false);
      }
    }

    fetchCryptoHistory();
  }, [selectedCrypto, selectedPeriod]);

  return (
    <CryptoContext.Provider
      value={{
        cryptoList,
        filteredCryptoList,
        selectedCrypto,
        setSelectedCrypto,
        cryptoHistory,
        searchTerm,
        setSearchTerm,
        selectedPeriod,
        setSelectedPeriod,
        loading,
        loadingList,
        loadingHistory,
        error,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}
