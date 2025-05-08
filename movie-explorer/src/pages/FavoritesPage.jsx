import React from 'react';
import { Box } from '@mui/material';
import MovieGrid from '../components/Movie/MovieGrid';
import { useMovies } from '../context/MovieContext';

const FavoritesPage = () => {
  const { favorites } = useMovies();

  return (
    <Box>
      <MovieGrid
        movies={favorites}
        loading={false}
        title="My Favorite Movies"
      />
    </Box>
  );
};

export default FavoritesPage;