import { View, Text, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../utils/FirebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    setSliderList([]);
    try {
      const q = query(collection(db, "Sliders"));
      const querySnaphshot = await getDocs(q);
      querySnaphshot.forEach((doc) => {
        // console.log(doc.data());
        setSliderList((prev) => [...prev, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching slider data:", error);
    }
  };

  return (
    <View>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          paddingLeft: 15,
          paddingTop: 15,
          marginBottom: 5,
        }}
      >
        #Special for you
      </Text>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 20 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: 300,
              height: 130,
              borderRadius: 15,
              marginRight: 15,
            }}
          />
        )}
      />
    </View>
  );
}
