import Graph from "../../components/Graph/Graph";
import OptionCrypto from "../../components/OptionCrypto/OptionCrypto";
import InfoCrypto from "../../components/InfoCrypto/InfoCrypto"
import Header from "../../components/Header/Header"

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <Header />
      <OptionCrypto />
      <Graph />
      <InfoCrypto/>
    </div>
  );
}

export default Dashboard;
