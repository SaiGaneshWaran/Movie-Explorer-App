import React, { useState, useEffect, useCallback } from "react";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import MovieGrid from "./MovieGrid";
import { getTrendingMovies } from "../../services/api";

const TrendingMovies = () => {
  const [timeWindow, setTimeWindow] = useState("day");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchTrendingMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTrendingMovies(timeWindow, 1);
      setMovies(data.results);
      setTotalPages(data.total_pages || 0);
      setPage(1);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trending movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  const handleLoadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const data = await getTrendingMovies(timeWindow, nextPage);

      setMovies((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more trending movies. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

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
        <Box
          component="h2"
          sx={{
            typography: "h3",
            fontSize: "2.5rem",
            mb: 0,
            color: "#00bcd4",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Trending Movies
        </Box>
        <ToggleButtonGroup
          value={timeWindow}
          exclusive
          onChange={handleTimeWindowChange}
          aria-label="time window"
          size="small"
        >
          <ToggleButton
            value="day"
            aria-label="today"
            sx={{
              color: ({ palette }) =>
                palette.mode === "dark" ? "#fff" : "text.primary",
              "&.Mui-selected": {
                color: "#00bcd4",
                backgroundColor: "rgba(0, 188, 212, 0.1)",
                borderColor: "#00bcd4",
                "&:hover": {
                  backgroundColor: "rgba(0, 188, 212, 0.2)",
                },
              },
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "rgba(0, 188, 212, 0.05)",
              },
            }}
          >
            Today
          </ToggleButton>
          <ToggleButton
            value="week"
            aria-label="this week"
            sx={{
              color: ({ palette }) =>
                palette.mode === "dark" ? "#fff" : "text.primary",
              "&.Mui-selected": {
                color: "#00bcd4",
                backgroundColor: "rgba(0, 188, 212, 0.1)",
                borderColor: "#00bcd4",
                "&:hover": {
                  backgroundColor: "rgba(0, 188, 212, 0.2)",
                },
              },
              borderColor: "divider",
              "&:hover": {
                backgroundColor: "rgba(0, 188, 212, 0.05)",
              },
            }}
          >
            This Week
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <MovieGrid
        movies={movies}
        loading={loading}
        error={error}
        onRetry={fetchTrendingMovies}
        loadMore={handleLoadMore}
        hasMore={page < totalPages}
        loadingMore={loadingMore}
      />
    </Box>
  );
};

export default TrendingMovies;
