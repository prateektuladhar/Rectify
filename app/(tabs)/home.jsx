import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Header from "@components/Home/Header";
import Slider from "@components/Home/Slider";
import Category from "@components/Home/Category";
import PopularBusinessList from "@components/Home/PopularBusinessList";
import { useUser } from "@clerk/clerk-expo";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { db, auth } from "@utils/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/** Save user to Firestore **/
const saveUserToFirestore = async (user) => {
  if (!user?.id) {
    return console.error("Missing user data, skipping Firestore save.");
  }

  try {
    const userRef = doc(db, "clients", user.id);
    const userSnap = await getDoc(userRef);

    let existingData = userSnap.exists() ? userSnap.data() : {};

    // Preserve existing role if already set
    const userData = {
      email: user?.primaryEmailAddress?.emailAddress || "N/A",
      userName: user?.fullName || "Anonymous",
      createdAt: userSnap.exists()
        ? existingData.createdAt
        : user?.createdAt || Date.now(),
      role: userSnap.exists() ? existingData.role : "client",
    };

    await setDoc(userRef, userData, { merge: true });
    console.log("✅ User saved to Firestore!");
  } catch (error) {
    console.error("🔥 Firestore Error:", error.message);
  }
};

/** Save user to Realtime Database **/
const storeUserToRealtimeDB = async (user) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return console.warn("No authenticated user found!");

  try {
    await set(
      ref(getDatabase(), `users/${currentUser.uid}`),
      getUserData(user)
    );
    // console.log("✅ User data stored in Realtime Database!");
  } catch (error) {
    console.error("🔥 Error storing user data:", error.message);
  }
};

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const [popularBusinessList, setPopularBusinessList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await GetBusinessList();
  
      if (isLoaded && isSignedIn && user) {
        console.log("🔄 Storing user data...");
        saveUserToFirestore(user);
        storeUserToRealtimeDB(user);
      }
    };
  
    fetchData();
  }, [isLoaded, isSignedIn, user]);
  
  
  const GetBusinessList = async () => {
    try {
      const q = query(
        collection(db, "List"),
        where("isVerifiedPost", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const businesses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPopularBusinessList(businesses);
    } catch (error) {
      console.error("🔥 Error fetching business list:", error);
    }
  };

  /** Handle Refresh **/
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log("🔄 Refreshing data...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      GetBusinessList();
      // console.log("✅ Refresh completed.");
    } catch (error) {
      console.error("❌ Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);


  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }


  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header />
      <Slider />
      <Category />
      <PopularBusinessList popularBusinessList={popularBusinessList} />
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
