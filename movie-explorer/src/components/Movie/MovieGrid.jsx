import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import MovieCard from './MovieCard';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

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
  if (loading && !movies?.length) {
    return <Loader />;
  }

  if (error && !movies?.length) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!loading && !error && (!movies || movies.length === 0)) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h5" gutterBottom>
          No movies found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try changing your search or filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      
      {loadMore && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button 
            variant="contained" 
            onClick={loadMore} 
            disabled={!hasMore || loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;
