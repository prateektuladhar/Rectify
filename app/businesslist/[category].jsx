import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
// import { collection, query } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@utils/FirebaseConfig";
import { FlatList } from "react-native";
import BusinessListCard from "@components/BusinessList/BusinessListCard";

export default function BusinesslistByCategory() {
  const navigation = useNavigation();
  const { category } = useLocalSearchParams();
  const [businessList, setBusinessList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category,
    });
    getBusinessList();
  }, []);
  /**
   * used to get  list by category
   */

  const getBusinessList = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "List"),
        where("Category", "==", category)
      );
      const querySnapshot = await getDocs(q);

      const businesses = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc?.id, ...doc.data() });
      });

      setBusinessList(businesses);
    } catch (e) {
      console.error("Error fetching Item list:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {businessList?.length > 0 && loading == false ? (
        <FlatList
          data={businessList}
          onRefresh={() => getBusinessList()}
          refreshing={loading}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item, index }) => (
            <BusinessListCard business={item} key={index} />
          )}
        />
      ) : loading ? (
        <ActivityIndicator
          style={{
            marginTop: "65%",
          }}
          size={"large"}
          color={"blue"}
        />
      ) : (
        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit-bold",
            color: "gray",
            marginTop: "50%",
            textAlign: "center",
          }}
        >
          No Item Found
        </Text>
      )}
    </View>
  );
}
