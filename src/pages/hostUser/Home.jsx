import React, { useEffect } from "react";
import NavBar from "../../components/hostComponents/NavBar";
import BootomNavBar from "../../components/hostComponents/BootomNavBar";
import RoomDetails from "../../components/hostComponents/rooms/RoomDetails";
import { useNavigate } from "react-router-dom";
import { useValue } from "../../context/ContextProvider";
import { useSelector } from "react-redux";
import Notification from "../../components/hostComponents/Notification";
const Home = () => {
 
  const {
    state: { currentUser },
  } = useValue();
    

  return (
    <>
    <Notification/>
      <NavBar />
      <BootomNavBar />
      <RoomDetails />
    </>
  );
};

export default Home;
