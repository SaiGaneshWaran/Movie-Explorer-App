import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { useMovies } from '../../context/MovieContext';
import { useMovieAPI } from '../../hooks/useMovieAPI';
import { getGenres } from '../../services/api';

const MovieSearch = ({ onSearch, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { setLastSearch, filters, setFilters, resetFilters } = useMovies();
  const { data: genresData } = useMovieAPI(() => getGenres());

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLastSearch(searchQuery);
    onSearch({
      query: searchQuery,
      filters,
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ [name]: value });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      sx={{ mb: 4, overflow: 'hidden' }}
    >
      <Box sx={{ p: 2 }}>
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
                <Stack direction="row" spacing={1}>
                  {searchQuery && (
                    <IconButton
                      onClick={() => setSearchQuery('')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={toggleFilters}
                    edge="end"
                    color={filtersVisible ? 'primary' : 'default'}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Stack>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filtersVisible && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="genre-label">Genre</InputLabel>
                  <Select
                    labelId="genre-label"
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                    label="Genre"
                  >
                    <MenuItem value="">All Genres</MenuItem>
                    {genresData?.genres?.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="year-label">Year</InputLabel>
                  <Select
                    labelId="year-label"
                    name="year"
                    value={filters.year}
                    onChange={handleFilterChange}
                    label="Year"
                  >
                    <MenuItem value="">All Years</MenuItem>
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
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel id="rating-label">Min Rating</InputLabel>
                  <Select
                    labelId="rating-label"
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    label="Min Rating"
                  >
                    <MenuItem value="">Any Rating</MenuItem>
                    {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}+ Stars
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
                sx={{ mr: 1 }}
              >
                Reset Filters
              </Button>
              <Button variant="contained" size="small" type="submit">
                Apply Filters
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default MovieSearch;