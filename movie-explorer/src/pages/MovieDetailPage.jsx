import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MovieDetail from '../components/Movie/MovieDetail';
import { getMovieDetails } from '../services/api';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setError(null);
      // Set document title based on movie
      document.title = `${data.title} - Movie Explorer`;
    } catch (err) {
      setError('Failed to fetch movie details. Please try again later.');
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      <MovieDetail
        movie={movie}
        loading={loading}
        error={error}
        onRetry={fetchMovieDetails}
      />
    </Box>
  );
};

export default MovieDetailPage;
