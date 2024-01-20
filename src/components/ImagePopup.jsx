import React, { useState } from "react";
import "./imagePopup.css";

const ImagePopup = ({ imageUrl, onClose }) => {
  const [zoomedIn, setZoomedIn] = useState(false);

  const handleZoomToggle = () => {
    setZoomedIn(!zoomedIn);
  };

  return (
    <div
      className={`image-popup-overlay ${zoomedIn ? "zoomed-in" : ""}`}
      onClick={onClose}
    >
      <div className="image-popup-content" onClick={handleZoomToggle}>
        <img src={imageUrl} alt="popupimage" />
      </div>
    </div>
  );
};

export default ImagePopup;
