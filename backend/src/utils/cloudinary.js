import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded on cloudinary url is ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = cloudinary.uploader.destroy(publicId);
    console.log("successfully deleted from cloudinary ", result);
  } catch (err) {
    console.log("error deleting from cloudinary ", err);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
