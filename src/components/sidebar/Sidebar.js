import { Box, Drawer, IconButton, Rating, styled, Typography } from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import PriceSlider from './PriceSlider';
import { useValue } from '../../context/ContextProvider';
import { useState } from 'react';
import RatingSlider from './ratingSlider';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { containerRef } = useValue();
  const [minRating, setMinRating] = useState(0);

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
    // You can add logic to update your state or perform other actions here
  };
  return (
    <Drawer variant="persistent" hideBackdrop={true} open={isOpen}>
      <DrawerHeader>
        <Typography>Apply Search or Filter:</Typography>
        <IconButton onClick={() => setIsOpen(false)}>
          <ChevronLeft fontSize="large" />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ width: 240, p: 3 }}>
        <Box ref={containerRef}></Box>
        <PriceSlider />
        
        <RatingSlider />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
