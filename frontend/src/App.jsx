import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login-page";
import { SignUpPage } from "./pages/signup-page";
import { DashboardPage } from "./pages/dashboard-page";
import ProtectedRoute from "./utils/protected-route";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<SignUpPage />} />
      </Routes>
    </>
  );
}
