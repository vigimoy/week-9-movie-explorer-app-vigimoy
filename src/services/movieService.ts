import api from '@/lib/axios';
import type { Genre, MovieDetails, MovieResponse } from '@/types/movie';

export const movieService = {
  async getPopularMovies(page = 1, signal?: AbortSignal) {
    return (await api.get<MovieResponse>('/movie/popular', { params: { page }, signal })).data;
  },
  async getNowPlayingMovies(page = 1, signal?: AbortSignal) {
    return (await api.get<MovieResponse>('/movie/now_playing', { params: { page }, signal })).data;
  },
  async getMovieDetails(id: number, signal?: AbortSignal) {
    return (
      await api.get<MovieDetails>(`/movie/${id}`, {
        params: { append_to_response: 'credits,videos,similar,release_dates' },
        signal,
      })
    ).data;
  },
  async searchMovies(query: string, page = 1, signal?: AbortSignal) {
    return (
      await api.get<MovieResponse>('/search/movie', {
        params: { query, page, include_adult: false },
        signal,
      })
    ).data;
  },
  async getGenres(signal?: AbortSignal) {
    return (await api.get<{ genres: Genre[] }>('/genre/movie/list', { signal })).data.genres;
  },
};
