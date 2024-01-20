// fileUploadMiddleware.js

const multer = require("multer");

const storage = multer.memoryStorage(); // You can customize the storage as needed

const upload = multer({ storage: storage });

const uploadFields = [
  { name: "images", maxCount: 4 }, // Assuming you want to handle image uploads
  { name: "videos", maxCount: 1 }, // Assuming you want to handle video uploads
];

const handleFileUpload = upload.fields(uploadFields);

module.exports = handleFileUpload;
