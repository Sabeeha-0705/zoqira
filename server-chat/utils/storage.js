const fs = require("fs");
const path = require("path");

// Storage provider wrapper for file uploads
// Supports local disk, Cloudinary, and AWS S3

const storageProvider = process.env.STORAGE_PROVIDER || "local";

const uploadFile = async (
  buffer,
  filename,
  mimeType = "application/octet-stream"
) => {
  try {
    if (storageProvider === "local") {
      return await uploadToLocal(buffer, filename);
    } else if (storageProvider === "cloudinary") {
      return await uploadToCloudinary(buffer, filename, mimeType);
    } else if (storageProvider === "s3") {
      return await uploadToS3(buffer, filename, mimeType);
    } else {
      throw new Error(`Unknown storage provider: ${storageProvider}`);
    }
  } catch (error) {
    console.error("File upload error:", error);
    throw error;
  }
};

const uploadToLocal = async (buffer, filename) => {
  // TODO: Implement local disk storage
  // Save to /uploads directory with timestamp prefix
  const uploadsDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const filename_with_timestamp = `${timestamp}-${filename}`;
  const filepath = path.join(uploadsDir, filename_with_timestamp);

  fs.writeFileSync(filepath, buffer);

  return {
    success: true,
    url: `/uploads/${filename_with_timestamp}`,
    key: filename_with_timestamp,
  };
};

const uploadToCloudinary = async (buffer, filename, mimeType) => {
  // TODO: Implement Cloudinary upload using cloudinary SDK
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET,
  // });
  // const result = await cloudinary.uploader.upload_stream({
  //   public_id: filename,
  //   resource_type: 'auto',
  // });
  // result.end(buffer);

  console.log("Cloudinary upload not yet configured. Using local fallback.");
  return uploadToLocal(buffer, filename);
};

const uploadToS3 = async (buffer, filename, mimeType) => {
  // TODO: Implement AWS S3 upload
  // const AWS = require('aws-sdk');
  // const s3 = new AWS.S3({
  //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // });
  // const params = {
  //   Bucket: process.env.AWS_S3_BUCKET,
  //   Key: filename,
  //   Body: buffer,
  //   ContentType: mimeType,
  // };
  // const result = await s3.upload(params).promise();
  // return { success: true, url: result.Location, key: result.Key };

  console.log("S3 upload not yet configured. Using local fallback.");
  return uploadToLocal(buffer, filename);
};

const getFileUrl = (key) => {
  if (storageProvider === "local") {
    return `/uploads/${key}`;
  } else if (storageProvider === "cloudinary") {
    // Return Cloudinary URL
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_NAME}/image/upload/${key}`;
  } else if (storageProvider === "s3") {
    // Return S3 URL
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
  }
  return null;
};

module.exports = { uploadFile, getFileUrl };
