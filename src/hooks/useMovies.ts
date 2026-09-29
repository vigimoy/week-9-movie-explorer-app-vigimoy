import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movieService';
import type { MovieResponse } from '@/types/movie';

const nextPage = (last: MovieResponse) => last.page < Math.min(last.total_pages, 500) ? last.page + 1 : undefined;
export function usePopularMovies() {
  return useQuery({ queryKey: ['movies', 'popular'], queryFn: ({ signal }) => movieService.getPopularMovies(1, signal) });
}
export function useNowPlayingMovies() {
  return useInfiniteQuery({
    queryKey: ['movies', 'now-playing'], initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => movieService.getNowPlayingMovies(pageParam, signal),
    getNextPageParam: nextPage,
  });
}
export function useMovieDetails(id: number, enabled = true) {
  return useQuery({
    queryKey: ['movie', id], queryFn: ({ signal }) => movieService.getMovieDetails(id, signal),
    enabled: enabled && Number.isSafeInteger(id) && id > 0,
  });
}
export function useSearchMovies(query: string) {
  return useInfiniteQuery({
    queryKey: ['movies', 'search', query], initialPageParam: 1,
    queryFn: ({ pageParam, signal }) => movieService.searchMovies(query, pageParam, signal),
    getNextPageParam: nextPage, enabled: query.trim().length > 0,
  });
}
export function useGenres() {
  return useQuery({ queryKey: ['genres'], queryFn: ({ signal }) => movieService.getGenres(signal), staleTime: 86400000 });
}

