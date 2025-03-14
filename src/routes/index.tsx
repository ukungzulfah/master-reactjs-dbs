import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { useEffect } from "react";
import MainLayoutChat from "../layouts/MainLayoutChat";

const AppRoutes = () => {
  
  useEffect(() => {
    const handleTouchMove = (event: any) => {
      event.stopPropagation();
    };
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);
  
  return (
    <Router>
      <Routes>

        {/* Routes dengan Layout */}
        <Route path="/" element={<MainLayoutChat />}>
        
        </Route>

        {/* Routes dengan Layout */}
        <Route path="/test" element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* <Route index element={<Dashboard />} /> */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route path="/login" element={<Login />} />
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;