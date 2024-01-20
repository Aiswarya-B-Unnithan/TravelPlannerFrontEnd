import { Lock } from '@mui/icons-material';
import { Alert, AlertTitle, Button, Container } from '@mui/material';
import React from 'react';
import { useValue } from '../../context/ContextProvider';
import { useNavigate } from "react-router-dom";

const AccessMessage = () => {
  const { dispatch } = useValue();
  const navigate = useNavigate();
  const handleLoginClick = () => {
    // Navigate to the "/login" page
    navigate("/login");
  };
  return (
    <Container sx={{ py: 10 }}>
      <Alert severity="error" variant="outlined">
        <AlertTitle>Forbidden Access</AlertTitle>
        Please login or register to access this page
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          startIcon={<Lock />}
          onClick={handleLoginClick}
          
         
        >
          login
        </Button>
      </Alert>
    </Container>
  );
};

export default AccessMessage;
