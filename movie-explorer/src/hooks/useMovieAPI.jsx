import { useState, useEffect, useRef, useCallback } from 'react';

export const useMovieAPI = (apiCallFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store the dependencies in a ref to compare them
  const depsRef = useRef(dependencies);
  
  // Only fetch data if dependencies actually changed
  const depsChanged = Array.isArray(dependencies) && 
    JSON.stringify(depsRef.current) !== JSON.stringify(dependencies);
  
  if (depsChanged) {
    depsRef.current = dependencies;
  }
  
  // Create a stable fetchData function with useCallback
  const fetchData = useCallback(async () => {
    if (!apiCallFn) return;
    
    try {
      setLoading(true);
      const result = await apiCallFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [apiCallFn]);
  
  // Trigger fetch on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, depsChanged]);
  
  return { data, loading, error, refetch: fetchData };
};