import React, { useEffect, useState } from "react";
import { MdImage, MdOutlineAttachFile, MdSend, MdMic, MdOutlineFileUpload, MdClear } from "react-icons/md";
import styled from "styled-components";
import { FaMicrophoneSlash } from "react-icons/fa";
import RecordButtons from "./RecordButton";
const AttachmentModal = ({
  onClose,
  onFileChange,
  onImageChange,
  onVideoChange,
  onStartRecording,
  onStopRecording,
  onSendFile,
}) => {
  const handleFileInput = (event) => {
    const fileType = event.target.accept;
console.log(fileType)
    if (fileType === ".pdf") {
      onFileChange(event);
    } else if (fileType === "image/*") {
      onImageChange(event);
    } else if (fileType === "video/*") {
      onVideoChange(event);
    }
  };
   const [isRecording, setIsRecording] = useState(false);

  return (
    <ModalWrapper>
      <div className="attachment-options">
        <MdImage className="image-icon" style={{ color: "white" }} />
        <input
          style={{ color: "white" }}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="file-input"
        />
        <MdOutlineFileUpload className="file-icon" style={{ color: "white" }} />
        <input
          style={{ color: "white" }}
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="file-input"
        />
        <MdOutlineAttachFile className="file-icon" style={{ color: "white" }} />
        <input
          style={{ color: "white" }}
          type="file"
          accept="video/*"
          onChange={onVideoChange}
          className="file-input"
        />
      </div>

      <div className="record-button">
        <RecordButtons
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          isRecording={isRecording}
        />
      </div>

      <button onClick={onClose} style={{ color: "white" }}>
        Close
      </button>
    </ModalWrapper>
  );
};
const ModalWrapper = styled.div`
  position: fixed;
  
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #080420; /* Dark color */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;





export default AttachmentModal;
