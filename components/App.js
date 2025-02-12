import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadImageToCloudinary } from './utils/cloudinary';

const App = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) {
        console.log('User canceled image picker');
        return;
      }
      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorCode);
        return;
      }

      const selectedImage = response.assets[0].uri;
      setImage(selectedImage);

      setLoading(true);

      try {
        // Upload the image to Cloudinary
        const uploadedImage = await uploadImageToCloudinary(selectedImage);
        setImageUrl(uploadedImage.secure_url); // This is the URL of the uploaded image
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Pick Image" onPress={pickImage} />
      
      {loading && <Text>Uploading...</Text>}

      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      {image && !imageUrl && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});

export default App;
