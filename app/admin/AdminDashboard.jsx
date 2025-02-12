import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@utils/FirebaseConfig";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchClientsWithItems = async () => {
    setRefreshing(true);
    try {
      // Fetch all clients with role "client"
      const clientsQuery = query(
        collection(db, "clients"),
        where("role", "==", "client")
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const clients = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        items: [],
      }));

      // Fetch all items
      const itemsQuery = collection(db, "List");
      const itemsSnapshot = await getDocs(itemsQuery);
      const items = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Associate items with respective users & include isVerifiedPost field
      const clientsWithItems = clients.map((client) => ({
        ...client,
        items: items
          .filter((item) => item.userEmail === client.email)
          .map((item) => ({
            ...item,
            isVerifiedPost: item.isVerifiedPost || false, // Default false if not present
          })),
      }));

      setUsers(clientsWithItems);
    } catch (error) {
      console.error("🔥 Error fetching clients or items:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClientsWithItems();
  }, []);

  const onRefresh = useCallback(() => {
    fetchClientsWithItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.userName}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>

            {/* Display items uploaded by the user */}
            {item.items.length > 0 ? (
              <View style={styles.itemsContainer}>
                <Text style={styles.itemsTitle}>Uploaded Items:</Text>
                {item.items.map((uploadedItem) => (
                  <View key={uploadedItem.id} style={styles.itemRow}>
                    <Image
                      source={{ uri: uploadedItem.imageUrl }}
                      style={styles.itemImage}
                    />
                    <View>
                      <Text style={styles.itemName}>{uploadedItem.name}</Text>
                      <Text
                        style={[
                          styles.verificationStatus,
                          uploadedItem.isVerifiedPost
                            ? styles.verified
                            : styles.notVerified,
                        ]}
                      >
                        {uploadedItem.isVerifiedPost
                          ? "Verified "
                          : "Not Verified "}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noItems}>No items uploaded.</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noData}>No clients found.</Text>
        }
      />
    </View>
  );
}

/** Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
  },
  role: {
    fontSize: 14,
    fontWeight: "600",
    color: "green",
    marginTop: 5,
  },
  itemsContainer: {
    marginTop: 10,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 5,
  },
  itemsTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  itemName: {
    fontSize: 14,
    color: "#444",
  },
  verificationStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 3,
  },
  verified: {
    color: "green",
  },
  notVerified: {
    color: "red",
  },
  noItems: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
