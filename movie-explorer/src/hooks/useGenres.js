import { useState, useEffect } from "react";
import { getGenres } from "../services/api";

export const useGenres = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const result = await getGenres();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  return { data, loading, error };
};
