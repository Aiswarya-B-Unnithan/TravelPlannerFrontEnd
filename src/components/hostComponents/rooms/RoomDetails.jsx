import React, { forwardRef, useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Rating,
  Select,
  Slide,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useValue } from "../../../context/ContextProvider";
import { Close, StarBorder } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow, Lazy, Zoom } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import "swiper/css/effect-coverflow";

import "swiper/css/lazy";

import "swiper/css/zoom";
import "./swiper.css";
import { addComment } from "../../../actions/room";
import Comments from "./Comments";
import axios from "axios";

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref} />;
});
const RoomDetails = () => {
  const [place, setPlace] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]); 
  const [showReportModal, setShowReportModal] = useState(false); 
  const [reportReason, setReportReason] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [currentRoom, setCurrentRoom] = useState(null);

  const {
    state: { room, currentUser },
    dispatch,
  } = useValue();
 
useEffect(() => {
  if (room) {
 
    axios
      .get(`http://localhost:8800/room/${room._id}`)
      .then((response) => {
        const { room: updatedRoom } = response.data;
        setCurrentRoom(updatedRoom);
        setUserRating(updatedRoom.ratings || 0);
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
      });

   
  }
}, [room]);
const handleRatingChange = (event, newValue) => {
   setUserRating(newValue);

   // Assuming you have a room ID and an API endpoint to update the rating
   const roomId = room?._id;

  
  axios
    .post(`http://localhost:8800/room/updateRating`, {
      roomId,
      newRating: newValue,
    })
    .then((response) => {
      // Update the local state with the new averageRating
      setCurrentRoom((prevRoom) => ({
        ...prevRoom,
        averageRating: response.data.room.averageRating,
      }));
alert("Rating updated successfully:", response.data);
      // Log or handle the success response if needed
    })
    .catch((error) => {
      // Log or handle the error if the request fails
      console.error("Error updating rating:", error);
    });
};
  useEffect(() => {
    if (room) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${room.lng},${room.lat}.json?access_token=${process.env.REACT_APP_MAP_TOKEN}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => setPlace(data.features[0]));
      setComments(room.comments || []);
    }
  }, [room]);

  //REPORT
  const canReport = currentUser && room?.uId !== currentUser._id;
   const handleReport = () => {
     setShowReportModal(true);
   };
const handleCloseReportModal = () => {
  setShowReportModal(false);
  setReportReason(""); // Clear the selected report reason when the modal is closed
};

const handleReportSubmit = async (roomId, userId, userToken) => {
  const response = await axios.post(
    "http://localhost:8800/users/reportedRooms/submitReport",
    {
      roomId,
      userId,
      reportReason,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`, // Include the token in the Authorization header
      },
    }
  );
  // Log the response from the server

  handleCloseReportModal();
};

const handleReportReasonChange = (event) => {
  setReportReason(event.target.value);
};
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };
  const handleCommentSubmit = async () => {
   
    await addComment(room?._id, newComment, currentUser, dispatch);
    setComments((prevComments) => [
      ...prevComments,
      { user: currentUser, text: newComment },
    ]);
    setNewComment("");
  };
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };
  const handleClose = () => {
    dispatch({ type: "UPDATE_ROOM", payload: null });
  };

  return (
    <Dialog
      fullScreen
      open={Boolean(room)}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" component="h3" sx={{ ml: 2, flex: 1 }}>
            {room?.title}
          </Typography>
          <IconButton color="inherit" onClick={handleClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          pt: 3,
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow, Lazy, Zoom]}
          centeredSlides
          slidesPerView={2}
          grabCursor
          navigation
          autoplay
          lazy
          zoom
          effect="coverflow"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
        >
          {room?.images?.map((url) => (
            <SwiperSlide key={url}>
              <div className="swiper-zoom-container">
                <img src={url} alt="room" />
              </div>
            </SwiperSlide>
          ))}
          {canReport && (
            <Tooltip
              title={room?.uName || ""}
              sx={{
                position: "absolute",
                bottom: "8px",
                left: "8px",
                zIndex: 2,
              }}
            >
              <Avatar src={room?.uPhoto} />
            </Tooltip>
          )}
        </Swiper>
        <Stack sx={{ p: 3 }} spacing={2}>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h6" component="span">
                {"Price Per Night: "}
              </Typography>
              <Typography component="span">
                {room?.price === 0 ? "Free Stay" : "$" + room?.price}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" component="span">
                {"Ratings: "}
              </Typography>
              <Rating
                name="room-ratings"
                value={room?.averageRating}
                precision={0.5}
                onChange={handleRatingChange}
              />
              <span>{room?.averageRating?.toFixed(1)}</span>
            </Box>
          </Stack>
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="h6" component="span">
                {"Place Name: "}
              </Typography>
              <Typography component="span">{place?.text}</Typography>
            </Box>
            <Box>
              <Typography variant="h6" component="span">
                {"Address: "}
              </Typography>
              <Typography component="span">{place?.place_name}</Typography>
            </Box>
          </Stack>
          <Stack>
            <Typography variant="h6" component="span">
              {"Details: "}
            </Typography>
            <Typography component="span">{room?.description}</Typography>
          </Stack>
        </Stack>
        {canReport && (
          <Box
            sx={{
              bottom: "16px",
              right: "906px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton color="primary" onClick={handleReport}>
              {/* You can replace this with your actual report button icon */}
              Report
            </IconButton>
          </Box>
        )}
        <Box sx={{ p: 1 }} spacing={2}>
          {/* Show/Hide Comments Button */}
          <button onClick={toggleComments}>
            {showComments ? "Hide Comments" : "Show Comments"}
          </button>

          {showComments && comments.length > 0 && (
            <div>
              <Typography variant="h6" component="span">
                Comments:
              </Typography>
              {comments.map((comment, index) => (
                // Render the Comments component for each comment
                <Comments key={index} comment={comment} />
              ))}
            </div>
          )}

          {/* Add new comment */}
          <div style={{ marginTop: "16px" }}>
            <Typography variant="h6" gutterBottom>
              Add a Comment:
            </Typography>
            <Box display="flex" flexDirection="column">
              <textarea
                value={newComment}
                onChange={handleCommentChange}
                rows={4}
                style={{
                  resize: "none",
                  marginBottom: "8px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />
              <button
                onClick={handleCommentSubmit}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "8px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit Comment
              </button>
            </Box>
          </div>
        </Box>
        <Dialog open={showReportModal} onClose={handleCloseReportModal}>
          <DialogTitle>Report this room</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel>Choose a reason</InputLabel>
              <Select
                value={reportReason}
                onChange={handleReportReasonChange}
                label="Choose a reason"
              >
                <MenuItem value="Not Cleaned">Not Cleaned</MenuItem>
                <MenuItem value="Very Expensive">Very Expensive</MenuItem>
                <MenuItem value="Very Small Room">Very Small Room</MenuItem>
                {/* Add more report reasons as needed */}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReportModal}>Cancel</Button>
            <Button
              onClick={() =>
                handleReportSubmit(
                  room?._id,
                  currentUser._id,
                  currentUser.token
                )
              }
              color="primary"
            >
              Submit Report
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Dialog>
  );
};

export default RoomDetails;
