import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const { user } = useUser();
  const navigation = useNavigation();

  const goToProfile = () => {
    navigation.navigate("profile");
  };

  return (
    <View
      style={{
        padding: 10,
        padding: 20,
        backgroundColor: "#ADD8E6",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {/* Touchable Image */}
        <TouchableOpacity onPress={goToProfile}>
          <Image
            source={{ uri: user?.imageUrl }}
            style={{
              width: 45,
              height: 45,
              borderRadius: 99,
            }}
          />
        </TouchableOpacity>
        <View>
          <Text
            style={{
              color: "#fff",
            }}
          >
            WELCOME.
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 19,
              fontFamily: "outfit-medium",
            }}
          >
            {user?.firstName}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
