// src/components/Movie/TrailerModal.jsx
import React, { useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Box, 
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TrailerModal = ({ open, onClose, videoId, title }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const playerRef = useRef(null);

  // Handle clean-up when modal closes
  useEffect(() => {
    // If dialog is closed, make sure to stop the video
    if (!open && playerRef.current) {
      // This helps ensure the video stops playing when modal is closed
      playerRef.current.src = playerRef.current.src;
    }
  }, [open]);

  if (!videoId) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="trailer-dialog-title"
      PaperProps={{
        elevation: 5,
        sx: {
          bgcolor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" component="h2" id="trailer-dialog-title">
          {title ? `${title} - Trailer` : 'Watch Trailer'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, height: fullScreen ? '100%' : '500px', bgcolor: '#000' }}>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={playerRef}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${window.location.origin}`}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TrailerModal;