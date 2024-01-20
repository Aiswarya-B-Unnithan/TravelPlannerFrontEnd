// apiConfig.js
const API_URLS = {
  SERVER: "http://localhost:8800",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_CALL_TOKEN: "http://localhost:8800/auth/generate-token",
  CREATE_POST: "/posts/create-post",
  GET_FRIEND_REQUEST: "/users/get-friend-request",
  SUGGESTED_FRIENDS: "/users/suggested-friends",
  ACCEPT_FRIEND_REQUEST: "/users/accept-request",
  CREATE_EVENT: "/events/create",
  UPDATE_USER: "users/update-user",
  REPORT_TRAVELER: "users/report",
  REPORTED_TRAVELERS: "admin/reportedUsers",
  REPORTED_ROOMS: "admin/reportedRooms",
  GET_POST_COMMENT: "/posts/comments/",
  HOST_UPDATE_PROFILE_IMAGE_CLOUDINARY: "/host/updateProfileImage",
  HOST_UPDATE_PROFILE: "http://localhost:8800/host/updateProfile",
  REQUESTS_FROM_HOSTS: "admin/requests",
  SEND_MAIL: "admin/sendMail",
  REAPPLAY: "/host/reapply",
  SEND_TEXT_MESSAGE: "chat/addmsg/",
  SEND_IMAGE_MESSAGE: "http://localhost:8800/chat/addImgmsg/",
  GET_ALL_MSGES: "chat/getmsg/",
  SEND_FILE_MESSAGE: "http://localhost:8800/chat/filemsg/",
  SEND_VOICE_MESSAGE: "http://localhost:8800/chat/voicemsg/",
  SEND_VIDEO_MESSAGE: "http://localhost:8800/chat/videomsg/",
  MARK_CHAT_AS_READ: "http://localhost:8800/chat/mark-chat-as-read/",
  FETCH_UNREAD_COUNT: "http://localhost:8800/chat/fetch-unread-count/",
  FETCH_UNREAD_MSG_CURRENT_USER:
    "http://localhost:8800/chat/fetch-unread-msg_sender/",
  MARK_NOTIFICATION_AS_READ:
    "http://localhost:8800/users/mark-notification-as-read",
};

export default API_URLS;
