import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Grid,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getFullImagePath, formatDate } from '../../utils/helpers';
import { useMovies } from '../../context/MovieContext';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';

const MovieDetail = ({ movie, loading, error, onRetry }) => {
  const theme = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const favorite = movie ? isFavorite(movie.id) : false;

  if (loading) {
    return <Loader message="Loading movie details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (!movie) {
    return null;
  }

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  // Find trailer
  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || movie.videos?.results?.[0];

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
      <Box
        sx={{
          position: 'relative',
          height: { xs: 200, sm: 300, md: 400 },
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), ${
            theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)'
          }), url(${getFullImagePath(movie.backdrop_path, 'original')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-end' },
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: { xs: 120, sm: 180, md: 220 },
              height: { xs: 180, sm: 270, md: 330 },
              boxShadow: 3,
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0,
              mb: { xs: 2, sm: -3, md: -4 },
              mr: { sm: 3 },
              bgcolor: 'background.paper',
            }}
          >
            <img
              src={getFullImagePath(movie.poster_path)}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                fontWeight: 700,
                mb: 1,
              }}
            >
              {movie.title}
              {movie.release_date && (
                <Typography
                  component="span"
                  variant="h5"
                  sx={{ ml: 1, opacity: 0.8 }}
                >
                  ({new Date(movie.release_date).getFullYear()})
                </Typography>
              )}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 2 }}
            >
              {movie.genres?.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  size="small"
                  sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.8)', color: 'black' }}
                />
              ))}
            </Box>
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Rating
                value={movie.vote_average / 2}
                precision={0.5}
                readOnly
                sx={{ color: 'warning.light' }}
              />
              <Typography
                variant="body1"
                sx={{
                  ml: 1,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votes)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3, pt: { xs: 4, sm: 5, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Typography variant="h5" component="h2">
                Overview
              </Typography>
              <Tooltip
                title={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <IconButton onClick={handleFavoriteClick}>
                  {favorite ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            
            <Typography variant="body1" paragraph>
              {movie.overview || 'No overview available.'}
            </Typography>

            {trailer && (
              <Box mt={3}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Trailer
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              Cast
            </Typography>
            <List>
              {movie.credits?.cast?.slice(0, 6).map((person) => (
                <ListItem key={person.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={person.name}
                      src={
                        person.profile_path
                          ? getFullImagePath(person.profile_path, 'w200')
                          : '/placeholder.png'
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={person.name}
                    secondary={person.character}
                  />
                </ListItem>
              ))}
              {(!movie.credits?.cast || movie.credits?.cast.length === 0) && (
                <Typography variant="body2">
                  No cast information available.
                </Typography>
              )}
            </List>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}
            >
              <Typography variant="h6" gutterBottom>
                Movie Info
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Release Date
                </Typography>
                <Typography variant="body1">
                  {formatDate(movie.release_date) || 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Runtime
                </Typography>
                <Typography variant="body1">
                  {movie.runtime
                    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                    : 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">{movie.status || 'Unknown'}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Original Language
                </Typography>
                <Typography variant="body1">
                  {movie.original_language
                    ? new Intl.DisplayNames(['en'], { type: 'language' }).of(
                        movie.original_language
                      )
                    : 'Unknown'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Budget
                </Typography>
                <Typography variant="body1">
                  {movie.budget
                    ? `$${movie.budget.toLocaleString()}`
                    : 'Not available'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Revenue
                </Typography>
                <Typography variant="body1">
                  {movie.revenue
                    ? `$${movie.revenue.toLocaleString()}`
                    : 'Not available'}
                </Typography>
              </Box>
              
              {movie.production_companies?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Production
                  </Typography>
                  <Typography variant="body1">
                    {movie.production_companies
                      .map((company) => company.name)
                      .join(', ')}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default MovieDetail;
