import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./src/context/AuthContext";
import { useAuth } from "./src/context/AuthContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AptitudePracticeScreen from "./src/screens/AptitudePracticeScreen";
import AptitudeStatsScreen from "./src/screens/AptitudeStatsScreen";
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, Alert } from 'react-native';
import CommunicationScreen from "./src/screens/CommunicationScreen";
import LoadingScreen from "./src/screens/LoadingScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading, logout } = useAuth();
  // simple menu via native Alert (keeps navigation logic unchanged)

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <React.Fragment>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#000000",
            height: 72,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            color: "#05b5ff",
          },
          headerLeft: () => (
            <View style={{ paddingLeft: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image source={require('./assets/zoqira_logo.png')} style={{ width: 34, height: 34, resizeMode: 'contain' }} />
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#05b5ff' }}>ZOQIRA</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert('Menu', 'Choose an option', [
                  { text: 'Help', onPress: () => navigation.navigate('Communication') },
                  { text: 'Logout', onPress: () => logout && logout(), style: 'destructive' },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
              style={{ padding: 8 }}
            >
              <View style={{ width: 18, height: 14, justifyContent: 'space-between' }}>
                <View style={{ height: 2, backgroundColor: '#fff', borderRadius: 2 }} />
                <View style={{ height: 2, backgroundColor: '#fff', borderRadius: 2 }} />
                <View style={{ height: 2, backgroundColor: '#fff', borderRadius: 2 }} />
              </View>
            </TouchableOpacity>
          ),
        })}
    >
      {user ? (
        // Authenticated Stack
        <>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "ZOQIRA Dashboard" }}
          />
          <Stack.Screen
            name="AptitudePractice"
            component={AptitudePracticeScreen}
            options={{ title: "Aptitude Practice" }}
          />
          <Stack.Screen
            name="AptitudeStats"
            component={AptitudeStatsScreen}
            options={{ title: "Your Aptitude Stats" }}
          />
          <Stack.Screen
            name="Communication"
            component={CommunicationScreen}
            options={{ title: "Communication Coach" }}
          />
        </>
      ) : (
        // Public Stack
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "ZOQIRA" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Register" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
