import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { CryptoProvider } from "./context/CryptoContext";
import Dashboard from "./pages/dashbord/DashBoard";

function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <CryptoProvider>
        <Dashboard />
      </CryptoProvider>
    </QueryClientProvider>
  );
}

export default App;
