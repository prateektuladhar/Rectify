import { View, Text, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Category from "@components/Home/Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@utils/FirebaseConfig";
import BusinessListCard from "@components/Explore/BusinessListCard";
import { FlatList } from "react-native";

export default function Explore() {
  const [businessList, setBusinessList] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBusinesses = async (category = null) => {
    setLoading(true);
    setBusinessList([]);
    setFilteredBusinesses([]);
    try {
      let q = collection(db, "List");
      if (category) {
        q = query(q, where("Category", "==", category));
      }
      const querySnapshot = await getDocs(q);
      const businesses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinessList(businesses);
      setFilteredBusinesses(businesses);
    } catch (error) {
      console.error("Error fetching Item: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Header Component
  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Explore More</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="#ADD8E6" />
        <TextInput
          placeholder="Search Item..."
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            setFilteredBusinesses(
              text.trim() === ""
                ? businessList
                : businessList.filter((b) =>
                    b.name.toLowerCase().includes(text.toLowerCase())
                  )
            );
          }}
          style={styles.searchInput}
        />
      </View>
      <Category explore={true} onCategorySelect={fetchBusinesses} />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#ADD8E6" />}

      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BusinessListCard business={item} />}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyMessage}>No Item found.</Text>
          ) : null
        }
        ListHeaderComponent={<ListHeader />}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    backgroundColor: "#fff",
    padding: 15,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
  searchInput: {
    fontFamily: "outfit",
    fontSize: 16,
    flex: 1,
  },
  emptyMessage: {
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "gray",
  },
});
