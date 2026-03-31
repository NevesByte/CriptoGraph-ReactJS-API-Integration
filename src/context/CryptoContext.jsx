import { useQueries, useQuery } from "@tanstack/react-query";
import { createContext, useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export const CryptoContext = createContext();
const DEFAULT_PERIOD = "7";

const MARKET_ENDPOINT =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false";
const HISTORY_ENDPOINT = "https://api.coingecko.com/api/v3/coins";

function safeParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

async function fetchMarketList({ signal, page, perPage }) {
  const response = await fetch(`${MARKET_ENDPOINT}&per_page=${perPage}&page=${page}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar a lista de criptomoedas.");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

async function fetchHistory({ signal, coinId, days }) {
  const response = await fetch(
    `${HISTORY_ENDPOINT}/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar o historico da criptomoeda.");
  }

  const data = await response.json();
  return data?.prices || [];
}

export function CryptoProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(DEFAULT_PERIOD);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedCryptoId, setSelectedCryptoId] = useState(null);
  const [compareCryptoIds, setCompareCryptoIds] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    const parsed = safeParse(localStorage.getItem("cryptograph:favorites"), []);
    return Array.isArray(parsed) ? parsed : [];
  });
  const [alertTargets, setAlertTargets] = useState(() => {
    if (typeof window === "undefined") return {};
    const parsed = safeParse(localStorage.getItem("cryptograph:alertTargets"), {});
    return parsed && typeof parsed === "object" ? parsed : {};
  });
  const [triggeredAlerts, setTriggeredAlerts] = useState([]);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("cryptograph:theme") || "dark";
  });

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const marketQuery = useQuery({
    queryKey: ["markets", page, perPage],
    queryFn: ({ signal }) => fetchMarketList({ signal, page, perPage }),
  });

  const cryptoList = useMemo(() => marketQuery.data || [], [marketQuery.data]);

  useEffect(() => {
    if (!cryptoList.length) return;

    if (!selectedCryptoId || !cryptoList.some((coin) => coin.id === selectedCryptoId)) {
      setSelectedCryptoId(cryptoList[0].id);
    }
  }, [cryptoList, selectedCryptoId]);

  useEffect(() => {
    localStorage.setItem("cryptograph:favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("cryptograph:alertTargets", JSON.stringify(alertTargets));
  }, [alertTargets]);

  useEffect(() => {
    localStorage.setItem("cryptograph:theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!cryptoList.length) return;

    const newlyTriggered = [];
    const updatedTargets = { ...alertTargets };

    cryptoList.forEach((coin) => {
      const target = Number(alertTargets[coin.id]);
      if (!target || Number.isNaN(target)) return;

      if (coin.current_price >= target) {
        newlyTriggered.push({
          id: `${coin.id}-${Date.now()}`,
          coinId: coin.id,
          coinName: coin.name,
          currentPrice: coin.current_price,
          targetPrice: target,
        });
        delete updatedTargets[coin.id];
      }
    });

    if (newlyTriggered.length) {
      setTriggeredAlerts((current) => [...newlyTriggered, ...current].slice(0, 8));
      setAlertTargets(updatedTargets);
    }
  }, [cryptoList, alertTargets]);

  const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();

  const filteredCryptoList = useMemo(() => {
    const byText = cryptoList.filter((coin) => {
      if (!normalizedSearch) return true;
      const name = coin.name?.toLowerCase() || "";
      const symbol = coin.symbol?.toLowerCase() || "";
      return name.includes(normalizedSearch) || symbol.includes(normalizedSearch);
    });

    if (!showFavoritesOnly) return byText;
    return byText.filter((coin) => favorites.includes(coin.id));
  }, [cryptoList, normalizedSearch, showFavoritesOnly, favorites]);

  const selectedCrypto = useMemo(
    () => cryptoList.find((coin) => coin.id === selectedCryptoId) || null,
    [cryptoList, selectedCryptoId]
  );

  const selectedCoinIds = useMemo(
    () => [...new Set([selectedCryptoId, ...compareCryptoIds].filter(Boolean))],
    [selectedCryptoId, compareCryptoIds]
  );

  const historyQueries = useQueries({
    queries: selectedCoinIds.map((coinId) => ({
      queryKey: ["history", coinId, selectedPeriod],
      queryFn: ({ signal }) => fetchHistory({ signal, coinId, days: selectedPeriod }),
      enabled: Boolean(coinId),
    })),
  });

  const historyByCoin = useMemo(() => {
    const result = {};
    historyQueries.forEach((query, index) => {
      const coinId = selectedCoinIds[index];
      if (!coinId) return;
      result[coinId] = query.data || [];
    });
    return result;
  }, [historyQueries, selectedCoinIds]);

  const cryptoHistory = selectedCryptoId ? historyByCoin[selectedCryptoId] || [] : [];

  const loadingHistory = historyQueries.some((query) => query.isFetching || query.isLoading);
  const errorHistory = historyQueries.find((query) => query.isError)?.error || null;

  const toggleFavorite = (coinId) => {
    setFavorites((current) =>
      current.includes(coinId)
        ? current.filter((id) => id !== coinId)
        : [...current, coinId]
    );
  };

  const toggleCompareCrypto = (coinId) => {
    setCompareCryptoIds((current) => {
      if (current.includes(coinId)) {
        return current.filter((id) => id !== coinId);
      }

      if (current.length >= 3) {
        return [...current.slice(1), coinId];
      }

      return [...current, coinId];
    });
  };

  const setAlertTarget = (coinId, target) => {
    const normalized = Number(target);
    if (!normalized || Number.isNaN(normalized) || normalized < 0) return;

    setAlertTargets((current) => ({
      ...current,
      [coinId]: normalized,
    }));
  };

  const removeAlertTarget = (coinId) => {
    setAlertTargets((current) => {
      const clone = { ...current };
      delete clone[coinId];
      return clone;
    });
  };

  const dismissAlert = (alertId) => {
    setTriggeredAlerts((current) => current.filter((alert) => alert.id !== alertId));
  };

  const retryHistory = () => {
    historyQueries.forEach((query) => query.refetch?.());
  };

  const hasNextPage = cryptoList.length >= perPage;
  const hasPreviousPage = page > 1;

  return (
    <CryptoContext.Provider
      value={{
        cryptoList,
        filteredCryptoList,
        selectedCrypto,
        selectedCryptoId,
        setSelectedCrypto: setSelectedCryptoId,
        compareCryptoIds,
        toggleCompareCrypto,
        historyByCoin,
        cryptoHistory,
        searchTerm,
        setSearchTerm,
        selectedPeriod,
        setSelectedPeriod,
        page,
        setPage,
        perPage,
        setPerPage,
        hasNextPage,
        hasPreviousPage,
        favorites,
        toggleFavorite,
        isFavorite: (coinId) => favorites.includes(coinId),
        showFavoritesOnly,
        setShowFavoritesOnly,
        alertTargets,
        setAlertTarget,
        removeAlertTarget,
        triggeredAlerts,
        dismissAlert,
        loading: marketQuery.isFetching || loadingHistory,
        loadingList: marketQuery.isFetching || marketQuery.isLoading,
        loadingHistory,
        error: marketQuery.error || errorHistory,
        errorList: marketQuery.error,
        errorHistory,
        retryList: marketQuery.refetch,
        retryHistory,
        theme,
        toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}
