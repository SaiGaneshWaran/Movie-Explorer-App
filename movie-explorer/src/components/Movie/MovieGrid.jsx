import React from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  useMediaQuery, 
} from '@mui/material';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import { staggerContainer } from '../../utils/animations';

const MovieGrid = ({
  movies,
  loading,
  error,
  title,
  onRetry,
  loadMore,
  hasMore,
  loadingMore,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (loading && !movies?.length) {
    return <Loader />;
  }
  
  if (error && !movies?.length) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }
  
  if (!loading && !error && (!movies || movies.length === 0)) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box 
          textAlign="center" 
          py={6} 
          px={2} 
          sx={{
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight="500">
            No movies found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try changing your search or filters.
          </Typography>
        </Box>
      </motion.div>
    );
  }
  
  return (
    <Box>
      {title && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ mb: 3, fontWeight: 'medium' }}
          >
            {title}
          </Typography>
        </motion.div>
      )}
      
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <Grid 
          container 
          spacing={{ xs: 2, sm: 2, md: 3 }} 
          sx={{ mb: 4 }}
        >
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      </motion.div>
      
      {loadMore && hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Box 
            display="flex" 
            justifyContent="center" 
            mt={4} 
            mb={4}
          >
            <Button
              variant="contained"
              size="large"
              onClick={loadMore}
              disabled={loadingMore}
              sx={{
                minWidth: isMobile ? '100%' : '200px',
                py: 1.2,
                boxShadow: 2,
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                  transition: 'all 0.2s'
                }
              }}
            >
              {loadingMore ? 'Loading...' : 'Load More Movies'}
            </Button>
          </Box>
        </motion.div>
      )}
      
      {loadingMore && (
        <Box textAlign="center" mt={2}>
          <Loader message="Loading more movies..." />
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;