import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/hostUser/Home";
import PreHomePage from "../pages/hostUser/PreHomePage";
import DashBoard from "../pages/dashboard/DashBoard";
const HostRoute = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(user.adminVerification);
  useEffect(() => {
    // Check the adminVerification status and navigate accordingly
    if (
      user.adminVerification === "pending" ||
      user.adminVerification === "rejected"
    ) {
      // If adminVerification is false, navigate to PreHome
      navigate("/pre-home");
    }
  }, [user.adminVerification, navigate]);
  return (
    <Routes>
      <Route
        path="/"
        element={user.adminVerification ? <Home /> : <PreHomePage />}
      />
      <Route
        path="/pre-home"
        element={
          <PreHomePage
            adminVerification={user.adminVerification}
            email={user.email}
          />
        }
      />
      <Route path="/dashboard/*" element={<DashBoard />} />
    </Routes>
  );
};
export default HostRoute;
