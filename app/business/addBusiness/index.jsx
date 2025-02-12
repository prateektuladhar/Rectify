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
  StyleSheet,
} from "react-native";
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { db } from "@utils/FirebaseConfig";
import { collection, doc, getDocs, query, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user } = useUser();
  const [name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState("");
  const [About, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Item",
      headerShown: true,
    });
    GetCategoryList();

    // Request media library permission on mount
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

      if (response.data?.secure_url) {
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
    try {
      const q = query(collection(db, "Category"));
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        setCategoryList((prev) => [
          ...prev,
          { label: doc.data().name, value: doc.data().name },
        ]);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const saveItemDetail = async () => {
    if (
      !name ||
      !Address ||
      !contact ||
      !selectedCategory ||
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
        Category: selectedCategory,
        About,
        price,
        username: user?.fullName || "Anonymous",
        userEmail: user?.primaryEmailAddress?.emailAddress || "Unknown",
        imageUrl: image,
        isVerifiedPost: false,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "List", businessId), businessData);

      ToastAndroid.show(
        "Item will be added after verification!",
        ToastAndroid.LONG
      );
      setLoading(false);

      // Reset form fields
      setName("");
      setAddress("");
      setContact("");
      setWebsite("");
      setAbout("");
      setSelectedCategory("");
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New Item</Text>
      <Text style={styles.subheader}>Fill all details to add a new item.</Text>

      <TouchableOpacity
        style={styles.imageContainer}
        onPress={onImagePick}
      >
        {!image ? (
          <Image
            source={require("@assets/images/logoexpress.png")}
            style={styles.image}
          />
        ) : (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        )}
      </TouchableOpacity>

      <View>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Address"
          value={Address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <TextInput
          placeholder="Contact"
          value={contact}
          onChangeText={setContact}
          style={styles.input}
        />
        <TextInput
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
        />
        <TextInput
          placeholder="About"
          value={About}
          onChangeText={setAbout}
          multiline
          numberOfLines={5}
          style={styles.textarea}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.categoryText}>
            {selectedCategory || "Select Category"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={saveItemDetail}
        disabled={loading}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Add"}</Text>
      </TouchableOpacity>

      {/* Modal for Category Selection */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Category</Text>
            {categoryList.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedCategory(category.value);
                  setModalVisible(false);
                }}
                style={styles.categoryItem}
              >
                <Text style={styles.categoryItemText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ padding: 20 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    color: "#333",
  },
  subheader: {
    fontFamily: "outfit",
    color: "gray",
    marginVertical: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    resizeMode: "cover",
  },
  input: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
    marginTop: 10,
    backgroundColor: "#fff",
  },
  textarea: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 15,
    marginTop: 10,
    height: 100,
    backgroundColor: "#fff",
  },
  categoryButton: {
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 10,
    backgroundColor: "#fff",
  },
  categoryText: {
    fontSize: 15,
    color: "#333",
  },
  button: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "outfit-bold",
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalHeader: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryItemText: {
    fontSize: 16,
    color: "#555",
  },
  closeModalButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 5,
  },
  closeModalText: {
    color: "white",
    textAlign: "center",
  },
});
