// RoomsActions.js
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Preview, Edit } from "@mui/icons-material";
import { useValue } from "../../../context/ContextProvider";
import { clearRoom, deleteRoom } from "../../../actions/room";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoomsActions = ({ params }) => {
  const { user } = useSelector((state) => state.user);
  const { dispatch, state } = useValue();

  const navigate = useNavigate();

  const { _id, lng, lat, price, title, description, images, uid } = params.row;
  const { currentUser, updatedRoom, addedImages, images: newImages } = state;

  const handleEdit = () => {
    if (updatedRoom) {
      clearRoom(dispatch, currentUser, addedImages, updatedRoom);
    } else {
      clearRoom(dispatch, currentUser, newImages);
    }
    dispatch({ type: "UPDATE_LOCATION", payload: { lng, lat } });
    dispatch({
      type: "UPDATE_DETAILS",
      payload: { price, title, description },
    });
    dispatch({ type: "UPDATE_IMAGES", payload: images });
    dispatch({ type: "UPDATE_UPDATED_ROOM", payload: { _id, uid } });
    dispatch({ type: "UPDATE_SECTION", payload: 2 });
    if (user.role === "Admin") navigate("/roomDetails");
    else navigate("/");
  };

  return (
    <Box>
      {user?.role === "Host" && (
        <Tooltip title="View room details">
          <IconButton
            onClick={() => {
              dispatch({ type: "UPDATE_ROOM", payload: params?.row });
              navigate("/");
            }}
          >
            <Preview />
          </IconButton>
        </Tooltip>
      )}
      {user?.role === "Admin" && (
        <Tooltip title="View room details">
          <IconButton
            onClick={() => {
              dispatch({ type: "UPDATE_ROOM", payload: params?.row });
              navigate("/roomDetails");
            }}
          >
            <Preview />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Edit this room">
        <IconButton onClick={handleEdit}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete this room">
        <IconButton
          onClick={() => deleteRoom(params.row, currentUser, dispatch)}
        >
          <Delete />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RoomsActions;
