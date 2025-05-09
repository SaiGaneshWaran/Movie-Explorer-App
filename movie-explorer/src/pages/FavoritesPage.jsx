import React from "react";
import { Box } from "@mui/material";
import MovieGrid from "../components/Movie/MovieGrid";
import { useMovies } from "../context/MovieContext";
import { motion } from "framer-motion";
import { Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";

const FavoritesPage = () => {
  const { favorites } = useMovies();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3" // Changed from h4 to h3
          component="h1"
          sx={{
            mb: 2,
            color: "#00bcd4",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "2.5rem", // Added explicit larger font size
          }}
        >
          My Favorite Movies
        </Typography>

        <Typography
          variant="h6" // Changed from body1 to h6 for larger text
          color="text.secondary"
          sx={{
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.25rem", // Added explicit larger font size
          }}
        >
          Your personally curated collection of movies you love.
        </Typography>

        {favorites.length > 0 ? (
          <MovieGrid movies={favorites} loading={false} />
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
