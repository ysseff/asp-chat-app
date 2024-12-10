import React, { useState } from "react";
import styles from "../styles/components-style/profile.module.css";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed
import axios from "axios"; // Import axios for HTTP requests
import { toast } from "react-toastify"; // Import toast from react-toastify

// Import the CSS for react-toastify
import "react-toastify/dist/ReactToastify.css";

const ResetPass = ({ togglePasswordUpdate }) => {
  const { token } = useAuth(); // Access token from AuthContext

  // If token is undefined, try getting it from localStorage
  const currentToken = token || localStorage.getItem("userToken");

  // Log the token for debugging
  console.log("Current Token:", currentToken);

  // Initialize formData for passwords
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Handle input changes to update formData
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission to update the password
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New Password and Confirm Password do not match.");
      return;
    }

    // Log the data being sent
    console.log("Sending Data:", {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });

    try {
      const response = await axios.post(
        "http://localhost:5002/api/User/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`, // Send token in Authorization header
          },
        }
      );

      // Log the response for debugging
      console.log("Response:", response);

      // Success response - show toast
      toast.success("Password updated successfully!");
      togglePasswordUpdate(); // Close the password reset form
    } catch (error) {
      // Log the error for debugging
      console.error("Error:", error);

      // Error response - show toast
      toast.error(
        error.response?.data?.message || "Failed to update password. Please try again."
      );
    }
  };

  return (
    <div className={styles.profilePopup}>
      <div className={styles.profileContent}>
        <header className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Reset Password</h2>
          {/* Close button to toggle the password reset popup */}
          <button
            className={styles.closeBtn}
            onClick={togglePasswordUpdate} // Close the password reset form
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {/* Old Password field */}
          <div className={styles.profileField}>
            <label htmlFor="currentPassword" className={styles.profileLabel}>
              Old Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter old password"
              className={styles.profileInput}
            />
          </div>

          {/* New Password field */}
          <div className={styles.profileField}>
            <label htmlFor="newPassword" className={styles.profileLabel}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className={styles.profileInput}
            />
          </div>

          {/* Confirm New Password field */}
          <div className={styles.profileField}>
            <label
              htmlFor="confirmNewPassword"
              className={styles.profileLabel}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={styles.profileInput}
            />
          </div>

          {/* Buttons for submitting or canceling */}
          <div className={styles.profileButtons}>
            <button type="submit" className={styles.editProfileBtn}>
              Update Password
            </button>
            <button
              type="button"
              className={styles.resetPasswordBtn}
              onClick={togglePasswordUpdate} // Return to the previous component
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;
