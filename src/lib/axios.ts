import axios from 'axios';

const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();
const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
export const isApiConfigured = Boolean(accessToken || (apiKey && apiKey !== 'your_api_key_here'));

export class MovieApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'MovieApiError';
    this.status = status;
  }
}
const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  timeout: 15000,
  params: { language: 'en-US', ...(accessToken ? {} : { api_key: apiKey }) },
  headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
});
api.interceptors.request.use((config) => {
  if (!isApiConfigured) throw new MovieApiError('Add your TMDB API key to explore movies.', 401);
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) return Promise.reject(error);
    const status = error.response?.status;
    const message =
      status === 401
        ? 'Your TMDB credentials are invalid. Please check your API key.'
        : status === 404
          ? 'This movie could not be found.'
          : status === 429
            ? 'Too many requests. Please wait a moment and try again.'
            : 'Unable to reach TMDB. Check your connection and try again.';
    return Promise.reject(new MovieApiError(message, status));
  },
);
export default api;
