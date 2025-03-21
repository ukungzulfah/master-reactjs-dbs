import { Navigate } from "react-router-dom";
import { Widget } from "../System/Lib/Widgets";

const ProtectedRoute = (props: any) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? props.children : Widget(Navigate, {to: "/login"});
};

export default ProtectedRoute;