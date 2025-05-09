import React from "react";
import { Alert, Box, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <Box my={2}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          )
        }
      >
        {message || "An error occurred. Please try again."}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
