import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";

import Input from "../components/UI/Input";
import Checkbox from "../components/UI/Checkbox";
import Button from "../components/UI/Button";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Navigation handled by AuthContext
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Please check your credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  // animations
  const logoScale = React.useRef(new Animated.Value(1)).current;
  const cardTranslate = React.useRef(new Animated.Value(30)).current;
  const cardOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.04,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 12000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, cardTranslate, cardOpacity]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" />

        <Animated.Image
          source={require("../../assets/splash.png")}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]}
        />
        <Animated.View
          style={{
            transform: [{ translateY: cardTranslate }],
            opacity: cardOpacity,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue your learning journey
          </Text>

          <Input
            placeholder="Email"
            value={email}
            onChangeText={(val) => {
              setEmail(val);
              const rx = /^\S+@\S+\.\S+$/;
              setEmailError(
                !val || rx.test(val) ? "" : "Invalid email address"
              );
            }}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text style={{ color: "#e53935", marginBottom: 6 }}>
              {emailError}
            </Text>
          ) : null}
          <Input
            placeholder="Password"
            value={password}
            onChangeText={(val) => {
              setPassword(val);
              setPasswordError(
                !val || val.length >= 6
                  ? ""
                  : "Password must be at least 6 characters"
              );
            }}
            secureTextEntry
          />
          {passwordError ? (
            <Text style={{ color: "#e53935", marginBottom: 6 }}>
              {passwordError}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: 420,
            }}
          >
            <Checkbox
              label="Remember me"
              checked={remember}
              onToggle={(v) => setRemember(v)}
            />
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Reset password",
                  "Use the web portal to reset your password."
                )
              }
            >
              <Text style={{ color: "#05b5ff", fontWeight: "600" }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", maxWidth: 420, marginTop: 18 }}>
            <Button
              title={loading ? "Logging in..." : "Login"}
              onPress={handleLogin}
              style={{
                opacity: loading || !!emailError || !!passwordError ? 0.7 : 1,
              }}
              disabled={loading || !!emailError || !!passwordError}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 22 }}
          >
            <Text style={styles.link}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 96,
    height: 96,
    resizeMode: "contain",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 18,
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
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
