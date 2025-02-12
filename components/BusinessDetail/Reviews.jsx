import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { Rating } from "react-native-ratings";
import { TouchableOpacity } from "react-native";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@utils/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";

export default function Reviews({ business }) {
  const [rating, setRating] = useState(4);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const onSubmit = async () => {
    if (!userInput.trim()) {
      ToastAndroid.show(
        "Please write a comment before submitting!",
        ToastAndroid.BOTTOM
      );
      return;
    }

    if (!user || !user.fullName || !user.imageUrl) {
      ToastAndroid.show(
        "User information is missing. Please log in again.",
        ToastAndroid.BOTTOM
      );
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "List", business?.id);

      await updateDoc(docRef, {
        Reviews: arrayUnion({
          id: Date.now().toString(), // Unique ID for each review
          rating: rating,
          comment: userInput,
          userName: user?.fullName || "Anonymous",
          userImage: user?.imageUrl || "",
          userEmail: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      ToastAndroid.show("Comment added successfully!", ToastAndroid.BOTTOM);

      // Reset input and rating
      setUserInput("");
      setRating(4);
    } catch (error) {
      console.error("Error submitting review:", error);
      ToastAndroid.show(
        "Error submitting your review. Please try again.",
        ToastAndroid.BOTTOM
      );
    } finally {
      setLoading(false);
    }
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <Image
        source={{
          uri: item.userImage || "https://via.placeholder.com/50",
        }}
        style={styles.userImage}
      />
      <View style={styles.reviewContent}>
        <Text style={styles.userName}>{item.userName || "Anonymous"}</Text>
        <Text style={styles.comment}>{item.comment}</Text>
        <Rating
          imageSize={15}
          readonly
          startingValue={item.rating}
          style={styles.reviewRating}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>

      {/* Rating Input */}
      <View style={styles.ratingContainer}>
        <Rating
          imageSize={25}
          showRating={false}
          startingValue={rating}
          onFinishRating={(rating) => setRating(rating)}
          style={styles.rating}
        />
      </View>

      {/* Comment Input */}
      <TextInput
        placeholder="Write your comment"
        value={userInput}
        onChangeText={setUserInput}
        style={styles.textInput}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity
        disabled={!userInput.trim() || loading}
        onPress={onSubmit}
        style={[
          styles.submitButton,
          (!userInput.trim() || loading) && styles.disabledButton,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {/* Display Previous Reviews */}
      <FlatList
        data={business?.Reviews || []}
        keyExtractor={(item) => item.id}
        renderItem={renderReviewItem}
        ListEmptyComponent={
          <Text style={styles.noReviewsText}>
            No reviews yet. Be the first to review!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginBottom: 10,
  },
  ratingContainer: {
    paddingVertical: 10,
  },
  rating: {
    paddingVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    marginVertical: 10,
    textAlignVertical: "top",
    height: 80,
  },
  submitButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ADD8E6",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  submitButtonText: {
    fontFamily: "outfit-bold",
    color: "white",
    textAlign: "center",
  },
  reviewItem: {
    flexDirection: "row",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    marginBottom: 5,
  },
  comment: {
    fontSize: 14,
    marginBottom: 5,
  },
  reviewRating: {
    alignSelf: "flex-start",
  },
  noReviewsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
