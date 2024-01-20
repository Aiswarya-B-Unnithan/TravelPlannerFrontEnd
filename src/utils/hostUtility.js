// userUtility.js

import { updateUser } from "../redux/userSlice";
import { fetchUserFromServer } from ".";

export const startUserUpdatePolling = (dispatch, userId, interval = 10000) => {
  const updateUserData = async () => {
   
    const updatedUser = await fetchUserFromServer(userId);
    if (updatedUser) {
      dispatch(updateUser(updatedUser));
    }
  };

  const pollingInterval = setInterval(updateUserData, interval);

  return () => clearInterval(pollingInterval);
};
