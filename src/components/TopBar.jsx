import { TbSocial } from "react-icons/tb";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdClose, IoMdNotificationsOutline } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";
import { useSelector, useDispatch } from "react-redux";
import { SetTheme } from "../redux/theme";
import {
  Logout,
  UpdateUnreadMessages,
  removeUnreadMessages,
} from "../redux/userSlice";
import { apiRequest, fetchPosts } from "../utils";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import API_URLS from "../utils/apiConfig";
import { io } from "socket.io-client";
import socket from "../utils/socketConnection";
import { CiVideoOn } from "react-icons/ci";

const TopBar = ({ newPostNotifications }) => {
  const [notificationList, setNotificationList] = useState([]);
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const { unreadMessages } = useSelector((state) => state.user);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
   
    newPostNotifications?.forEach((notification) => {
      setNotificationList((prevList) => [...prevList, notification]);
    });
  }, [newPostNotifications]);
  const handleNotificationClick = () => {
  
    setIsNotificationOpen(!isNotificationOpen);

    // Clear existing notifications when the notification icon is clicked
    if (!isNotificationOpen) {
      setNotificationList([]);

      // If there are new post notifications, filter out duplicates based on the entire notification object
      const uniqueNotifications = newPostNotifications?.reduce(
        (uniqueList, notification) => {
          const isDuplicate = uniqueList.some(
            (uniqueNotification) =>
              JSON.stringify(uniqueNotification) ===
              JSON.stringify(notification)
          );

          if (!isDuplicate) {
          
            uniqueList.push(notification);
          }

          return uniqueList;
        },
        []
      );

      // Add unique notifications to the notification list
      uniqueNotifications?.forEach((notification) => {
        addNotification(notification);
      });
    }
  };

  const handleNotificationClose = () => {
    setIsNotificationOpen(false);
  };

  const handleClearAllNotifications = () => {
    setNotificationList([]);
  };

  const addNotification = (notification) => {
    setNotificationList((prevList) => [...prevList, notification]);
  };

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // Make an API request to fetch the unread messages count
        const response = await apiRequest({
          url: `${API_URLS.FETCH_UNREAD_COUNT}`,
          method: "GET",
          token: user?.token,
        });
        console.log("res", response);
        // Update the state with the unread count
        if (response && response.success) {
          setUnreadCount(response.unreadCount);
        }
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    if (user) {
      // Call the function to fetch unread count
      fetchUnreadCount();
    }
  }, []);

  useEffect(() => {
    setHasUnreadMessages(JSON.stringify(unreadMessages) !== "[]");
  }, [unreadMessages]);

  useEffect(() => {
    if (user) {
      socket.current = io(API_URLS.SERVER);
      socket.current.emit("add-user", user._id);
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", async (msg) => {
        if (msg) {
          console.log(msg);
          dispatch(UpdateUnreadMessages(msg));
        }
      });
    }
  }, [user]);

  const handleChatIconClick = async () => {
    setHasUnreadMessages(false);
    dispatch(removeUnreadMessages());
    localStorage.removeItem("unreadMessages");
  };

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";

    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {
    await fetchPosts(user.token, dispatch, "", data);
  };

  return (
    <div className="topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary">
      <Link to="/" className="flex gap-2 items-center">
        <div className="p-1 md:p-2 bg-[#065ad8] rounded text-white">
          <TbSocial />
        </div>
        <span className="text-xl md:text-2xl text-[#065ad8] font-semibold">
          TravelPlanner
        </span>
      </Link>
      <form
        className="hidden md:flex items-center justify-center"
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder="Search..."
          styles="w-[18rem] lg:w-[38rem]  rounded-l-full py-3 "
          register={register("search")}
        />
        <CustomButton
          title="Search"
          type="submit"
          containerStyles="bg-[#0444a4] text-white px-6 py-2.5 mt-2 rounded-r-full"
        />
      </form>
      {/* Icons */}
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Theme Toggle */}
        <button onClick={() => handleTheme()} className="mr-4">
          {theme ? (
            <BsMoon style={{ color: "#000080", fontSize: "22px" }} />
          ) : (
            <BsSunFill />
          )}
        </button>
        {/* Notification Icon */}
        <div className="relative flex items-center mr-4">
          <IoMdNotificationsOutline
            className={`mr-2 ${
              isNotificationOpen
                ? `text-${theme === "dark" ? "white" : "black"}`
                : ""
            }`}
            onClick={handleNotificationClick}
            style={{ color: "#000080", fontSize: "30px" }}
          />
          {isNotificationOpen && (
            <div className="absolute top-12 right-0 w-60 bg-[#0444a4] bg-opacity-100 border border-[#719bd6] rounded-lg p-4 shadow-md overflow-y-auto max-h-60">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-md font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Notifications
                </span>
                <button
                  className={`text-sm ${
                    theme === "dark" ? "text-ascent-1" : "text-ascent-2"
                  } hover:${
                    theme === "dark" ? "text-ascent-2" : "text-ascent-1"
                  } focus:outline-none`}
                  onClick={handleClearAllNotifications}
                >
                  Clear All
                </button>
              </div>
              {notificationList.map((notification, index) => (
                <div key={index} className="mb-2">
                  <span
                    className={`text-sm ${
                      theme === "dark" ? "text-ascent-2" : "text-ascent-1"
                    }`}
                  >
                    {notification.message}
                  </span>
                </div>
              ))}
              <button
                className={`absolute top-2 right-2 ${
                  theme === "dark" ? "text-white" : "text-black"
                } hover:text-gray-700 focus:outline-none`}
                onClick={handleNotificationClose}
              >
                <IoMdClose />
              </button>
            </div>
          )}
        </div>

        {/* Chat Icon */}
        <Link to="/chat" className="relative flex items-center mr-4">
          <FaRegMessage
            className={`mr-2 ${hasUnreadMessages ? "text-[#08230d]" : ""}`}
            onClick={handleChatIconClick}
            style={{
              color: hasUnreadMessages ? "#0abe2b" : "#000080",
              fontSize: "22px",
            }}
          />
          {unreadCount > 0 && (
            <span className="absolute -top-3 -right-2 bg-red-500 text-[#0abe2b] rounded-full px-2 py-1 text-sm font-bold">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Video Call Icon */}
        <Link to="/videoCall" className="relative flex items-center">
          <CiVideoOn style={{ color: "#000080", fontSize: "30px" }} />
        </Link>
      </div>

      {/* Logout Button */}
      <div className="mt-2 md:mt-0">
        <CustomButton
          onClick={() => dispatch(Logout())}
          title="Log Out"
          containerStyles="text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full"
        />
      </div>
    </div>
  );
};
export default TopBar;
