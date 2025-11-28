import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // enforce password rules
    const checks = getPasswordChecks(password);
    const allGood = Object.values(checks).every(Boolean);
    if (!allGood) {
      Alert.alert(
        "Error",
        "Password does not meet required rules (8+ chars, upper, lower, number, special)"
      );
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      // Navigation handled by AuthContext
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message || "Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPasswordChecks = (pw) => ({
    minLen: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  });

  const calcStrength = (pw) => {
    if (!pw) return { score: 0, label: "Too short", color: "#e53935" };
    const checks = getPasswordChecks(pw);
    const passed = Object.values(checks).filter(Boolean).length;
    const score = Math.round((passed / Object.keys(checks).length) * 100);
    let label = "Very weak";
    let color = "#e53935";
    if (score >= 80) {
      label = "Strong";
      color = "#2e7d32";
    } else if (score >= 60) {
      label = "Good";
      color = "#1e88e5";
    } else if (score >= 40) {
      label = "Fair";
      color = "#f57c00";
    }
    return { score, label, color };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../../assets/zoqira_logo.png")}
        style={styles.hero}
        resizeMode="contain"
      />
      <Text style={styles.title}>Create an account</Text>

      <Input
        placeholder="Full Name"
        value={name}
        onChangeText={(val) => {
          setName(val);
          setNameError(val.trim() ? "" : "Please enter your full name");
        }}
      />
      {nameError ? (
        <Text style={{ color: "#e53935", marginBottom: 6 }}>{nameError}</Text>
      ) : null}

      <Input
        placeholder="Email"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          const rx = /^\S+@\S+\.\S+$/;
          setEmailError(
            !val || rx.test(val) ? "" : "Please enter a valid email"
          );
        }}
        keyboardType="email-address"
      />
      {emailError ? (
        <Text style={{ color: "#e53935", marginBottom: 6 }}>{emailError}</Text>
      ) : null}

      <Input
        placeholder="Password"
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          const checks = getPasswordChecks(val);
          const all = Object.values(checks).every(Boolean);
          setPasswordError(all ? "" : "Password must meet required rules");
        }}
        secureTextEntry
      />
      {/* strength meter */}
      {password ? (
        (() => {
          const s = calcStrength(password);
          return (
            <View style={{ marginVertical: 8 }}>
              <View
                style={{
                  height: 8,
                  width: "100%",
                  backgroundColor: "#eef6ff",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${s.score}%`,
                    height: "100%",
                    backgroundColor: s.color,
                  }}
                />
              </View>
              <Text style={{ color: s.color, marginTop: 6, fontWeight: "700" }}>
                {s.label} ({s.score}%)
              </Text>
            </View>
          );
        })()
      ) : (
        <Text style={{ color: "#777", marginBottom: 8 }}>
          Use a strong password (8+ chars, upper + lower + number + special).
        </Text>
      )}

      {/* rule list */}
      <View style={{ marginBottom: 8 }}>
        {(() => {
          const checks = getPasswordChecks(password);
          const items = [
            ["minLen", "At least 8 characters"],
            ["upper", "One uppercase letter"],
            ["lower", "One lowercase letter"],
            ["number", "A number"],
            ["special", "A special character"],
          ];
          return items.map(([k, label]) => (
            <View
              key={k}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginVertical: 4,
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  backgroundColor: checks[k] ? "#2e7d32" : "transparent",
                  borderWidth: checks[k] ? 0 : 1,
                  borderColor: checks[k] ? "transparent" : "#ddd",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {checks[k] ? (
                  <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
                ) : null}
              </View>
              <Text style={{ color: checks[k] ? "#2e7d32" : "#777" }}>
                {label}
              </Text>
            </View>
          ));
        })()}
      </View>
      {passwordError ? (
        <Text style={{ color: "#e53935", marginBottom: 6 }}>
          {passwordError}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.button,
          (loading || !!nameError || !!emailError || !!passwordError) &&
            styles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading || !!nameError || !!emailError || !!passwordError}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>Already have an account? Login here</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  hero: {
    width: "100%",
    height: 160,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#1a1a1a",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
