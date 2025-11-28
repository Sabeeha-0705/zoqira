import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <Image
        source={require("../../assets/zoqira_logo.png")}
        style={styles.logo}
      />
      <View style={styles.welcomeCard}>
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

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.sectionTitle}>Programming Practice</Text>
        <Text style={styles.sectionSubtitle}>Coding module – coming soon.</Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() =>
            Alert.alert(
              "Coming soon",
              "Programming Practice will be available soon!"
            )
          }
        >
          <Text style={styles.ctaButtonText}>Start</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  card: {
    backgroundColor: "#f5faff",
    borderRadius: 10,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 8,
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
    padding: 12,
    backgroundColor: "#fff",
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
    backgroundColor: "#000",
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
