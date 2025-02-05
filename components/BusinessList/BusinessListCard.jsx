import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function BusinessListCard({ business }) {
  const router = useRouter();

  // Calculate average rating dynamically if reviews exist
  const averageRating =
    business.Reviews?.reduce((acc, review) => acc + review.rating, 0) /
      (business.Reviews?.length || 1) || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/businessdetail/${business.id}`)}
    >
      <Image
        source={{
          uri: business?.imageUrl || "https://via.placeholder.com/120",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.address}>{business.address}</Text>
        <View style={styles.ratingContainer}>
          <Image
            source={require("./../../assets/images/star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    gap: 15,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  info: {
    flex: 1,
    gap: 7,
  },
  name: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  address: {
    fontFamily: "outfit",
    color: "gray",
    fontSize: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  ratingText: {
    fontFamily: "outfit-medium",
  },
});
