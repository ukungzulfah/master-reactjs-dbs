import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? props.children : <Navigate to="/login" />;
};

export default ProtectedRoute;