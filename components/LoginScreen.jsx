import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useUser } from "@clerk/clerk-expo";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [error, setError] = useState(null);
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { setActive } = useSignIn();
  const { isSignedIn } = useUser();

  /** Handle OAuth login **/
  const onPress = useCallback(async () => {
    try {
      console.log(" Starting OAuth flow...");
      const { createdSessionId } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        console.log(" Session activated!");
      } else {
        console.error("⚠️ No Session ID created.");
      }
    } catch (err) {
      console.error(" Authentication error:", err);
      setError("Authentication failed. Please try again.");
    }
  }, [startOAuthFlow, setActive]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/bike.jpg")}
          style={styles.image}
        />
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.heading}>
          Your Ultimate{" "}
          <Text style={styles.highlightedText}>
            Goods Renting Or Buying Partner
          </Text>{" "}
          App
        </Text>
        <Text style={styles.description}>Find Your Needed Product</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isSignedIn && (
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>Let's Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 450,
    borderRadius: 20,
    borderWidth: 8,
    borderColor: "#000",
  },
  subContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: -20,
    width: "90%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 30,
    fontFamily: "outfit-bold",
    textAlign: "center",
  },
  highlightedText: {
    color: "blue",
  },
  description: {
    fontSize: 15,
    fontFamily: "outfit",
    textAlign: "center",
    marginVertical: 15,
    color: "gray",
  },
  btn: {
    backgroundColor: "blue",
    padding: 16,
    borderRadius: 99,
    marginTop: 20,
  },
  btnText: {
    textAlign: "center",
    fontFamily: "outfit",
    color: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
