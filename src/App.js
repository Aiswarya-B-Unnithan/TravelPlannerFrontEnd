import {
  Outlet,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useSelector } from "react-redux";
import UserRoute from "./routes/userRoutes";
import AuthRoute from "./routes/authRoute";
import HostRoute from "./routes/hostRoute";
import AdminRoute from "./routes/adminRoute";
import { useEffect } from "react";
import { useValue } from "./context/ContextProvider";
const Layout = ({ children }) => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
 
  const location = useLocation();

  useEffect(() => {
    if (!user?.user?.token) {
      navigate("/login");
    }
  }, [user?.user?.token]);
  return <>{children}</>;
};

function App() {
  const { user } = useSelector((state) => state.user);
  const role = user?.role;

  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Layout>
        {role === "Host" && <HostRoute />}
        {role === "Traveler" && <UserRoute />}
        {role === "Admin" && <AdminRoute />}
        {/* {(!role || role === "undefined") && <AuthRoute />} */}
      </Layout>
      <AuthRoute />
    </div>
  );
}

export default App;
