import axios from "axios";
import { SetPosts } from "../redux/postSlice";
import { SetEvents } from "../redux/eventSlice";
const API_URL = "http://localhost:8800";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

export const apiRequest = async ({ url, token, data, method }) => {
  
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);

    if (err?.message === "Something is wrong with your authorization!") {
      localStorage.removeItem("user");
    
      window.alert("User session expired. Login again.");
      window.location.reload("/login");
    }
    return { status: err.success, message: err.message };
  }
};

export async function fetchPosts(token, dispatch, uri, data) {
  try {
    const res = await apiRequest({
      url: uri || "/posts",
      token: token,
      method: "POST",
      data: data || {},
      
    });

    dispatch(SetPosts(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
}
export async function fetchEvents(token, dispatch, uri, data) {
  try {
    const res = await apiRequest({
      url: uri || "/events",
      token: token,
      method: "POST",
      data: data || {},
    });

    dispatch(SetEvents(res?.data));
    return;
  } catch (error) {
    console.log(error);
  }
}
export const likePost = async ({ uri, token ,socket}) => {
  try {
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });
    socket?.current.emit("post-like", { ...res });
 
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/posts/" + id,
      token: token,
      method: "DELETE",
    });
  } catch (error) {
    console.log(error);
  }
};
export const editPost = async (postId, token, description) => {
  const data = { description, postId };

  try {
    const res = await apiRequest({
      url: "/posts/edit",
      token: token,
      data: data || {},
      method: "POST",
    });
   
  } catch (error) {
    console.log(error);
  }
};
export const deleteEvent = async (id, token) => {
  try {
    const res = await apiRequest({
      url: "/events/" + id,
      token: token,
      method: "DELETE",
    });
    
  } catch (error) {
    console.log(error);
  }
};

export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;

    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });

    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      window.alert("User session expired. Login again.");
      window.location.replace("/login");
    }

    return res?.user;
  } catch (error) {
    console.log(error);
  }
};

export const sendFriendRequest = async (token, id) => {

  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token: token,
      method: "POST",
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const handleApiError = (error) => {
  console.log(error);
};

export const viewUserProfile = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/profile-view",
      token: token,
      method: "POST",
      data: { id },
    });
  } catch (error) {
    console.log(error);
  }
};

export const unfriend = async (userId, friendId, token) => {
  const data = {
    userId,
    friendId,
  };

  try {
    const res = await apiRequest({
      url: "/users/unfriend",
      token: token,
      method: "POST",
      data: data,
    });
    console.log(res);
    if (res.success === true) {
     
      return { success: true, message: "Unfriended successfully" };
    } else {
      console.error("Unfriend operation failed");
      return { success: false, message: "Unfriend operation failed" };
    }
  } catch (error) {
    console.error("Error during unfriend operation", error);
    return { success: false, message: "Error during unfriend operation" };
  }
};
export const fetchUserFromServer = async (hostId) => {
  try {
    const response = await axios.get(
      `http://localhost:8800/host/hostUsers/${hostId}`
    );
    return response.data; // Assuming the server responds with the updated user object
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

