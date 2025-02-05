import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function CategoryItem({ category, onCategoryPress }) {
  const placeholderImage = "https://via.placeholder.com/40";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onCategoryPress(category)}
        activeOpacity={0.7}
        accessible
        accessibilityLabel={`Category: ${category.name}`}
        accessibilityHint="Tap to view items in this category"
      >
        <Image
          source={{ uri: category.icon || placeholderImage }}
          style={styles.icon}
          onError={({ nativeEvent }) => {
            console.error(
              `Failed to load image for category '${category.name}': ${nativeEvent.error}`
            );
          }}
        />
        <Text style={styles.name} numberOfLines={1}>
          {category.name?.trim() || "Unnamed Category"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  name: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "outfit-medium",
    color: "#333",
  },
});
