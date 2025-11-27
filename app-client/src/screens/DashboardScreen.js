import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{user?.email}</Text>
        </Text>
        <Text style={styles.label}>
          Role: <Text style={styles.value}>{user?.role}</Text>
        </Text>

        <View style={styles.info}>
          <Text style={styles.infoText}>
            This is a protected screen. Only authenticated users can access
            this.
          </Text>
          <Text style={styles.infoText}>
            Dashboard content to be implemented.
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Aptitude Practice</Text>
        <Text style={styles.sectionSubtitle}>
          Sharpen your Quantitative, Logical, and Verbal reasoning with curated
          aptitude sets.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("AptitudePractice")}
        >
          <Text style={styles.ctaButtonText}>Start Aptitude Practice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaButton, { marginTop: 10, backgroundColor: "#444" }]}
          onPress={() => navigation.navigate("AptitudeStats")}
        >
          <Text style={styles.ctaButtonText}>View Your Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Communication Coach</Text>
        <Text style={styles.sectionSubtitle}>
          Practice English speaking with an AI tutor. Improve fluency, interview
          skills, and technical communication.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Communication")}
        >
          <Text style={styles.ctaButtonText}>Start Communication Practice</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  value: {
    color: "#000",
    fontWeight: "500",
  },
  info: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
