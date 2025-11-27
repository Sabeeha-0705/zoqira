import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function CommunicationScreen({ navigation }) {
  const { user } = useAuth();

  // Profile state
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    level: "beginner",
    goal: "fluency",
    preferredAccent: "",
  });

  // Conversation state
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load profile and conversations on mount
  useEffect(() => {
    loadProfile();
    loadConversations();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/communication/profile/me");
      setProfile(res.data.data);
      setProfileForm({
        level: res.data.data.level,
        goal: res.data.data.goal,
        preferredAccent: res.data.data.preferredAccent || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    }
  };

  const loadConversations = async () => {
    try {
      const res = await api.get("/communication/conversations");
      setConversations(res.data.data);
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

      const res = await api.put("/communication/profile/me", updates);
      setProfile(res.data.data);
      setShowProfileModal(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (context) => {
    try {
      setLoading(true);
      const res = await api.post("/communication/conversations", { context });
      setActiveConversation(res.data.data);
      setMessageInput("");
    } catch (error) {
      console.error("Error starting conversation:", error);
      Alert.alert("Error", "Failed to start conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return;

    try {
      setLoading(true);
      const res = await api.post(
        `/communication/conversations/${activeConversation._id}/message`,
        { content: messageInput.trim() }
      );
      setActiveConversation(res.data.data);
      setMessageInput("");
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    setMessageInput("");
  };

  const handleMicPress = () => {
    Alert.alert("Coming Soon", "🎤 Voice input coming soon!");
  };

  const renderContextButtons = () => (
    <View style={styles.contextButtonsContainer}>
      <TouchableOpacity
        style={styles.contextButton}
        onPress={() => handleStartConversation("general")}
        disabled={loading}
      >
        <Text style={styles.contextButtonText}>💬 General Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contextButton}
        onPress={() => handleStartConversation("interview")}
        disabled={loading}
      >
        <Text style={styles.contextButtonText}>💼 Interview</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contextButton}
        onPress={() => handleStartConversation("technical")}
        disabled={loading}
      >
        <Text style={styles.contextButtonText}>⚙️ Technical</Text>
      </TouchableOpacity>
    </View>
  );

  const renderConversationMessages = () => (
    <View style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderTitle}>
          {activeConversation.context.charAt(0).toUpperCase() +
            activeConversation.context.slice(1)}{" "}
          Practice
        </Text>
      </View>

      <FlatList
        data={activeConversation.messages}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              ...styles.messageWrapper,
              justifyContent: item.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <View
              style={{
                ...styles.message,
                backgroundColor: item.role === "user" ? "#0066cc" : "#e0e0e0",
              }}
            >
              <Text
                style={{
                  ...styles.messageText,
                  color: item.role === "user" ? "#fff" : "#000",
                }}
              >
                {item.content}
              </Text>
              <Text style={styles.messageTime}>
                {new Date(item.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
        style={styles.messagesList}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your message..."
          value={messageInput}
          onChangeText={setMessageInput}
          editable={!loading}
          multiline
        />
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleMicPress}
          disabled={loading}
        >
          <Text style={styles.micButtonText}>🎤</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!messageInput.trim() || loading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!messageInput.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.label}>Level</Text>
            <View style={styles.pickerContainer}>
              {["beginner", "intermediate", "advanced"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    profileForm.level === level && styles.optionButtonActive,
                  ]}
                  onPress={() => setProfileForm({ ...profileForm, level })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      profileForm.level === level && styles.optionTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., interview, fluency, IELTS"
              value={profileForm.goal}
              onChangeText={(text) =>
                setProfileForm({ ...profileForm, goal: text })
              }
            />

            <Text style={styles.label}>Preferred Accent (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., US, UK, Neutral"
              value={profileForm.preferredAccent}
              onChangeText={(text) =>
                setProfileForm({ ...profileForm, preferredAccent: text })
              }
            />

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleProfileUpdate}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowProfileModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Content */}
      {activeConversation ? (
        renderConversationMessages()
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Profile</Text>
              <TouchableOpacity onPress={() => setShowProfileModal(true)}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            {profile ? (
              <>
                <Text style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Level:</Text>{" "}
                  {profile.level}
                </Text>
                <Text style={styles.profileItem}>
                  <Text style={styles.profileLabel}>Goal:</Text> {profile.goal}
                </Text>
                {profile.preferredAccent && (
                  <Text style={styles.profileItem}>
                    <Text style={styles.profileLabel}>Accent:</Text>{" "}
                    {profile.preferredAccent}
                  </Text>
                )}
              </>
            ) : (
              <ActivityIndicator color="#0066cc" size="large" />
            )}
          </View>

          {/* Start Conversation */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Start a New Conversation</Text>
            <Text style={styles.cardSubtitle}>
              Choose a practice context to begin your English coaching session.
            </Text>
            {renderContextButtons()}
          </View>

          {/* Recent Conversations */}
          {conversations.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Conversations</Text>
              {conversations.map((conv) => (
                <TouchableOpacity
                  key={conv._id}
                  style={styles.conversationListItem}
                  onPress={() => handleSelectConversation(conv)}
                >
                  <Text style={styles.conversationItemText}>
                    {conv.context.charAt(0).toUpperCase() +
                      conv.context.slice(1)}{" "}
                    · {new Date(conv.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.messageCount}>
                    {conv.messages.length} messages
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  editText: {
    color: "#0066cc",
    fontSize: 14,
    fontWeight: "600",
  },
  profileItem: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  profileLabel: {
    fontWeight: "600",
    color: "#555",
  },
  contextButtonsContainer: {
    gap: 10,
  },
  contextButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0066cc",
    borderRadius: 6,
    alignItems: "center",
  },
  contextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  conversationListItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: "#ddd",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationItemText: {
    fontSize: 13,
    color: "#1a1a1a",
    fontWeight: "500",
  },
  messageCount: {
    fontSize: 12,
    color: "#999",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#0066cc",
    borderColor: "#0066cc",
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  optionTextActive: {
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  modalButtonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#0066cc",
    borderRadius: 6,
    alignItems: "center",
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },

  // Chat Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 12,
  },
  message: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    opacity: 0.6,
  },
  inputArea: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#f9f9f9",
    gap: 8,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  micButtonText: {
    fontSize: 20,
  },
  sendButton: {
    width: 60,
    height: 44,
    borderRadius: 6,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
