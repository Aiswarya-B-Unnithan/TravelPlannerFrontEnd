import React, { useEffect, useState } from "react";
import { apiRequest } from "../../utils";
import API_URLS from "../../utils/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { CustomButton } from "../../components";
import { Logout } from "../../redux/userSlice";
import { startUserUpdatePolling } from "../../utils/hostUtility";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  //------------------------------------------>
  useEffect(() => {
    const userId = user?._id;

    if (userId) {
      const stopPolling = startUserUpdatePolling(dispatch, userId);
      return () => stopPolling();
    }
  }, [dispatch, user]);

  //------------------------------------------>
  const onReapply = async () => {
    try {
      const res = await apiRequest({
        url: API_URLS.REAPPLAY,
        data: { email: user?.email },
        token: user?.token,
        method: "PATCH",
      });
      if (res?.status === false) {
        toast.error(res?.message);
      }
      if (res.success === true) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //------------------------------------------>
  return (
    <nav className="bg-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          {user?.firstName && `Welcome, ${user?.firstName}`}
        </div>
        <div className="flex items-center">
          <div className="text-white mr-4">
            {user?.adminVerification && `Status: ${user?.adminVerification}`}
          </div>
          {user?.adminVerification === "rejected" && (
            <button
              className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-100"
              onClick={onReapply}
            >
              Reapply
            </button>
          )}

          <div>
            <CustomButton
              onClick={() => dispatch(Logout())}
              title="Log Out"
              containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-sm"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
