import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useContext, useMemo } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/graph.css";

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const comparePalette = ["#38bdf8", "#f59e0b", "#f97316"];

function formatPeriodLabel(period) {
  if (period === "1") return "24h";
  if (period === "7") return "7d";
  if (period === "30") return "30d";
  if (period === "365") return "1y";
  return `${period}d`;
}

function calculateMovingAverage(values, windowSize) {
  if (!values.length) return [];
  const ma = [];
  for (let i = 0; i < values.length; i += 1) {
    if (i < windowSize - 1) {
      ma.push(null);
      continue;
    }
    const slice = values.slice(i - windowSize + 1, i + 1);
    const avg = slice.reduce((sum, value) => sum + value, 0) / windowSize;
    ma.push(avg);
  }
  return ma;
}

function getRiskMetrics(values) {
  if (values.length < 2) {
    return { volatility: 0, drawdown: 0 };
  }

  const returns = [];
  for (let i = 1; i < values.length; i += 1) {
    const prev = values[i - 1];
    const current = values[i];
    if (prev > 0) {
      returns.push((current - prev) / prev);
    }
  }

  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    Math.max(returns.length, 1);
  const volatility = Math.sqrt(variance) * 100;

  let peak = values[0];
  let maxDrawdown = 0;
  for (const value of values) {
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  return { volatility, drawdown: maxDrawdown };
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="graphTooltip">
      <p className="graphTooltipDate">{label}</p>
      {payload
        .filter((item) => item.value != null)
        .map((item) => (
          <p key={item.dataKey} className="graphTooltipItem" style={{ color: item.color }}>
            {item.name}: {usdFormatter.format(item.value)}
          </p>
        ))}
    </div>
  );
}

function Graph() {
  const {
    selectedCrypto,
    selectedPeriod,
    loadingHistory,
    historyByCoin,
    compareCryptoIds,
    cryptoList,
  } = useContext(CryptoContext);

  const compareCoins = useMemo(
    () => compareCryptoIds.map((id) => cryptoList.find((coin) => coin.id === id)).filter(Boolean),
    [compareCryptoIds, cryptoList]
  );

  const chartData = useMemo(() => {
    if (!selectedCrypto) return [];

    const selectedHistory = historyByCoin[selectedCrypto.id] || [];
    if (!selectedHistory.length) return [];

    const allIds = [selectedCrypto.id, ...compareCoins.map((coin) => coin.id)];
    const mapByCoin = {};

    allIds.forEach((coinId) => {
      const entries = historyByCoin[coinId] || [];
      mapByCoin[coinId] = new Map(entries.map(([timestamp, price]) => [timestamp, price]));
    });

    const timeline = [...new Set(selectedHistory.map(([timestamp]) => timestamp))];

    const prices = selectedHistory.map(([, price]) => price);
    const ma7 = calculateMovingAverage(prices, 7);
    const ma21 = calculateMovingAverage(prices, 21);

    return timeline.map((timestamp, index) => {
      const date = new Date(timestamp);
      const label =
        selectedPeriod === "1"
          ? date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
          : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

      const base = {
        time: label,
        timestamp,
        ma7: ma7[index],
        ma21: ma21[index],
      };

      allIds.forEach((coinId) => {
        base[`price_${coinId}`] = mapByCoin[coinId].get(timestamp) ?? null;
      });

      return base;
    });
  }, [selectedCrypto, historyByCoin, compareCoins, selectedPeriod]);

  const summary = useMemo(() => {
    if (!selectedCrypto || !chartData.length) {
      return {
        trend: "neutral",
        trendLabel: "Sem variacao",
        trendValueLabel: "0.00%",
        lineColor: "#94a3b8",
        areaTopColor: "rgba(148,163,184,0.45)",
        areaBottomColor: "rgba(148,163,184,0.03)",
        lastPoint: null,
        volatility: 0,
        drawdown: 0,
      };
    }

    const key = `price_${selectedCrypto.id}`;
    const values = chartData.map((item) => item[key]).filter((value) => value != null);

    const first = values[0];
    const last = values[values.length - 1];
    const variation = ((last - first) / first) * 100;
    const isUp = variation >= 0;
    const { volatility, drawdown } = getRiskMetrics(values);

    return {
      trend: isUp ? "up" : "down",
      trendLabel: isUp ? "Alta" : "Queda",
      trendValueLabel: `${isUp ? "+" : ""}${variation.toFixed(2)}%`,
      lineColor: isUp ? "#22c55e" : "#ef4444",
      areaTopColor: isUp ? "rgba(34,197,94,0.42)" : "rgba(239,68,68,0.42)",
      areaBottomColor: isUp ? "rgba(34,197,94,0.02)" : "rgba(239,68,68,0.02)",
      lastPoint: chartData[chartData.length - 1],
      volatility,
      drawdown,
    };
  }, [chartData, selectedCrypto]);

  if (!selectedCrypto) return <p>Selecione uma criptomoeda</p>;

  const primaryDataKey = `price_${selectedCrypto.id}`;

  return (
    <section id="containerGraph" aria-label="Grafico de mercado">
      <div id="graphHeader">
        <div>
          <h2>{selectedCrypto.name}</h2>
          <p id="selectedPeriodLabel">Periodo: {formatPeriodLabel(selectedPeriod)}</p>
        </div>
        <div className={`trendBadge trend-${summary.trend}`}>
          <span>{summary.trendLabel}</span>
          <strong>{summary.trendValueLabel}</strong>
        </div>
      </div>

      <div id="metricsRow">
        <p>
          Volatilidade: <strong>{summary.volatility.toFixed(2)}%</strong>
        </p>
        <p>
          Max Drawdown: <strong>{summary.drawdown.toFixed(2)}%</strong>
        </p>
      </div>

      {loadingHistory ? (
        <p>Carregando grafico...</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 2 }}>
            <defs>
              <linearGradient id="priceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={summary.areaTopColor} stopOpacity={1} />
                <stop offset="95%" stopColor={summary.areaBottomColor} stopOpacity={1} />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
            <XAxis
              dataKey="time"
              minTickGap={16}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.3)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.3)" }}
            />
            <YAxis
              width={90}
              tickFormatter={(value) => usdFormatter.format(value)}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
              axisLine={{ stroke: "rgba(148,163,184,0.3)" }}
              tickLine={{ stroke: "rgba(148,163,184,0.3)" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0", strokeDasharray: "4 4" }} />

            <Area
              type="monotone"
              dataKey={primaryDataKey}
              name={selectedCrypto.symbol.toUpperCase()}
              stroke="none"
              fill="url(#priceAreaGradient)"
              isAnimationActive
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey={primaryDataKey}
              name={selectedCrypto.symbol.toUpperCase()}
              stroke={summary.lineColor}
              strokeWidth={3}
              dot={false}
              filter="url(#lineGlow)"
              isAnimationActive
              animationDuration={900}
            />

            {compareCoins.map((coin, index) => (
              <Line
                key={coin.id}
                type="monotone"
                dataKey={`price_${coin.id}`}
                name={coin.symbol.toUpperCase()}
                stroke={comparePalette[index % comparePalette.length]}
                strokeWidth={2}
                dot={false}
                strokeDasharray="6 4"
              />
            ))}

            <Line
              type="monotone"
              dataKey="ma7"
              name="MM 7"
              stroke="#eab308"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="ma21"
              name="MM 21"
              stroke="#a855f7"
              strokeWidth={1.5}
              dot={false}
            />

            {summary.lastPoint && (
              <ReferenceDot
                x={summary.lastPoint.time}
                y={summary.lastPoint[primaryDataKey]}
                r={5}
                fill={summary.lineColor}
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      )}
    </section>
  );
}

export default Graph;
