import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function PopularBusinessCard({ business }) {
  const router = useRouter();

  // Calculate average rating using reduce
  const averageRating =
    business.Reviews?.reduce((acc, review) => acc + review.rating, 0) /
      (business.Reviews?.length || 1) || 0;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/businessdetail/${business.id}`)} // Navigate to dynamic route
      activeOpacity={0.7}
      style={styles.card}
      accessible
      accessibilityLabel={`View details for ${business.name}`}
    >
      {/* Business Image */}
      <Image
        source={{
          uri: business?.imageUrl || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        {/* Business Name */}
        <Text style={styles.name} numberOfLines={1}>
          {business.name || "Unnamed Business"}
        </Text>

        {/* Business Address */}
        <Text style={styles.address} numberOfLines={1}>
          {business.Address || "Address not available"}
        </Text>

        {/* Row for Rating and Category */}
        <View style={styles.row}>
          {/* Ratings */}
          <View style={styles.rating}>
            <Image
              source={require("./../../assets/images/star.png")}
              style={styles.starIcon}
            />
            <Text style={styles.ratingText}>
              {averageRating.toFixed(1)} {/* Format to 1 decimal place */}
            </Text>
          </View>

          {/* Category */}
          <Text style={styles.category}>
            {business.Category || "Uncategorized"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Add shadow for Android
    width: 170, // Ensure consistent card width
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 15,
  },
  info: {
    marginTop: 7,
    gap: 5,
  },
  name: {
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
  address: {
    fontFamily: "outfit",
    fontSize: 14,
    color: "gray",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
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
    fontSize: 14,
    color: "#444",
  },
  category: {
    fontFamily: "outfit",
    backgroundColor: "purple",
    color: "#fff",
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});
