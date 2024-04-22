import React from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Container>
      <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
        <Typography variant="h1" gutterBottom color="white">
          404
        </Typography>
        <Typography variant="h5" gutterBottom color="white">
          Page Not Found
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
