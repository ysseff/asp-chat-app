import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import the AuthContext for user state

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Check if the user is authenticated

  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // Render the children (protected content) if authenticated
  return children;
};

export default ProtectedRoute;
