import { useContext } from "react";
import Graph from "../../components/Graph/Graph";
import OptionCrypto from "../../components/OptionCrypto/OptionCrypto";
import InfoCrypto from "../../components/InfoCrypto/InfoCrypto";
import Header from "../../components/Header/Header";
import { CryptoContext } from "../../context/CryptoContext";
import "./css/dashboard.css";

function Dashboard() {
  const { error, retryList, retryHistory, triggeredAlerts, dismissAlert } =
    useContext(CryptoContext);

  return (
    <main id="dashboardRoot">
      <Header />

      {error && (
        <section className="errorBanner" role="alert">
          <div>
            <strong>Erro ao carregar dados.</strong>
            <p>{error.message || "Tente novamente em instantes."}</p>
          </div>
          <div className="errorActions">
            <button type="button" onClick={() => retryList?.()}>
              Recarregar mercado
            </button>
            <button type="button" onClick={() => retryHistory?.()}>
              Recarregar historico
            </button>
          </div>
        </section>
      )}

      {triggeredAlerts.length > 0 && (
        <section className="alertsPanel" aria-live="polite">
          <h3>Alertas de preco acionados</h3>
          <div className="alertsList">
            {triggeredAlerts.map((alert) => (
              <article key={alert.id} className="alertCard">
                <p>
                  <strong>{alert.coinName}</strong> atingiu {alert.currentPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <p>
                  Alvo definido: {alert.targetPrice.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </p>
                <button type="button" onClick={() => dismissAlert(alert.id)}>
                  Fechar
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      <OptionCrypto />
      <Graph />
      <InfoCrypto />
    </main>
  );
}

export default Dashboard;
