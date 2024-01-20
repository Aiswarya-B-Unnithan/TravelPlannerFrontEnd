import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Delete, Preview, Edit } from "@mui/icons-material";
import { useValue } from "../../../context/ContextProvider";
import { blockRoom, clearRoom, deleteRoom } from "../../../actions/room";
import { useNavigate } from "react-router-dom";
import { TbLockOff } from "react-icons/tb";
import { TbLockOpen } from "react-icons/tb";
import { CiLock } from "react-icons/ci";
const ReportedRoomActions = ({ params }) => {
  const { dispatch, state } = useValue();
  const roomStatus = state?.room?.isBlock;
  const navigate = useNavigate();

  if (params.row.roomId) {
    const { _id, roomId, reportedUser, reason, timestamp, id } = params.row;
    const { currentUser, updatedRoom, addedImages, images: newImages } = state;

    return (
      <Box>
        <Tooltip title="View room details">
          <IconButton
            onClick={() => {
              dispatch({ type: "UPDATE_ROOM", payload: params.row.roomId });
              navigate("/roomDetails");
            }}
          >
            <Preview />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete this room">
          <IconButton
            onClick={() => deleteRoom(params.row.roomId, currentUser, dispatch)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title="Block this room">
          <IconButton
            onClick={() => blockRoom(params.row.roomId, currentUser, dispatch)}
          >
            <CiLock />
          </IconButton>
        </Tooltip>
      </Box>
    );
  } else {
    const { _id, lng, lat, price, title, description, images, uid } =
      params.row;
    const { currentUser, updatedRoom, addedImages, images: newImages } = state;

    // const handleEdit = () => {
    //   if (updatedRoom) {
    //     clearRoom(dispatch, currentUser, addedImages, updatedRoom);
    //   } else {
    //     clearRoom(dispatch, currentUser, newImages);
    //   }
    //   dispatch({ type: "UPDATE_LOCATION", payload: { lng, lat } });
    //   dispatch({
    //     type: "UPDATE_DETAILS",
    //     payload: { price, title, description },
    //   });
    //   dispatch({ type: "UPDATE_IMAGES", payload: images });
    //   dispatch({ type: "UPDATE_UPDATED_ROOM", payload: { _id, uid } });
    //   dispatch({ type: "UPDATE_SECTION", payload: 2 });
    //   navigate("/");
    // };

    return (
      <Box>
        <Tooltip title="View room details">
          <IconButton
            onClick={() =>
              dispatch({ type: "UPDATE_ROOM", payload: params.row })
            }
          >
            <Preview />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Edit this room">
          <IconButton onClick={handleEdit}>
            <Edit />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Delete this room">
          <IconButton
            onClick={() => deleteRoom(params.row, currentUser, dispatch)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete this room">
          <IconButton
            onClick={() => deleteRoom(params.row, currentUser, dispatch)}
          >
            <TbLockOff />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }
};

export default ReportedRoomActions;
