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

function formatPeriodLabel(period) {
  if (period === "1") return "24h";
  if (period === "7") return "7d";
  if (period === "30") return "30d";
  if (period === "365") return "1y";
  return `${period}d`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="graphTooltip">
      <p className="graphTooltipDate">{label}</p>
      <p className="graphTooltipPrice">{usdFormatter.format(payload[0].value)}</p>
    </div>
  );
}

function Graph() {
  const { cryptoHistory, selectedCrypto, loadingHistory, selectedPeriod } =
    useContext(CryptoContext);

  const data = useMemo(() => {
    if (!cryptoHistory?.length) return [];

    return cryptoHistory.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      const timeLabel =
        selectedPeriod === "1"
          ? date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });

      return {
        timestamp,
        time: timeLabel,
        price,
      };
    });
  }, [cryptoHistory, selectedPeriod]);

  const chartSummary = useMemo(() => {
    if (!data.length) {
      return {
        trend: "neutral",
        trendLabel: "Sem variacao",
        trendValueLabel: "0.00%",
        lineColor: "#94a3b8",
        areaTopColor: "rgba(148,163,184,0.45)",
        areaBottomColor: "rgba(148,163,184,0.03)",
        lastPoint: null,
      };
    }

    const first = data[0].price;
    const lastPoint = data[data.length - 1];
    const changePercent = ((lastPoint.price - first) / first) * 100;
    const isUp = changePercent >= 0;

    return {
      trend: isUp ? "up" : "down",
      trendLabel: isUp ? "Alta" : "Queda",
      trendValueLabel: `${isUp ? "+" : ""}${changePercent.toFixed(2)}%`,
      lineColor: isUp ? "#22c55e" : "#ef4444",
      areaTopColor: isUp ? "rgba(34,197,94,0.42)" : "rgba(239,68,68,0.42)",
      areaBottomColor: isUp ? "rgba(34,197,94,0.02)" : "rgba(239,68,68,0.02)",
      lastPoint,
    };
  }, [data]);

  if (!selectedCrypto) return <p>Selecione uma criptomoeda</p>;

  return (
    <section id="containerGraph">
      <div id="graphHeader">
        <div>
          <h2>{selectedCrypto.name}</h2>
          <p id="selectedPeriodLabel">Periodo: {formatPeriodLabel(selectedPeriod)}</p>
        </div>
        <div className={`trendBadge trend-${chartSummary.trend}`}>
          <span>{chartSummary.trendLabel}</span>
          <strong>{chartSummary.trendValueLabel}</strong>
        </div>
      </div>

      {loadingHistory ? (
        <p>Carregando grafico...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 2 }}>
            <defs>
              <linearGradient id="priceAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartSummary.areaTopColor} stopOpacity={1} />
                <stop offset="95%" stopColor={chartSummary.areaBottomColor} stopOpacity={1} />
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
              dataKey="price"
              stroke="none"
              fill="url(#priceAreaGradient)"
              isAnimationActive
              animationDuration={900}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={chartSummary.lineColor}
              strokeWidth={3}
              dot={false}
              filter="url(#lineGlow)"
              isAnimationActive
              animationDuration={900}
            />

            {chartSummary.lastPoint && (
              <ReferenceDot
                x={chartSummary.lastPoint.time}
                y={chartSummary.lastPoint.price}
                r={5}
                fill={chartSummary.lineColor}
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
