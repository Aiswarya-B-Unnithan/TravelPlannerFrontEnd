import deleteImages from "./utils/deleteImages";
import fetchData from "./utils/fetchData";

const url = process.env.REACT_APP_SERVER_URL + "room";

export const createRoom = async (room, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });
  console.log(currentUser);
  const result = await fetchData(
    { url, body: room, token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The room has been added successfully",
      },
    });
    clearRoom(dispatch, currentUser);
    dispatch({ type: "UPDATE_SECTION", payload: 0 });
    dispatch({ type: "UPDATE_ROOM", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const getRooms = async (dispatch) => {
  dispatch({ type: "START_LOADING" });
  const result = await fetchData({ url, method: "GET" }, dispatch);
  if (result) {
    dispatch({ type: "UPDATE_ROOMS", payload: result });
  }
  dispatch({ type: "END_LOADING" });
};

export const deleteRoom = async (room, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    { url: `${url}/${room._id}`, method: "DELETE", token: currentUser?.token },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The room has been deleted successfully",
      },
    });

    dispatch({ type: "DELETE_ROOM", payload: result._id });
  }

  dispatch({ type: "END_LOADING" });
};

export const updateRoom = async (
  room,
  currentUser,
  dispatch,
  updatedRoom,
  deletedImages
) => {
  dispatch({ type: "START_LOADING" });
console.log("up70",room, currentUser, dispatch, updatedRoom, deletedImages);
  const result = await fetchData(
    {
      url: `${url}/${updatedRoom._id}`,
      method: "PATCH",
      body: room,
      token: currentUser?.token,
    },
    dispatch
  );
  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "The room has been updated successfully",
      },
    });

    clearRoom(dispatch, currentUser, deletedImages, updatedRoom);
    dispatch({ type: "UPDATE_SECTION", payload: 0 });
    dispatch({ type: "UPDATE_ROOM", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const clearRoom = (
  dispatch,
  currentUser,
  images = [],
  updatedRoom = null
) => {
  dispatch({ type: "RESET_ROOM" });
  localStorage.removeItem(currentUser.id);
  if (updatedRoom) {
    deleteImages(images, updatedRoom.uid);
  } else {
    deleteImages(images, currentUser.id);
  }
};

export const storeRoom = (
  location,
  details,
  images,
  updatedRoom,
  deletedImages,
  addedImages,
  userId
) => {
  if (
    location.lng ||
    location.lat ||
    details.price ||
    details.title ||
    details.description ||
    images.length
  ) {
    localStorage.setItem(
      userId,
      JSON.stringify({
        location,
        details,
        images,
        updatedRoom,
        deletedImages,
        addedImages,
      })
    );
    return true;
  } else {
    return false;
  }
};

export const addComment = async (roomId, newComment, currentUser, dispatch) => {
  dispatch({ type: "START_LOADING" });

  const result = await fetchData(
    {
      url: `${url}/addComment/${roomId}`,
      method: "POST",
      body: {
        text: newComment,
        userName: currentUser?.firstName,
      },
      token: currentUser?.token,
    },
    dispatch
  );

  if (result) {
    dispatch({
      type: "UPDATE_ALERT",
      payload: {
        open: true,
        severity: "success",
        message: "Comment added successfully",
      },
    });

    // Assuming 'result' contains the updated room data
    dispatch({ type: "UPDATE_ROOM", payload: result });
  }

  dispatch({ type: "END_LOADING" });
};

export const blockRoom=async(roomId, currentUser, dispatch)=>{
  console.log("roomIDDDDDD",roomId._id)
  const blockingRoomId=roomId?._id
  console.log("blockingRoomId", blockingRoomId);
 dispatch({ type: "START_LOADING" });

 try {
   const result = await fetchData(
     {
       url: `${url}/blockRoom/${blockingRoomId}`,
       method: "PATCH",
       body: { isBlock: true },
       token: currentUser?.token,
     },
     dispatch
   );
   console.log("room",result)
   if (result) {
    if (result?.isBlock)
    {
      // Dispatch an action to update the room state with the blocked room
      dispatch({ type: "UPDATE_ROOM", payload: { ...result, isBlock: true } });

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "The room has been blocked successfully",
        },
      });
    }
    else{
      // Dispatch an action to update the room state with the blocked room
      dispatch({ type: "UPDATE_ROOM", payload: { ...result, isBlock: false } });

      dispatch({
        type: "UPDATE_ALERT",
        payload: {
          open: true,
          severity: "success",
          message: "The room has been un-blocked successfully",
        },
      });
    }
      
   }
 } catch (error) {
   console.error("Error blocking room:", error);

   dispatch({
     type: "UPDATE_ALERT",
     payload: {
       open: true,
       severity: "error",
       message: "Error blocking the room",
     },
   });
 }

 dispatch({ type: "END_LOADING" });
}