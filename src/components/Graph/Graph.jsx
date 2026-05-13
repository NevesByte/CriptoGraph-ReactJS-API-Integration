import {
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
} from "recharts";

import { useContext } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/graph.css";

function Graph() {
  const {
    selectedCrypto,
    cryptoList,
    loading,
  } = useContext(CryptoContext);

  // Se não tiver moeda
  if (!selectedCrypto) {
    return <p>Selecione uma criptomoeda</p>;
  }

  // Loading
  if (loading) {
    return <p>Carregando gráfico...</p>;
  }

  // Dados simples mudando conforme a moeda
  const basePrice = selectedCrypto.current_price;

  const chartData = [
    { date: "Seg", price: basePrice - 2000 },
    { date: "Ter", price: basePrice - 1000 },
    { date: "Qua", price: basePrice - 500 },
    { date: "Qui", price: basePrice + 500 },
    { date: "Sex", price: basePrice + 1000 },
    { date: "Sab", price: basePrice + 1500 },
    { date: "Dom", price: basePrice },
  ];

  return (
    <section id="containerGraph">
      <h2>
        Gráfico - {selectedCrypto.name}
      </h2>

      <div className="chartContainer">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              fill="#93c5fd"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default Graph;