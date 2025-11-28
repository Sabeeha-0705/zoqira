import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen({ navigation }) {
  const heroScale = React.useRef(new Animated.Value(1)).current;
  const textY = React.useRef(new Animated.Value(18)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroScale, {
          toValue: 1.03,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(heroScale, {
          toValue: 1,
          duration: 10000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(textY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroScale, textY, textOpacity]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" />
        <Animated.Image
          source={
            // prefer student image if available
            (() => {
              try {
                // eslint-disable-next-line global-require, import/no-dynamic-require
                return require("../../assets/student_grad.png");
              } catch (e) {
                return require("../../assets/splash.png");
              }
            })()
          }
          style={[styles.hero, { transform: [{ scale: heroScale }] }]}
        />

        <Animated.View
          style={{
            transform: [{ translateY: textY }],
            opacity: textOpacity,
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>The Best Online Learning Platform</Text>
          <Text style={styles.subtitle}>BEST ONLINE COURSES</Text>
          <Text style={styles.slogan}>
            Learn industry-grade IT skills with hands-on practice and expert
            mentors. Take your career to the next level — courses, projects and
            live feedback.
          </Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.btnPrimary]}
            onPress={() => navigation.navigate("About")}
          >
            <Text style={styles.btnPrimaryText}>Read More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.btnOutline]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.btnOutlineText}>Join Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 6,
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginBottom: 12,
  },
  hero: {
    width: "100%",
    height: 260,
    marginBottom: 16,
    resizeMode: "cover",
    borderRadius: 18,
  },
  slogan: {
    fontSize: 16,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  actionButton: {
    width: "100%",
    maxWidth: 360,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  btnPrimary: {
    backgroundColor: "#295BFF",
    shadowColor: "#295BFF",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 3,
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#295BFF",
  },
  btnOutlineText: { color: "#295BFF", fontWeight: "800", fontSize: 16 },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#1a1a1a",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutlineText: {
    color: "#1a1a1a",
  },
});
