import { CryptoProvider } from "./context/CryptoContext";
import Dashboard from "./pages/dashbord/DashBoard";

function App() {
  return (
    <CryptoProvider>
      <Dashboard />
    </CryptoProvider>
  );
}

export default App;
