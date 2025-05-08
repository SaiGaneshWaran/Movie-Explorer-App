import React from 'react';
import { useNavigate } from 'react-router-dom';
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
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
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
          {favorite ? (
            <FavoriteIcon sx={{ color: 'red' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: 'white' }} />
          )}
        </IconButton>
      </Box>
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="300"
          image={getFullImagePath(movie.poster_path)}
          alt={movie.title}
          sx={{
            width: '100%',
            objectFit: 'contain',      // <-- show entire image, letterboxing if needed
            backgroundColor: 'grey',   // optional: fill gaps with black or your theme’s bg
          }}
          
        />
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
          <Typography variant="body2" color="text.secondary">
            {truncateText(movie.overview, 120)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;