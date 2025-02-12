import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Share } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@utils/FirebaseConfig";

export default function MenuList() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
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

    fetchUserRole();
  }, [user]);

  const menulist = [
    {
      id: 1,
      name: "Add Item",
      icon: require("@assets/images/add.png"),
      path: "/business/addBusiness",
    },
    {
      id: 2,
      name: "My Items",
      icon: require("@assets/images/business-and-trade.png"),
      path: "/business/Mybusiness",
    },
    {
      id: 3,
      name: "Share App",
      icon: require("@assets/images/send.png"),
      path: "share",
    },
    {
      id: 4,
      name: "Logout",
      icon: require("@assets/images/logout.png"),
      path: "logout",
    },
  ];

  if (userRole === "admin") {
    menulist.push({
      id: 5,
      name: "Dashboard",
      icon: require("@assets/images/logout.png"),
      path: "/admin/AdminDashboard",
    });
  }

  const onMenuClick = (item) => {
    if (item.path === "logout") {
      signOut();
      return;
    }
    if (item.path === "share") {
      Share.share({
        message: "Download the app",
      });
      return;
    }
    router.push(item.path);
  };

  return (
    <View style={{ marginTop: 50 }}>
      <FlatList
        data={menulist}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onMenuClick(item)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              padding: 10,
              borderRadius: 15,
              borderWidth: 1,
              margin: 10,
              backgroundColor: "white",
              borderColor: "#CBC3E3",
            }}
          >
            <Image source={item.icon} style={{ width: 40, height: 40 }} />
            <Text
              style={{ fontFamily: "outfit-medium", fontSize: 16, flex: 1 }}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
