import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { useMovies } from "../../context/MovieContext";
import { searchMovies } from "../../services/api";

import { motion, AnimatePresence } from "framer-motion";
import { filterVariants } from "../../utils/animations";
import { useGenres } from "../../hooks/useGenres";

const MovieSearch = ({ onSearch, initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const {
    setLastSearch,
    filters,
    setFilters,
    resetFilters,
    recentSearches,
    addRecentSearch,
    savedSearches,
    addSavedSearch,
    removeSavedSearch,
  } = useMovies();
  const { data: genresData } = useGenres();
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let active = true;
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setIsLoadingSuggestions(true);
        const data = await searchMovies(searchQuery, 1);
        if (!active) return;
        setSuggestions((data.results || []).slice(0, 6));
      } catch (e) {
        if (active) {
          setSuggestions([]);
        }
      } finally {
        if (active) {
          setIsLoadingSuggestions(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 350);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastSearch(searchQuery);
    addRecentSearch(searchQuery);
    onSearch({
      query: searchQuery,
      filters,
    });
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setLastSearch(title);
    addRecentSearch(title);
    onSearch({
      query: title,
      filters,
    });
    setSuggestions([]);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleResetFilters = () => {
    resetFilters();
    onSearch({
      query: searchQuery,
      filters: {
        genre: "",
        year: "",
        rating: "",
      },
    });
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={3}
        sx={{ mb: 4, overflow: "hidden", position: "relative" }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
          <TextField
            fullWidth
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {searchQuery && (
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <IconButton
                          onClick={() => setSearchQuery("")}
                          edge="end"
                          size="small"
                        >
                          <ClearIcon />
                        </IconButton>
                      </motion.div>
                    )}
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <IconButton
                        onClick={toggleFilters}
                        edge="end"
                        color={filtersVisible ? "primary" : "default"}
                        sx={{ ml: 0.5 }}
                      >
                        <FilterListIcon />
                      </IconButton>
                    </motion.div>
                  </Box>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "100%",
                zIndex: 5,
              }}
            >
              <Paper
                square
                sx={{
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                {suggestions.map((movie) => (
                  <Box
                    key={movie.id}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => handleSuggestionClick(movie.title)}
                  >
                    <Typography variant="body2">
                      {movie.title}
                    </Typography>
                  </Box>
                ))}
                {isLoadingSuggestions && (
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Searching…
                    </Typography>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {filtersVisible && (
            <>
              <Divider />
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={filterVariants}
              >
                <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="medium"
                  >
                    Filters
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 2 },
                      mb: 2,
                    }}
                  >
                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 0 } }}
                    >
                      <InputLabel id="genre-label">Genre</InputLabel>
                      <Select
                        labelId="genre-label"
                        name="genre"
                        value={filters.genre}
                        onChange={handleFilterChange}
                        label="Genre"
                        displayEmpty
                      >
                        <MenuItem value=""></MenuItem>
                        {genresData?.genres?.map((genre) => (
                          <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 0 } }}
                    >
                      <InputLabel id="year-label">Year</InputLabel>
                      <Select
                        labelId="year-label"
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        label="Year"
                        displayEmpty
                      >
                        <MenuItem value=""></MenuItem>
                        {[...Array(20)].map((_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <FormControl
                      sx={{ flex: 1, minWidth: { xs: "100%", sm: 0 } }}
                    >
                      <InputLabel id="rating-label">Min Rating</InputLabel>
                      <Select
                        labelId="rating-label"
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        label="Min Rating"
                        displayEmpty
                      >
                        <MenuItem value=""></MenuItem>
                        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                          <MenuItem key={rating} value={rating}>
                            {rating}+ Stars
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 1, sm: 1 },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Reset Filters
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Apply Filters
                      </Button>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Recent and saved searches */}
        {(recentSearches.length > 0 || savedSearches.length > 0) && (
          <>
            <Divider />
            <Box
              sx={{
                p: { xs: 1.5, sm: 2 },
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {recentSearches.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    Recent searches
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {recentSearches.map((term) => (
                      <Button
                        key={term}
                        size="small"
                        variant="outlined"
                        onClick={() => handleSuggestionClick(term)}
                      >
                        {term}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Saved searches
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    addSavedSearch({
                      query: searchQuery,
                      filters: { ...filters },
                    })
                  }
                  disabled={!searchQuery && !filters.genre && !filters.year && !filters.rating}
                >
                  Save current
                </Button>
              </Box>

              {savedSearches.length > 0 && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {savedSearches.map((config, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => {
                          setSearchQuery(config.query || "");
                          setFilters(config.filters || {});
                          setLastSearch(config.query || "");
                          addRecentSearch(config.query || "");
                          onSearch({
                            query: config.query || "",
                            filters: config.filters || {},
                          });
                        }}
                        sx={{ textTransform: "none" }}
                      >
                        {config.query || "Filtered search"}
                      </Button>
                      <IconButton
                        size="small"
                        onClick={() => removeSavedSearch(index)}
                        aria-label="Remove saved search"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
      </Paper>
    </motion.div>
  );
};

export default MovieSearch;
