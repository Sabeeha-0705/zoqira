import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { communicationService } from "../services/communication.service";

const Communication = () => {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    level: "beginner",
    goal: "fluency",
    preferredAccent: "",
  });

  // Conversation state
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [listeningMode, setListeningMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load profile and conversations on mount
  useEffect(() => {
    loadProfile();
    loadConversations();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await communicationService.getProfile();
      setProfile(res.data);
      setProfileForm({
        level: res.data.level,
        goal: res.data.goal,
        preferredAccent: res.data.preferredAccent || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await communicationService.getConversations();
      setConversations(res.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const updates = {
        level: profileForm.level,
        goal: profileForm.goal,
      };
      if (profileForm.preferredAccent) {
        updates.preferredAccent = profileForm.preferredAccent;
      }

      const res = await communicationService.updateProfile(updates);
      setProfile(res.data);
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (context) => {
    try {
      setLoading(true);
      const res = await communicationService.startConversation(context);
      setActiveConversation(res.data);
      setMessageInput("");
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      setLoading(true);
      const tempMessage = messageInput;
      setMessageInput("");

      const res = await communicationService.sendMessage(
        activeConversation._id,
        tempMessage
      );
      setActiveConversation(res.data);

      // Refresh conversations list
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageInput(tempMessage); // Restore message on error
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessageInput("");
  };

  const getConversationTitle = (conversation) => {
    const contextLabel =
      conversation.context.charAt(0).toUpperCase() +
      conversation.context.slice(1);
    const date = new Date(conversation.createdAt).toLocaleDateString();
    return `${contextLabel} · ${date}`;
  };

  const handleMicClick = () => {
    // TODO: Implement actual speech recognition
    setListeningMode(!listeningMode);
    if (!listeningMode) {
      console.log("🎤 Voice input coming soon!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Communication Coach</h1>

      <div style={styles.layout}>
        {/* Left Sidebar */}
        <div style={styles.sidebar}>
          {/* Profile Settings */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Practice Settings</h3>

            {editingProfile ? (
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Level</label>
                  <select
                    value={profileForm.level}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, level: e.target.value })
                    }
                    style={styles.input}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Goal</label>
                  <input
                    type="text"
                    placeholder="e.g., interview, fluency, IELTS"
                    value={profileForm.goal}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, goal: e.target.value })
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Preferred Accent (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., US, UK, Neutral"
                    value={profileForm.preferredAccent}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        preferredAccent: e.target.value,
                      })
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.buttonGroup}>
                  <button
                    onClick={handleProfileUpdate}
                    style={styles.saveButton}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    style={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.profileDisplay}>
                <p>
                  <strong>Level:</strong> {profile?.level || "loading..."}
                </p>
                <p>
                  <strong>Goal:</strong> {profile?.goal || "loading..."}
                </p>
                {profile?.preferredAccent && (
                  <p>
                    <strong>Accent:</strong> {profile.preferredAccent}
                  </p>
                )}
                <button
                  onClick={() => setEditingProfile(true)}
                  style={styles.editButton}
                >
                  Edit Settings
                </button>
              </div>
            )}
          </div>

          {/* Conversation History */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Recent Conversations</h3>
            {conversations.length === 0 ? (
              <p style={styles.emptyText}>
                No conversations yet. Start one below!
              </p>
            ) : (
              <div style={styles.conversationList}>
                {conversations.map((conv) => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    style={{
                      ...styles.conversationItem,
                      backgroundColor:
                        activeConversation?._id === conv._id
                          ? "#e8f4f8"
                          : "#f9f9f9",
                      borderLeft:
                        activeConversation?._id === conv._id
                          ? "4px solid #0066cc"
                          : "4px solid #ddd",
                    }}
                  >
                    {getConversationTitle(conv)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={styles.mainArea}>
          {activeConversation ? (
            <>
              <div style={styles.chatHeader}>
                <h2 style={styles.chatTitle}>
                  {activeConversation.context.charAt(0).toUpperCase() +
                    activeConversation.context.slice(1)}{" "}
                  Practice
                </h2>
              </div>

              <div style={styles.messagesContainer}>
                {activeConversation.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.message,
                        backgroundColor:
                          msg.role === "user" ? "#0066cc" : "#e0e0e0",
                        color: msg.role === "user" ? "#fff" : "#000",
                      }}
                    >
                      <p style={styles.messageContent}>{msg.content}</p>
                      <span style={styles.timestamp}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.inputArea}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  style={styles.messageInput}
                  disabled={loading}
                />
                <button
                  onClick={handleMicClick}
                  title="Voice input coming soon"
                  style={{
                    ...styles.micButton,
                    backgroundColor: listeningMode ? "#ff6b6b" : "#666",
                  }}
                >
                  🎤
                </button>
                <button
                  onClick={handleSendMessage}
                  style={styles.sendButton}
                  disabled={loading || !messageInput.trim()}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <h2>Start a New Conversation</h2>
              <p>
                Choose a practice context to begin your English coaching
                session.
              </p>
              <div style={styles.contextButtons}>
                <button
                  onClick={() => handleStartConversation("general")}
                  style={styles.contextButton}
                  disabled={loading}
                >
                  💬 General Chat
                </button>
                <button
                  onClick={() => handleStartConversation("interview")}
                  style={styles.contextButton}
                  disabled={loading}
                >
                  💼 Interview Practice
                </button>
                <button
                  onClick={() => handleStartConversation("technical")}
                  style={styles.contextButton}
                  disabled={loading}
                >
                  ⚙️ Technical Discussion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1a1a1a",
  },
  layout: {
    display: "flex",
    gap: "20px",
    height: "calc(100vh - 120px)",
  },
  sidebar: {
    width: "320px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "0",
    marginBottom: "12px",
    color: "#1a1a1a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  saveButton: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "#0066cc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  cancelButton: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  profileDisplay: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#333",
  },
  editButton: {
    marginTop: "12px",
    padding: "8px 12px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    width: "100%",
  },
  emptyText: {
    fontSize: "13px",
    color: "#999",
    margin: "0",
  },
  conversationList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  conversationItem: {
    padding: "10px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "background-color 0.2s",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  chatHeader: {
    padding: "16px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  chatTitle: {
    margin: "0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "8px",
  },
  message: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: "8px",
    wordWrap: "break-word",
  },
  messageContent: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  timestamp: {
    fontSize: "11px",
    opacity: "0.7",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "16px",
    borderTop: "1px solid #ddd",
    backgroundColor: "#f9f9f9",
  },
  messageInput: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  micButton: {
    padding: "10px 14px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    backgroundColor: "#666",
    color: "#fff",
    transition: "background-color 0.2s",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#0066cc",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
  contextButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  },
  contextButton: {
    padding: "12px 20px",
    backgroundColor: "#0066cc",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "160px",
  },
};

export default Communication;
