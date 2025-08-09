import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login-page";
import { SignUpPage } from "./pages/signup-page";
import { AllUsers } from "./components/all-users";
import ProtectedRoute from "./utils/protected-route";
import Layout from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
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
          <Route path="/users" element={<AllUsers />} />
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
