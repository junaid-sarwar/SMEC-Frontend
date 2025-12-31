import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. Initialize State (Lazy loading from LocalStorage)
  // This ensures if you refresh the page, the user stays logged in
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    // Check if both exist before parsing
    if (token && user) {
      try {
        return { token, user: JSON.parse(user) };
      } catch (error) {
        // If JSON is invalid, clear storage
        localStorage.clear();
        return null;
      }
    }
    return null;
  });

  // 2. Login Function (Call this after Axios success in Login/AdminLogin)
  const login = (data) => {
    // data should look like: { token: "...", user: { role: "admin", ... } }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuth(data);
  };

  // 3. Logout Function (Call this on Logout button click)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(null);
    // Optional: window.location.href = '/login'; // Force redirect if needed
  };

  // 4. Helper to check if current user is Admin
  const isAdmin = auth?.user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to use the context easily
export const useAuth = () => useContext(AuthContext);