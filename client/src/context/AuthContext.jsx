import React, { createContext, useState, useEffect, useContext } from "react";

// Create Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Simulating an authentication check (replace this with actual logic)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("userToken");

    // Only parse storedUser if it's not null
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Simulate token expiration check (you should add real validation here)
        const isTokenExpired = checkTokenExpiration(storedToken);
        if (!isTokenExpired) {
          setUser(parsedUser);
          setToken(storedToken); // Set token if it's valid
        } else {
          logout(); // Logout if token is expired
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout(); // Logout if parsing fails
      }
    }
  }, []);

  // Function to check if the token is expired (example, modify based on actual token expiry logic)
  const checkTokenExpiration = (token) => {
    // Assuming the token has an expiration time (JWT example)
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.exp * 1000 < Date.now(); // Check expiration (in milliseconds)
    } catch (error) {
      return true; // If there's an issue with decoding, assume token is expired
    }
  };

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userToken", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
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
