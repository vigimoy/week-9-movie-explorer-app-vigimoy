import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Movie, MovieDetails, Video } from '@/types/movie';

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function getImageUrl(path: string | null | undefined, size = 'w500'): string | undefined {
  if (!path) return undefined;
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'}/${size}${path}`;
}
export function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 'Release date unavailable' :
    new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
export function formatRuntime(minutes: number | null) {
  if (!minutes) return 'Runtime unavailable';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
export function getTrailer(videos: Video[] = []) {
  const trailers = videos.filter((video) => video.site === 'YouTube' && video.type === 'Trailer' && /^[\w-]{11}$/.test(video.key));
  return trailers.find((video) => video.official) ?? trailers[0];
}
export function getCertification(movie: MovieDetails) {
  for (const region of ['ID', 'US']) {
    const release = movie.release_dates?.results.find((item) => item.iso_3166_1 === region);
    const certification = release?.release_dates.find((item) => item.certification)?.certification;
    if (certification) return certification;
  }
  return 'Not rated';
}
export function uniqueMovies(movies: Movie[]) {
  return [...new Map(movies.map((movie) => [movie.id, movie])).values()];
}

