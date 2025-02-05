import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";

export default function Price({ business }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price</Text>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.description}>
          {business?.price || "No Price available."}
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
    fontSize: 20,
    marginTop: -5,
  },
  scrollContainer: {
    marginTop: 10,
  },
  description: {
    fontFamily: "outfit-bold",
    lineHeight: 28,
    fontSize: 20,
  },
});
