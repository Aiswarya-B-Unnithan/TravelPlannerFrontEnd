import React, { useEffect, useState, useRef } from "react";
import { TopBar } from "../components";
import { IoSendOutline } from "react-icons/io5";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import API_URLS from "../utils/apiConfig";
import { useValue } from "../context/ContextProvider";
import Container from "../components/style/ChatStyle";

const Chat = () => {
  const {
    state: { videoCall, voiceCall, incommingVideoCall, incommingVoiceCall },
    dispatch,
  } = useValue();
  
  const socket = useRef();

  //------------------------------->
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentChatId, setCurrentChatId] = useState(undefined);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  //------------------------------->
  //------------------------------->
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (currentUser && currentChatId) {
      socket.current = io(API_URLS.SERVER);
      // Emit both userId and chatId
      socket?.current.emit("add-user", currentUser._id, currentChatId);

      socket?.current?.on("socket-setup", (id) => {
        // console.log("socketid---->", id);
      });
    }

    return () => {
      if (socket?.current) {
        socket?.current.disconnect();
      }
    };
  }, [currentUser, currentChatId]);

  //------------------------------->

 
  //------------------------------->
  const fetchContacts = async () => {
    if (currentUser) {
      const data = await apiRequest({
        url: "/users/allContacts",
        token: user?.token,
        method: "GET",
      });
      setContacts(data.friends);
      
    }
  };
  //------------------------------->
  const handleChatChange = (chat) => {
    
    setCurrentChat(chat);
    setCurrentChatId(chat._id);
  };
  //------------------------------->
  return (
    <>
   
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            setContacts={setContacts}
            changeChat={handleChatChange}
            currentUser={currentUser}
            socket={socket}
          />
          {currentChat === undefined ? (
            <Welcome currentUser={currentUser} />
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
              chatId={currentChatId}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default Chat;
