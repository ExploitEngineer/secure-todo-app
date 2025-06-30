import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  if (document.cookie === "token=") {
    return <Navigate to="/login" />;
  }

  return children;
}
