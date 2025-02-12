import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  Share,
  StyleSheet,
} from "react-native";
import React from "react";

export default function ActionButton({ business }) {
  const actionButtonMenu = [
    {
      id: 1,
      name: "Call",
      icon: require("@assets/images/phone-call.png"),
      url: "tel:" + business?.contact,
    },
    {
      id: 2,
      name: "Location",
      icon: require("@assets/images/map.png"),
      url:
        "https://www.google.com/maps/search/?api=1&query=" + business?.address,
    },
    {
      id: 3,
      name: "Web",
      icon: require("@assets/images/web.png"),
      url: business?.website || "https://default-url.com",
    },
    {
      id: 4,
      name: "Share",
      icon: require("@assets/images/share.png"),
      url: "tel:" + business?.contact, // Update to a URL or message as per actual requirements
    },
  ];

  const OnPressHandle = (item) => {
    if (item.name === "Share") {
      Share.share({
        message:
          business?.name +
          "\nAddress: " +
          business?.address +
          "\nFind more details on the business directory!",
      });
      return;
    }
    Linking.openURL(item.url);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={actionButtonMenu}
        numColumns={4}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => OnPressHandle(item)}
            accessible={true}
            accessibilityLabel={item.name}
            accessibilityHint={`Opens ${item.name}`}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  icon: {
    width: 50,
    height: 50,
  },
  text: {
    fontFamily: "outfit-medium",
    textAlign: "center",
    marginTop: 3,
  },
});
