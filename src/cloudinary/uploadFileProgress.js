
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const uploadFileProgress = (file, setProgress, roomImage, setRoomImage) => {
  return new Promise((resolve, reject) => {
  

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result;

        // Update the state with the image data URL
        setRoomImage(result);

        // Move the fetch logic inside the setRoomImage callback
        setRoomImage((updatedRoomImage) => {
          console.log("updatedRoomImage", updatedRoomImage);

          fetch("http://localhost:8800/host/upload-to-cloudinary", {
            method: "POST",
            body: JSON.stringify({ file: updatedRoomImage }), // Convert to JSON string
            headers: {
              "Content-Type": "application/json", // Set Content-Type header
            },
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("data", data);
              // Assuming your server sends back the Cloudinary URL in the 'url' property
              const cloudinaryUrl = data.data.url;
              console.log("cloudinaryUrl", cloudinaryUrl);
              resolve(cloudinaryUrl);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };
    }
  });
};


export default uploadFileProgress;
