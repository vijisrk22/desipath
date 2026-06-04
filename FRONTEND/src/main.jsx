import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import store from "./store/index.js"; // Import your Redux store
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: { main: "#FFA41C", contrastText: "#fff" },
    secondary: { main: "#0857D0", contrastText: "#fff" },
    blue: { main: "#2563eb", contrastText: "#fff" },
    green: { main: "#007185", contrastText: "#fff" },
    gray: { main: "#9ca3af", contrastText: "#fff" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* Wrap your app with Redux Provider */}
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <GoogleOAuthProvider clientId="122456871358-0ml36gj9qblo6smhq4j7hhpgb05khtdo.apps.googleusercontent.com">
              <App />
            </GoogleOAuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);

