import React, { useMemo } from "react";
import { Box, Typography, Paper, Grid, Chip, LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useMovies } from "../context/MovieContext";
import { useGenres } from "../hooks/useGenres";
import { pageVariants } from "../utils/animations";

const StatsPage = () => {
  const { favorites, watchlist, seen, ratingsByMovieId } = useMovies();
  const { data: genresData } = useGenres();

  const totalFavorites = favorites.length;
  const totalWatchlist = watchlist.length;
  const totalSeen = seen.length;

  const avgUserRating = useMemo(() => {
    const ratedEntries = Object.values(ratingsByMovieId || {}).filter(
      (v) => typeof v === "number"
    );
    if (!ratedEntries.length) return null;
    const sum = ratedEntries.reduce((acc, v) => acc + v, 0);
    return (sum / ratedEntries.length).toFixed(1);
  }, [ratingsByMovieId]);

  const genreStats = useMemo(() => {
    if (!genresData?.genres) return [];
    const counts = new Map();

    const accumulate = (movie) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((id) => {
          counts.set(id, (counts.get(id) || 0) + 1);
        });
      }
      if (movie.genres) {
        movie.genres.forEach((g) => {
          counts.set(g.id, (counts.get(g.id) || 0) + 1);
        });
      }
    };

    favorites.forEach(accumulate);
    watchlist.forEach(accumulate);

    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0) || 1;

    return Array.from(counts.entries())
      .map(([id, count]) => {
        const genre = genresData.genres.find((g) => g.id === id);
        return {
          id,
          name: genre ? genre.name : "Unknown",
          count,
          share: Math.round((count / total) * 100),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [favorites, watchlist, genresData]);

  const yearStats = useMemo(() => {
    const yearCounts = new Map();
    const accumulate = (movie) => {
      if (!movie.release_date) return;
      const year = new Date(movie.release_date).getFullYear();
      if (!year) return;
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1);
    };
    favorites.forEach(accumulate);
    seen
      .map((id) => favorites.find((m) => m.id === id))
      .filter(Boolean)
      .forEach(accumulate);

    return Array.from(yearCounts.entries())
      .sort((a, b) => b[0] - a[0])
      .slice(0, 5);
  }, [favorites, seen]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
    >
      <Typography variant="h3" sx={{ mb: 3, fontWeight: "bold" }}>
        Your Movie Stats
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Library overview
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>Favorites: {totalFavorites}</Typography>
              <Typography>Watchlist: {totalWatchlist}</Typography>
              <Typography>Seen: {totalSeen}</Typography>
              <Typography>
                Avg rating: {avgUserRating ? `${avgUserRating} / 5` : "N/A"}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top genres
            </Typography>
            {genreStats.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Add movies to favorites or watchlist to see your favorite genres.
              </Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {genreStats.map((genre) => (
                <Box key={genre.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Chip label={genre.name} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {genre.count} movies • {genre.share}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={genre.share}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent years in your library
            </Typography>
            {yearStats.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Add more movies to see year-by-year stats.
              </Typography>
            )}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {yearStats.map(([year, count]) => (
                <Box
                  key={year}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography>{year}</Typography>
                  <Chip label={`${count} movies`} size="small" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default StatsPage;

