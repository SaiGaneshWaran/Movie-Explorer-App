import React, { useState, useEffect, useCallback } from "react";
import { Box, Divider, Typography } from "@mui/material";
import TrendingMovies from "../components/Movie/TrendingMovies";
import MovieSearch from "../components/Movie/MovieSearch";
import MovieGrid from "../components/Movie/MovieGrid";
import {
  searchMovies,
  getMoviesByGenre,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "../services/api";
import { useMovies } from "../context/MovieContext";
import { pageVariants } from "../utils/animations";
import { motion } from "framer-motion";

const HomePage = () => {
  const { lastSearch, filters } = useMovies();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    query: lastSearch,
    filters: { ...filters },
  });

  const [topRated, setTopRated] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [topRatedError, setTopRatedError] = useState(null);

  const [nowPlaying, setNowPlaying] = useState([]);
  const [nowPlayingLoading, setNowPlayingLoading] = useState(true);
  const [nowPlayingError, setNowPlayingError] = useState(null);

  const [upcoming, setUpcoming] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [upcomingError, setUpcomingError] = useState(null);

  const handleSearch = useCallback(async (params) => {
    try {
      setLoading(true);
      setSearching(true);
      setSearchParams(params);
      setPage(1);
      const { query, filters } = params;

      let data;
      if (filters.genre && !query) {
        data = await getMoviesByGenre(filters.genre, 1);
      } else {
        data = await searchMovies(query, 1);
      }

      let filteredResults = data.results;
      if (filters.year) {
        filteredResults = filteredResults.filter((movie) => {
          const movieYear = new Date(movie.release_date).getFullYear();
          return movieYear === parseInt(filters.year);
        });
      }

      if (filters.rating) {
        filteredResults = filteredResults.filter(
          (movie) => movie.vote_average >= parseInt(filters.rating)
        );
      }

      setSearchResults(filteredResults);
      setTotalPages(data.total_pages);
      setError(null);
    } catch (err) {
      setError("Failed to search movies. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        const [topRatedData, nowPlayingData, upcomingData] = await Promise.all([
          getTopRatedMovies(1),
          getNowPlayingMovies(1),
          getUpcomingMovies(1),
        ]);
        setTopRated(topRatedData.results || []);
        setNowPlaying(nowPlayingData.results || []);
        setUpcoming(upcomingData.results || []);
        setTopRatedError(null);
        setNowPlayingError(null);
        setUpcomingError(null);
      } catch (e) {
        setTopRatedError("Failed to load discovery sections.");
        setNowPlayingError("Failed to load discovery sections.");
        setUpcomingError("Failed to load discovery sections.");
      } finally {
        setTopRatedLoading(false);
        setNowPlayingLoading(false);
        setUpcomingLoading(false);
      }
    };

    fetchDiscovery();
  }, []);

  const handleLoadMore = async () => {
    if (page >= totalPages) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { query, filters } = searchParams;

      let data;
      if (filters.genre && !query) {
        data = await getMoviesByGenre(filters.genre, nextPage);
      } else {
        data = await searchMovies(query, nextPage);
      }

      let filteredResults = data.results;
      if (filters.year) {
        filteredResults = filteredResults.filter((movie) => {
          const movieYear = new Date(movie.release_date).getFullYear();
          return movieYear === parseInt(filters.year);
        });
      }

      if (filters.rating) {
        filteredResults = filteredResults.filter(
          (movie) => movie.vote_average >= parseInt(filters.rating)
        );
      }

      setSearchResults([...searchResults, ...filteredResults]);
      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more movies. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
    >
      <Box>
        <MovieSearch onSearch={handleSearch} initialQuery={lastSearch} />

        {searching && (
          <MovieGrid
            movies={searchResults}
            loading={loading}
            error={error}
            title={`Search Results${
              searchParams.query ? ` for "${searchParams.query}"` : ""
            }`}
            onRetry={() => handleSearch(searchParams)}
            loadMore={handleLoadMore}
            hasMore={page < totalPages}
            loadingMore={loadingMore}
          />
        )}

        {(!searching || searchResults.length === 0) && (
          <>
            {searching && searchResults.length === 0 && !loading && (
              <Divider sx={{ my: 4 }} />
            )}
            <TrendingMovies />

            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: "medium" }}
              >
                Top Rated
              </Typography>
              <MovieGrid
                movies={topRated}
                loading={topRatedLoading}
                error={topRatedError}
              />
            </Box>

            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: "medium" }}
              >
                Now Playing
              </Typography>
              <MovieGrid
                movies={nowPlaying}
                loading={nowPlayingLoading}
                error={nowPlayingError}
              />
            </Box>

            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: "medium" }}
              >
                Upcoming
              </Typography>
              <MovieGrid
                movies={upcoming}
                loading={upcomingLoading}
                error={upcomingError}
              />
            </Box>
          </>
        )}
      </Box>
    </motion.div>
  );
};

export default HomePage;
