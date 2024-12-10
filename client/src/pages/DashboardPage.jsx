import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as signalR from "@microsoft/signalr";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiCirclePlus } from "react-icons/ci";
import "../styles/pages-style/DashboardPage.css";
import NewConvo from "../components/NewConvo";
import { BsSend } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Profile from "../components/Profile"; // Import Profile component

const DashboardPage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [conversations, setConversations] = useState([]);
  const [showNewConvo, setShowNewConvo] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false); // State to toggle profile popup
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messageInputRef = useRef(null);
  const sendButtonRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  // Logout function
  const logout = () => {
    localStorage.removeItem("userToken"); // Clear token
    navigate("/login"); // Redirect to login page
  };

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            selectedConversation.conversationId === msg.conversationId
          ) {
            setMessagesList((prev) => [
              ...prev,
              {
                conversationId: msg.conversationId,
                senderId: msg.senderId,
                content: msg.content,
                timestamp: msg.timestamp,
              },
            ]);
          } else {
            console.log("New message for another conversation:", msg);
          }
        });
  
        newConnection.on("ReceiveNewConversation", (conversation) => {
          // Remap the conversations array to include the new conversation at the end
          setConversations((prevConversations) => {
            const updatedConversations = [...prevConversations, conversation];
            return updatedConversations; // Return the new array with the added conversation at the end
          });
          toast.info("A new conversation has been started!");
        });
      })
      .catch((err) => console.error("Error starting SignalR connection:", err));
  
    return () => {
      newConnection.stop();
    };
  }, [token, selectedConversation]);
  

  // Scroll to bottom when messagesList updates
  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  // Fetch user's conversations
  const getConversationsMy = async () => {
    try {
      if (!token) {
        toast.error("You are not logged in.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5002/api/Conversations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      // Focus the message input field when a conversation is selected
      if (messageInputRef.current) {
        messageInputRef.current.focus();
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

  // Handle "Enter" key press to send message
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage(event);
    }
  };

  // Toggle profile popup
  const toggleProfilePopup = () => {
    setShowProfilePopup((prevState) => !prevState);
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
                <CiCirclePlus size={24} className="icon-conversations" />
                <span>New Conversation</span>
              </div>
            </button>
            {conversations.length > 0 ? (
              conversations.map((conversation, index) => (
                <div
                  key={index}
                  className={`conversationItem ${
                    selectedConversation?.conversationId ===
                    conversation.conversationId
                      ? "activeConversation"
                      : ""
                  }`}
                  onClick={() => selectConversation(conversation)}
                >
                  <div className="conversationDetails">
                    <FiMessageSquare size={24} className="conversationIcon" />
                    <p>
                      {userId === conversation.user1Id
                        ? conversation.user2UserName
                        : conversation.user1UserName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No conversations found.</p>
            )}

            <div className="userActions">
              <div className="Profile" onClick={toggleProfilePopup}>
                <LuUserRound size={20} className="userIcon" />
                <p>Profile</p>
              </div>
              <div className="Logout" onClick={logout}>
                <MdLogout size={20} className="logoutIcon" />
                <p>Logout</p>
              </div>
            </div>
          </div>

          <div className="chatContent">
            {selectedConversation ? (
              <>
                <ul id="messagesList" className="messagesList">
                  {messagesList.map((msg, index) => (
                    <li
                      key={index}
                      className={`message ${
                        String(msg.senderId) === String(userId)
                          ? "userMessage"
                          : "senderMessage"
                      } fade-in`}
                    >
                      <span className="messageContent">
                        {msg.content || "No content"}
                      </span>
                    </li>
                  ))}
                  <div ref={messagesEndRef} />
                </ul>

                <div className="messageInput">
                  <input
                    type="text"
                    id="messageInput"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    ref={messageInputRef}
                    onKeyDown={handleKeyPress} // Listen for Enter key press
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
              </>
            ) : (
              <div className="noConversationSelected">
                <p>Select a conversation or start a new one...</p>
              </div>
            )}
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

      {/* Profile Popup */}
      {showProfilePopup && (
        <Profile toggleProfile={toggleProfilePopup} />
      )}

      <ToastContainer />
    </>
  );
};

export default DashboardPage;
