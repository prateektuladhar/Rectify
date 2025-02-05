import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import BusinessListCard from "./BusinessListCard";

export default function ExploreBusinessList({ businessList }) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!businessList || businessList.length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  }, [businessList]);

  return (
    <ScrollView>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
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
      )}
      <View style={{ height: 400 }} />
    </ScrollView>
  );
}
