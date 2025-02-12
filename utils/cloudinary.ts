// import axios from 'axios';
// import mime from 'mime';

// // Cloudinary Configuration
// const CLOUD_NAME = 'dxusjmve1'; // Replace with your Cloudinary Cloud Name
// const UPLOAD_PRESET = 'react-native-upload'; // Replace with your Cloudinary Upload Preset
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// export const uploadImageToCloudinary = async (imageUri) => {
//   if (!imageUri || typeof imageUri !== 'string') {
//     throw new Error('Invalid image URI');
//   }

//   const data = new FormData();

//   // Extract file name and type
//   const fileName = imageUri.split('/').pop();
//   const fileType = mime.getType(imageUri) || 'image/jpeg'; // Default to JPEG if type not detected

//   data.append('file', {
//     uri: imageUri,
//     type: fileType,
//     name: fileName || 'image.jpg', // Fallback to 'image.jpg'
//   });
//   data.append('upload_preset', UPLOAD_PRESET);

//   try {
//     const response = await axios.post(CLOUDINARY_URL, data, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data; // This will return the uploaded image's details like the URL
//   } catch (error) {
//     console.error('Error uploading image:', error.response?.data || error.message);
//     throw new Error('Failed to upload image');
//   }
// };

// import { Cloudinary } from "@cloudinary/url-gen/index";
 
// const cld = new Cloudinary({
//   cloud: {
//     cloudName: 'demo',
//     api_key: "445892129561165",
//     api_secret: "pTzrdXONoo_b2g5Qua21_b30KkQ",
//   }
// });

// // const myImage = cld.image('docs/models'); 
// async function handleUpload(file) {
//   const res = await cld.image('docs/models');
//   return res;
// }

// Cloudinary.config({
//   cloud_name:"dxusjmve1",
//   api_key: "445892129561165",
//   api_secret: "pTzrdXONoo_b2g5Qua21_b30KkQ",
// });
// async function handleUpload(file) {
//   const res = await cloudinary.uploader.upload(file, {
//     resource_type: "auto",
//   });
//   return res;
// }

import { Cloudinary } from "@cloudinary/url-gen/index";
import { UploadApiOptions, upload } from "cloudinary-react-native";
import { APIConfig } from "cloudinary-react-native/lib/typescript/src/api/upload/config/api-config";

const myCld = new Cloudinary({
  cloud: {
    cloudName: "dxusjmve1",
  },
});

const config: APIConfig = {
  cloudName:"dxusjmve1",
  apiKey: "445892129561165",
  apiSecret: "pTzrdXONoo_b2g5Qua21_b30KkQ",
  uploadPrefix: "string",
  callbackUrl: "string",
  chunkSize: 5,
  timeout: 30
}
// const myImage = cld.image('docs/models');
export async function handleUpload(file: string | undefined) {
  const options: UploadApiOptions = {
    upload_preset: "react-native-upload",
    unsigned: true,
    use_filename: true,
  };
// console.log('====================================');
// console.log('hhh');
// console.log('====================================');
  await upload(myCld, {
    file: file,
    options: options,
    config: config,
    callback: (error: any, response: any) => {
      if (error) {
        // Handle error
        console.error("Upload failed:", error);
        return false; // You can return false or handle the error as needed
      }
  
      if (response) {
        // Handle successful response
        console.log("Upload successful:", response);
        return true; // Indicate success
      }
    },
  });
}