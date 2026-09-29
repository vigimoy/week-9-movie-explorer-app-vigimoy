import { Link } from 'react-router-dom';
import type { Movie } from '@/types/movie';
import { MovieImage } from './MovieImage';
import { FavoriteButton } from './FavoriteButton';
import { Rating } from './MovieCard';
import { TrailerButton } from './TrailerDialog';

export function MovieRow({ movie }: { movie: Movie }) {
  return <article className="movie-row">
    <Link to={`/movie/${movie.id}`} aria-label={`See details for ${movie.title}`}><MovieImage path={movie.poster_path} alt={`${movie.title} poster`} size="w342" /></Link>
    <div className="row-content">
      <div className="row-copy"><h2><Link to={`/movie/${movie.id}`}>{movie.title}</Link></h2>
        <Rating value={movie.vote_average} /><p>{movie.overview || 'No overview available for this movie.'}</p>
      </div><TrailerButton movieId={movie.id} />
    </div>
    <FavoriteButton movie={movie} />
  </article>;
}

