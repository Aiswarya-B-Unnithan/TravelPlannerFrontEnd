import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
  unreadMessages: JSON.parse(window?.localStorage.getItem("user.unreadMessages")) ?? [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("user");
         localStorage?.removeItem("currentUser");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    updateUnreadMessages(state, action) {
      state.unreadMessages = state.unreadMessages.concat(action.payload);
      localStorage.setItem(
        "unreadMessages",
        JSON.stringify(state.unreadMessages)
      );
    },
    // Add a new reducer to handle updating unreadMessages
    removeUnreadMessages(state, action) {
      state.unreadMessages = [];
      localStorage?.removeItem("user.unreadMessages");
    },
    updateUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export default userSlice.reducer;

export const {
  login,
  logout,
  updateProfile,
  updateUnreadMessages,
  removeUnreadMessages,
  updateUser,
} = userSlice.actions;

export function UserLogin(user) {
  return (dispatch, getState) => {
    dispatch(login(user));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(logout());
  };
}

export function UpdateProfile(val) {
  return (dispatch, getState) => {
    dispatch(updateProfile(val));
  };
}

export function UpdateUnreadMessages(unreadMessages) {
  return (dispatch, getState) => {
    dispatch(updateUnreadMessages(unreadMessages));
  };
}
export function UpdateUser(user) {
  return (dispatch, getState) => {
    dispatch(updateUser(user));
  };
}