import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Category from "@/components/Home/Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import ExploreBusinessList from "../../components/Explore/ExploreBusinessList";

export default function Explore() {
  const [businessList, setBusinessList] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState(null);

  // Fetch businesses based on category
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
      const businesses = [];
      querySnapshot.forEach((doc) => {
        businesses.push({ id: doc.id, ...doc.data() });
      });
      setBusinessList(businesses);
      setFilteredBusinesses(businesses);
    } catch (error) {
      console.error("Error fetching Item: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    fetchBusinesses(category);
  };

  // Handle search term change
  const handleSearch = (text) => {
    setSearchTerm(text);

    // Filter the list based on the search term
    if (text.trim() === "") {
      setFilteredBusinesses(businessList);
    } else {
      const filtered = businessList.filter((business) =>
        business.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredBusinesses(filtered);
    }
  };

  // Fetch all businesses on initial load
  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore More</Text>

      {/* SearchBar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color="#ADD8E6" />
        <TextInput
          placeholder="Search Item..."
          value={searchTerm}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Category Selection */}
      <Category explore={true} onCategorySelect={handleCategorySelect} />

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#ADD8E6" />}

      {/* Business List or Empty State */}
      {!loading && filteredBusinesses.length === 0 && (
        <Text style={styles.emptyMessage}>No Item found.</Text>
      )}
      {!loading && <ExploreBusinessList businessList={filteredBusinesses} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 30,
  },
  searchBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
  },
  searchInput: {
    fontFamily: "outfit",
    fontSize: 16,
    width: "90%",
  },
  emptyMessage: {
    fontFamily: "outfit",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    color: "gray",
  },
});
