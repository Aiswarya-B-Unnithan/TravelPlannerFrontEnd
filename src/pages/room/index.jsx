import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useValue } from "../../context/ContextProvider";
import "./roomPage.css"; 
function RoomPage() {
  const { roomId } = useParams();
 const {
   state: { currentUser },
 } = useValue();
  const roomUrl = `${window.location.origin}/room/${roomId}`;
  
  const myMeeting = async (element) => {
    const appId = 1407543400;
    const serverSecret = "9cb1b280bebd9be5f35574022aa23a26";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,

      Date.now().toString(),
      currentUser?.firstName
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp?.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };
    const inputField = useRef(null);

    const copyToClipboard = () => {
      inputField.current.select();
      document.execCommand("copy");
    };
  return (
    <div className="room-page">
      <Link to="/" className="back-button">
        Back
      </Link>
      <div className="meeting-container" ref={myMeeting} />
      <div className="link-container">
        <input
        className="copyInput"
          type="text"
          value={roomUrl}
          readOnly
          ref={inputField}
          onClick={() => inputField.current.select()}
        />
        <button onClick={copyToClipboard}>Copy Link</button>
      </div>
    </div>
  );
}

export default RoomPage;
