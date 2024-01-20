import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./adminNavbar";
import { Logout } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

const HomeAdmin = () => {
  const containerStyle = {
    background:
      "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://th.bing.com/th/id/OIP.VtoGCi6qUAla3klBVsjtTQHaEo?rs=1&pid=ImgDetMain')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center", // Center items horizontally
  };

  const headingStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "white",
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "5px",
    backgroundColor: "#4CAF50", 
    display: "inline-block",
  };
 const dispatch = useDispatch();

 const handleLogout = () => {
   dispatch(Logout());
 };
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome Admin</h1>

      <div style={buttonContainerStyle}>
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>
        <Link to="/logout" onClick={handleLogout}  style={linkStyle}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default HomeAdmin;
