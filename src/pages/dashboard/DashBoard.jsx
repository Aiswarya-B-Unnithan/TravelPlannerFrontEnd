import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MuiAppBar from "@mui/material/AppBar";
import { Brightness4, Brightness7, Home, Menu } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideList from "./SideList";
import EmailDialog from "./EmailDialog";
import { CiMail } from "react-icons/ci";
import { apiRequest } from "../../utils";
import API_URLS from "../../utils/apiConfig";
import { useSelector } from "react-redux";
// import Protected from "../../components/protected/Protected";
// import Login from "../../components/user/Login";
const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
const {user}=useSelector((state)=>state.user)
  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleOpenEmailDialog = () => {
    setEmailDialogOpen(true);
  };

  const handleCloseEmailDialog = () => {
    setEmailDialogOpen(false);
  };

 const handleSendEmail = async ({ recipientEmail, emailContent }) => {
   try {
     const res = await apiRequest({
       url: API_URLS.SEND_MAIL,
       data: { recipientEmail, emailContent },
       token: user?.token,
       method: "POST",
     });

     if (res.success) {
       toast.success(res.result, {
         position: "top-right",
         autoClose: 3000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
       });
     } else {
       toast.error("Failed to send email", {
         position: "top-right",
         autoClose: 3000,
         hideProgressBar: false,
         closeOnClick: true,
         pauseOnHover: true,
         draggable: true,
       });
     }
   } catch (error) {
     console.error("Error sending email:", error);
     toast.error("Error sending email", {
       position: "top-right",
       autoClose: 3000,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
     });
   }
 };
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <Menu />
            </IconButton>
            <Tooltip title="Go back to home page">
              <IconButton sx={{ mr: 1 }} onClick={() => navigate("/")}>
                <Home />
              </IconButton>
            </Tooltip>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            {user?.role === "Admin" && (
              <Tooltip title="Send Email">
                <IconButton onClick={handleOpenEmailDialog}>
                  <CiMail />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={() => setDark(!dark)}>
              {dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <SideList {...{ open, setOpen }} />
        <EmailDialog
          open={emailDialogOpen}
          onClose={handleCloseEmailDialog}
          onSend={handleSendEmail}
        />
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}
