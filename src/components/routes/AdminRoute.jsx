import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

const AdminRoute = ({ children }) => {
  const { auth, isAdmin } = useAuth();

  // 1. If not logged in at all, go to Admin Login
  if (!auth) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. If logged in but NOT an admin, kick them to Home
  if (!isAdmin) {
    // We use useEffect to show toast only once to avoid render loops
    // returning the Navigate component happens immediately
    return <Navigate to="/" replace />;
  }

  // 3. If Admin, allow access
  return children;
};

export default AdminRoute;