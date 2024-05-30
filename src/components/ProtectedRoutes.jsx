import { Navigate } from "react-router-dom";
import { useQuery } from "react-query";
import { auth } from "../api";

function ProtectedRoute({ children }) {
  const { data: isAuthorized, isLoading } = useQuery("auth", auth);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
