import React, { createContext, useState, useEffect, useContext } from "react";

// Create Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Simulating an authentication check (replace this with actual logic)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("userToken"); // Get token from localStorage

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken); // Set token if available
    }
  }, []); // Empty dependency array to run once on mount

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user)); // Store user in localStorage
    localStorage.setItem("userToken", token); // Store token in localStorage
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user"); // Remove user from localStorage
    localStorage.removeItem("userToken"); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
