import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../utils";
import API_URLS from "../utils/apiConfig";
import { Message } from "@mui/icons-material";
import { FiArrowLeft } from "react-icons/fi";
import { CiVideoOn } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";
import { reducerCases } from "../context/constant";
import { useValue } from "../context/ContextProvider";
import Container from "../components/style/ChatContainerStyles"
const ChatContainer = ({ currentChat, currentUser, socket, chatId }) => {
  
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const {
    dispatch,
  } = useValue();
  const chat = async () => {
    await fetchChat();
    await markChatAsRead();
  };
  
//-------------------------------------->
 

//---------------------------------->

  useEffect(() => {
    chat();
  }, [chatId]);
  //-------------------------------------->
  useEffect(() => {
    if (socket?.current) {
      // Listen for the "update-online-status" event
      socket.current.on("update-online-status", (onlineUsersArray) => {
        setOnlineUsers(onlineUsersArray);
      });
    }
  }, [socket]);
  //-------------------------------------->
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  //-------------------------------------->
  const markChatAsRead = async () => {
    
    if (currentChat) {
      try {
        // Send a request to the backend to mark the chat as read
        const res = await apiRequest({
          url: `${API_URLS.MARK_CHAT_AS_READ}?chatId=${currentChat._id}`,
          method: "PATCH",
          token: user?.token,
        });
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    }
  };
  //-------------------------------------->
  const fetchChat = async () => {
    if (currentChat) {
      const res = await apiRequest({
        url: `${API_URLS.GET_ALL_MSGES}?from=${currentUser?._id}&to=${currentChat?._id}`,
        method: "GET",
        token: user?.token,
      });
      setMessages(res);
    }
  };
  //-------------------------------------->
  const base64toBlob = (base64Data, contentType) => {
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
  //---------------------------->
  const handleSendMsg = async (msg) => {
    let res;

    if (msg.type === "text") {
      // For text messages
      res = await apiRequest({
        url: API_URLS.SEND_TEXT_MESSAGE,
        data: {
          from: currentUser?._id,
          to: currentChat?._id,
          message: msg,
        },
        method: "POST",
        token: currentUser?.token,
      });
    } else if (msg.type === "image") {
      // Extracting file extension from the original image file name
      const fileExtension = msg.content.file.name.split(".").pop();
      // Assuming that `msg.content.dataUrl` contains the base64 encoded image data
      const base64Data = msg.content.dataUrl.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const blob = base64toBlob(base64Data, `image/${fileExtension}`);

      // Create FormData to send the blob as a file
      const formData = new FormData();
      formData.append("image", blob, `image_${Date.now()}.${fileExtension}`);
      formData.append("from", currentUser?._id);
      formData.append("to", currentChat?._id);

      try {
        // Use Axios to send the image to the server
        res = await axios.post(API_URLS.SEND_IMAGE_MESSAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    } else if (msg.type === "file") {
      const base64Data = msg?.content?.replace(/^data:.*\/.*;base64,/, "");
      const blob = base64toBlob(base64Data);

      // Create FormData to send the blob as a file
      const formData = new FormData();
      formData.append("file", blob, `file_${Date.now()}.pdf`);
      formData.append("from", currentUser?._id);
      formData.append("to", currentChat?._id);
      try {
        // Use Axios to send the file to the server
        res = await axios.post(API_URLS.SEND_FILE_MESSAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        // Handle the response as needed
      } catch (error) {
        // Handle errors
        console.log("Error uploading file:", error);
      }
    } else if (msg.type === "voice") {
     

      // Convert the Blob to a base64 string
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1]; // Extracting base64 data

        // Create a Blob from the base64 data
        const blob = base64toBlob(base64Data, "audio/wav");

        // Create FormData to send the Blob as an audio file
        const formData = new FormData();
        formData.append("audio", blob, `voice_${Date.now()}.wav`);
        formData.append("from", currentUser?._id);
        formData.append("to", currentChat?._id);

        try {
          // Use Axios to send the audio file to the server
          const res = await axios.post(API_URLS.SEND_VOICE_MESSAGE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${currentUser?.token}`,
            },
          });

        
        } catch (error) {
          // Handle errors
          console.error("Error uploading voice message:", error);
        }
      };

      // Read the Blob as a data URL
      reader.readAsDataURL(msg.content.audio);
    } else if (msg.type === "video") {
      const formData = new FormData();
      formData.append("video", msg.content.file);
      formData.append("from", currentUser?._id);
      formData.append("to", currentChat?._id);

      try {
        // Use Axios to send the video to the server
        res = await axios.post(API_URLS.SEND_VIDEO_MESSAGE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser?.token}`,
          },
        });

        
      
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }

    // Send the message to the server
    socket?.current?.emit("send-msg", {
      to: currentChat?._id,
      from: currentUser?._id,
      msg,
    });

    // Fetch the updated chat messages
    await fetchChat();
  };
  //-------------------------------------->
  useEffect(() => {
    if (socket?.current) {
      socket?.current.on("msg-recieve", async (msg) => {
        if (msg) {
          setArrivalMessage({ fromSelf: false, message: msg });
          await markChatAsRead();
        }
        await fetchChat();
      });
    }
  }, [socket]);
  //-------------------------------------->
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
      setArrivalMessage(null);
    }
  }, [arrivalMessage]);
  //-------------------------------------->
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  //-------------------------------------->
  const getMessageContent = (message) => {
    switch (message.type) {
      case "text":
        return { text: message.content.text };
      case "image":
        return { imageUrl: message.content.imageUrl };
      case "file":
        return {
          fileUrl: message.content.fileUrl,
          fileName: message.content.fileName,
        };
      case "voice":
        return {
          voiceUrl: message?.content?.voiceUrl,
        };
      case "video":
        return { videoUrl: message?.content?.videoUrl };
      default:
        return null;
    }
  };
  //-------------------------------------->
  const renderMessageContent = (message) => {
    const content = getMessageContent(message);

    if (content) {
    
      switch (message?.type) {
        case "text":
          return <p>{content?.text}</p>;
        case "image":
          const imagePathParts = content?.imageUrl?.split(/[\\/]/);
          const relativeImagePath = imagePathParts?.slice(-2).join("/");
          return (
            <div>
              <p>Image Message</p>
              <img src={relativeImagePath} alt="pic" />
            </div>
          );

        case "file":
          return (
            <div>
              <p>File Recevied</p>
              <a
                href={content.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download File
              </a>
            </div>
          );
        case "voice":
      
          const voicePathParts = content?.voiceUrl.split(/[\\/]/);
          const relativeVoicePath = voicePathParts.slice(-2).join("/");
          return (
            <div>
              <p>Voice Message</p>
              <audio controls>
                <source src={relativeVoicePath} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        case "video":
          const videoPathParts = content?.videoUrl?.split(/[\\/]/);
          const relativeVideoPath = videoPathParts?.slice(-2).join("/");
          return (
            <div>
              <p>Video Message</p>
              <video width="320" height="240" controls>
                <source src={relativeVideoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          );

        default:
          return null;
      }
    }

    return null;
  };
  //-------------------------------------->
  const handleGoBack = () => {
    navigate("/");
  };
  //-------------------------------------->
  const formatTimestamp = (timestamp) => {
    const now = moment();
    const messageTime = moment(timestamp);

    if (now.diff(messageTime, "days") === 0) {
      return messageTime.format("h:mm A"); // Today
    } else if (now.diff(messageTime, "days") === 1) {
      return "Yesterday " + messageTime.format("h:mm A");
    } else {
      return messageTime.format("MMM D, YYYY h:mm A"); // Other days
    }
  };
  //-------------------------------------->
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`${currentChat.profileUrl}`} alt="" />
          </div>
          <div className="user-info">
            <div className="username">
              <h3>{currentChat.firstName}</h3>
            </div>
            <div className="online-status">
              {onlineUsers.includes(currentChat?._id) && (
                <span
                  style={{
                    color: "lightgreen",
                    fontSize: "small",
                    fontStyle: "italic",
                  }}
                >
                  Online
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button className="back-button" onClick={handleGoBack}>
          <FiArrowLeft />
        </button>
      </div>
      <div className="chat-messages">
        {messages?.map((message) => {
         
          const formattedTimestamp = formatTimestamp(message.createdAt);

          return (
            <div key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  {renderMessageContent(message)}
                  <span
                    style={{
                      color: "gray",
                      fontSize: "small",
                      fontStyle: "italic",
                    }}
                  >
                    {message.fromSelf && "You "} {formattedTimestamp}
                  </span>
                  {message?.fromSelf && message?.isRead ? (
                    <span className="tick-icon">✓✓</span>
                  ) : (
                    message.fromSelf && <span className="tick-icon">✓</span>
                  )}
                </div>
              </div>
              <div ref={messagesEndRef} />
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};


export default ChatContainer;
