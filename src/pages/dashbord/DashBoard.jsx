import { useContext } from "react";
import Header from "../../components/Header/Header";
import Graph from "../../components/Graph/Graph";
import InfoCrypto from "../../components/InfoCrypto/InfoCrypto";
import OptionCrypto from "../../components/OptionCrypto/OptionCrypto";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/dashboard.css";

function Dashboard() {
  const { error } = useContext(CryptoContext);

  return (
    <main id="dashboardRoot">
      <Header />

      {error && (
        <p className="errorMessage">
          Erro ao carregar criptomoedas.
        </p>
      )}

      <OptionCrypto />

      <Graph />

      <InfoCrypto />
    </main>
  );
}

export default Dashboard;