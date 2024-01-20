import { Box, Slider, Typography } from "@mui/material";
import React from "react";
import { useValue } from "../../context/ContextProvider";

const RatingSlider = () => {
 const {
   state: { ratingFilter },
   dispatch,
 } = useValue();

 // Ensure ratingFilter is defined with a default value of 0
 const rating = ratingFilter ?? 0;
  return (
    <Box sx={{ mt: 5 }}>
      <Typography>Minimum Rating: {ratingFilter}</Typography>
      <Slider
        min={0}
        max={5}
        defaultValue={0}
        step={0.5}
        valueLabelDisplay="auto"
        value={ratingFilter}
        onChange={(e, rating) =>
          dispatch({ type: "FILTER_RATING", payload: rating })
        }
      />
    </Box>
  );
};

export default RatingSlider;
