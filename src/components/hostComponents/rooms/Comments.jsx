import React from "react";
import { Avatar, Box, Typography } from "@mui/material";

const Comments = ({ comment }) => {

  
  // Extract the first letter of the user's name
  const firstLetter = comment?.user?.firstName.charAt(0).toUpperCase();

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        mb: 2,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      {/* Avatar */}
      <Avatar>{firstLetter}</Avatar>

      {/* Comment details */}
      <Box sx={{ ml: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {comment?.user?.firstName}
        </Typography>
        <Typography variant="body2">{comment?.text}</Typography>
      </Box>
    </Box>
  );
};

export default Comments;
