import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      textAlign="center"
      p={3}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 3 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        404: Page Not Found
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        component={RouterLink}
        to="/"
        variant="contained"
        size="large"
        sx={{ mt: 2 }}
      >
        Go to Home Page
      </Button>
    </Box>
  );
};

export default NotFoundPage;