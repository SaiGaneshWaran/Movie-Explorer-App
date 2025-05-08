import React, { useState, useEffect, useCallback } from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import MovieGrid from './MovieGrid';
import { getTrendingMovies } from '../../services/api';

const TrendingMovies = () => {
  const [timeWindow, setTimeWindow] = useState('day');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchTrendingMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTrendingMovies(timeWindow);
      setMovies(data.results);
      setError(null);
    } catch (err) {
      setError('Failed to fetch trending movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  useEffect(() => {
    fetchTrendingMovies();
  }, [fetchTrendingMovies]); 

  const handleTimeWindowChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeWindow(newValue);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box component="h2" sx={{ typography: 'h4', mb: 0 }}>
          Trending Movies
        </Box>
        <ToggleButtonGroup
          value={timeWindow}
          exclusive
          onChange={handleTimeWindowChange}
          aria-label="time window"
          size="small"
        >
          <ToggleButton value="day" aria-label="today">
            Today
          </ToggleButton>
          <ToggleButton value="week" aria-label="this week">
            This Week
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        onRetry={fetchTrendingMovies}
      />
    </Box>
  );
};

export default TrendingMovies;