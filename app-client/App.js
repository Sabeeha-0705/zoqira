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
import CommunicationScreen from "./src/screens/CommunicationScreen";
import LoadingScreen from "./src/screens/LoadingScreen";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
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
