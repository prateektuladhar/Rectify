import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import LoginScreen from "../components/LoginScreen";
import * as SecureStore from "expo-secure-store";

// Token Cache for Clerk Authentication
const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("Secure Store get item error:", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`${key} saved successfully.`);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    outfit: require("./../assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("./../assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("./../assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} 
    >
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SignedIn>

      <SignedOut>
        <LoginScreen />
      </SignedOut>
    </ClerkProvider>
  );
}
