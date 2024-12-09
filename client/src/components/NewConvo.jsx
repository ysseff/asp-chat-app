import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HubConnectionBuilder } from "@microsoft/signalr"; // Import SignalR
import styles from "../styles/components-style/NewConvo.module.css"; // Import the CSS Module

const NewConvo = ({ togglePopup, updateConversations, conversations }) => {
  const [username, setUsername] = useState(""); // State for username input
  const [loading, setLoading] = useState(false); // State for loading
  const [connection, setConnection] = useState(null); // State to hold SignalR connection
  const [isTokenReady, setIsTokenReady] = useState(false); // Track if token is available

  // Check if the token exists in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Fetch token from localStorage
    if (token) {
      setIsTokenReady(true); // If token exists, set token readiness to true
    }
  }, []);

  // Initialize SignalR connection
  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Fetch token for SignalR connection
    if (token) {
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5002/chathub", {
          accessTokenFactory: () => token, // Provide token for authorization
        })
        .withAutomaticReconnect()
        .build();

      setConnection(newConnection);

      newConnection
        .start()
        .then(() => {
          console.log("SignalR Connected!");
          newConnection.on("ReceiveNewConversation", (conversation) => {
            // Update sidebar when a new conversation is created
            updateConversations([...conversations, conversation]);
          });
        })
        .catch((error) => console.error("SignalR Connection Error:", error));
    }
  }, [updateConversations, conversations]);

  // Handle username input change
  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  // Function to check if the input is an email
  const isEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  };

  // Handle form submission
  const handleStartConversation = async () => {
    if (!username) {
      toast.error("Please enter a username or email.");
      return;
    }

    if (!isTokenReady) {
      toast.error("Token not available. Please login first.");
      return;
    }

    setLoading(true);

    const isEmailInput = isEmail(username);

    const requestPayload = {
      [isEmailInput ? "email" : "username"]: username, // Dynamically send email or username
    };
    const token = localStorage.getItem("userToken");

    try {
      const response = await axios.post(
        "http://localhost:5002/api/Conversations/start",
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from API:", response);

      if (response.status === 200) {
        const conversation = response.data;
        toast.success("Conversation started successfully!");

        // Add conversation to the local state
        updateConversations([ conversation,...conversations]);

        // Notify SignalR hub
        if (connection) {
          await connection.invoke("SendNewConversation", conversation);
        }

        togglePopup();
      } else {
        toast.error("Failed to start conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response || error);
      toast.error(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.newConvo}>
      <div className={styles.newConvoContent}>
        <div className={styles.newConvoHeader}>
          <h3 className={styles.headerTitle}>New Conversation</h3>
          <button className={styles.closeBtn} onClick={togglePopup}>
            ×
          </button>
        </div>

        <label htmlFor="username" className={styles.newConvoLabel}>
          Username or Email
        </label>
        <input
          type="text"
          id="username"
          className={styles.newConvoInput}
          placeholder="Enter username or email"
          value={username}
          onChange={handleInputChange}
        />

        <button
          className={styles.startConvoBtn}
          onClick={handleStartConversation}
          disabled={loading || !isTokenReady} // Disable button while loading or if token is not ready
        >
          {loading ? "Starting..." : "Start Conversation"}
        </button>
      </div>
    </div>
  );
};

export default NewConvo;
