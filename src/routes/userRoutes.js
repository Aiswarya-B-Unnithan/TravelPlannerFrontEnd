import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import HomePage from "../pages/Home";
import ProfilePage from "../pages/Profile";
import Chat from "../pages/Chat";
// import ResetPasswordPage from "../pages/ResetPassword";
// import Login from "../Pages/LoginPage";
// import Register from "../Pages/RegisterPage";
// import { useEffect } from "react";
// const val = 0;
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import VideoCall from "../components/call/VideoCall";
import VideoChat from "../components/VideoCall";
import RoomPage from "../pages/room";
const UserRoute = () => {


   const socket = useRef(null);

   useEffect(() => {
     // Set up socket connection
     socket.current = io("http://localhost:8800");

     // Handle connect error
     socket.current.on("connect_error", (err) => {
       console.log("Socket connection error:", err.message);
     });

     // Clean up socket connection on component unmount
     return () => {
       if (socket.current) {
         socket.current.disconnect();
       }
     };
   }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage socket={socket.current} />} />
      <Route path="/profile/:id?" element={<ProfilePage />} />
      <Route path="/chat" element={<Chat socket={socket.current} />} />
      <Route path="/videoCall" element={<VideoChat />} />
      <Route path="/room/:roomId" element={<RoomPage/>} />
    </Routes>
  );
};
export default UserRoute;
