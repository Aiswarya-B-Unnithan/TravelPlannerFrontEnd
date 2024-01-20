import fetchData from "./utils/fetchData";
import { v4 as uuidv4 } from "uuid";

import { apiRequest } from "../utils";
import API_URLS from "../utils/apiConfig";

const url = process.env.REACT_APP_SERVER_URL + "/host";
const url2 = process.env.REACT_APP_SERVER_URL + "host";
const url1 = process.env.REACT_APP_SERVER_URL + "admin";

export const registerInfo = async (user, dispatch) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const updateProfile = async (currentUser, updatedFields, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const { name, file } = updatedFields;
  let body = { name };

  try {
    if (file) {
      const res = await apiRequest({
        url: API_URLS.HOST_UPDATE_PROFILE_IMAGE_CLOUDINARY,
        data: updatedFields,
        method: "POST",
      });
      console.log("response", res);
      const url = res.data.secure_url;
      body = { ...body, url };
      console.log("body", body);
    }
    const result = await fetchData(
      {
        url: API_URLS.HOST_UPDATE_PROFILE,
        method: "post",
        body,
        token: currentUser?.token,
        headers: {
          "Content-Type": "application/json",
        },
      },
      dispatch
    );
    console.log(result);
    if (result) {
      dispatch({ type: "UPDATE_USER", payload: { ...currentUser, ...result } });
      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "Your profile has been updated successfully",
        },
      });
      dispatch({
        type: "UPDATE_PROFILE",
        payload: { open: false, file: null, photoURL: result.photoURL },
      });
    }
  } catch (error) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "error",
        message: error.message,
      },
    });
    console.log(error);
  }

  dispatch({ type: "END_LOADING" });
};

export const getHostUsers = async (dispatch, currentUser) => {
  const result = await fetchData(
    { url: url1, method: "GET", token: currentUser.token },
    dispatch
  );
  if (result) {
    dispatch({ type: "UPDATE_HOSTUSERS", payload: result });
  }
};

export const updateStatus = (updatedFields, userId, dispatch, currentUser) => {
  return fetchData(
    {
      url: `${url2}/updateStatus/${userId}`,
      method: "PATCH",
      token: currentUser.token,
      body: updatedFields,
    },
    dispatch
  );
};

export const logout = (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: "UPDATE_USER", payload: null });
  dispatch({ type: "RESET_ROOM" });
  dispatch({ type: "UPDATE_USERS", payload: [] });
  localStorage.removeItem("currentUser");
};
