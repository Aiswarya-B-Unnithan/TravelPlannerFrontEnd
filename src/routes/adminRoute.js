import { useSelector } from "react-redux";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Dashboard from "../pages/dashboard/DashBoard";
import Home from "../pages/dashboard/Home";
import RoomDetails from "../components/hostComponents/rooms/RoomDetails";
import Notification from "../components/hostComponents/Notification";
import { Loading } from "../components";
import HomeAdmin from "../pages/dashboard/Home";
import AdminSection from "../pages/dashboard/AdminSection";

const UserRoute = () => {
  return (
    <>
      
      <Notification />
      <Routes>
        <Route path="/*" element={<HomeAdmin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/roomDetails*" element={<AdminSection />} />
      </Routes>
      
    </>
  );
};
export default UserRoute;
