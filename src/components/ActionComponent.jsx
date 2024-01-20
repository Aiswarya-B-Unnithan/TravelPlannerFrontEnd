import React from "react";
import UsersActions from "../pages/dashboard/users/UsersActions";
import ReportedRoomActions from "../pages/dashboard/rooms/reportedRoomActions";

const ActionsComponent = ({ actionsType, params, rowId, setRowId }) => {
  switch (actionsType) {
    case "users":
      return <UsersActions {...{ params, rowId, setRowId }} />;
    case "reportedRooms":
      return <ReportedRoomActions {...{ params, rowId, setRowId }} />;
    
    default:
      return null;
  }
};

export default ActionsComponent;
