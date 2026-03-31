import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useContext, useMemo } from "react";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/graph.css";

function Graph() {
  const { cryptoHistory, selectedCrypto, loadingHistory, selectedPeriod } =
    useContext(CryptoContext);

  const data = useMemo(() => {
    if (!cryptoHistory) return [];
    return cryptoHistory.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString("pt-BR"),
      price,
    }));
  }, [cryptoHistory]);

  if (!selectedCrypto) return <p>Selecione uma criptomoeda</p>;

  return (
    <div id="containerGraph">
      <h2>{selectedCrypto.name}</h2>
      <p id="selectedPeriodLabel">Periodo: {selectedPeriod} dias</p>
      {loadingHistory ? (
        <p>Carregando grafico...</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis dataKey="price" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Graph;
