
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import { QueryClientProvider } from "@tanstack/react-query";
  import { queryClient } from "@/services/queryClient";
  import { ErrorBoundary } from "@/components/ErrorBoundary";
  import App from "./App";
  import "./index.css";

   createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
   );
  