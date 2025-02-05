import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";

export default function About({ business }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.description}>
          {business?.About || "No description available."}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    marginTop: -10,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 15,
    marginTop: -5,
  },
  scrollContainer: {
    marginTop: 10,
  },
  description: {
    fontFamily: "outfit",
    lineHeight: 25,
  },
});
