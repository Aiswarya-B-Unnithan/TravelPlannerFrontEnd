import React, { useMemo, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
} from "@mui/material";
import { ArrowBack, Brightness4, Brightness7, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const AppBar = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#2196F3", // Set your desired background color
  color: "#fff", // Set your desired text color
  width: "100%", // Set the width to 100%
  paddingLeft: open ? drawerWidth : 0,
  transition: theme.transitions.create(["padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function Nav() {
  const [dark, setDark] = useState(true);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );

  const handleBackToDashboard = () => {
    // Handle the navigation back to the dashboard or your desired page
    navigate("/dashboard");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar open={false}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="back to dashboard"
              onClick={handleBackToDashboard}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Back to Dashboard
            </Typography>
            <IconButton onClick={() => setDark(!dark)}>
              {dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
