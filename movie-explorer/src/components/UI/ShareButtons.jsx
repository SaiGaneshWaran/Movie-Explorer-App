import React from 'react';
import { Box, Button, IconButton, Tooltip, Snackbar } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

const ShareButtons = ({ title, text, url }) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  // Check if Web Share API is supported
  const isWebShareSupported = navigator.share !== undefined;

  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        setSnackbarMessage('Shared successfully!');
        setSnackbarOpen(true);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSnackbarMessage('Error sharing content');
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setSnackbarMessage('Link copied to clipboard!');
        setSnackbarOpen(true);
      },
      () => {
        setSnackbarMessage('Failed to copy link');
        setSnackbarOpen(true);
      }
    );
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`;

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        {isWebShareSupported ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleNativeShare}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Share
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Share on Twitter">
                <IconButton
                  color="primary"
                  component="a"
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                >
                  <TwitterIcon />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Share on Facebook">
                <IconButton
                  color="primary"
                  component="a"
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                >
                  <FacebookIcon />
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Tooltip title="Share on WhatsApp">
                <IconButton
                  color="primary"
                  component="a"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on WhatsApp"
                >
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
            </motion.div>
          </>
        )}

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Tooltip title="Copy Link">
            <IconButton
              onClick={handleCopyLink}
              color="primary"
              aria-label="Copy link"
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default ShareButtons;