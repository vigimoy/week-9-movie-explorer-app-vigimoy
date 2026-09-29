import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { MovieImage } from './MovieImage';
import { Icon } from './Icon';

export function Rating({ value }: { value: number }) {
  return <div className="rating"><Icon name="star" /><span>{value > 0 ? `${value.toFixed(1)}/10` : 'Not rated'}</span></div>;
}
export function MovieCard({ movie, rank }: { movie: Movie; rank?: number }) {
  return <article className="movie-card">
    <Link to={`/movie/${movie.id}`} aria-label={`See details for ${movie.title}`}>
      <div className="relative"><MovieImage path={movie.poster_path} alt={`${movie.title} poster`} size="w342" />{rank && <span className="rank">{rank}</span>}</div>
      <h3 title={movie.title}>{movie.title}</h3>
      <Rating value={movie.vote_average} />
    </Link>
  </article>;
}

