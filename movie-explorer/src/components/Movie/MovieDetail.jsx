import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getFullImagePath, formatDate } from '../../utils/helpers';
import { useMovies } from '../../context/MovieContext';
import Loader from '../UI/Loader';
import ErrorMessage from '../UI/ErrorMessage';
import TrailerModal from './TrailerModal';



const MovieDetail = ({ movie, loading, error, onRetry }) => {
  const theme = useTheme();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const favorite = movie ? isFavorite(movie.id) : false;
  const [trailerOpen, setTrailerOpen] = useState(false);


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

  const openTrailer = () => setTrailerOpen(true);
  const closeTrailer = () => setTrailerOpen(false);

  
  const trailer = movie.videos?.results?.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || movie.videos?.results?.[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Box
            sx={{
              position: 'relative',
              height: {  md: 400 },
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
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
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
                    {movie.genres?.map((genre, index) => (
                      <motion.div
                        key={genre.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                      >
                        <Chip
                          label={genre.name}
                          size="small"
                          sx={{ mr: 1, mb: 1, bgcolor: 'rgba(255,255,255,0.8)', color: 'black' }}
                        />
                      </motion.div>
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
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ p: 3, pt: { xs: 4, sm: 5, md: 6 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
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
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <IconButton onClick={handleFavoriteClick}>
                        {favorite ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </motion.div>
                  </Tooltip>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {movie.overview || 'No overview available.'}
                </Typography>

                  {trailer && (
    <Box mt={3}>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={openTrailer} // Change this from a link to onClick
          size="large"
        >
          Watch Trailer
        </Button>
      </motion.div>
      
      {/* Add the trailer modal */}
      <TrailerModal
        open={trailerOpen}
        onClose={closeTrailer}
        videoId={trailer.key}
        title={movie.title}
      />
    </Box>
  )}
              </motion.div>

              <Divider sx={{ my: 3 }} />

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.7, duration: 0.4 }}
>
  {trailer && (
    <Box mt={4} mb={2}>
      <Typography variant="h5" component="h2" gutterBottom>
        Trailer
      </Typography>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 aspect ratio
          bgcolor: 'black',
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover .overlay': {
            opacity: 1,
          },
        }}
        onClick={openTrailer}
      >
        <Box
          component="img"
          src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
          alt={`${movie.title} Trailer`}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
           
            e.target.src = `https://img.youtube.com/vi/${trailer.key}/mqdefault.jpg`;
          }}
        />
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)',
            opacity: 0.7,
            transition: 'opacity 0.3s',
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
              width: 80,
              height: 80,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 60 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )}
</motion.div>

              <Divider sx={{ my: 3 }} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Cast
                </Typography>
                <List>
                  {movie.credits?.cast?.slice(0, 6).map((person, index) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                    >
                      <ListItem alignItems="flex-start">
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
                    </motion.div>
                  ))}
                  {(!movie.credits?.cast || movie.credits?.cast.length === 0) && (
                    <Typography variant="body2">
                      No cast information available.
                    </Typography>
                  )}
                </List>
              </motion.div>
              
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
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
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default MovieDetail;