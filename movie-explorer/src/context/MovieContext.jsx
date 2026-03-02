import React, { createContext, useContext, useReducer, useEffect } from "react";

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

const initialState = {
  favorites: [],
  watchlist: [],
  seen: [],
  ratingsByMovieId: {},
  lastSearch: "",
  filters: {
    genre: "",
    year: "",
    rating: "",
  },
  recentSearches: [],
  savedSearches: [],
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case "SET_FAVORITES":
      return { ...state, favorites: action.payload };
    case "ADD_FAVORITE":
      if (state.favorites.some((movie) => movie.id === action.payload.id)) {
        return state;
      }
      return { ...state, favorites: [...state.favorites, action.payload] };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter(
          (movie) => movie.id !== action.payload
        ),
      };
    case "SET_WATCHLIST":
      return { ...state, watchlist: action.payload };
    case "ADD_WATCHLIST":
      if (state.watchlist.some((movie) => movie.id === action.payload.id)) {
        return state;
      }
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case "REMOVE_WATCHLIST":
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (movie) => movie.id !== action.payload
        ),
      };
    case "MARK_SEEN":
      if (state.seen.includes(action.payload)) {
        return state;
      }
      return { ...state, seen: [...state.seen, action.payload] };
    case "UNMARK_SEEN":
      return {
        ...state,
        seen: state.seen.filter((id) => id !== action.payload),
      };
    case "RATE_MOVIE":
      return {
        ...state,
        ratingsByMovieId: {
          ...state.ratingsByMovieId,
          [action.payload.movieId]: action.payload.rating,
        },
      };
    case "SET_LAST_SEARCH":
      return { ...state, lastSearch: action.payload };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "RESET_FILTERS":
      return { ...state, filters: initialState.filters };
    case "ADD_RECENT_SEARCH": {
      const updated = [
        action.payload,
        ...state.recentSearches.filter((item) => item !== action.payload),
      ].slice(0, 10);
      return { ...state, recentSearches: updated };
    }
    case "SET_SAVED_SEARCHES":
      return { ...state, savedSearches: action.payload };
    case "ADD_SAVED_SEARCH":
      return {
        ...state,
        savedSearches: [...state.savedSearches, action.payload],
      };
    case "REMOVE_SAVED_SEARCH":
      return {
        ...state,
        savedSearches: state.savedSearches.filter(
          (item, index) => index !== action.payload
        ),
      };
    default:
      return state;
  }
};

export const MovieProvider = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState, () => {
    const savedState = localStorage.getItem("movieState");
    return savedState ? JSON.parse(savedState) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("movieState", JSON.stringify(state));
  }, [state]);

  const addToFavorites = (movie) => {
    dispatch({ type: "ADD_FAVORITE", payload: movie });
  };

  const removeFromFavorites = (movieId) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: movieId });
  };

  const isFavorite = (movieId) => {
    return state.favorites.some((movie) => movie.id === movieId);
  };

  const addToWatchlist = (movie) => {
    dispatch({ type: "ADD_WATCHLIST", payload: movie });
  };

  const removeFromWatchlist = (movieId) => {
    dispatch({ type: "REMOVE_WATCHLIST", payload: movieId });
  };

  const isInWatchlist = (movieId) => {
    return state.watchlist.some((movie) => movie.id === movieId);
  };

  const markSeen = (movieId) => {
    dispatch({ type: "MARK_SEEN", payload: movieId });
  };

  const unmarkSeen = (movieId) => {
    dispatch({ type: "UNMARK_SEEN", payload: movieId });
  };

  const isSeen = (movieId) => {
    return state.seen.includes(movieId);
  };

  const rateMovie = (movieId, rating) => {
    dispatch({ type: "RATE_MOVIE", payload: { movieId, rating } });
  };

  const setLastSearch = (query) => {
    dispatch({ type: "SET_LAST_SEARCH", payload: query });
  };

  const setFilters = (filters) => {
    dispatch({
      type: "SET_FILTERS",
      payload: filters,
    });
  };

  const resetFilters = () => {
    dispatch({ type: "RESET_FILTERS" });
  };

  const addRecentSearch = (query) => {
    if (!query) return;
    dispatch({ type: "ADD_RECENT_SEARCH", payload: query });
  };

  const addSavedSearch = (searchConfig) => {
    dispatch({ type: "ADD_SAVED_SEARCH", payload: searchConfig });
  };

  const removeSavedSearch = (index) => {
    dispatch({ type: "REMOVE_SAVED_SEARCH", payload: index });
  };

  const value = {
    favorites: state.favorites,
    watchlist: state.watchlist,
    seen: state.seen,
    ratingsByMovieId: state.ratingsByMovieId,
    lastSearch: state.lastSearch,
    filters: state.filters,
    recentSearches: state.recentSearches,
    savedSearches: state.savedSearches,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    markSeen,
    unmarkSeen,
    isSeen,
    rateMovie,
    setLastSearch,
    setFilters,
    resetFilters,
    addRecentSearch,
    addSavedSearch,
    removeSavedSearch,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
