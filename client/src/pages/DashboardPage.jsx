import React, { useState, useEffect, useRef } from "react";
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
      .withUrl("https://localhost:7052/chathub", {
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
            // If the message isn't for the currently selected conversation
            console.log("New message for another conversation:", msg);
            console.log(selectedConversation);
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

      const response = await axios.get("https://localhost:7052/api/Conversations/my", {
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
        `https://localhost:7052/api/Messages/${conversation.conversationId}`,
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
          `https://localhost:7052/api/messages/send`,
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
                  <p>{userId === conversation.user1Id ? conversation.user2UserName : conversation.user1UserName}</p>
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

export default DashboardPage;