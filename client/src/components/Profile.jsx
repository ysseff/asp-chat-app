import React, { useState } from "react";
import styles from "../styles/components-style/profile.module.css"; // Import the CSS Module

const Profile = ({ toggleProfile }) => {  // Receive toggleProfile prop to handle closing the popup
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    firstName: "",
    lastName: ""
  });

  // Handle input changes to update formData
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Handle form submission (e.g., save profile changes)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can add logic to send data to an API here, or trigger some other action.
  };

  return (
    <div className={styles.profilePopup}>
      <div className={styles.profileContent}>
        <header className={styles.profileHeader}>
          <h2 className={styles.profileTitle}>Profile</h2>
          {/* Close button that toggles the profile popup */}
          <button 
            className={styles.closeBtn} 
            onClick={toggleProfile}  // Close the profile popup when clicked
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {/* Email field */}
          <div className={styles.profileField}>
            <label htmlFor="email" className={styles.profileLabel}>Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className={styles.profileInput}
            />
          </div>

          {/* Username field */}
          <div className={styles.profileField}>
            <label htmlFor="username" className={styles.profileLabel}>Username</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="User123"
              className={styles.profileInput}
            />
          </div>

          {/* First Name field */}
          <div className={styles.profileField}>
            <label htmlFor="firstName" className={styles.profileLabel}>First Name</label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className={styles.profileInput}
            />
          </div>

          {/* Last Name field */}
          <div className={styles.profileField}>
            <label htmlFor="lastName" className={styles.profileLabel}>Last Name</label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className={styles.profileInput}
            />
          </div>

          {/* Buttons to save changes or reset password */}
          <div className={styles.profileButtons}>
            <button type="submit" className={styles.editProfileBtn}>Edit Profile</button>
            <button type="button" className={styles.resetPasswordBtn}>Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
