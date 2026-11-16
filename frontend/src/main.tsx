import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ConfigProvider } from "antd";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./index.css";
import "./App.css";

import App from "./App.tsx";

const queryClient = new QueryClient();

const antdTheme = {
  token: {
    colorPrimary: "#004AC6",
    colorInfo: "#004AC6",
    colorSuccess: "#18794E",
    colorWarning: "#BC4800",
    colorError: "#BA1A1A",

    colorText: "#0B1C30",
    colorTextSecondary: "#565E74",

    colorBgBase: "#F8F9FF",
    colorBgContainer: "#FFFFFF",
    colorBgElevated: "#FFFFFF",

    colorBorder: "#C3C6D7",
    colorBorderSecondary: "#E5EEFF",

    borderRadius: 12,
    controlHeight: 40,

    fontFamily: '"Geist Variable", sans-serif',
  },
};
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <App />
      </ConfigProvider>

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);
