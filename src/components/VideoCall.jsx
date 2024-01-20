import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./videoChat.css"; 

function VideoChat() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate(`/room/${roomCode}`);
  };

  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="video-chat-container">
      <form onSubmit={handleFormSubmit} className="inputForm">
        <div>
          <label className="roomLabel">Enter Room Code</label>
          <input
            className="roomInput"
            type="text"
            required
            placeholder="Enter Room Code"
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button className="addRoom" type="submit">
            Enter Room
          </button>
          {""} {""}
          {""} {""}
          {""} {""}
          <button className="backButton" onClick={handleBack}>
            Back To Home
          </button>
        </div>
      </form>
    </div>
  );
}

export default VideoChat;
