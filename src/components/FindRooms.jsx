import { AddLocationAlt, Bed, LocationOn, Room } from "@mui/icons-material";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ClusterMap from "../components/hostComponents/map/ClusterMap";
//  import AddRoom from "../components/hostComponents/addRoom/AddRoom";
import Rooms from "../components/hostComponents/rooms/Rooms";
import RoomDetails from "./hostComponents/rooms/RoomDetails";
import NavBar from "./hostComponents/NavBar";
// import Protected from "../components/protected/Protected";
const BootomNavBar = () => {
  const [value, setValue] = useState(0);
  const ref = useRef();
  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);

  return (
    <Box ref={ref}>
     
      {
        {
          0: <ClusterMap />,
          1: <Rooms />,
        }[value]
      }
      <Paper
        elevation={3}
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 2 }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction label="Map" icon={<LocationOn />} />
          <BottomNavigationAction label="Rooms" icon={<Bed />} />
          <RoomDetails />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default BootomNavBar;
