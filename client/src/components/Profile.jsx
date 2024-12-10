import React, { useState } from "react";
import styles from "../styles/components-style/profile.module.css";
import { useAuth } from "../context/AuthContext"; // Adjust the path as needed
import axios from "axios"; // Import axios for HTTP requests
import ResetPass from "./ResetPass"; // Import the ResetPass component
import { toast } from "react-toastify"; // Import toast from react-toastify

// Import the CSS for react-toastify
import "react-toastify/dist/ReactToastify.css";

const Profile = ({ toggleProfile }) => {
  const { user, token, login } = useAuth(); // Access user data and token from AuthContext

  // If token is undefined, try getting it from localStorage
  const currentToken = token || localStorage.getItem("userToken");

  // Initialize formData with user data
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
  });
  

  // State to toggle between Profile and ResetPass components
  const [isResetPassword, setIsResetPassword] = useState(false);

  // Handle input changes to update formData
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission (e.g., save profile changes)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:5002/api/User/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`, // Use the currentToken
          },
        }
      );

      // Success response - show toast
      toast.success("Profile updated successfully!");

      // Update user data in AuthContext with the updated response data
      login(response.data, currentToken);
    } catch (error) {
      // Error response - show toast
      toast.error(
        error.response?.data?.message || "Failed to update profile!"
      );
    }
  };

  // Toggle to show ResetPass component
  const handleResetPasswordClick = () => {
    setIsResetPassword(true);
  };

  // Toggle to show Profile component
  const handleBackToProfile = () => {
    setIsResetPassword(false);
  };

  if (isResetPassword) {
    return <ResetPass togglePasswordUpdate={handleBackToProfile} />;
  }

  return (
    <div className={styles.profilePopup}>
      <div className={styles.profileContent}>
        <header className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Profile</h2>
          {/* Close button to toggle the profile popup */}
          <button
            className={styles.closeBtn}
            onClick={toggleProfile} // Close the profile popup when clicked
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
  {/* Email field */}
  <div className={styles.profileField}>
    <label htmlFor="email" className={styles.profileLabel}>
      Email
    </label>
    <input
      type="email"
      id="email"
      value={formData.email}
      onChange={handleChange}
      placeholder={user?.email || "Enter your email"} // Use user data or default placeholder
      className={styles.profileInput}
    />
  </div>

  {/* Username field */}
  <div className={styles.profileField}>
    <label htmlFor="username" className={styles.profileLabel}>
      Username
    </label>
    <input
      type="text"
      id="username"
      value={formData.username}
      onChange={handleChange}
      placeholder={user?.userName || "Enter your username"} // Use user data or default placeholder
      className={styles.profileInput}
    />
  </div>

  {/* First Name field */}
  <div className={styles.profileField}>
    <label htmlFor="firstName" className={styles.profileLabel}>
      First Name
    </label>
    <input
      type="text"
      id="firstName"
      value={formData.firstName}
      onChange={handleChange}
      placeholder={user?.firstName || "Enter your first name"} // Use user data or default placeholder
      className={styles.profileInput}
    />
  </div>

  {/* Last Name field */}
  <div className={styles.profileField}>
    <label htmlFor="lastName" className={styles.profileLabel}>
      Last Name
    </label>
    <input
      type="text"
      id="lastName"
      value={formData.lastName}
      onChange={handleChange}
      placeholder={user?.lastName || "Enter your last name"} // Use user data or default placeholder
      className={styles.profileInput}
    />
  </div>

  {/* Buttons to save changes or reset password */}
  <div className={styles.profileButtons}>
    <button type="submit" className={styles.editProfileBtn}>
      Edit Profile
    </button>
    <button
      type="button"
      className={styles.resetPasswordBtn}
      onClick={handleResetPasswordClick} // Show ResetPass component
    >
      Reset Password
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default Profile;
