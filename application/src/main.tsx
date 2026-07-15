import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    text: {
      primary: "#e8e8f4",
      secondary: "#4a4a6a",
    },
    background: { default: "#0a0a0f", paper: "#13131a" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Inter', sans-serif" },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
