import React, { useMemo, useState } from "react";
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MovieGrid from "../components/Movie/MovieGrid";
import { useMovies } from "../context/MovieContext";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";

const FavoritesPage = () => {
  const { favorites, ratingsByMovieId } = useMovies();
  const [sortBy, setSortBy] = useState("title");

  const sortedFavorites = useMemo(() => {
    const list = [...favorites];
    switch (sortBy) {
      case "ratingDesc":
        return list.sort(
          (a, b) =>
            (ratingsByMovieId[b.id] || 0) - (ratingsByMovieId[a.id] || 0)
        );
      case "tmdbRatingDesc":
        return list.sort((a, b) => b.vote_average - a.vote_average);
      case "releaseDateDesc":
        return list.sort(
          (a, b) =>
            new Date(b.release_date || "1900-01-01") -
            new Date(a.release_date || "1900-01-01")
        );
      case "title":
      default:
        return list.sort((a, b) => a.title.localeCompare(b.title));
    }
  }, [favorites, ratingsByMovieId, sortBy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3" 
          component="h1"
          sx={{
            mb: 2,
            color: "#00bcd4",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "2.5rem", 
          }}
        >
          My Favorite Movies
        </Typography>

        <Typography
          variant="h6" 
          color="text.secondary"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.25rem", 
          }}
        >
          Your personally curated collection of movies you love.
        </Typography>

        {favorites.length > 0 ? (
          <>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="favorite-sort-label">Sort by</InputLabel>
                <Select
                  labelId="favorite-sort-label"
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="title">Title (A–Z)</MenuItem>
                  <MenuItem value="releaseDateDesc">Release date (newest)</MenuItem>
                  <MenuItem value="tmdbRatingDesc">TMDb rating (high to low)</MenuItem>
                  <MenuItem value="ratingDesc">Your rating (high to low)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <MovieGrid movies={sortedFavorites} loading={false} />
          </>
        ) : (
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
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight="500">
                No favorite movies yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Start adding movies to your favorites by clicking the heart
                icon.
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/"
                startIcon={<ExploreIcon />}
                sx={{ bgcolor: "#00bcd4" }}
              >
                Discover Movies
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default FavoritesPage;
