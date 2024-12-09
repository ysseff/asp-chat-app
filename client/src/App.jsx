import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage"; // Import DashboardPage

function App() {
  return (
    <AuthProvider> {/* Wrap the app in AuthProvider */}
      <Router>
        <Routes>
          {/* If the user is logged in, they should be redirected to the dashboard */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Route for Dashboard, only accessible if logged in */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
