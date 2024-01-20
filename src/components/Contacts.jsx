import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import API_URLS from "../utils/apiConfig";
import { apiRequest } from "../utils";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector } from "react-redux";
import Container from "./style/ContactStyle";
export default function Contacts({
  contacts,
  currentUser,
  changeChat,
  socket,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [unreadMessages, setUnreadMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUserName(currentUser.firstName);
    setCurrentUserImage(currentUser.profileUrl);
  }, [currentUser]);
  //-------------------------------------->
  const markMessageAsRead = (senderId) => {
    setUnreadMessages((prevUnreadMessages) => {
      const updatedUnreadMessages = { ...prevUnreadMessages };
      delete updatedUnreadMessages[senderId];
      return updatedUnreadMessages;
    });
  };
  //-------------------------------------->
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const userId = currentUser?._id;
      try {
        const response = await apiRequest({
          url: `http://localhost:8800/chat/fetch-unread-msg_sender/${user?._id}`,
          method: "GET",
          token: currentUser?.token,
        });
        if (response.success && Array.isArray(response.unreadMessages)) {
          const unreadMessagesMap = response.unreadMessages.reduce(
            (acc, { message, sender }) => {
              const senderId = sender._id;
              acc[senderId] = acc[senderId] || { count: 0, sender };
              acc[senderId].count += 1;
              return acc;
            },
            {}
          );

          setUnreadMessages(unreadMessagesMap);
        }
      } catch (error) {
        console.error(
          "Error fetching unread messages for the current user:",
          error
        );
      }
    };

    fetchUnreadMessages();
  }, [contacts, currentUser]);
  //-------------------------------------->
  const handleGoBack = () => {
    navigate("/");
  };
  //-------------------------------------->
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
    if (unreadMessages[contact._id]) {
      markMessageAsRead(contact._id);
    }
  };
  //-------------------------------------->
  return (
    <>
      {currentUserImage && (
        <Container>
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h3>Travel Planner</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              const unreadMessageInfo = unreadMessages[contact?._id];
              const hasUnreadMessages =
                unreadMessageInfo && unreadMessageInfo?.count > 0;
              const isMessageFromContact =
                unreadMessageInfo?.sender?._id === contact?._id;
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  } ${hasUnreadMessages && isMessageFromContact ? "" : ""}`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img src={`${contact.profileUrl}`} alt="" />
                    {hasUnreadMessages && (
                      <div className="unread-count">
                        {unreadMessageInfo.count}
                      </div>
                    )}
                  </div>
                  <div className="username">
                    <h3>{contact.firstName}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <button className="back-button" onClick={handleGoBack}>
              <FiArrowLeft />
            </button>
            <div className="avatar">
              <img src={`${currentUserImage}`} alt="avatar" />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

