import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Define the uploadFile function as an async function
export const uploadFile = ({ file, newImgFileName, dirAddress }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Use cloudinary.uploader.upload_stream to upload the file
      const result = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id: newImgFileName,
          folder: `${dirAddress}`,
        },
        (error, result) => {
          if (error) {
            // console.error("Error uploading to Cloudinary:", error);
            reject(error); // Reject the Promise on error
          } else {
            // console.log("File uploaded to Cloudinary:", result);
            resolve(result); // Resolve the Promise with the upload result
          }
        }
      );

      // Pipe the file's stream to the Cloudinary upload stream
      streamifier.createReadStream(file.buffer).pipe(result);
    } catch (error) {
      // console.error("Error during file upload:", error);
      reject(error); // Reject the Promise on any other errors
    }
  });
};

export const deleteImages = async (publicIds) => {
  try {
    return await cloudinary.api.delete_resources(publicIds);
    // console.log(result);
  } catch (error) {
    // console.error('Error deleting images:', error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // console.error('Error deleting image:', error);
    throw error;
  }
};