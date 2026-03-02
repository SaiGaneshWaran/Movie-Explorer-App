import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Chip,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MovieGrid from "../components/Movie/MovieGrid";
import Loader from "../components/UI/Loader";
import ErrorMessage from "../components/UI/ErrorMessage";
import { getPersonDetails, getPersonMovieCredits } from "../services/api";
import { getFullImagePath } from "../utils/helpers";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/animations";

const PersonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerson = useCallback(async () => {
    try {
      setLoading(true);
      const [personData, creditsData] = await Promise.all([
        getPersonDetails(id),
        getPersonMovieCredits(id),
      ]);
      setPerson(personData);
      setCredits(creditsData.cast || []);
      setError(null);
      document.title = `${personData.name} - Movie Explorer`;
    } catch (e) {
      setError("Failed to fetch person details. Please try again later.");
      setPerson(null);
      setCredits([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPerson();
  }, [fetchPerson]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Loader message="Loading person details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPerson} />;
  }

  if (!person) {
    return null;
  }

  const topMovies = [...credits]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 20);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="exit"
      variants={pageVariants}
    >
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Back
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={3}>
            <Avatar
              src={
                person.profile_path
                  ? getFullImagePath(person.profile_path, "w300")
                  : undefined
              }
              alt={person.name}
              sx={{ width: 160, height: 160, mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="h4" gutterBottom>
              {person.name}
            </Typography>
            {person.known_for_department && (
              <Chip
                label={person.known_for_department}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
            )}
            {person.biography && (
              <Typography variant="body1" paragraph>
                {person.biography}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {person.place_of_birth && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Born in:</strong> {person.place_of_birth}
                </Typography>
              )}
              {person.birthday && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Birthday:</strong> {person.birthday}
                </Typography>
              )}
              {person.deathday && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Death:</strong> {person.deathday}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Known credits:</strong> {credits.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <MovieGrid
        movies={topMovies}
        loading={false}
        error={null}
        title="Top movies featuring this person"
      />
    </motion.div>
  );
};

export default PersonPage;

