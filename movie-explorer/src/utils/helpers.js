import { IMAGE_BASE_URL, POSTER_SIZE, DEFAULT_POSTER } from './constants';

export const getFullImagePath = (path, size = POSTER_SIZE) => {
  if (!path) return DEFAULT_POSTER;
  return `${IMAGE_BASE_URL}${size}${path}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getYearFromDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};