import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoEye, GoEyeClosed } from "react-icons/go"; // Import visibility icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import styles from "../styles/pages-style/LoginPage.module.css"; // Import the CSS Module

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const navigate = useNavigate(); // Initialize navigate hook
  const { login } = useAuth(); // Get login function from context
  const handleLogin = async (values) => {
    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5002/api/Auth/login", {
        email: values.email,
        password: values.password,
      });
  
      // Print the response in the console
      console.log("Login response:", response);
  
      // Handle successful login response
      if (response.status === 200) {
        toast.success("Login successful!");
        console.log("Login successful:", response.data); // This will print the user data
  
        // Store user info and token in the Auth context and localStorage
        login(response.data); // Store the user in the context
  
        // Save the token to localStorage
        localStorage.setItem("userToken", response.data.token); // Assuming the token is in response.data.token
  
        // Redirect to the dashboard page after successful login
        navigate("/dashboard"); // Redirect to the dashboard
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };
  
  

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: handleLogin,
  });

  return (
    <div className={styles.loginPage}>
      <ToastContainer />
      <div className={styles.loginFormContainer}>
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.email && formik.errors.email ? styles.error : ""}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type={passwordVisible ? "text" : "password"} // Toggle password visibility
              id="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.password && formik.errors.password ? styles.error : ""}
              required
            />
            <span
              onClick={() => setPasswordVisible(!passwordVisible)} // Toggle password visibility state
              className={styles.passwordToggleIcon}
            >
              {passwordVisible ? <GoEyeClosed /> : <GoEye />} {/* Show icon based on state */}
            </span>
          </div>
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


/*import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCirclePlus } from "react-icons/ci";
import "../styles/pages-style/DashboardPage.css";
import NewConvo from "../components/NewConvo";
import { BsSend } from "react-icons/bs";

const DashboardPage = () => {
  const [conversations, setConversations] = useState([]);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messageInputRef = useRef(null);
  const sendButtonRef = useRef(null);

  // Decode token to get userId
  const token = localStorage.getItem("userToken");
  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.sub || payload.nameid || payload.userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("Failed to decode user ID from token.");
    }
  }

  // Setup SignalR only when token is available
  useEffect(() => {
    if (!token) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5002/chathub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
        newConnection.on("ReceiveMessage", (msg) => {
          if (
            selectedConversation &&
            selectedConversation.conversationId === msg.ConversationId
          ) {
            setMessagesList((prev) => [
              ...prev,
              {
                conversationId: msg.ConversationId,
                senderId: msg.SenderId,
                content: msg.Content,
                timestamp: msg.Timestamp,
              },
            ]);
          } else {
            // If the message isn't for the currently selected conversation
            console.log("New message for another conversation");
          }
        });

        newConnection.on("ReceiveNewConversation", (conversation) => {
          setConversations((prev) => [...prev, conversation]);
          toast.info("A new conversation has been started!");
        });
      })
      .catch((err) => console.error("Error starting SignalR connection:", err));

    // Cleanup when component unmounts (optional)
    return () => {
      newConnection.stop();
    };
  }, [token, selectedConversation]);

  // Fetch user's conversations
  const getConversationsMy = async () => {
    try {
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await axios.get("http://localhost:5002/api/Conversations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(response.data)) {
        setConversations(response.data);
      } else {
        setConversations([]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations.");
      setConversations([]);
    }
  };

  useEffect(() => {
    getConversationsMy();
  }, [token]);

  // Handle conversation selection
  const selectConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      setMessagesList([]);

      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await axios.get(
        `http://localhost:5002/api/Messages/${conversation.conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (Array.isArray(response.data)) {
        setMessagesList(response.data);
      } else {
        toast.warning("No messages found for this conversation.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages for the selected conversation.");
    }
  };

  // Handle sending messages
  const sendMessage = async (event) => {
    event.preventDefault();

    if (message.trim() && selectedConversation) {
      const newMessage = {
        senderId: userId,
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessagesList((prevMessages) => [...prevMessages, newMessage]);
      setMessage(""); // Clear input field

      try {
        await axios.post(
          `http://localhost:5002/api/messages/send`,
          {
            conversationId: selectedConversation.conversationId,
            content: message,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("Error sending message:", err);
        toast.error("Failed to send message. Please try again.");
      }
    } else {
      toast.error("Please select a conversation or type a message.");
    }
  };

  const togglePopup = () => {
    setShowNewConvo((prevState) => !prevState);
  };

  return (
    <>
      <section className="chatHome">
        <div className="container">
          <div className="conversations">
            <button
              type="button"
              className="NewConversation"
              onClick={togglePopup}
            >
              <div>
                <div className="icon-conversations">
                  <CiCirclePlus size={24} />
                </div>
                New Conversation
              </div>
            </button>

            {conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  key={index}
                  className={`conversationItem ${
                    selectedConversation?.conversationId === conversation.conversationId
                      ? "activeConversation"
                      : ""
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <i className="fa-regular fa-message"></i>
                  <p>{conversation.receiverUsername}</p>
                </div>
              ))
            ) : (
              <p>No conversations found.</p>
            )}

            <div className="userActions">
              <div className="Profile">
                <i className="fa-regular fa-user"></i>
                <p>Profile</p>
              </div>
              <div className="Logout">
                <i className="fa-solid fa-right-from-bracket"></i>
                <p>Logout</p>
              </div>
            </div>
          </div>

          <div className="chatContent">
            <div className="chatHeader">
              <h2>
                {selectedConversation
                  ? selectedConversation.receiverUsername
                  : "Select a conversation or start a new one"}
              </h2>
            </div>
            <ul id="messagesList" className="messagesList">
              {messagesList.map((msg, index) => {
                const isUserMessage = String(msg.senderId) === String(userId);
                return (
                  <li
                    key={index}
                    className={`message ${
                      isUserMessage ? "userMessage" : "senderMessage"
                    } fade-in`}
                  >
                    <span className="messageSender">
                      {isUserMessage ? "You" : msg.senderUsername || "Them"}
                    </span>
                    <span className="messageContent">
                      {msg.content || "No content"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="messageInput">
              <input
                type="text"
                id="messageInput"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                ref={messageInputRef}
              />
              <button
                id="sendButton"
                ref={sendButtonRef}
                onClick={sendMessage}
                aria-label="Send Message"
              >
                <BsSend size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showNewConvo && (
        <NewConvo
          togglePopup={togglePopup}
          updateConversations={setConversations}
          conversations={conversations}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default DashboardPage;*/