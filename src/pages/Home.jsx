import React, { useEffect, useRef, useState } from "react";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { Close } from "@mui/icons-material";
import {
  CustomButton,
  EditProfile,
  FriendsCard,
  Loading,
  PostCard,
  ProfileCard,
  TextInput,
  TopBar,
} from "../components";
import { Link } from "react-router-dom";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import {
  apiRequest,
  deleteEvent,
  deletePost,
  editPost,
  fetchEvents,
  fetchPosts,
  getUserInfo,
  handleFileUpload,
  likePost,
  sendFriendRequest,
} from "../utils";
import { useForm } from "react-hook-form";
import { NoProfile } from "../assets";
import { UpdateProfile, UserLogin } from "../redux/userSlice";
import { LiaEditSolid } from "react-icons/lia";
import { updateEvents } from "../redux/eventSlice";
import CreateEvent from "../components/CreateEvent";
import Event from "../components/Event";
import FindRoom from "../components/FindRooms";
import FindFriendsMap from "../components/FindFriendsMap";
import { Button } from "@mui/material";
import API_URLS from "../utils/apiConfig";
import { io } from "socket.io-client";
const Home = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  //-------------------------------------->
  const dispatch = useDispatch();
  const { user, edit } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.posts);
  const [friendRequest, setFriendRequest] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const { events, editEvents } = useSelector((state) => state.events);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  // const [file, setFile] = useState(null);
  const [postImage, setPostImage] = useState([]);
  const [showFindRoom, setShowFindRoom] = useState(false);
  const [showFindFriendsMap, setShowFindFriendsMap] = useState(false);
  const [newPostNotifications, setNewPostNotifications] = useState([]);
  const [newFriendtNotification, setNewFriendNotification] = useState(null);
  ///////////////////////////////////
  //-------------------------------------->
  const socket = useRef(null);
  useEffect(() => {
    // Set up socket connection
    socket.current = io("http://localhost:8800");

    socket.current.on("connect_error", (err) => {
      console.log("Socket connection error:", err.message);
    });

    return () => {
      // Disconnect socket when component unmounts
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);
  const fetchNotificationdata = async () => {
    await fetchNotification();
  };
  useEffect(() => {
    fetchNotificationdata();
  }, []);
  //-------------------------------------->
  useEffect(() => {
    if (socket.current) {
      socket.current.on("new-post", (newPostData) => {
        // console.log("New post received:", newPostData);
        const newNotification = {
          message: `New post created by ${newPostData.userName} `,
          timestamp: new Date().toISOString(),
          createdUser: newPostData.userName,
        };
        handlingNotification(newNotification);
      });
      socket.current.on("new-event", (newEventData) => {
        const newNotification = {
          message: `New event created by ${newEventData?.userName} `,
          timestamp: new Date().toISOString(),
          createdUser: newEventData.userName,
        };
        handlingNotification(newNotification);
      });
      socket.current.on("new-like-event", (likeDetails) => {
        const newNotification = {
          message: `${likeDetails?.creator} post is liked by  ${likeDetails?.likedUser}.`,
          timestamp: new Date().toISOString(),
          createdUser: likeDetails.creator,
        };
        handlingNotification(newNotification);
      });
      socket.current.on("newComment", (commentData) => {
        // Format timestamp
        const timestamp = new Date(commentData.timestamp).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }
        );
        const newNotification = {
          message: `${commentData?.newCommentFrom} comment on ${commentData?.userName} post ${commentData.postDescription}.`,
          timestamp: new Date().toISOString(),
          createdUser: commentData.newCommentFrom,
        };
        handlingNotification(newNotification);
      });
    }
    const handlingNotification = async (newNotification) => {
      await sendNotificationToBackend(newNotification);
      // Update state by adding the new notification to the array
      // await setNewPostNotifications((prevNotifications) => [
      //   newNotification,
      //   ...prevNotifications,
      // ]);
      // console.log(newPostNotifications);
    };
    return () => {
      if (socket.current) {
        socket.current.off("new-post");
      }
    };
  }, [socket]);
  //-------------------------------------->
  useEffect(() => {
    if (socket.current) {
      socket.current.on("new-friend-request", (sender) => {
        

        setNewFriendNotification({
          message: `New friend requset received .Show notification!`,

          timestamp: new Date().toISOString(),
        });
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("new-friend-request");
      }
    };
  }, [socket]);

  //-------------------------------------->
  const handleFindFriendsClick = () => {
    try {
      // Set the state after scrolling to the top
      setShowFindFriendsMap(true);
    } catch (error) {
      console.error("Error scrolling to top:", error);
    }
  };
  //-------------------------------------->
  const handleFindStayClick = () => {
    setShowFindRoom(true);
  };
  //-------------------------------------->
  const handleCloseModal = () => {
    setShowFindFriendsMap(false);
    setShowFindRoom(false);
  };
  //-------------------------------------->
  const fetchPost = async () => {
    await fetchPosts(user?.token, dispatch);
    setLoading(false);
  };
  //-------------------------------------->
  const fetchEvent = async () => {
    await fetchEvents(user?.token, dispatch);
    setLoading(false);
  };
  //-------------------------------------->
  const onSubmitPost = async (data) => {
    setPosting(true);
    setErrMsg("");
    try {
      const { description } = data;
      const res = await apiRequest({
        url: API_URLS.CREATE_POST,
        data: { description, images: postImage },
        token: user?.token,
        method: "POST",
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
    
        socket.current.emit("post-created", { ...res, userId: user._id });

        reset({
          description: "",
        });

        setErrMsg("");
        await fetchPost();
      }
      setPosting(false);
      setPostImage([]);
    } catch (error) {
      console.log(error);
      setPosting(false);
    }
  };
  //-------------------------------------->
  const handleLikePost = async (uri) => {
    const res = await likePost({ uri: uri, token: user?.token, socket });
    await fetchPost();
  };
  //-------------------------------------->
  const handlePost = (e) => {
    const { files } = e.target;

    // Using the spread operator to create a new array with the existing images
    const updatedImages = [...postImage];

    // Loop through the selected files
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const result = reader.result;
        updatedImages.push(result);
        setPostImage(updatedImages);
      };
    });
  };
  //-------------------------------------->
  const handleVideoUpload = async (e) => {};
  //-------------------------------------->
  const handleDelete = async (id) => {
    await deletePost(id, user.token);
    await fetchPost();
  };
  //-------------------------------------->
  const handleDeleteEvent = async (id) => {
    await deleteEvent(id, user.token);
    await fetchEvent();
  };
  //-------------------------------------->
  const fetchFriendRequests = async () => {
    try {
      const res = await apiRequest({
        url: API_URLS.GET_FRIEND_REQUEST,
        token: user?.token,
        method: "POST",
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  //-------------------------------------->
  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: API_URLS.SUGGESTED_FRIENDS,
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  //-------------------------------------->
  const handleFriendRequest = async (id) => {
    try {
      const res = await sendFriendRequest(user.token, id);
     

      socket.current.emit("friend-requset", res);

      await fetchSuggestedFriends();
    } catch (error) {
      console.log(error);
    }
  };
  //-------------------------------------->
  const acceptFriendRequest = async (id, status) => {
    try {
      const res = await apiRequest({
        url: API_URLS.ACCEPT_FRIEND_REQUEST,
        token: user?.token,
        method: "POST",
        data: { rid: id, status },
      });
      setFriendRequest(res?.data);
    } catch (error) {
      console.log(error);
    }
  };
  //-------------------------------------->
  const getUser = async () => {
    const res = await getUserInfo(user?.token);
    const newData = { token: user?.token, ...res };
    dispatch(UserLogin(newData));
  };
  //-------------------------------------->
  const sendNotificationToBackend = async (notification) => {
    
    try {
      const data = await apiRequest({
        url: "/users/addNotificationToDb",
        method: "POST",
        token: user.token,
        data: {
          userId: user._id,
          userName: notification?.createdUser,
          message: notification?.message,
          receiverId: notification?.receiverId,
          timestamp: notification.timestamp,
        },
      });

      await fetchNotification();
     
    } catch (error) {
      console.error("Error sending notification to the backend:", error);
    }
  };
  //-------------------------------------->
  const fetchNotification = async () => {
    try {
      const data = await apiRequest({
        url: `/users/getNotification/${user?._id}`,
        method: "GET",
        token: user.token,
      });

      setNewPostNotifications((prevNotifications) => [
        ...prevNotifications,
        ...data.notifications,
      ]);

      
    } catch (error) {
      console.error("Error fetching notification from the backend:", error);
    }
  };
  //-------------------------------------->
  useEffect(() => {
    setLoading(true);
    getUser();
    fetchPost();
    fetchEvent();
    fetchFriendRequests();
    fetchSuggestedFriends();
  }, []);
  //-------------------------------------->
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if the click is outside of the modal content
      if (
        e.target.classList.contains("modal-overlay") ||
        e.target.classList.contains("modal-content")
      ) {
        handleCloseModal();
      }
    };

    // Add event listener when the modal is shown
    if (showFindRoom || showFindFriendsMap) {
      document.addEventListener("click", handleOutsideClick);
    }

    // Remove event listener when the modal is hidden or component unmounts
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [showFindRoom, showFindFriendsMap]);
  //-------------------------------------->
  return (
    <>
      <div className="w-full px-0 lg:px-10 pb-5 md:pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar newPostNotifications={newPostNotifications} />

        <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
          {/* LEFT */}
          <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto md:pl-4 lg:pl-0">
            <ProfileCard user={user} />
            <FriendsCard friends={user?.friends} />
          </div>

          {/* CENTER */}
          <div className=" flex-1 h-full bg-orimary px-4 flex flex-col gap-6 overflow-y-auto">
            <form
              className="bg-primary px-4 rounded-lg"
              onSubmit={handleSubmit(onSubmitPost)}
            >
              <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
                <img
                  src={user?.profileUrl ?? NoProfile}
                  alt="UserImage"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <TextInput
                  styles="w-full rounded-full py-5"
                  placeholder="What's on your mind...."
                  name="description"
                  register={register("description", {
                    required: "Write something about post",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />
              </div>
              {errMsg?.message && (
                <span
                  role="alert"
                  className={`text-sm ${
                    errMsg?.status === "failed"
                      ? "text-[#f64949fe]"
                      : "text-[#2ba150fe]"
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className="flex items-center justify-between py-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    onChange={(e) => handlePost(e)}
                    className="hidden"
                    id="imgUpload"
                    data-max-size="5120"
                    accept=".jpg, .png, .jpeg"
                    multiple
                  />
                  <BiImages />
                  <span>Image</span>
                </label>
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                  htmlFor="vdUpload"
                >
                  <input
                    type="file"
                    onChange={(e) => handleVideoUpload(e)}
                    className="hidden"
                    id="vdUpload"
                    accept=".mp4"
                    multiple
                  />
                  <BiImages />
                  <span>Video</span>
                </label>
                <label className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer">
                  <LiaEditSolid
                    size={22}
                    className="text-blue cursor-pointer"
                    onClick={() => dispatch(updateEvents(true))}
                  />
                  <span>Event</span>
                </label>

                {posting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type="submit"
                    title="Post"
                    containerStyles="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                  />
                )}
              </div>
            </form>

            <div className="block md:hidden">
              <ProfileCard user={user} />
            </div>
            {showFindRoom && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                className="modal-overlay"
              >
                <div
                  style={{
                    position: "relative",
                    width: "80%",
                    maxWidth: "600px",
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                  className="modal-content"
                >
                  <button
                    style={{
                      backgroundColor: "#0444a4",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                    onClick={handleCloseModal}
                  >
                    <Close />
                  </button>
                  <FindRoom />
                </div>
              </div>
            )}
            {showFindFriendsMap && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000,
                }}
                className="modal-overlay"
              >
                <div
                  style={{
                    position: "relative",
                    width: "80%", // Adjust as needed
                    maxWidth: "600px", // Set a max-width if desired
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                  className="modal-content"
                >
                  <button
                    style={{
                      backgroundColor: "#0444a4",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                    onClick={handleCloseModal}
                  >
                    <Close />
                  </button>
                  <FindFriendsMap />
                </div>
              </div>
            )}
            {loading ? (
              <Loading />
            ) : posts?.length > 0 ? (
              posts?.map((post) => (
                <PostCard
                  post={post}
                  key={post?._id}
                  user={user}
                  deletePost={handleDelete}
                  likePost={handleLikePost}
                  socket={socket}
                />
              ))
            ) : (
              <div className="flex w-full h-full items-center justify-center">
                <p className="text-lg text-ascent-2">No Post Available</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden w-1/4 h-full lg:flex flex-col gap-8 overflow-y-auto">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleFindFriendsClick}
            >
              FIND FRIENDS
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleFindStayClick}
            >
              {" "}
              FIND STAY
            </Button>
            {/* FRIEND REEQUESTS */}
            <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span> Friend Request</span>
                <span>{friendRequest?.length}</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {friendRequest?.map(({ _id, requestFrom: from }, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index + _id}
                  >
                    <Link
                      to={"/profile/" + from._id}
                      key={from?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={from?.profileUrl ?? NoProfile}
                        alt={from?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {from?.firstName} {from?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {from?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <CustomButton
                        onClick={() => acceptFriendRequest(_id, "Accepted")}
                        title="Accept"
                        containerStyles="bg-[#0444a4] text-xs text-white px-1.5 py-1 rounded-full"
                      />
                      <CustomButton
                        title="Deny"
                        onClick={() => acceptFriendRequest(_id, "Denied")}
                        containerStyles="border border-[#666] text-xs text-ascent-1 px-1.5 py-1 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUGGESTED FRIENDS */}
            <div className="w-full bg-primary shadow-xl rounded-lg px-6 py-5">
              <div className="flex items-center justify-between text-xl text-ascent-1 pb-2 border-b border-[#66666645]">
                <span>Friend Suggestion</span>
              </div>
              <div className="w-full flex flex-col gap-4 pt-4">
                {suggestedFriends?.map((friend, index) => (
                  <div
                    className="flex items-center justify-between"
                    key={index + friend?._id}
                  >
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile}
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>

                    <div className="flex gap-1">
                      <button
                        className="bg-[#0444a430] text-sm text-white p-1 rounded"
                        onClick={() => handleFriendRequest(friend?._id)}
                      >
                        <BsPersonFillAdd size={20} className="text-[#0f52b6]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Recent Events Section */}
            <div className="bg-primary px-4 rounded-lg">
              <h2 className="text-xl font-medium text-ascent-1 py-4 border-b border-[#66666645]">
                Recent Events
              </h2>
              <div className="events-container overflow-y-scroll max-h-30">
                {events?.length > 0 ? (
                  events.map((event) => (
                    <Event
                      event={event}
                      key={event?._id}
                      deleteEvent={handleDeleteEvent}
                    />
                  ))
                ) : (
                  <p className="text-lg text-ascent-2 py-4">No Recent Events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {edit && <EditProfile />}
      {editEvents && (
        <CreateEvent
          fetchEvents={fetchEvents}
          newPostNotifications={newPostNotifications}
          socket={socket}
        />
      )}
    </>
  );
};

export default Home;
