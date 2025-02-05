import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "./../../utils/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Intro({ business }) {
  const { user } = useUser();
  const router = useRouter();

  const [liked, setLiked] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const loadLikedState = async () => {
      const storedLikedState = await AsyncStorage.getItem(
        `liked-${business?.id}`
      );
      if (storedLikedState !== null) {
        setLiked(JSON.parse(storedLikedState));
      }
    };

    const fetchUserRole = async () => {
      if (!user?.id) return;

      try {
        const userRef = doc(db, "clients", user.id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserRole(userSnap.data().role);
        }
      } catch (error) {
        console.error("🔥 Error fetching user role:", error.message);
      }
    };

    loadLikedState();
    fetchUserRole();
  }, [business?.id, user]);

  const toggleHeart = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    await AsyncStorage.setItem(
      `liked-${business?.id}`,
      JSON.stringify(newLikedState)
    );
  };

  const OnDelete = () => {
    Alert.alert(
      "Do you want to delete?",
      "Do you really want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteBusiness(),
        },
      ]
    );
  };

  const deleteBusiness = async () => {
    if (!business?.id) {
      console.log("Item ID is missing");
      ToastAndroid.show("Error: Item ID is missing!", ToastAndroid.LONG);
      return;
    }

    try {
      console.log("Deleting Item with ID:", business.id);

      await deleteDoc(doc(db, "List", business.id));

      router.back();

      ToastAndroid.show("Item Deleted!", ToastAndroid.LONG);
    } catch (error) {
      console.error("Error deleting Item: ", error);
      ToastAndroid.show("Error deleting Item!", ToastAndroid.LONG);
    }
  };

  const canDelete =
    userRole === "admin" ||
    user?.primaryEmailAddress?.emailAddress === business?.userEmail;

  return (
    <View>
      <View
        style={{
          position: "absolute",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          padding: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle" size={40} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleHeart}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={40}
            color={liked ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: business?.imageUrl }}
        style={{
          width: "100%",
          height: 300,
        }}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          padding: 20,
          marginTop: -20,
          justifyContent: "space-between",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View
          style={{
            padding: 20,
            marginTop: -20,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 26,
            }}
          >
            {business?.name}
          </Text>

          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 18,
              color: "gray",
            }}
          >
            {business?.address}
          </Text>
        </View>

        {canDelete && (
          <TouchableOpacity onPress={() => OnDelete()}>
            <Ionicons name="trash" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
