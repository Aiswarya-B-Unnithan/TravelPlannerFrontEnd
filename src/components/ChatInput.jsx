import React, { useEffect, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { MdImage, MdMic, MdOutlineAttachFile } from "react-icons/md";
import { MdOutlineFileUpload } from "react-icons/md";
import AttachmentModal from "./AttachmentModel";
import Container from "./style/ChatInputStyles";
export default function ChatInput({ handleSendMsg }) {
  const [message, setMessage] = useState({ type: "text", content: "" });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  //----------------------------------------->
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  //----------------------------------------->
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Use the audioBlob and audioUrl as needed (e.g., set in the state or send to the server)
        setMessage({
          type: "voice",
          content: {
            audio: audioBlob,
            dataUrl: audioUrl,
          },
        });
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };
  //----------------------------------------->
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };
  //----------------------------------------->
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  //----------------------------------------->
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  //----------------------------------------->
  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => ({
      ...prevMessage,
      content: (prevMessage.content || "") + emojiObject.emoji,
    }));
  };

  const handleAttachmentClick = () => {
    setShowAttachmentModal(true);
  };
  //----------------------------------------->
  const handleModalClose = () => {
    setShowAttachmentModal(false);
  };
  //----------------------------------------->
  const handleImageChange = async (event) => {
  
    const selectedImage = event.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result;

      setMessage({
        type: "image",
        content: {
          file: selectedImage,
          dataUrl: imageDataUrl,
        },
      });
    };

    if (selectedImage) {
      reader.readAsDataURL(selectedImage);
    }
  };
  //----------------------------------------->
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileDataUrl = reader.result;

        // Set the file state or perform other actions
        setMessage({
          type: "file",
          content: fileDataUrl,
        });
      };

      reader.readAsDataURL(selectedFile);
    }
  };
  //----------------------------------------->
  // Handle video selection
  const handleVideoChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setSelectedVideo(selectedFile);
    }
  };
  //----------------------------------------->
  const sendChat = (event) => {
    event.preventDefault();
    let newMessage = null;

    if (selectedVideo) {
      newMessage = {
        type: "video",
        content: {
          file: selectedVideo,
          dataUrl: URL.createObjectURL(selectedVideo),
        },
      };
    }
    if (message.type === "text" && message.content.trim() !== "") {
      handleSendMsg(message);
      setMessage({ type: "text", content: "" });
    } else if (message.type === "image" && message.content) {
      handleSendMsg(message);
      setMessage({ type: "text", content: "" });
    } else if (message.type === "file" && message.content) {
     
      handleSendMsg(message);
      setMessage({ type: "text", content: "" });
    } else if (message.type === "voice" && message.content) {
      handleSendMsg(message);
      setMessage({ type: "text", content: "" });
    }
    if (newMessage) {

      handleSendMsg(newMessage);
      setSelectedVideo(null);
      setMessage({ type: "text", content: "" });
    }
  };
  //----------------------------------------->
  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>

        <div className="attachment-button">
          <button onClick={handleAttachmentClick}>
            <MdOutlineAttachFile className="file-icon" />
          </button>
        </div>
      </div>

      {showAttachmentModal && (
        <AttachmentModal
          onClose={handleModalClose}
          onFileChange={handleFileChange}
          onImageChange={handleImageChange}
          onVideoChange={handleVideoChange}
          onStartRecording={toggleRecording}
          onStopRecording={stopRecording}
        />
      )}

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) =>
            setMessage({ type: "text", content: e.target.value })
          }
          value={message.content}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}


//----------------------------------------->

