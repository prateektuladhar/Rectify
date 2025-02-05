import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import Intro from "../../components/BusinessDetail/Intro";
import ActionButton from "../../components/BusinessDetail/ActionButton";
import About from "@/components/BusinessDetail/About";
import Reviews from "../../components/BusinessDetail/Reviews";
import Price from "../../components/BusinessDetail/Price";

export default function BusinessDetail() {
  const { businessid } = useLocalSearchParams();
  const navigation = useNavigation();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    if (businessid) {
      GetBusinessDetailById();
    }
  }, [businessid]);

  const GetBusinessDetailById = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "List", businessid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBusiness({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.warn("No such document!");
      }
    } catch (error) {
      console.error("Error fetching business details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator
          style={{
            marginTop: "60%",
          }}
          color={"blue"}
          size={"large"}
        />
      ) : (
        <Intro business={business} />
      )}
      {/*Action Button*/}
      <ActionButton business={business} />

      {/*About Section*/}

      <About business={business} />
      <Price business={business} />

      {/*Review Section*/}

      <Reviews business={business} />
    </ScrollView>
  );
}
