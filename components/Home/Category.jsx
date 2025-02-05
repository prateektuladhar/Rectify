import { Text, View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/utils/FirebaseConfig";
import CategoryItem from "./CategoryItem";
import { useRouter } from "expo-router";

export default function Category({ explore = false, onCategorySelect }) {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetCategoryList();
  }, []);

  const GetCategoryList = async () => {
    try {
      const q = query(collection(db, "Category"));
      const querySnapshot = await getDocs(q);

      const categories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //   console.log(categories);
      setCategoryList(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const onCategoryPressHandler = (item) => {
    if (!explore) {
      router.push("/businesslist/" + item.name);
    } else {
      onCategorySelect(item.name);
    }
  };

  return (
    <View>
      {!explore && (
        <View style={styles.header}>
          <Text style={styles.title}>Category</Text>
          {/* <Text style={styles.viewAll}>View All</Text> */}
        </View>
      )}

      <FlatList
        data={categoryList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onCategoryPress={(category) => onCategoryPressHandler(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
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
    paddingLeft: 15,
    marginTop: 8,
    fontSize: 20,
    fontFamily: "outfit-bold",
  },
  // viewAll: {
  //   color: "blue",
  //   fontFamily: "outfit-medium",
  // },
  listContainer: {
    paddingHorizontal: 20,
  },
});
