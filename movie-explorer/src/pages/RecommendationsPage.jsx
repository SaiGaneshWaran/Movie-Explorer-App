import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import MovieGrid from "../components/Movie/MovieGrid";
import { getMoviesByGenre } from "../services/api";
import { useMovies } from "../context/MovieContext";
import { pageVariants } from "../utils/animations";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";

const RecommendationsPage = () => {
  const { favorites } = useMovies();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [genreName, setGenreName] = useState("");

  const getUniqueGenres = useCallback(() => {
    const genresMap = new Map();

    favorites.forEach((movie) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((genreId) => {
          const count = genresMap.get(genreId) || 0;
          genresMap.set(genreId, count + 1);
        });
      }
    });

    return [...genresMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([genreId]) => genreId);
  }, [favorites]);

  const findGenreName = useCallback((genreId) => {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    return genreMap[genreId] || "Unknown";
  }, []);

  const fetchRecommendations = useCallback(async () => {
    if (!favorites || favorites.length === 0 || !selectedGenreId) {
      setRecommendedMovies([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getMoviesByGenre(selectedGenreId, 1);
      setRecommendedMovies(data.results || []);
      setTotalPages(data.total_pages || 0);
      setPage(1);
      setGenreName(findGenreName(selectedGenreId));
      setError(null);
    } catch (err) {
      setError("Failed to fetch recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedGenreId, favorites, findGenreName]);

  const handleLoadMore = async () => {
    if (page >= totalPages || !selectedGenreId) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await getMoviesByGenre(selectedGenreId, nextPage);

      setRecommendedMovies((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more recommendations. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      const uniqueGenres = getUniqueGenres();
      if (uniqueGenres.length > 0) {
        setSelectedGenreId(uniqueGenres[0]);
      }
    }
  }, [favorites, getUniqueGenres]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (!favorites || favorites.length === 0) {
    return (
      <motion.div
        initial="initial"
        animate="in"
        exit="exit"
        variants={pageVariants}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            maxWidth: 600,
            mx: "auto",
            mt: 4,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            No Recommendations Yet
          </Typography>
          <Typography variant="body1" paragraph>
            Add movies to your favorites to see personalized recommendations
            based on your taste.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<BookmarkAddIcon />}
            sx={{ mt: 2 }}
          >
            Discover Movies to Favorite
          </Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
    >
     <Box sx={{ textAlign: 'center', mb: 4 }}>
  <Typography 
    variant="h3" 
    component="h1" 
    gutterBottom
    sx={{
      color: '#00bcd4',
      fontWeight: 'bold',
      fontSize: '2.5rem',
    }}
  >
    Recommendations For You
  </Typography>
  <Typography 
    variant="h6" 
    paragraph
    sx={{
      color: '#00bcd4',
      fontWeight: 'bold',
      mb: 4
    }}
  >
    Based on your interest in {genreName} movies
  </Typography>
  
  <MovieGrid
    movies={recommendedMovies}
    loading={loading}
    error={error}
    title={`${genreName} Movies You Might Like`}
    onRetry={fetchRecommendations}
    loadMore={handleLoadMore}
    hasMore={page < totalPages}
    loadingMore={loadingMore}
  />
</Box>
    </motion.div>
  );
};

export default RecommendationsPage;
