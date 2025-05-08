import React, { createContext, useContext, useReducer, useEffect } from 'react';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

const initialState = {
  favorites: [],
  lastSearch: '',
  filters: {
    genre: '',
    year: '',
    rating: '',
  },
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      if (state.favorites.some(movie => movie.id === action.payload.id)) {
        return state;
      }
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(movie => movie.id !== action.payload),
      };
    case 'SET_LAST_SEARCH':
      return { ...state, lastSearch: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState, () => {
    const savedState = localStorage.getItem('movieState');
    return savedState ? JSON.parse(savedState) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('movieState', JSON.stringify(state));
  }, [state]);

  const addToFavorites = (movie) => {
    dispatch({ type: 'ADD_FAVORITE', payload: movie });
  };

  const removeFromFavorites = (movieId) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: movieId });
  };

  const isFavorite = (movieId) => {
    return state.favorites.some(movie => movie.id === movieId);
  };

  const setLastSearch = (query) => {
    dispatch({ type: 'SET_LAST_SEARCH', payload: query });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const value = {
    favorites: state.favorites,
    lastSearch: state.lastSearch,
    filters: state.filters,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    setLastSearch,
    setFilters,
    resetFilters,
  };

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};