import { View, Text, FlatList } from "react-native";
import React from "react";
import BusinessListCard from "./BusinessListCard";

export default function ExploreBusinessList({ businessList }) {
  return (
    <View style={{ flex: 1, paddingBottom: 20 }}>
      <FlatList
        data={businessList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BusinessListCard business={item} />}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No businesses available.
          </Text>
        }
      />
    </View>
  );
}

