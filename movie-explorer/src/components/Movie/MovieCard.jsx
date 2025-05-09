import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  Rating,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getFullImagePath, getYearFromDate, truncateText } from '../../utils/helpers';
import { useMovies } from '../../context/MovieContext';
import { cardVariants, fadeInUp } from '../../utils/animations';
import ShareIcon from '@mui/icons-material/Share';
import ShareButtons from '../UI/ShareButtons';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovies();
  const favorite = isFavorite(movie.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show">
      <motion.div whileHover="hover" variants={cardVariants}>
        <Card 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            transition: 'all 0.3s ease',
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
              }}
            >
              <motion.div 
                whileTap={{ scale: 0.85 }}
                animate={{ scale: favorite ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {favorite ? (
                  <FavoriteIcon sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: 'white' }} />
                )}
              </motion.div>
            </IconButton>
              <IconButton
    onClick={(e) => {
      e.stopPropagation();
      // For simplicity, call navigator.share directly here
      if (navigator.share) {
        navigator.share({
          title: movie.title,
          text: `Check out ${movie.title} on Movie Explorer!`,
          url: `${window.location.origin}/movie/${movie.id}`
        }).catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error sharing', err);
          }
        });
      }
    }}
    sx={{
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
    }}
  >
    <ShareIcon sx={{ color: 'white' }} />
  </IconButton>
          </Box>
          <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1 }}>
            <Box sx={{ width: '100%', height: 450, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={getFullImagePath(movie.poster_path)}
                alt={movie.title}
                sx={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0.8)',
                  transition: 'filter 0.3s ease',
                  objectPosition: 'center top',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    filter: 'brightness(1)',
                  },
                }}
              />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {movie.title}
                {movie.release_date && (
                  <Box component="span" sx={{ color: 'text.secondary', ml: 1 }}>
                    ({getYearFromDate(movie.release_date)})
                  </Box>
                )}
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <Rating
                  value={movie.vote_average / 2}
                  precision={0.5}
                  readOnly
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {movie.vote_average.toFixed(1)}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}
              >
                {truncateText(movie.overview, 120)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;