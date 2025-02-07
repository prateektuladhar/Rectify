import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../../utils/FirebaseConfig";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const { user } = useUser();
  const [name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [About, setAbout] = useState("");
  const [Category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Item",
      headerShown: true,
    });
    GetCategoryList();
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
      }
    })();
  }, []);

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      setImage(uri);

      await uploadImageToCloudinary(uri);
    } else {
      console.log("Image selection canceled");
    }
  };

  const uploadImageToCloudinary = async (uri) => {
    try {
      const type = uri.split(".").pop();
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: `image/${type}`,
        name: `upload.${type}`,
      });
      formData.append("upload_preset", "react-native-upload");
      formData.append("cloud_name", "dxusjmve1");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxusjmve1/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data && response.data.secure_url) {
        console.log("Uploaded image URL:", response.data.secure_url);
        setImage(response.data.secure_url);
      } else {
        console.error("Cloudinary upload failed:", response.data);
        ToastAndroid.show("Image upload failed. Try again.", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      ToastAndroid.show("Image upload failed. Try again.", ToastAndroid.LONG);
    }
  };

  const GetCategoryList = async () => {
    setCategoryList([]);
    const q = query(collection(db, "Category"));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setCategoryList((prev) => [
        ...prev,
        {
          label: doc.data().name,
          value: doc.data().name,
        },
      ]);
    });
  };

  const saveItemDetail = async () => {
    if (
      !name ||
      !Address ||
      !contact ||
      !Category ||
      !About ||
      !price ||
      !image
    ) {
      ToastAndroid.show(
        "Please fill all fields and upload an image!",
        ToastAndroid.LONG
      );
      return;
    }

    setLoading(true);

    try {
      const businessId = Date.now().toString();
      const businessData = {
        name,
        Address,
        contact,
        website,
        Category,
        About,
        price,
        username: user?.fullName || "Anonymous",
        userEmail: user?.primaryEmailAddress?.emailAddress || "Unknown",
        imageUrl: image || "",
        isVerifiedPost: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "List", businessId), businessData);

      ToastAndroid.show(
        "will be added after being varified!",
        ToastAndroid.LONG
      );
      setLoading(false);

      setName("");
      setAddress("");
      setContact("");
      setWebsite("");
      setAbout("");
      setCategory("");
      setPrice("");
      setImage(null);
    } catch (error) {
      console.error("Error saving item:", error);
      ToastAndroid.show("Failed to add item. Try again.", ToastAndroid.LONG);
      setLoading(false);
    }

    setModalVisible(true);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 25 }}>
        Add New Item
      </Text>
      <Text style={{ fontFamily: "outfit", color: "gray" }}>
        Fill all details to add a new Item.
      </Text>

      <TouchableOpacity style={{ marginTop: 20 }} onPress={onImagePick}>
        {!image ? (
          <Image
            source={require("./../../assets/images/logoexpress.png")}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 15 }}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(v) => setName(v)}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
          }}
        />
        <TextInput
          placeholder="Address"
          value={Address}
          onChangeText={(v) => setAddress(v)}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
          }}
        />
        <TextInput
          placeholder="Contact"
          value={contact}
          onChangeText={(v) => setContact(v)}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
          }}
        />
        <TextInput
          placeholder="Website"
          value={website}
          onChangeText={(v) => setWebsite(v)}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
          }}
        />
        <TextInput
          placeholder="About"
          value={About}
          onChangeText={(v) => setAbout(v)}
          multiline
          numberOfLines={5}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
            height: 100,
          }}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={(v) => setPrice(v)}
          style={{
            padding: 15,
            borderRadius: 5,
            borderWidth: 1,
            fontSize: 15,
            marginTop: 10,
          }}
        />
        <View style={{ borderRadius: 5, borderWidth: 1, marginTop: 10 }}>
          <RNPickerSelect
            onValueChange={(value) => setCategory(value)}
            items={categoryList}
            value={Category}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={saveItemDetail}
        disabled={loading}
        style={{
          padding: 10,
          backgroundColor: loading ? "gray" : "#ADD8E6",
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            color: "white",
            textAlign: "center",
          }}
        >
          {loading ? "Saving..." : "Add"}
        </Text>
      </TouchableOpacity>

      {/* Modal for displaying image */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Image
              source={require("./../../assets/images/qr.jpg")}
              style={{ width: 300, height: 300 }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "blue", textAlign: "center" }}>Close</Text>
              <Text style={{ color: "blue", textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
