import { View, Text, StyleSheet, FlatList } from "react-native";
import React from "react";

import PopularBusinesscard from "./PopularBusinesscard";

export default function PopularBusinessList({ popularBusinessList }) {
  // const [popularBusinessList, setPopularBusinessList] = useState([]);

  // useEffect(() => {
  //   GetBusinessList();
  // }, []);

  // const GetBusinessList = async () => {
  //   setPopularBusinessList([]); // Clear previous list

  //   try {
  //     const q = query(
  //       collection(db, "List"),
  //       where("isVerifiedPost", "==", true) // Filter only verified posts
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const businesses = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));

  //     setPopularBusinessList(businesses);
  //   } catch (error) {
  //     console.error("🔥 Error fetching business list:", error);
  //   }
  // };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Item</Text>
        {/* <Text style={styles.viewAll}>View All</Text> */}
      </View>

      <FlatList
        data={popularBusinessList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PopularBusinesscard business={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    paddingLeft: 20,
    marginTop: 10,
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  viewAll: {
    color: "blue",
    fontFamily: "outfit-medium",
  },
});
