// Improved MovieSearch.jsx
import React, { useState, useEffect } from 'react';
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

  // THIS IS THE CRITICAL FIX - preserving all existing filters
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });  // Keep existing filters
  };

  const handleResetFilters = () => {
    resetFilters();
    // Apply the search with reset filters
    onSearch({
        query: searchQuery,
        filters: {  // Define empty filters explicitly here instead of using initialState
          genre: '',
          year: '',
          rating: ''
        }
      });
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    sx={{ ml: 0.5 }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filtersVisible && (
        <>
          <Divider />
          <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
              Filters
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 2 },
              mb: 2
            }}>
              {/* Genre Filter */}
              <FormControl 
                sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
              >
                <InputLabel id="genre-label"></InputLabel>
                <Select
                  labelId="genre-label"
                  name="genre"
                  value={filters.genre}
                  onChange={handleFilterChange}
                  label="Genre"
                  displayEmpty
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {genresData?.genres?.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {/* Year Filter */}
              <FormControl 
                sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
              >
                <InputLabel id="year-label"></InputLabel>
                <Select
                  labelId="year-label"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  label="Year"
                  displayEmpty
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
              
              {/* Rating Filter */}
              <FormControl 
                sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
              >
                <InputLabel id="rating-label"></InputLabel>
                <Select
                  labelId="rating-label"
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                  label="Min Rating"
                  displayEmpty
                >
                  <MenuItem value="">Any Rating</MenuItem>
                  {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((rating) => (
                    <MenuItem key={rating} value={rating}>
                      {rating}+ Stars
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 1 }
            }}>
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Reset Filters
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
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