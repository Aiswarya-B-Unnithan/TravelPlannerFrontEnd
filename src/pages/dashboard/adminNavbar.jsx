import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Logout } from "../../redux/userSlice";


const Navbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(Logout());
  };

  const navbarStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  };

  const linkStyle = {
    margin: "0 20px",
    fontSize: "1.2rem",
    color: "white",
    textDecoration: "none",
  };

  return (
    <div style={navbarStyle}>
      <Link to="/dashboard" style={linkStyle}>
        Dashboard
      </Link>
      <button onClick={handleLogout} style={linkStyle}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
