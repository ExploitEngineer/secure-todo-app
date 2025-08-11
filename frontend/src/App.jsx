import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login-page";
import { SignUpPage } from "./pages/signup-page";
import ProtectedRoute from "./utils/protected-route";
import Layout from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { io } from "socket.io-client";

export default function App() {
  const socket = io("http://localhost:4000");

  socket.emit("connection", { text: "Hello server!" });

  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        storageKey="vite-ui-theme"
        enableSystem
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<SignUpPage />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
