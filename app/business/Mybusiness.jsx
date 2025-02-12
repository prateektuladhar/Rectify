import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../utils/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import BusinessListCard from "../../components/BusinessList/BusinessListCard";
import { useNavigation } from "expo-router";

export default function Mybusiness() {
  const { user } = useUser();
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "My Item",
      headerStyle: {
        backgroundColor: "#CBC3E3",
      },
    });
    if (user) {
      GetUserBusiness();
    }
  }, [user]);

  const GetUserBusiness = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const q = query(
        collection(db, "List"),
        where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
      );

      const querySnapshot = await getDocs(q);
      const businesses = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });

      setBusinessList(businesses);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setError("Failed to load businesses. Please try again.");
    }
    setLoading(false);
  };

  // Render loading indicator if still fetching
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle case where no businesses are found
  if (!loading && businessList.length === 0) {
    return (
      <View
        style={{
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No Item found.</Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 30 }}>My Item</Text>
      <FlatList
        data={businessList}
        onRefresh={GetUserBusiness}
        refreshing={loading}
        keyExtractor={(item) => item.id} // Use `id` as key
        renderItem={({ item }) => <BusinessListCard business={item} />}
      />
    </View>
  );
}
