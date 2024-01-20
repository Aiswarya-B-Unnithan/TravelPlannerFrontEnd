import { Route, Routes } from "react-router-dom"
import Register from "../pages/Register";
import Login from "../pages/Login";
import ResetPasswordPage from "../pages/ResetPassword";


const AuthRoute= ()=>{
return (
  <Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
  </Routes>
);
}
export default AuthRoute